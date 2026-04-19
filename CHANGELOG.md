# Changelog

Semua perubahan penting pada proyek L-Premium POS akan didokumentasikan di file ini. Format berdasarkan standar *Keep a Changelog*.

## [v2.0.0] - Core Architecture Refactoring & Modularization (Terbaru)

Pembaruan besar (Major Update) ini berfokus pada **perombakan total arsitektur kode (Under the Hood)** dari sistem yang sebelumnya monolitik menjadi struktur modular berbasis fitur (Feature-Driven Development). Perubahan ini tidak mengubah fungsi visual, melainkan meningkatkan skalabilitas, kemudahan pemeliharaan (*maintainability*), dan keterbacaan kode secara drastis.

### 🔥 Arsitektur & Struktur Direktori Baru
*   **Google Apps Script Compatibility**: Semua pemecahan file diakomodasi untuk tetap kompatibel 100% dengan limitasi lingkungan Google Apps Script yang menggunakan `clasp` (perataan file saat di-push).
*   **Pemisahan Client & Server**: Struktur direktori dibagi rapi menjadi `client/` (Frontend UI) dan `server/` (Backend Logic).
*   **Penghapusan File Monolitik**: File raksasa seperti `Kode.js` (400+ baris), `index.html` (1000+ baris), dan `JavaScript.html` (1900+ baris) telah dihapus dan dipecah sepenuhnya.

### 🛠️ Backend Modularization (Server-Side)
File `Kode.js` telah diekstrak ke modul-modul independen:
*   `Config.js`: Pemusatan ID Spreadsheet dan variabel statis.
*   `Main.js`: Inisialisasi `doGet()` dan helper `include()`.
*   `Utils.js`: Pemusatan fungsi helper (Database, Date parsing, UUID, Error Logging, Auto-Backup).
*   `Auth.js`: Logika login dan *hashing password* SHA-256.
*   `Transactions.js`, `Customers.js`, `Packages.js`, `Promos.js`, `Settings.js`: CRUD mandiri per entitas bisnis.

### 🎨 Frontend & JavaScript Logic Decomposition
*   **UI Fragments**: `index.html` menjadi *entrypoint* murni, memuat komponen spesifik dari `client/layout/` dan `client/features/`.
*   **Pragmatic Hoisted Globals**: Pemecahan 2.000 baris logika JS (SPA Navigation, State, Event Listeners) ke dalam modul spesifik (seperti `auth.js`, `transactions.js`) menggunakan pola *hoisting* untuk mencegah perlunya bundler eksternal seperti Webpack.
*   **Bugfix**: Menyelesaikan isu *ReferenceError* (*hoisting order*) pada fungsi `debounce` filter riwayat transaksi.

---

## [v1.4.0] - Settings & Promo UI Enterprise Redesign

Pembaruan yang difokuskan pada peningkatan kelas UI/UX menjadi standar *Enterprise SaaS* di area administratif.

### UI/UX Enhancements
*   **System Settings Redesign**: Transisi dari *layout* 3-kolom yang sempit ke struktur asimetris 2-kolom yang rapi.
*   **Global Save Action**: Implementasi tombol *Save* (*floating/sticky*) secara global untuk alur kerja admin yang lebih bersih dan pasti.
*   **Marketing & Promo Module**: Mengubah *layout* berbasis tabel/grid kaku menjadi antarmuka daftar ala *voucher* berkelas premium (penggunaan radius `rounded-2xl` dan pembatas *dashed*).
*   **Visual Cues**: Penambahan indikator visual abu-abu (*grayscale styling*) untuk membedakan secara instan promo yang sudah kedaluwarsa/tidak aktif.
*   **WhatsApp Preview Aesthetics**: Peningkatan estetika pada pratinjau (*preview*) pesan WhatsApp agar mensimulasikan *bubble chat* aslinya.

---

## [v1.3.0] - Analytics & Dashboard Overhaul

Penyederhanaan dan profesionalisasi halaman Dasbor dan Analitik untuk mempercepat pengambilan keputusan manajerial.

### Analytics Refinement
*   **Sales Analysis Optimization**: Mengganti *chart* (grafik) yang berat dan kompleks dengan komponen berbasis teks/angka yang *streamlined*, cepat, dan sangat profesional.
*   **Date-Range Filter**: Penambahan fungsionalitas filter rentang waktu (*date-range*) pada dasbor untuk melihat analitik di periode tertentu.
*   **Payment Method Visualizer**: Mengubah laporan metode pembayaran menjadi antarmuka *progress-bar* horizontal yang sangat intuitif.
*   **Top Customers Leaderboard**: Mentransformasi modul pelanggan terbaik menjadi sistem *leaderboard* yang elegan, dipadukan dengan *custom SVG icons* (badge medali/trofi) untuk kesan *high-end*.

---

## [v1.2.0] - Dashboard Role Optimization & PDF Export Fix

Fokus pada perbaikan integritas data cetak dan keselarasan *layout* untuk perangkat yang berbeda.

### Role-Based UI & Fixes
*   **Admin vs Staff Layout**: Penyempurnaan tata letak Dasbor khusus untuk *role* Admin (lengkap dengan omzet) dan Staff/Kasir (fokus operasional harian). Mencegah masalah teks terpotong (*truncation*) pada resolusi layar yang tidak standar.
*   **PDF Export Bug Fix**: Menyelesaikan masalah fatal pada integritas data di *export* laporan PDF (menghilangkan *bug* kemunculan label "Multi-Item" yang tidak tepat serta memperbaiki kalkulasi total berat/kuantitas pada transaksi jamak).
*   **Clean High-Conversion Interface**: Melakukan *decluttering* (pembersihan) informasi ganda lintas modul agar *interface* dapat menyajikan wawasan yang dapat langsung ditindaklanjuti (*actionable insights*) oleh *owner*.
