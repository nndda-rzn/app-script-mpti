// FUNGSI PROMO
function getPromos() {
  const sheet = getSheet('promos'); const rawData = sheet.getDataRange().getValues();
  if (rawData.length <= 1) return [];
  return rawData.slice(1).filter(r => r.join('').trim() !== '').map(r => ({
    id: r[0], kode_promo: String(r[1]).toUpperCase(), tipe_diskon: String(r[2]), nilai_diskon: parseInt(r[3]) || 0, 
    min_transaksi: parseInt(r[4]) || 0, berlaku_hingga: parseSafeDate(r[5]), status: String(r[6])
  }));
}

function addPromo(kode, tipe, nilai, min, tanggal, status) {
  getSheet('promos').appendRow([generateId('PRM'), kode.toUpperCase(), tipe, nilai, min, tanggal, status]); 
  return { success: true };
}

function updatePromo(id, kode, tipe, nilai, min, tanggal, status) {
  const sheet = getSheet('promos'); const ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) { 
    if (ids[i][0] === id) { sheet.getRange(i + 2, 2, 1, 6).setValues([[kode.toUpperCase(), tipe, nilai, min, tanggal, status]]); return { success: true }; } 
  } 
  return { success: false };
}

function deletePromo(id) {
  const sheet = getSheet('promos'); const ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) { 
    if (ids[i][0] === id) { sheet.deleteRow(i + 2); return { success: true }; } 
  } 
  return { success: false };
}
