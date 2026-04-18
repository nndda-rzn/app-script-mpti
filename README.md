# 🧺 Laundry POS — UI/UX Redesign Documentation

> Dokumentasi lengkap hasil evaluasi dan perombakan desain antarmuka (*UI/UX Overhaul*) pada sistem Point of Sale Laundry berbasis Google Apps Script.

---

## 📋 Ringkasan Proyek

Aplikasi Laundry POS ini merupakan sistem manajemen laundry berbasis web yang dibangun di atas **Google Apps Script** dengan antarmuka HTML/CSS/JavaScript menggunakan **TailwindCSS CDN**. Seluruh data tersimpan di Google Spreadsheet sebagai *backend* database.

Pada sesi pengembangan ini, dilakukan **evaluasi UI/UX menyeluruh** oleh perspektif *UI/UX Designer profesional* terhadap setiap modul aplikasi. Tujuannya adalah menaikkan standar visual dan *usability* dari level *MVP (Minimum Viable Product)* menjadi **Enterprise SaaS-grade interface**.

---

## 🏗️ Arsitektur File

| File | Fungsi |
|------|--------|
| `Kode.js` | Backend logic (Google Apps Script server-side) |
| `index.html` | Struktur HTML seluruh halaman & komponen |
| `JavaScript.html` | Logika rendering dinamis, event handler, & CRUD |
| `CSS.html` | Stylesheet tambahan & custom styles |
| `appsscript.json` | Konfigurasi manifest Apps Script |

---

## 🎨 Design System yang Diterapkan

### Prinsip Desain Utama

| Prinsip | Penjelasan |
|---------|------------|
| **Less is More** | Menghapus elemen redundan untuk mengurangi *cognitive load* pengguna |
| **Visual Hierarchy** | Menggunakan ukuran, warna, dan *spacing* untuk mengarahkan mata pengguna |
| **Consistency First** | Seluruh modul mengikuti *design language* yang identik |
| **Touch-Friendly** | Area sentuh (*tap target*) diperbesar untuk penggunaan tablet/mobile |

### Bahasa Visual (*Design Tokens*)

#### Kelengkungan (*Border Radius*)
```
Sebelum: rounded-[2rem], rounded-[1.5rem]  (tidak konsisten)
Sesudah: rounded-2xl                        (seragam di seluruh modul)
```

#### Bayangan (*Shadow*)
```
Sebelum: shadow-[0_8px_30px_rgb(0,0,0,0.04)]  (custom, berat)
Sesudah: shadow-sm + hover:shadow-md            (ringan, responsif)
```

#### Kode Warna per Modul

| Modul | Warna Aksen | Kode Tailwind |
|-------|-------------|---------------|
| Dashboard | Biru | `blue-600` |
| Pelanggan | Hijau | `emerald-500` |
| Layanan | Biru | `blue-600` |
| Promo | Ungu | `violet-600` |
| Mode Edit | Kuning | `amber-500` |
| Hapus/Bahaya | Merah | `red-500` |

#### Pola Judul Form (*Title Pattern*)
```html
<!-- SEBELUM: Ikon SVG berwarna sebagai penanda -->
<h3 class="text-lg font-black text-blue-600">
    <svg class="w-5 h-5">...</svg> Judul
</h3>

<!-- SESUDAH: Garis aksen vertikal + teks hitam -->
<h3 class="text-xl font-black text-slate-900 flex items-center gap-3">
    <div class="w-2 h-6 bg-blue-600 rounded-full"></div> Judul
</h3>
```

#### Pola Input Form (*Input Pattern*)
```html
<!-- SEBELUM: Input kosong tanpa ikon -->
<input class="w-full px-4 py-3 bg-slate-50 border rounded-xl ...">

<!-- SESUDAH: Input dengan ikon SVG di dalam + focus glow -->
<div class="relative">
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg class="w-4 h-4 text-slate-400">...</svg>
    </div>
    <input class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-xl 
                  focus:bg-white focus:ring-2 focus:ring-blue-100 
                  focus:border-blue-500 transition-all ...">
</div>
```

#### Pola Tombol Aksi (*Action Button Pattern*)
```html
<!-- SEBELUM: Tombol teks polos -->
<button class="bg-blue-600 text-white font-bold py-3.5 rounded-xl">
    Simpan
</button>

<!-- SESUDAH: Tombol dengan ikon + shadow glow -->
<button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 
              rounded-xl shadow-lg shadow-blue-600/20 
              flex justify-center items-center gap-2">
    <svg class="w-5 h-5">...</svg> Simpan
</button>
```

