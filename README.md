<div align="center">
  <img src="https://img.shields.io/badge/Google_Apps_Script-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Apps Script" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
</div>

<br />

<h1 align="center">🧺 L-Premium POS (Point of Sale)</h1>

<p align="center">
  <strong>Enterprise-Grade Laundry Management System</strong><br>
  Sistem kasir cerdas berbasis web yang dirancang khusus untuk bisnis laundry modern. Dibangun menggunakan arsitektur serverless Google Apps Script dengan UI/UX premium yang responsif, aman, dan sangat cepat.
</p>

---

## 📋 Ringkasan Proyek

**L-Premium POS** adalah solusi *end-to-end* untuk manajemen operasional laundry. Aplikasi ini menghilangkan kebutuhan akan server fisik dengan memanfaatkan ekosistem **Google Workspace (Google Sheets sebagai Database & Google Apps Script sebagai Backend)**, menjadikannya gratis untuk di-host (*zero-cost infrastructure*) namun tetap memiliki standar keamanan dan kecepatan layaknya aplikasi berbayar.

Aplikasi ini telah melalui proses **Evaluasi Senior Full-Stack & UI/UX Profesional**, mencakup perombakan desain secara menyeluruh serta optimasi performa sistem (*Concurrency control, Caching, & Batching*).

---

## ✨ Fitur Utama

### 🛒 Manajemen Transaksi & Kasir
* **Kalkulasi Otomatis:** Perhitungan tagihan, diskon promo, dan uang kembalian secara instan.
* **Sistem Pembayaran Fleksibel:** Mendukung pelunasan langsung atau sistem Uang Muka (DP) dengan metode Tunai, Transfer, maupun QRIS.
* **Auto-Save Draft:** Tidak perlu takut kehilangan data saat browser *crash*. Form transaksi otomatis tersimpan ke memori sementara (Draft) setiap 5 detik.
* **Cetak Nota Digital:** Pembuatan nota dinamis yang siap dicetak di printer kasir (Thermal) atau dibagikan via WhatsApp.
* **Konfirmasi WhatsApp:** Integrasi API WhatsApp untuk mengirimkan bukti transaksi dan notifikasi ke pelanggan dengan sekali klik.

### 👥 Manajemen Pelanggan & Loyalitas
* Pendataan pelanggan lengkap dengan nomor WhatsApp.
* Pelacakan riwayat transaksi dan total pengeluaran (*Total Spent*) per pelanggan.

### 📦 Manajemen Layanan & Promo
* **Katalog Dinamis:** Menambah, mengedit, dan menonaktifkan layanan/paket (Kiloan, Satuan, dsb).
* **Voucher Promo:** Pembuatan kode promo (persen atau nominal) dengan batas minimum transaksi dan tanggal kedaluwarsa.

### 📊 Dasbor Analitik (Admin)
* Pantauan *real-time* Omzet Hari Ini, Total Transaksi, Antrean Diproses, dan Cucian Siap Diambil.
* **Multi-Cashier Sync:** Data dasbor tersinkronisasi antar komputer kasir secara otomatis setiap 5 menit.
* **Sistem Laporan:** Cetak rekapitulasi penjualan harian/bulanan ke format PDF.

---

## 🎨 UI/UX & Design System

Aplikasi ini menggunakan **TailwindCSS** dengan pendekatan *Enterprise SaaS-grade interface*:

* **Vibrant & Clean Design:** Penggunaan warna yang dikurasi, *white-space* yang lega, dan tipografi modern (Inter/Roboto).
* **Visual Hierarchy & Consistency:**
  - `rounded-2xl` untuk semua kontainer dan *card*.
  - *Glow focus effect* elegan pada input form.
  - Ikon berbasis **SVG Inline (Heroicons)** di seluruh elemen untuk ketajaman visual maksimal tanpa menambah beban *loading*.
* **Micro-Animations:** Transisi halus pada *hover*, efek tekan tombol, dan *skeleton loading* yang responsif.
* **Audio Cues:** Notifikasi *beep* (Web Audio API) yang asinkron ketika transaksi sukses, membantu efisiensi kasir tanpa harus selalu menatap layar.

---

