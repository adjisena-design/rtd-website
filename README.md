# Situs Rama Trimitra Development Group

Situs satu halaman untuk RTD Group — pengembang rumah subsidi di Palembang dan Ogan Ilir.
Dibangun dari panduan visual RTD: krem sebagai kanvas, navy sebagai tinta, amber sebagai
aksen tunggal, Source Serif 4 untuk judul dan Plus Jakarta Sans untuk teks.

HTML, CSS, dan JavaScript biasa. Tanpa kerangka kerja, tanpa proses build, tanpa dependensi.
Buka `index.html` di peramban dan situs langsung jalan.

## Isi halaman

| Bagian | Isi |
| --- | --- |
| Hero | Judul, penyaring cepat, render utama, kartu proyek mengambang |
| Angka | Unit diserahkan, jumlah proyek, cakupan wilayah |
| Kenapa RTD | Tiga alasan: spesifikasi lengkap, angsuran tiga tenor, satu standar |
| Proyek | Sepuluh perumahan, bisa disaring menurut kategori dan daerah |
| Simulasi KPR | Kalkulator anuitas: harga, DP, bunga, tenor |
| Spesifikasi | Dua belas baris standar RTD, plus denah |
| Cara Membeli | Lima langkah dari pilih unit sampai serah terima |
| Tentang RTD | Profil singkat |
| Kontak | Formulir tiga kolom yang meneruskan ke WhatsApp pemasaran |

## Susunan berkas

```
index.html              seluruh markah halaman
assets/css/style.css    token warna, tipografi, jarak, dan semua gaya
assets/js/app.js        data proyek, penyaring, kalkulator KPR, navigasi
img/                    logo, render proyek, denah, favicon
```

## Cara mengubah data proyek

Semua data proyek ada di satu tempat: konstanta `DATA_PROYEK` di bagian atas
`assets/js/app.js`. Tidak perlu menyentuh berkas lain untuk menambah, menghapus,
atau memperbarui proyek.

```js
{
  id: 'green-nature',              // juga nama berkas gambar di img/
  nama: 'The Green Nature',
  tahap: null,                     // "Tahap 3" bila ada; tahap bukan bagian dari nama
  kategori: 'subsidi',             // 'subsidi' atau 'komersil'
  warna: 'var(--proyek-hutan)',    // warna aksen, dikunci seumur proyek
  lokasi: 'Pangkalan Benteng',
  daerah: 'palembang-lain',        // 'gandus' | 'ogan-ilir' | 'palembang-lain'
  tipe: '36/84', kt: 2, km: 1,
  harga: 166000000, dp: 5700000,
  angsuran20: 1072000,             // angka brosur; dipakai apa adanya bila diisi
  klaim: null,                     // dipakai bila harga masih null
  status: 'tersedia',              // 'tersedia' | 'booking' | 'terjual'
  gbr: 'green-nature.jpg'
}
```

**Aturan penting soal harga.** Isi `harga` hanya dengan angka yang sudah dikonfirmasi
pemasaran. Selama `harga` bernilai `null`, kartu menampilkan kalimat dari brosur proyek
tersebut lewat kolom `klaim`, ditambah ajakan menghubungi pemasaran — bukan angka karangan.

Saat ini hanya **The Green Nature** yang punya angka lengkap, karena hanya brosur itu yang
memuat tabel harga penuh. Sembilan proyek lainnya menunggu konfirmasi.

## Yang masih harus dikerjakan tim

1. **Harga dan angsuran sembilan proyek.** Isi `harga`, `dp`, dan `angsuran20` di
   `DATA_PROYEK` begitu pemasaran mengonfirmasi.
2. **Formulir kontak belum punya peladen.** Saat ini formulir membuka WhatsApp dengan
   pesan yang sudah terisi. Untuk menyimpan prospek ke basis data atau mengirim surel,
   ganti bagian `form.addEventListener('submit', …)` di `app.js`.
3. **Logo masih raster.** `img/rtd-logo-navy.png` dan `rtd-logo-krem.png` berukuran
   1704 × 529 px. Untuk layar beresolusi tinggi sebaiknya diganti SVG.
4. **Gambar berasal dari brosur cetak** dan dipotong ulang dari PDF, jadi resolusinya
   terbatas. Render asli dari tim desain akan jauh lebih tajam.
5. **Foto rumah terbangun belum ada.** Render menjual rencana; foto rumah yang sudah
   dihuni menjual bukti. Ini aset paling bernilai yang bisa ditambahkan.
6. **Casa Adiva** belum punya render bersih — potongan yang ada masih terbatas.
7. **Domain.** Situs lama `rumahidamankita.co.id` masih tercantum di footer. Saat pindah
   ke domain bernama RTD, alihkan domain lama ke yang baru, jangan dimatikan — tautan
   lama masih beredar di brosur cetak yang sudah tersebar.

## Menayangkan dengan GitHub Pages

Settings → Pages → Source: `Deploy from a branch` → Branch: `main`, folder `/ (root)` → Save.
Situs terbit di `https://adjisena-design.github.io/rtd-website/`.

Untuk domain sendiri, tambahkan berkas `CNAME` berisi nama domainnya dan arahkan DNS
ke GitHub Pages.

## Aksesibilitas

Yang sudah dipenuhi: teks isian 16px supaya peramban ponsel tidak memperbesar halaman
sendiri; area sentuh minimal 44 × 44 px; kontras teks minimal 4,5:1; tanda fokus papan
ketik di semua kendali; tautan lompat ke isi utama; setiap gambar punya teks alternatif
yang menyebut nama proyek dan tipe unit; `prefers-reduced-motion` dihormati.

## Catatan hukum

Angka pada situs ini mengikuti brosur yang berlaku saat dibuat dan masih berstatus
pratinjau. Simulasi KPR memakai metode anuitas dan bersifat perkiraan — angka final
ditetapkan bank penyalur pada saat akad, dan belum termasuk biaya provisi, asuransi,
notaris, dan pajak. Semua materi harus diperiksa pemasaran sebelum situs ditayangkan
ke publik.