---

## 📐 Detail Evaluasi per Modul

### 1. Sidebar Navigation

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Ikon | Ikon tebal (*filled*) | Ikon *stroke* tipis yang diperhalus |
| Indikator Aktif | Background warna penuh | Garis vertikal di sisi kiri |
| Profil User | Tidak ada | Ditambahkan di bagian bawah sidebar |
| Kesan | Berat & ramai | Ringkas & profesional |

---

### 2. Dashboard

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Header | Ada tombol "Transaksi Baru" redundan | Dihapus (sudah ada di sidebar) |
| Stat Cards | Ikon emoji/teks | Ikon SVG profesional |
| Layout | Standar | Enterprise-ready dengan visual hierarchy |

---

### 3. Form Transaksi Baru

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Struktur Form | Semua input berjajar tanpa pengelompokan | Dikelompokkan 3 blok logis: *Info Pelanggan*, *Rincian Layanan*, *Opsi Tambahan* |
| Ikon | Emoticon/teks | Seluruhnya SVG inline |
| Toggle DP | Checkbox biasa | Toggle switch bergaya iOS |

---

### 4. Riwayat Transaksi (Daftar Transaksi)

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Layout | Grid cards (zig-zag) | **List vertikal** (kronologis, mudah di-*scan*) |
| Identitas | Hanya teks | Avatar inisial pelanggan |
| Status Badge | Kecil, tersembunyi | Badge warna besar yang jelas |
| Tombol Aksi | Kecil | Diperbesar, *touch-friendly* |

---

### 5. Manajemen Pelanggan

#### a. Card "Tambah Pelanggan" (Form)

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Radius | `rounded-[2rem]` | `rounded-2xl` |
| Judul | Ikon SVG berwarna | Garis aksen vertikal hijau |
| Input Nama | Kotak kosong | Ikon 👤 Person di dalam input |
| Input WA | Kotak kosong | Ikon 📞 Phone di dalam input |
| Tombol Simpan | Teks polos | Ikon + teks + shadow glow |
| Focus Effect | Transparan ring | Background putih + ring hijau solid |
| Mode Edit | Hanya teks berubah | Garis aksen → kuning, tombol → amber + ikon pensil |

#### b. Daftar Pelanggan

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Layout | Grid 2 kolom (kartu) | **List vertikal** satu kolom |
| Visual Anchor | Tidak ada | Avatar inisial bulat dengan hover effect |
| Data Finansial | Tersembunyi di bawah (`text-[8px]`) | Angka tebal hijau di sisi kanan |
| Badge Loyalitas | Menempel di ujung nama | Bersanding rapi di bawah nama |
| Tombol Aksi | Kecil tanpa border | Icon buttons berbingkai dengan shadow |

---

### 6. Manajemen Layanan

#### a. Card "Tambah Layanan" (Form)

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Radius | `rounded-[2rem]` | `rounded-2xl` |
| Judul | Ikon SVG biru | Garis aksen vertikal biru |
| Input Nama | Kotak kosong | Ikon 🏷️ Tag |
| Input Harga | Kotak kosong | Label statis **Rp** di dalam input |
| Input Satuan | Kotak kosong | Ikon ⚖️ Scale |
| Input Durasi | Kotak kosong | Ikon 🕐 Clock |
| Input Kategori | Kotak kosong | Ikon 📦 Archive |
| Tombol Simpan | Teks polos | Ikon + teks + shadow glow biru |

#### b. Daftar Layanan

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Layout | Grid 2 kolom (kartu tebal) | **List vertikal** elegan |
| Visual Anchor | Tidak ada | Avatar inisial berwarna per kategori |
| Harga | Teks kecil di dalam kartu | Angka raksasa biru di sisi kanan |
| Tombol Toggle | Tombol teks "Nonaktifkan" | **Toggle switch iOS** (hijau/abu-abu) |
| Tombol Edit/Hapus | Tombol teks panjang berjejer | Icon buttons bulat berbingkai |
| Filter | 3 tombol terpisah | **Segmented Control** bergaya iOS/Mac |
| Status Nonaktif | Opacity 70% saja | Opacity + grayscale + strikethrough pada nama |

---

### 7. Marketing & Promo