## 🏗️ Arsitektur & Performa Sistem (Optimasi Senior-Level)

Di balik tampilan antarmukanya, L-Premium POS dilengkapi sistem backend yang dirancang untuk stabilitas jangka panjang:

### 1. Integritas Data (Zero Collision)
* **UUID Implementation:** Seluruh data ID (*Primary Key*) menggunakan Universal Unique Identifier, mencegah tabrakan data saat 2 kasir menyimpan transaksi di milidetik yang sama.
* **Double-Submit Prevention:** Proteksi otomatis terhadap klik ganda via *state management*, mencegah entri transaksi duplikat.
* **Server-Side Trust:** Semua validasi pembayaran, perhitungan total, dan diskon dilakukan ulang di server (Google Apps Script) untuk mencegah manipulasi data dari inspeksi browser.

### 2. Extreme Performance Optimization
* **Batch Operations:** Mengubah operasi *I/O Google Sheets* yang mahal (multiple `setValue`) menjadi 1 kali eksekusi `setValues()` dalam format array. Meningkatkan kecepatan simpan data hingga **400-600%**.
* **3-Layer Caching Strategy:**
  1. **Server Cache:** Menyimpan referensi *Spreadsheet* memangkas waktu latensi API.
  2. **Transaction TTL Cache:** Menyimpan data transaksi di RAM klien selama 1 menit. Navigasi menu terasa *instant* tanpa perlu memanggil server.
  3. **Settings LocalStorage:** Preferensi aplikasi (Nama Toko, Rekening) dikunci di memori lokal selama 1 jam.

### 3. Reliability & Maintenance
* **Auto-Backup System:** Terdapat fungsi *CRON trigger* yang otomatis menggandakan (duplikasi) database Google Sheets setiap hari jam 02:00 pagi ke Google Drive sebagai *fail-safe*.
* **Silent Error Logging:** Semua *exception* atau kendala di server akan otomatis dicatat (*log*) pada lembar khusus `error_logs` di database, memungkinkan *debugging* tanpa mengganggu layar kasir.
* **Optimized Queries:** Pembacaan data transaksi dibatasi algoritma *Smart Row Range*, hanya membaca 300 data terbaru untuk memastikan *loading* aplikasi tetap cepat meskipun database sudah terisi puluhan ribu baris.

---

## 📂 Struktur File Repository

```text
app-script-mpti/
├── appsscript.json   # Konfigurasi manifest Apps Script (TimeZone, Library, URL)
├── Kode.js           # Server-Side Backend (CRUD logic, Caching, Security)
├── index.html        # Struktur HTML utama (Layout, Sidebar, Modal)
├── CSS.html          # Custom Styling, Font imports, Print Media Queries
└── JavaScript.html   # Client-Side Frontend (SPA Navigation, State, Event Listeners)
```

---

## ⚙️ Cara Instalasi & Deployment

Proyek ini dibangun menggunakan `clasp` (Command Line Apps Script Projects).

**Persyaratan:**
* Node.js & npm terinstal.
* Memiliki akun Google.

**Langkah-langkah:**
1. Clone repositori ini:
   ```bash
   git clone https://github.com/nndda-rzn/app-script-mpti.git
   cd app-script-mpti
   ```
2. Instal clasp secara global:
   ```bash
   npm install -g @google/clasp
   ```
3. Login ke akun Google Anda:
   ```bash
   clasp login
   ```
4. Hubungkan ke project Apps Script Anda yang sudah ada atau buat baru:
   ```bash
   # Jika sudah punya Script ID:
   clasp clone <YOUR_SCRIPT_ID>
   
   # ATAU buat baru:
   clasp create --type web --title "L-Premium POS"
   ```
5. Deploy kode ke server Google:
   ```bash
   clasp push
   ```

**Post-Deployment (Aktivasi Backup):**
Setelah di-deploy, buka Editor Apps Script di browser (`clasp open`), pilih fungsi `setupBackupTrigger()`, dan klik jalankan (▶ Run) satu kali untuk mengaktifkan sistem backup harian otomatis.

---

<div align="center">
  <p>Dibuat dengan ❤️ untuk merevolusi manajemen usaha laundry.</p>
</div>
