# Changelog

Semua perubahan penting pada proyek L-Premium POS akan didokumentasikan di file ini.

## [v2.0.0] - Refactoring & Modularization Architecture (Terbaru)

Pembaruan besar (Major Update) ini berfokus pada **perombakan total arsitektur kode (Under the Hood)** dari sistem yang sebelumnya monolitik (semua kode digabung dalam file masif) menjadi struktur modular berbasis fitur (Feature-Driven Development). Perubahan ini **tidak mengubah fungsi aplikasi secara visual**, melainkan meningkatkan skalabilitas, kemudahan pemeliharaan (*maintainability*), dan keterbacaan kode secara drastis bagi *developer*.

### 🔥 Arsitektur & Struktur Direktori Baru
Struktur direktori sekarang dibagi secara rapi menggunakan sistem `client/` dan `server/`.
*   **Google Apps Script Compatibility**: Semua pemecahan file diakomodasi untuk tetap kompetibel 100% dengan limitasi lingkungan Google Apps Script yang menggunakan `clasp` (perataan file saat di-push).
*   **Penghapusan File Monolitik**: File kuno yang sangat masif seperti `Kode.js` (400+ baris), `index.html` (1000+ baris), dan `JavaScript.html` (1900+ baris) telah **dihapus/dipecah sepenuhnya**.

### 🛠️ Backend Modularization (Server-Side)
File `Kode.js` telah diekstrak dan didistribusikan ke dalam modul-modul independen:
*   `server/Config.js`: Pemusatan ID Spreadsheet dan token keamanan.
*   `server/Main.js`: Inisialisasi `doGet()` dan helper `include()`.
*   `server/Utils.js`: Pemusatan fungsi pembantu (Database helpers, Date parsing, ID UUID generator, Error Logging, dan Backup Harian).
*   `server/Auth.js`: Logika login, *rate-limiter*, dan *hashing password* SHA-256.
*   `server/Transactions.js`: Pemrosesan pembuatan transaksi, perhitungan diskon di *server*, penanganan status (Proses/Diambil).
*   `server/Customers.js`, `server/Packages.js`, `server/Promos.js`, `server/Settings.js`: Fungsionalitas CRUD mandiri untuk masing-masing domain.

### 🎨 Frontend UI Modularization (HTML & CSS)
File `index.html` sekarang hanya bertindak sebagai *shell/entrypoint* murni, sementara antarmuka UI dipecah:
*   `client/core/styles.html`: Migrasi dari `CSS.html` lama (Tailwind utilities).
*   `client/layout/`: Berisi potongan struktur statis aplikasi seperti `header.html`, `sidebar.html`, `mobile_nav.html`, dan *modals* global (loading, toast, konfirmasi hapus).
*   `client/features/`: Direktori fitur individual yang berisi UI mandiri seperti `dashboard/overview.html`, `transactions/form.html`, `analytics/laporan.html`, dll.

### 🧠 JavaScript Logic Decomposition (Pragmatic Hoisted Globals)
File `JavaScript.html` yang mencapai hampir 2.000 baris kini telah dipecah secara pragmatis (tanpa menggunakan bundler modern seperti Webpack, demi menjaga kompatibilitas murni Apps Script editor):
*   **Core & State**:
    *   `client/core/globals.js.html`: Menampung seluruh deklarasi variabel global (state management ringan).
    *   `client/core/utils.js.html`: Kumpulan utilitas *frontend* seperti *Debounce*, *EscapeHTML*, *Toast*.
    *   `client/core/init.js.html`: Logika `window.onload` dan manajemen navigasi SPA.
*   **Feature Logic**: Logika bisnis diekstrak ke dalam filenya masing-masing di dalam `client/features/...` (misalnya `auth.js`, `transactions.js`, `customers.js`).
*   **Perbaikan Bug Resolusi Referensi (Hoisting)**: Menyelesaikan isu di mana *debounce* untuk *history filter* memanggil fungsi yang belum didefinisikan akibat urutan eksekusi file HTML. Diatasi dengan mengatur strict *load order* pada `index.html`.

---
*Dokumentasi ini dibuat untuk melacak jejak restrukturisasi fase 1 & 2 dari repositori ini.*