#### a. Card "Buat Promo" (Form)

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Warna Identitas | Biru (sama dengan Layanan) | **Violet** (identitas tersendiri) |
| Radius | `rounded-[2rem]` | `rounded-2xl` |
| Judul | Ikon SVG biru | Garis aksen vertikal ungu |
| Input Kode Promo | Input biasa | Font **monospace** + uppercase + tracking-widest + ikon Tag |
| Input Nilai | Kotak kosong | Ikon 💰 Currency |
| Input Min. Belanja | Kotak kosong | Label statis **Rp** |
| Input Tanggal | Kotak kosong kecil | Ikon 📅 Calendar + ukuran normal |
| Focus Effect | Tidak ada | Ring ungu (*violet glow*) |
| Tombol Simpan | Teks polos biru | Ikon hadiah + teks + shadow glow ungu |

#### b. Daftar Promo

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Layout | Grid 2 kolom (kartu biasa) | **List vertikal bergaya Voucher/Tiket** |
| Nilai Diskon | Teks kecil di bagian bawah | **Area khusus gradien ungu** di sisi kiri dengan angka raksasa |
| Kode Promo | Teks biasa | Font monospace + uppercase + tracking-widest |
| Detail | Tabel teks kecil | Ikon SVG inline + teks ringkas |
| Dekorasi | Tidak ada | **Lingkaran dekoratif** (*punch hole*) di sambungan voucher |
| Promo Expired | Badge merah saja | Seluruh kartu **redup + grayscale** |
| Tombol Aksi | Tombol kecil tanpa border | Icon buttons berbingkai standar |

---

## ✅ Checklist Konsistensi Antar Modul

| Elemen | Pelanggan | Layanan | Promo | Status |
|--------|-----------|---------|-------|--------|
| Radius `rounded-2xl` | ✅ | ✅ | ✅ | Seragam |
| Garis aksen vertikal pada judul | ✅ | ✅ | ✅ | Seragam |
| Ikon SVG di dalam input | ✅ | ✅ | ✅ | Seragam |
| Focus glow (ring + border) | ✅ | ✅ | ✅ | Seragam |
| Tombol ikon + teks + shadow | ✅ | ✅ | ✅ | Seragam |
| Layout daftar: List vertikal | ✅ | ✅ | ✅ | Seragam |
| Mode Edit warna amber | ✅ | ✅ | ✅ | Seragam |
| Icon buttons aksi (Edit/Hapus) | ✅ | ✅ | ✅ | Seragam |
| Label `tracking-widest` uppercase | ✅ | ✅ | ✅ | Seragam |

---

## 🛠️ Stack Teknologi

| Teknologi | Versi / Detail |
|-----------|----------------|
| Runtime | Google Apps Script (V8) |
| Frontend | HTML5 + Vanilla JavaScript |
| CSS Framework | TailwindCSS CDN |
| Ikon | SVG Inline (Heroicons style) |
| Database | Google Spreadsheet |
| Deployment | Google Apps Script Web App |
| Version Control | `clasp` (Command Line Apps Script) |

---

## 📌 Catatan Teknis

- **Tidak ada dependensi eksternal baru** — seluruh ikon menggunakan SVG inline untuk performa optimal.
- **Backward compatible** — tidak ada perubahan pada struktur data atau API backend (`Kode.js`).
- **Responsive** — seluruh layout menggunakan `flex-col` → `md:flex-row` untuk adaptasi mobile/tablet.
- Perubahan dilakukan pada 2 file utama: `index.html` (markup) dan `JavaScript.html` (rendering dinamis).

---

## 🚀 Deployment

```bash
# Push perubahan ke Google Apps Script
clasp push

# Buka editor online
clasp open
```

---

## 📅 Riwayat Perubahan

| Tanggal | Modul | Perubahan |
|---------|-------|-----------|
| 2026-04-18 | Sidebar | Redesign ikon, indikator aktif, profil user |
| 2026-04-18 | Dashboard | Hapus tombol redundan, SVG stat cards |
| 2026-04-18 | Transaksi Baru | Grouping 3 blok, SVG icons, toggle DP |
| 2026-04-18 | Riwayat Transaksi | Grid → List vertikal, avatar, badge |
| 2026-04-18 | Daftar Pelanggan | Grid → List, avatar, financial metrics |
| 2026-04-18 | Form Pelanggan | Radius, ikon input, focus glow, aksen bar |
| 2026-04-18 | Daftar Layanan | Grid → List, avatar kategori, toggle iOS, segmented filter |
| 2026-04-18 | Form Layanan | Radius, ikon input, focus glow, aksen bar |
| 2026-04-18 | Daftar Promo | Grid → Voucher list, gradien diskon, punch hole |
| 2026-04-18 | Form Promo | Warna violet, monospace input, ikon, focus glow |

---

*Dibuat sebagai dokumentasi hasil evaluasi UI/UX profesional pada sistem Laundry POS.*
