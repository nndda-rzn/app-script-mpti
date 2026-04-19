function getTransactions() {
  try {
    const sheet = getSheet('transactions');
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return [];
    
    // [P2] Optimasi: hanya baca 300 row terakhir daripada seluruh sheet
    const rowCount = Math.min(300, lastRow - 1);
    const startRow = lastRow - rowCount + 1;
    const rawData = sheet.getRange(startRow, 1, rowCount, 18).getValues();
    
    let validData = [];
    for (let i = 0; i < rawData.length; i++) {
        let row = rawData[i]; if (row.join('').trim() !== '') validData.push(row); 
    }
    return validData.map(r => ({
        id: String(r[0] || 'TRX-?'), tanggal: parseSafeDate(r[1]), customer: String(r[2] || 'Pelanggan'), 
        paket: String(r[3] || 'Layanan'), berat: parseFloat(r[4]) || 0, total: parseInt(r[5]) || 0, 
        status: String(r[6] || 'Proses'), kasir: String(r[7] || '-'), whatsapp: String(r[8] || ''), 
        satuan: String(r[9] || 'Kg'), estimasi: parseSafeDate(r[10]), metode_pembayaran: String(r[11] || 'Tunai'), 
        status_pembayaran: String(r[12] || 'Belum Lunas'), kode_promo: String(r[13] || ''), diskon: parseInt(r[14]) || 0,
        catatan: String(r[15] || ''), terbayar: r[16] !== undefined && r[16] !== '' ? parseInt(r[16]) : (String(r[12] || 'Belum Lunas') === 'Lunas' ? (parseInt(r[5]) || 0) : 0),
        items: r[17] ? (function(){try{return JSON.parse(r[17]);}catch(e){return [];}})() : [{paket: String(r[3] || 'Layanan'), berat: parseFloat(r[4]) || 0, satuan: String(r[9] || 'Kg'), subtotal: (parseInt(r[5]) || 0) + (parseInt(r[14]) || 0)}]
    }));
  } catch(e) { logError('getTransactions', e.message); throw new Error("Gagal baca sheet Transaksi: " + e.message); }
}

function createTransaction(data) {
  if (!data || !data.customer || !data.items_json) return { success: false, message: "Data tidak lengkap." };
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(5000); 
    const sheetTrx = getSheet('transactions'); const sheetPkg = getSheet('packages'); const sheetPromo = getSheet('promos');
    
    let items = [];
    try { items = JSON.parse(data.items_json); } catch(e) { }
    if (!items || items.length === 0) return { success: false, message: "Keranjang kosong." };
    
    const pkgData = sheetPkg.getDataRange().getValues();
    let subtotal = 0;
    let totalBerat = 0;
    
    for (let i = 0; i < items.length; i++) {
        let serverHarga = 0;
        for (let j = 1; j < pkgData.length; j++) { if (pkgData[j][1] === items[i].paket) { serverHarga = parseInt(pkgData[j][2]); break; } }
        if (serverHarga === 0) return { success: false, message: "Paket " + items[i].paket + " tidak valid." };
        items[i].harga = serverHarga;
        items[i].subtotal = serverHarga * parseFloat(items[i].berat);
        subtotal += items[i].subtotal;
        totalBerat += parseFloat(items[i].berat);
    }
    
    data.items_json = JSON.stringify(items);
    
    let diskon = 0;
    let appliedPromo = "";

    // Validasi Promo di Server-Side
    if (data.kode_promo) {
      const promoData = sheetPromo.getDataRange().getValues();
      const today = new Date();
      for (let i = 1; i < promoData.length; i++) {
        if (String(promoData[i][1]).toUpperCase() === String(data.kode_promo).toUpperCase()) {
          let pType = promoData[i][2]; let pVal = parseInt(promoData[i][3]) || 0; let pMin = parseInt(promoData[i][4]) || 0;
          let pDate = new Date(promoData[i][5]); pDate.setHours(23, 59, 59, 999); // Valid hingga akhir hari
          let pStatus = promoData[i][6];

          if (pStatus === 'Aktif' && today <= pDate && subtotal >= pMin) {
            appliedPromo = String(data.kode_promo).toUpperCase();
            if (pType === 'Persen') diskon = subtotal * (pVal / 100);
            else diskon = pVal;
            if (diskon > subtotal) diskon = subtotal; // Cegah minus
          }
          break;
        }
      }
    }

    let grandTotal = subtotal - diskon;

    // [P0] Gunakan UUID untuk ID — menghindari collision pada transaksi bersamaan
    const id = generateId('TRX');
    const date = new Date();
    const paketLabel = items.length === 1 ? items[0].paket : `Multi-Item (${items.length})`;

    // [P0] Server hitung status_pembayaran sendiri — JANGAN percaya input client
    const terbayar = parseInt(data.terbayar) || 0;
    let statusPay;
    if (terbayar >= grandTotal && terbayar > 0) statusPay = 'Lunas';
    else if (terbayar > 0) statusPay = 'DP';
    else statusPay = 'Belum Lunas';

    sheetTrx.appendRow([ 
      id, date, data.customer, paketLabel, totalBerat, grandTotal, 'Proses', data.kasir, 
      data.whatsapp || '', items.length === 1 ? (items[0].satuan || 'Kg') : '-', data.estimasi || '', data.metode_pembayaran || 'Tunai', statusPay,
      appliedPromo, diskon, data.catatan || '', terbayar, data.items_json
    ]);
    
    saveOrUpdateCustomer(data.kasir, data.customer, data.whatsapp || '', date); 
    return { success: true, id: id, tanggal: date.toISOString(), total: grandTotal, subtotal: subtotal, diskon: diskon, appliedPromo: appliedPromo, status_pembayaran: statusPay };
  } catch (e) { logError('createTransaction', e.message, JSON.stringify(data).substring(0, 500)); return { success: false, message: "Sistem sibuk, silakan simpan lagi." }; } finally { lock.releaseLock(); }
}

