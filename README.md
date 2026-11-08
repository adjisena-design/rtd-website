# rtd-website

Situs PT Rama Trimitra Development Group — pengembang perumahan di Palembang,
Banyuasin, dan Ogan Ilir.

HTML, CSS, dan JavaScript biasa. Tanpa kerangka kerja, tanpa dependensi, tanpa proses build.

## Menjalankan

Buka `index.html` di peramban. Untuk menguji dengan peladen lokal:

```bash
python3 -m http.server 8000
```

Halaman detail proyek membaca `?id=` dari URL, jadi gunakan peladen lokal — bukan
`file://` — saat menguji tautan antarhalaman.

## Halaman

| Berkas | Isi |
| --- | --- |
| `index.html` | Hero berputar, angka, proyek, penghargaan, testimoni, simulasi KPR, cara membeli, media sosial, kontak |
| `proyek/index.html` | Semua proyek yang dijual + rekam jejak perumahan terbangun |
| `proyek/detail.html?id=<id>` | Halaman satu proyek: foto, siteplan, spesifikasi, fasilitas, angsuran |
| `tentang.html` | Profil, visi, misi, tim manajemen (direksi dan manajer) |
| `tim.html?id=<id>` | Profil satu anggota tim beserta CV |
| `yayasan.html` | Yayasan Al-Mukmin Darunnajah Center, tema biru muda dan putih; isi dan foto dari Company Profile Yayasan |
| `legalitas.html` | Legalitas holding dan mitra perbankan |
| `spesifikasi.html` | Dua belas baris spesifikasi standar |
| `berita.html` | Sorotan + kartu berita dengan saring kategori |
| `artikel.html?id=<id>` | Satu berita |
| `karier.html` | Daftar lowongan + kenapa RTD |
| `lowongan.html?id=<id>` | Satu lowongan |
| `kontak.html` | Formulir dan alamat |

## Struktur

```
assets/css/style.css    token dan gaya
assets/js/app.js        semua data dan perilaku
img/                    logo, render sampul, denah, favicon
img/hero/               render 3D dari Drive (Foto Proyek 3D), dipakai di semua kepala halaman
img/sosial/             poster reel Instagram
img/tim/                foto tim (isi `foto` di DATA_TIM)
img/yayasan/            foto kegiatan yayasan (isi DATA_YAYASAN_FOTO)
img/proyek/             foto unit dan siteplan per proyek
```

## Data

Semua data ada sebagai konstanta di bagian atas `assets/js/app.js`.

| Konstanta | Isi |
| --- | --- |
| `DATA_PROYEK` | Proyek yang dijual, termasuk galeri dan siteplan |
| `DATA_PORTOFOLIO`, `DATA_RUKO` | Perumahan yang sudah terbangun |
| `DATA_SPEK` | Dua belas baris spesifikasi standar |
| `DATA_LEGALITAS`, `DATA_LEGALITAS_YAYASAN` | Legalitas holding dan yayasan |
| `DATA_PENGHARGAAN_SOROT`, `DATA_PENGHARGAAN_LAIN` | Penghargaan |
| `DATA_TESTIMONI`, `DATA_TIM` | Testimoni dan tim manajemen |
| `DATA_REEL`, `DATA_YOUTUBE` | Tautan Instagram dan YouTube |
| `DATA_BERITA`, `DATA_KARIER` | Berita dan lowongan |
| `KONTAK` | Nomor WhatsApp, email, alamat |

Angka pada pita hero dihitung dari `DATA_PROYEK` dan `DATA_PORTOFOLIO`, tidak ditulis manual.

### Menambah proyek

Tambahkan objek ke `DATA_PROYEK`, letakkan render sampul di `img/`, dan foto unit
di `img/proyek/`.

