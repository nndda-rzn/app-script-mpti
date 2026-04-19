function computeHash(rawPassword) {
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, rawPassword);
  let txtHash = '';
  for (let i = 0; i < rawHash.length; i++) {
    let hashVal = rawHash[i];
    if (hashVal < 0) { hashVal += 256; }
    if (hashVal.toString(16).length == 1) { txtHash += '0'; }
    txtHash += hashVal.toString(16);
  }
  return txtHash;
}

function login(username, password) {
  const cache = CacheService.getScriptCache(); const attemptKey = 'login_attempts_' + username; let attempts = cache.get(attemptKey);
  if (attempts && parseInt(attempts) >= 5) return { success: false, message: "Akun dikunci sementara. Coba lagi dalam 15 menit." };

  try {
    const sheet = getSheet('users'); const data = sheet.getDataRange().getValues(); const inputHash = computeHash(password);
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === username) {
        const dbPassword = String(data[i][1]).trim();
        if (dbPassword === password) { sheet.getRange(i + 1, 2).setValue(inputHash); } 
        else if (dbPassword !== inputHash) { cache.put(attemptKey, (attempts ? parseInt(attempts) + 1 : 1).toString(), 900); return { success: false, message: 'Username atau password salah!' }; }
        cache.remove(attemptKey); return { success: true, role: data[i][2], nama: data[i][3] };
      }
    }
    cache.put(attemptKey, (attempts ? parseInt(attempts) + 1 : 1).toString(), 900);
    return { success: false, message: 'Username atau password salah!' };
  } catch (error) { return { success: false, message: 'Error Database: ' + error.message }; }
}