function updateTransactionStatus(id, newStatus) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(3000); const sheet = getSheet('transactions'); const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return { success: false, message: 'Data kosong' };
    const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let i = 0; i < ids.length; i++) { if (ids[i][0] === id) { sheet.getRange(i + 2, 7).setValue(newStatus); return { success: true }; } }
    return { success: false, message: 'Transaksi tidak ditemukan' };
  } catch(e) { logError('updateTransactionStatus', e.message, id); return { success: false, message: 'Sistem sibuk.' }; } finally { lock.releaseLock(); }
}

function lunasDanAmbil(id, metode) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(3000); const sheet = getSheet('transactions'); const lastRow = sheet.getLastRow(); const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let i = 0; i < ids.length; i++) {
      if (ids[i][0] === id) { 
        const total = parseInt(sheet.getRange(i + 2, 6).getValue()) || 0;
        // [OPT] Batch write: 4 setValue → 1 setValues
        const row = i + 2;
        const rowData = sheet.getRange(row, 1, 1, 18).getValues()[0];
        rowData[6] = 'Diambil';       // col G (status)
        rowData[11] = metode;          // col L (metode_pembayaran)
        rowData[12] = 'Lunas';         // col M (status_pembayaran)
        rowData[16] = total;           // col Q (terbayar)
        sheet.getRange(row, 1, 1, 18).setValues([rowData]);
        return { success: true }; 
      }
    }
    return { success: false, message: 'Transaksi tidak ditemukan' };
  } catch(e) { logError('lunasDanAmbil', e.message, id); return { success: false, message: 'Sistem sibuk.' }; } finally { lock.releaseLock(); }
}

function deleteTransaction(id) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(3000); const sheet = getSheet('transactions'); const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return { success: false, message: 'Data kosong' };
    const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let i = 0; i < ids.length; i++) { if (ids[i][0] === id) { sheet.deleteRow(i + 2); return { success: true }; } }
    return { success: false, message: 'Transaksi tidak ditemukan' };
  } catch(e) { logError('deleteTransaction', e.message, id); return { success: false, message: 'Sistem sibuk.' }; } finally { lock.releaseLock(); }
}
