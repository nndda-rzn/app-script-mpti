function getCustomers() {
  const sheet = getSheet('customers'); const rawData = sheet.getDataRange().getValues();
  if (rawData.length <= 1) return [];
  return rawData.slice(1).filter(r => r.join('').trim() !== '').map(r => ({ id: r[0], nama: String(r[1] || 'Anonim'), whatsapp: String(r[2] || ''), terakhir_order: parseSafeDate(r[3]) })).reverse();
}

function saveOrUpdateCustomer(kasir, nama, wa, date) {
  if(!nama) return;
  const sheet = getSheet('customers'); const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const names = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
    for (let i = 0; i < names.length; i++) {
      if (String(names[i][0]).trim().toLowerCase() === String(nama).trim().toLowerCase()) {
        if(wa) sheet.getRange(i + 2, 3).setValue(wa); sheet.getRange(i + 2, 4).setValue(date); return; 
      }
    }
  }
  sheet.appendRow([generateId('CUST'), nama, wa, date]); 
}

function addCustomerData(nama, wa) { getSheet('customers').appendRow([generateId('CUST'), nama, wa, new Date().toISOString()]); return { success: true }; }

function updateCustomerData(id, nama, wa) {
  const sheet = getSheet('customers'); const ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  // [OPT] Batch write: 2 setValue → 1 setValues
  for (let i = 0; i < ids.length; i++) { if (ids[i][0] === id) { sheet.getRange(i + 2, 2, 1, 2).setValues([[nama, wa]]); return { success: true }; } }
  return { success: false };
}

function deleteCustomerData(id) {
  const sheet = getSheet('customers'); const ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) { if (ids[i][0] === id) { sheet.deleteRow(i + 2); return { success: true }; } }
  return { success: false };
}
