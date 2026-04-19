function getSettings() {
  const cache = CacheService.getScriptCache(); const cachedSettings = cache.get('app_settings');
  if (cachedSettings) return JSON.parse(cachedSettings);
  const data = getSheet('settings').getDataRange().getValues(); let settings = {};
  for (let i = 1; i < data.length; i++) settings[data[i][0]] = data[i][1];
  cache.put('app_settings', JSON.stringify(settings), 21600); return settings;
}

function saveSettingsConfig(dataObj) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(3000); const sheet = getSheet('settings'); const data = sheet.getDataRange().getValues();
    for (let key in dataObj) {
      let found = false;
      for (let i = 1; i < data.length; i++) { if (data[i][0] === key) { sheet.getRange(i + 1, 2).setValue(dataObj[key]); found = true; break; } }
      if (!found) sheet.appendRow([key, dataObj[key]]);
    }
    CacheService.getScriptCache().remove('app_settings'); return { success: true };
  } catch(e) { logError('saveSettingsConfig', e.message); return { success: false, message: "Sistem sibuk. Coba lagi." }; } finally { lock.releaseLock(); }
}
