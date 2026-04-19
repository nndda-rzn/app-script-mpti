// [P1] Cache spreadsheet reference — menghindari openById() berulang (~200-500ms per panggilan)
let _cachedSS = null;
function getSS() {
  if (!_cachedSS) _cachedSS = SpreadsheetApp.openById(DB_ID);
  return _cachedSS;
}

function getSheet(name) {
  const ss = getSS();
  if (!ss) throw new Error("Spreadsheet tidak ditemukan.");
  const sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error("Sheet '" + name + "' tidak ditemukan.");
  return sheet;
}

// [P0] Generate ID unik menggunakan Utilities.getUuid() — menghindari collision
function generateId(prefix) {
  return prefix + "-" + Utilities.getUuid().replace(/-/g, '').substring(0, 12);
}

// [P2] Error logging ke Cloud Logging + sheet error_logs
function logError(funcName, message, context) {
  try {
    console.error('[' + funcName + '] ' + message + (context ? ' | Context: ' + context : ''));
    const ss = getSS();
    let logSheet = ss.getSheetByName('error_logs');
    if (!logSheet) {
      logSheet = ss.insertSheet('error_logs');
      logSheet.appendRow(['Waktu', 'Fungsi', 'Pesan', 'Context']);
      logSheet.setFrozenRows(1);
    }
    logSheet.appendRow([new Date(), funcName, message, (context || '').substring(0, 500)]);
    // Batasi log maksimal 500 baris
    const lastRow = logSheet.getLastRow();
    if (lastRow > 500) logSheet.deleteRows(2, lastRow - 500);
  } catch(e) { /* fail silently untuk logging */ }
}

// [P2] Auto backup harian — panggil setupBackupTrigger() sekali untuk mengaktifkan
function setupBackupTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'dailyBackup') ScriptApp.deleteTrigger(triggers[i]);
  }
  ScriptApp.newTrigger('dailyBackup').timeBased().everyDays(1).atHour(2).create();
}

function dailyBackup() {
  try {
    const ss = SpreadsheetApp.openById(DB_ID);
    const name = 'Backup_LPremium_' + Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd');
    ss.copy(name);
  } catch(e) {
    logError('dailyBackup', e.message);
  }
}

function setupDatabase() {
  const ss = SpreadsheetApp.openById(DB_ID);
  const sheets = ['users', 'packages', 'transactions', 'settings', 'customers', 'promos'];
  sheets.forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      if (name === 'users') {
        sheet.appendRow(['username', 'password', 'role', 'nama']);
        sheet.appendRow(['admin', computeHash('admin123'), 'admin', 'Administrator']);
      } else if (name === 'packages') {
        sheet.appendRow(['id', 'nama_paket', 'harga', 'durasi_hari', 'satuan', 'kategori', 'status']);
      } else if (name === 'transactions') {
        sheet.appendRow(['id', 'tanggal', 'customer', 'paket', 'berat', 'total', 'status', 'kasir', 'whatsapp', 'satuan', 'estimasi_selesai', 'metode_pembayaran', 'status_pembayaran', 'kode_promo', 'diskon', 'catatan']);
      } else if (name === 'settings') {
        sheet.appendRow(['key', 'value']);
        sheet.appendRow(['nota_title', 'L-PREMIUM']);
        sheet.appendRow(['nota_subtitle', 'Laundry Bersih & Wangi']);
        sheet.appendRow(['nota_footer', 'Terima kasih!']);
      } else if (name === 'customers') {
        sheet.appendRow(['id', 'nama', 'whatsapp', 'terakhir_order']);
      } else if (name === 'promos') {
        sheet.appendRow(['id', 'kode_promo', 'tipe_diskon', 'nilai_diskon', 'min_transaksi', 'berlaku_hingga', 'status']);
      }
    } else if (name === 'packages') {
      // Migration: tambah kolom kategori & status jika belum ada
      const lastCol = sheet.getLastColumn();
      const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      if (headers.indexOf('kategori') === -1) { sheet.getRange(1, 6).setValue('kategori'); }
      const hdrs2 = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      if (hdrs2.indexOf('status') === -1) {
        const sCol = sheet.getLastColumn() + 1;
        sheet.getRange(1, sCol).setValue('status');
        const lastRow = sheet.getLastRow();
        if (lastRow > 1) { sheet.getRange(2, sCol, lastRow - 1, 1).setValue('Aktif'); }
      }
    }
  });
  return "Setup selesai.";
}

function parseSafeDate(rawDate) {
  if (!rawDate) return new Date().toISOString();
  if (rawDate instanceof Date && !isNaN(rawDate)) return rawDate.toISOString();
  let str = String(rawDate).trim();
  if (str.includes('/')) {
    let parts = str.split(' '); let datePart = parts[0]; let timePart = parts[1] || '00:00:00';
    if (timePart.split(':').length === 2) timePart += ':00'; 
    let dParts = datePart.split('/');
    if (dParts.length === 3) {
       let isoStr = `${dParts[2]}-${dParts[1].padStart(2,'0')}-${dParts[0].padStart(2,'0')}T${timePart}.000Z`;
       let testDate = new Date(isoStr); if (!isNaN(testDate)) return testDate.toISOString();
    }
  }
  let fallback = new Date(str); if (!isNaN(fallback)) return fallback.toISOString();
  return new Date().toISOString();
}