```js
{
  id: 'green-nature',              // dipakai di ?id= dan nama berkas
  nama: 'The Green Nature',
  tahap: null,                     // "Tahap 3" bila ada
  kategori: 'subsidi',             // 'subsidi' | 'komersil'
  warna: 'var(--proyek-hutan)',
  lokasi: 'Pangkalan Benteng',
  alamat: 'Jl. ...',               // null bila belum dikonfirmasi
  daerah: 'banyuasin',             // 'gandus' | 'ogan-ilir' | 'banyuasin' | 'palembang-lain'
  tipe: '36/84', kt: 2, km: 1, unit: 106,
  harga: 166000000, dp: 5700000,
  angsuran20: 1072000,             // angka brosur; dipakai apa adanya bila diisi
  klaim: null,                     // dipakai bila harga masih null
  status: 'tersedia',              // 'tersedia' | 'booking' | 'terjual'
  gbr: 'green-nature.jpg',
  galeri: ['green-nature-1.jpg'],  // di img/proyek/; kosongkan bila belum ada
  siteplan: 'green-nature-siteplan.jpg',
  fasilitas: ['Musholla', 'Taman'],
  spekBeda: { 'Air': 'PDAM' }      // hanya yang berbeda dari standar
}
```

`harga` diisi hanya dengan angka yang sudah dikonfirmasi pemasaran. Selama `null`,
kartu menampilkan `klaim` dan ajakan menghubungi pemasaran.

Galeri yang kosong otomatis menampilkan kotak "Foto menyusul", bukan ruang kosong.

## Simulasi KPR

Metode anuitas, dihitung di sisi klien:

```
angsuran = P · i / (1 − (1 + i)^−n)
```

`P` plafon, `i` bunga bulanan, `n` jumlah angsuran. Bunga bawaan 5% mengikuti
ketentuan KPR subsidi FLPP.

## Tipografi

Inter, dimuat dari Google Fonts, dengan tumpukan cadangan
`"Helvetica Neue", Helvetica, Arial`. Helvetica Neue sendiri tidak di-host karena
berlisensi; Inter dipilih sebagai padanan bebas lisensi yang tampil sama di semua
perangkat.

## Sematan pihak ketiga

Instagram memakai `embed.js` resmi. Bila skrip itu diblokir, blockquote-nya tetap
tampil sebagai kartu tautan. YouTube memakai `youtube-nocookie.com`.

## Penayangan

GitHub Pages: Settings → Pages → Branch `main`, folder `/ (root)`.

## Aksesibilitas

Teks isian 16px, area sentuh minimal 44 × 44 px, kontras teks minimal 4,5:1,
tanda fokus papan ketik pada semua kendali, tautan lompat ke isi utama, teks
alternatif pada semua gambar, dan `prefers-reduced-motion` dihormati — termasuk
menghentikan putaran hero.

## Belum selesai

- Foto tim belum ada; kartu menampilkan inisial. CV baru lengkap untuk M. Junestrada Diem.
- Hanya 6 dari 14 render 3D yang diambil (resolusi 1280 px dari pratinjau Drive).

- Harga dan angsuran sembilan proyek masih `null`, menunggu konfirmasi pemasaran.
- Angka 3.808 unit adalah total portofolio, bukan jumlah serah terima.
- Isi `berita.html` dan `karier.html` masih contoh.
- Formulir kontak belum punya peladen; sementara meneruskan ke WhatsApp.
- Logo masih PNG, perlu diganti SVG.
- Render sampul dipotong dari PDF brosur, resolusinya terbatas. Render asli dari
  tim desain akan jauh lebih tajam.
- Siteplan baru tersedia untuk empat proyek; sisanya menampilkan "Siteplan menyusul".
- Domain masih mengarah ke `rumahidamankita.co.id`.

## Catatan

Angka pada situs ini mengikuti brosur dan company profile yang berlaku saat dibuat,
dan masih berstatus pratinjau. Semua materi perlu diperiksa pemasaran sebelum
ditayangkan ke publik.
