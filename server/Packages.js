function getPackages() {
  const sheet = getSheet('packages'); const rawData = sheet.getDataRange().getValues();
  if (rawData.length <= 1) return [];
  return rawData.slice(1).filter(r => r.join('').trim() !== '').map(r => ({ id: r[0], nama: String(r[1] || 'Paket'), harga: parseInt(r[2]) || 0, durasi: parseInt(r[3]) || 0, satuan: String(r[4] || 'Kg'), kategori: String(r[5] || ''), status: String(r[6] || 'Aktif') }));
}

function addPackage(nama, harga, durasi, satuan, kategori, status) { getSheet('packages').appendRow([generateId('PKG'), nama, harga, durasi, satuan, kategori || '', status || 'Aktif']); return { success: true }; }

function updatePackage(id, newNama, newHarga, newDurasi, newSatuan, newKategori, newStatus) { 
  const sheet = getSheet('packages'); const ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  // [OPT] Batch write: 6 setValue → 1 setValues
  for (let i = 0; i < ids.length; i++) { if (ids[i][0] === id) { sheet.getRange(i + 2, 2, 1, 6).setValues([[newNama, newHarga, newDurasi, newSatuan, newKategori || '', newStatus || 'Aktif']]); return { success: true }; } } 
  return { success: false }; 
}

function updatePackageStatus(id, newStatus) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(3000);
    const sheet = getSheet('packages'); const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return { success: false, message: 'Data kosong' };
    const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let i = 0; i < ids.length; i++) { if (ids[i][0] === id) { sheet.getRange(i + 2, 7).setValue(newStatus); return { success: true }; } }
    return { success: false, message: 'Layanan tidak ditemukan' };
  } catch(e) { logError('updatePackageStatus', e.message, id); return { success: false, message: 'Sistem sibuk.' }; } finally { lock.releaseLock(); }
}

function deletePackage(id) { 
  const sheet = getSheet('packages'); const ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) { if (ids[i][0] === id) { sheet.deleteRow(i + 2); return { success: true }; } } 
  return { success: false }; 
}
