# rtd-website

Situs PT Rama Trimitra Development Group — pengembang perumahan di Palembang,
Banyuasin, dan Ogan Ilir.

HTML, CSS, dan JavaScript biasa. Tanpa kerangka kerja, tanpa dependensi, tanpa proses build.
Isinya dikelola tim lewat konsol di `/konsol/` (Supabase).

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
| `galeri.html` | Album kegiatan (dari situs lama) |
| `album.html?id=<id>` | Foto satu album dengan penampil layar penuh |
| `yayasan.html` | Yayasan Al-Mukmin Darunnajah Center, tema biru muda dan putih; isi dan foto dari Company Profile Yayasan |
| `legalitas.html` | Legalitas holding dan mitra perbankan |
| `spesifikasi.html` | Dua belas baris spesifikasi standar |
| `berita.html` | Sorotan + kartu berita dengan saring kategori |
| `artikel.html?id=<id>` | Satu berita |
| `karier.html` | Daftar lowongan + kenapa RTD |
| `lowongan.html?id=<id>` | Satu lowongan |
| `kontak.html` | Formulir dan alamat |
| `konsol/` | Konsol tim: semua isi, foto, pesan, lamaran, kode akses, log, penerbitan |

## Struktur

```
assets/css/style.css      token dan gaya
assets/js/app.js          perilaku situs; membaca data dari Supabase atau data/situs.json
assets/js/konfigurasi.js  alamat dan kunci anon Supabase (kosong = tanpa Supabase)
data/situs.json           salinan isi situs di repo, dipakai bila Supabase belum siap atau tidak terjangkau
data/teks-halaman.json    daftar teks halaman yang bisa disunting konsol (dibuat alat/teks-halaman.mjs)
konsol/                   konsol tim di /konsol/ (HTML, CSS, JS biasa; supabase-js disertakan di vendor/)
supabase/migrations/      skema, keamanan, dan fungsi database konsol
supabase/seed.sql         isi awal konsol dari data/situs.json (dibuat alat/buat-seed.mjs)
alat/                     skrip Node kecil tanpa dependensi
img/                      logo, render sampul, denah, favicon, foto lama
```

## Data

Isi situs tidak lagi ditulis di `app.js`. Saat halaman dibuka, `app.js` mengambil isi dari:

1. **Pratinjau** (`?pratinjau=1`, hanya untuk pemegang sesi konsol): isi konsol yang belum diterbitkan.
2. **Supabase**, fungsi `situs()`: versi terakhir yang diterbitkan lewat konsol.
3. **`data/situs.json`** di repo: bila `konfigurasi.js` kosong atau Supabase tidak menjawab dalam 4 detik.

Bentuk `data/situs.json` sama dengan yang dihasilkan konsol:

| Kunci | Isi |
| --- | --- |
| `proyek` | Proyek yang dijual: angka pemasaran, foto, siteplan, fasilitas, spesifikasi berbeda, titik peta |
| `portofolio` | Rekam jejak, `jenis: 'perumahan' \| 'ruko'` |
| `hero`, `promo` | Slide hero beranda; banner promo (tampil sesuai tanggal mulai/selesai) |
| `bank` | Mitra perbankan dengan logo, di beranda dan Legalitas |
| `penghargaan`, `testimoni`, `spesifikasi`, `legalitas` | Isi perusahaan (`sorot`, `kelompok: 'holding' \| 'yayasan'`) |
| `tim`, `pemasaran` | Manajemen dengan CV; tim pemasaran dengan foto dan WhatsApp |
| `berita`, `karier`, `galeri`, `yayasan_foto`, `reel`, `youtube` | Kabar dan media |
| `pengaturan.kontak` | WhatsApp, email, Instagram, YouTube, alamat, jam buka; dipakai di semua halaman |
| `pengaturan.angka` | Angka pemasaran. Kosong = dihitung dari proyek dan rekam jejak |
| `pengaturan.kpr` | Bunga, tenor, batas harga dan DP simulasi |
| `pengaturan.teks` | Teks halaman yang diubah dari bawaan HTML, per kunci `data-teks` |

Gambar: nilai seperti `proyek/tag-1.jpg` berarti berkas di `img/`; alamat `https://…` berarti
unggahan konsol di Supabase Storage. Unggahan konsol diperkecil di peramban ke WebP (1600 px,
siteplan 2600 px) dan disertai versi `-sm.webp` 820 px untuk `srcset`.

Teks halaman: setiap judul dan paragraf statis bertanda `data-teks="…"`. Menambah elemen
bertanda baru di HTML lalu menjalankan `node alat/teks-halaman.mjs` membuatnya muncul di konsol.
Pada teks judul, `|` memisahkan bagian yang tampil redup.

## Konsol tim

`/konsol/` adalah halaman statis yang berbicara langsung dengan Supabase. Cara kerjanya sama
dengan konsol IEEF:

- Peramban mendapat sesi anonim Supabase; memasukkan kode akses (`RTD-XXXX-XXXX`) menautkan
  sesi itu ke satu orang selama 12 jam.
- Peran: **pemilik** (satu, tidak bisa dicabut, mengelola kode admin), **admin** (menghapus isi,
  memulihkan versi, mengelola kode editor dan kontributor), **editor** (mengubah isi, membaca pesan
  dan lamaran, menyetujui draf, menerbitkan), **kontributor** (mengirim usulan yang ditinjau editor).
- Kode disimpan sebagai hash SHA-256 dan hanya tampil sekali. Mencabut kode langsung mengakhiri sesinya.
  Delapan kode salah dalam 15 menit dari satu peramban atau IP memblokir percobaan berikutnya.
