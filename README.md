# rtd-website

Situs satu halaman untuk Rama Trimitra Development Group — pengembang perumahan
di Palembang, Banyuasin, dan Ogan Ilir.

HTML, CSS, dan JavaScript biasa. Tanpa kerangka kerja, tanpa dependensi, tanpa proses build.

## Menjalankan

Buka `index.html` di peramban. Tidak ada langkah lain.

Untuk menguji dengan peladen lokal:

```bash
python3 -m http.server 8000
```

## Struktur

```
index.html              markah halaman
assets/css/style.css    token dan gaya
assets/js/app.js        data dan perilaku
img/                    logo, render proyek, denah, favicon
```

## Data

Semua data ada sebagai konstanta di bagian atas `assets/js/app.js`.

| Konstanta | Isi |
| --- | --- |
| `DATA_PROYEK` | Proyek yang sedang dijual |
| `DATA_PORTOFOLIO` | Perumahan yang sudah terbangun |
| `DATA_RUKO` | Proyek ruko |
| `DATA_LEGALITAS` | Legalitas holding |
| `DATA_PENGHARGAAN` | Daftar penghargaan |
| `DATA_TESTIMONI` | Testimoni |
| `DATA_TIM` | Tim manajemen |

Angka pada pita hero dihitung dari `DATA_PROYEK` dan `DATA_PORTOFOLIO`, tidak ditulis manual.

### Menambah proyek

Tambahkan objek ke `DATA_PROYEK` dan letakkan gambarnya di `img/` dengan nama
yang sama seperti kolom `gbr`.

```js
{
  id: 'green-nature',
  nama: 'The Green Nature',
  tahap: null,                     // "Tahap 3" bila ada
  kategori: 'subsidi',             // 'subsidi' | 'komersil'
  warna: 'var(--proyek-hutan)',
  lokasi: 'Pangkalan Benteng',
  daerah: 'palembang-lain',        // 'gandus' | 'ogan-ilir' | 'palembang-lain'
  tipe: '36/84', kt: 2, km: 1, unit: 106,
  harga: 166000000, dp: 5700000,
  angsuran20: 1072000,             // angka brosur; dipakai apa adanya bila diisi
  klaim: null,                     // dipakai bila harga masih null
  status: 'tersedia',              // 'tersedia' | 'booking' | 'terjual'
  gbr: 'green-nature.jpg'
}
```

`harga` diisi hanya dengan angka yang sudah dikonfirmasi pemasaran. Selama `null`,
kartu menampilkan `klaim` dan ajakan menghubungi pemasaran.

Bila `angsuran20` diisi, angka itu yang ditampilkan. Bila tidak, dihitung dari
`harga − dp` dengan anuitas 5% per tahun selama 20 tahun.

## Simulasi KPR

Metode anuitas, dihitung di sisi klien:

```
angsuran = P · i / (1 − (1 + i)^−n)
```

`P` plafon, `i` bunga bulanan, `n` jumlah angsuran. Bunga bawaan 5% mengikuti
ketentuan KPR subsidi FLPP. Hasilnya perkiraan dan belum termasuk provisi,
asuransi, notaris, dan pajak.

## Penayangan

GitHub Pages: Settings → Pages → Branch `main`, folder `/ (root)`.

Untuk domain sendiri, tambahkan berkas `CNAME` berisi nama domain dan arahkan
DNS ke GitHub Pages.

## Aksesibilitas

Teks isian 16px, area sentuh minimal 44 × 44 px, kontras teks minimal 4,5:1,
tanda fokus papan ketik pada semua kendali, tautan lompat ke isi utama, teks
alternatif pada semua gambar, dan `prefers-reduced-motion` dihormati.

## Belum selesai

- Harga dan angsuran sembilan proyek masih `null`, menunggu konfirmasi pemasaran.
- Angka 3.808 unit adalah total portofolio, bukan jumlah serah terima.
- Formulir kontak belum punya peladen; sementara meneruskan ke WhatsApp.
- Logo masih PNG, perlu diganti SVG.
- Gambar dipotong dari PDF brosur, resolusinya terbatas.
- Belum ada foto bangunan terbangun.
- Casa Adiva belum punya render bersih.
- Domain masih mengarah ke `rumahidamankita.co.id`.

## Catatan

Angka pada situs ini mengikuti brosur dan company profile yang berlaku saat
dibuat, dan masih berstatus pratinjau. Semua materi perlu diperiksa pemasaran
sebelum ditayangkan ke publik.