- Semua tabel ada di skema `rtd` yang tidak diekspos API. Peramban hanya bisa memanggil fungsi
  `konsol_*` (memeriksa peran di setiap panggilan), `situs()`, `kirim_pesan()`, dan `kirim_lamaran()`.
- Setiap perubahan tercatat di log aktivitas dengan nama pemegang kode.
- **Terbitkan** menyimpan seluruh isi konsol sebagai satu versi di `rtd.terbitan`; situs selalu memakai
  versi teratas. Versi lama bisa diunduh sebagai JSON atau dipulihkan (admin).
- Formulir kontak dan lamaran menyimpan ke `rtd.pesan` dan `rtd.lamaran` (dibatasi per IP, dengan
  jebakan bot). CV PDF masuk bucket privat `lamaran`; konsol membukanya lewat tautan dua menit.
  Pengirim kontak tetap ditawari melanjutkan lewat WhatsApp.

Menu konsol: Ringkasan · Proyek · Rekam jejak · Angka pemasaran · Simulasi KPR · Hero beranda ·
Promo · Manajemen (dengan CV) · Tim pemasaran · Mitra perbankan · Penghargaan · Testimoni ·
Spesifikasi standar · Legalitas · Berita · Karier · Galeri · Foto yayasan · Reel Instagram ·
Video YouTube · Teks halaman · Kontak & media sosial · Pesan · Lamaran kerja · Tinjau draf ·
Aktivitas · Versi terbit · Kode akses.

**Mode demo.** Selama `konfigurasi.js` kosong, `/konsol/` berjalan sepenuhnya di peramban atas
salinan `data/situs.json`, dengan kode contoh di layar masuk (`RTD-DEMO-PMLK`, `-ADMN`, `-EDTR`,
`-KTRB`). Perubahan hanya tersimpan di tab itu; Pratinjau menampilkannya di situs pada peramban
yang sama. Tidak ada yang sampai ke pengunjung lain.

### Menyambungkan ke Supabase

1. Buat proyek Supabase (region Singapore paling dekat).
2. **Authentication → Sign In / Providers**: aktifkan **Allow anonymous sign-ins**.
3. **SQL Editor**: jalankan berurutan `supabase/migrations/20261112000001_konsol.sql`,
   `20261112000002_penyimpanan.sql`, lalu `supabase/seed.sql`. Seed mengisi konsol dengan isi
   `data/situs.json` dan menerbitkannya sebagai versi 1. Bila `data/situs.json` berubah sebelum
   langkah ini, buat ulang seed dengan `node alat/buat-seed.mjs`.
4. Masih di SQL Editor: `select rtd.buat_pemilik('Daffa Adjisena');` — kode pemilik tampil sekali.
   Simpan di pengelola kata sandi.
5. **Project Settings → API**: salin Project URL dan kunci anon/publishable ke
   `assets/js/konfigurasi.js`, jalankan `sh versi.sh`, lalu commit. Kunci ini memang untuk peramban; jangan pernah
   menaruh `service_role` di repo.
6. Biarkan **Data API → Exposed schemas** tetap `public` saja. Skema `rtd` tidak boleh diekspos.
7. Buka `/konsol/`, masuk dengan kode pemilik, buat kode untuk tim di menu Kode akses.

Situs tetap statis, jadi bisa ditayangkan di GitHub Pages atau Cloudflare Pages tanpa perubahan;
keduanya membaca isi dari Supabase yang sama.

Proyek Supabase gratis dijeda setelah seminggu tanpa aktivitas. Selama dijeda, situs memakai
`data/situs.json`. Sesekali unduh versi terbaru dari **Versi terbit** dan simpan sebagai
`data/situs.json` agar salinan cadangan tidak tertinggal jauh.

### Menguji database secara lokal

Migrasi diuji pada PostgreSQL 16 dengan tiruan kecil skema `auth` dan `storage` Supabase:
pemilik pertama, kode salah, pembuatan kode, simpan dan urutkan isi, pratinjau, terbit, draf
kontributor dan persetujuan, pesan dan lamaran (termasuk lowongan tertutup dan jebakan bot),
penolakan akses untuk peran yang tidak berhak dan untuk anon, pencabutan kode, dan pemulihan versi.

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

- Galeri baru memuat 100 dari 191 foto situs lama (9 dari 18 album; Akad Massal 8 dari 32). Album 2024–2026 belum dipindah.

- Foto tim belum ada; kartu menampilkan inisial. CV baru lengkap untuk M. Junestrada Diem.
- Hanya 6 dari 14 render 3D yang diambil (resolusi 1280 px dari pratinjau Drive).

- Harga dan angsuran sembilan proyek masih `null`, menunggu konfirmasi pemasaran.
- Angka 3.808 unit adalah total portofolio, bukan jumlah serah terima.
- Isi `berita.html` dan `karier.html` masih contoh.
- Formulir kontak dan lamaran baru menyimpan ke database setelah Supabase disambungkan; sampai itu, keduanya meneruskan ke WhatsApp.
- Pemberitahuan pesan dan lamaran baru hanya lewat konsol (lencana di menu), belum lewat email.
- Logo bank BTN dan BTN Syariah belum diunggah; kartu menampilkan nama bank.
- Logo masih PNG, perlu diganti SVG.
- Render sampul dipotong dari PDF brosur, resolusinya terbatas. Render asli dari
  tim desain akan jauh lebih tajam.
- Siteplan baru tersedia untuk empat proyek; sisanya menampilkan "Siteplan menyusul".
- Domain masih mengarah ke `rumahidamankita.co.id`.

## Catatan

Angka pada situs ini mengikuti brosur dan company profile yang berlaku saat dibuat,
dan masih berstatus pratinjau. Semua materi perlu diperiksa pemasaran sebelum
ditayangkan ke publik.
