/* ==========================================================================
   Rama Trimitra Development Group
   Semua data situs ada di berkas ini. Tanpa kerangka kerja, tanpa dependensi.
   ========================================================================== */

'use strict';

/* --------------------------------------------------------------------------
   PROYEK YANG SEDANG DIJUAL

   id          kode unik, dipakai di tautan ?id= dan nama berkas gambar
   nama        nama resmi, ditulis lengkap
   tahap       "Tahap 3" bila ada. Tahap bukan bagian dari nama.
   kategori    'subsidi' | 'komersil'
   warna       warna aksen proyek, dikunci seumur proyek
   lokasi      kelurahan/kecamatan, kota
   alamat      alamat lengkap bila sudah dikonfirmasi
   daerah      'gandus' | 'ogan-ilir' | 'palembang-lain' | 'banyuasin'
   tipe        LB/LT, mis. '36/84'
   kt, km      jumlah kamar tidur dan kamar mandi
   unit        jumlah unit dalam proyek
   harga       harga jual rupiah, atau null bila belum dikonfirmasi
   dp          uang muka rupiah, atau null
   angsuran20  angsuran 20 tahun menurut brosur; dipakai apa adanya bila diisi
   klaim       kalimat brosur, dipakai bila harga masih null
   status      'tersedia' | 'booking' | 'terjual'
   gbr         render sampul di img/
   galeri      foto dari Drive di img/proyek/ — kosongkan bila belum ada
   siteplan    berkas siteplan di img/proyek/, atau null
   fasilitas   daftar fasilitas umum
   spekBeda    penyimpangan dari spesifikasi standar, mis. { Air: 'PDAM' }
   -------------------------------------------------------------------------- */

const DATA_PROYEK = [
  {
    id: 'green-nature', nama: 'The Green Nature', tahap: null,
    kategori: 'subsidi', warna: 'var(--proyek-hutan)',
    lokasi: 'Pangkalan Benteng', alamat: 'Jl. Pangkalan Benteng, Sukamoro, Kec. Talang Kelapa, Kab. Banyuasin, Sumatera Selatan',
    daerah: 'banyuasin', tipe: '36/84', kt: 2, km: 1, unit: 106,
    harga: 166000000, dp: 5700000, angsuran20: 1072000, klaim: null,
    status: 'tersedia', gbr: 'green-nature.jpg',
    galeri: ['green-nature-1.jpg', 'green-nature-2.jpg', 'green-nature-3.jpg'],
    siteplan: 'green-nature-siteplan.jpg',
    fasilitas: ['Musholla', 'Taman', 'Jalan cor beton', 'One gate system'],
    spekBeda: {}
  },
  {
    id: 'tag-tahap-3', nama: 'Taman Asri Gandus 2', tahap: 'Tahap 3',
    kategori: 'subsidi', warna: 'var(--proyek-laut)',
    lokasi: 'Gandus, Palembang', alamat: 'Jl. Talang Kemang RT 22 RW 06, Kel. Gandus, Kec. Gandus, Kota Palembang, Sumatera Selatan',
    daerah: 'gandus', tipe: '36/84', kt: 2, km: 1, unit: 249,
    harga: null, dp: 3000000, angsuran20: null, klaim: 'DP all in 3 juta',
    status: 'tersedia', gbr: 'tag-tahap-3.jpg',
    galeri: ['tag-1.jpg', 'tag-2.jpg', 'tag-3.jpg'],
    siteplan: 'tag-siteplan.jpg',
    fasilitas: ['Kolam renang', 'Jogging track', 'Masjid', 'Lapangan olahraga', 'One gate system', 'Security 24 jam'],
    spekBeda: {}
  },
  {
    id: 'tag-tahap-4', nama: 'Taman Asri Gandus 2', tahap: 'Tahap 4',
    kategori: 'subsidi', warna: 'var(--proyek-laut)',
    lokasi: 'Gandus, Palembang', alamat: 'Jl. Talang Kemang RT 22 RW 06, Kel. Gandus, Kec. Gandus, Kota Palembang, Sumatera Selatan',
    daerah: 'gandus', tipe: '36/84', kt: 2, km: 1, unit: 251,
    harga: null, dp: 3000000, angsuran20: null, klaim: 'DP all in 3 juta',
    status: 'tersedia', gbr: 'tag-tahap-4.jpg',
    galeri: ['tag-1.jpg', 'tag-2.jpg', 'tag-3.jpg'],
    siteplan: 'tag-siteplan.jpg',
    fasilitas: ['Kolam renang', 'Jogging track', 'Masjid', 'Lapangan olahraga', 'One gate system', 'Security 24 jam'],
    spekBeda: {}
  },
  {
    id: 'tag-tahap-5', nama: 'Taman Asri Gandus 2', tahap: 'Tahap 5',
    kategori: 'subsidi', warna: 'var(--proyek-laut)',
    lokasi: 'Gandus, Palembang', alamat: 'Jl. Talang Kemang RT 22 RW 06, Kel. Gandus, Kec. Gandus, Kota Palembang, Sumatera Selatan',
    daerah: 'gandus', tipe: '36/84', kt: 2, km: 1, unit: 334,
    harga: null, dp: null, angsuran20: null, klaim: 'Angsuran mulai 1 jutaan',
    status: 'tersedia', gbr: 'tag-tahap-5.jpg',
    galeri: ['tag-1.jpg', 'tag-2.jpg', 'tag-3.jpg'],
    siteplan: 'tag-siteplan.jpg',
    fasilitas: ['Kolam renang', 'Jogging track', 'Masjid', 'Lapangan olahraga', 'One gate system', 'Security 24 jam'],
    spekBeda: {}
  },
  {
    id: 'tag-signature', nama: 'TAG Signature', tahap: null,
    kategori: 'komersil', warna: 'var(--proyek-batu)',
    lokasi: 'Gandus, Palembang', alamat: 'Jl. Sofyan Kenawas RT 21 RW 06, Kel. Gandus, Kec. Gandus, Kota Palembang, Sumatera Selatan',
    daerah: 'gandus', tipe: '36/84', kt: 2, km: 1, unit: 126,
    harga: null, dp: null, angsuran20: null, klaim: 'Hubungi pemasaran untuk harga',
    status: 'tersedia', gbr: 'tag-signature.jpg',
    galeri: ['tag-signature-1.jpg'],
    siteplan: null,
    fasilitas: ['Lampu taman', 'Playground', 'Jogging track', 'Lapangan olahraga', 'One gate system', 'Security 24 jam'],
    spekBeda: {}
  },
  {
    id: 'green-village', nama: 'The Green Village', tahap: null,
    kategori: 'subsidi', warna: 'var(--proyek-daun)',
    lokasi: 'Merah Mata, Banyuasin', alamat: null,
    daerah: 'banyuasin', tipe: '36/99', kt: 2, km: 1, unit: 270,
    harga: null, dp: null, angsuran20: null, klaim: 'Angsuran mulai 1 juta, langsung huni',
    status: 'tersedia', gbr: 'green-village.jpg',
    galeri: ['green-village-1.jpg', 'green-village-2.jpg'],
    siteplan: 'green-village-siteplan.jpg',
    fasilitas: ['Musholla', 'Taman', 'Playground'],
    spekBeda: {}
  },
  {
    id: 'grand-athmar-indralaya', nama: 'Grand Athmar Indralaya', tahap: null,
    kategori: 'subsidi', warna: 'var(--proyek-kayu)',
    lokasi: 'Indralaya Utara, Ogan Ilir', alamat: 'Dusun II, Desa Tanjung Baru, Kec. Indralaya Utara, Kab. Ogan Ilir, Sumatera Selatan',
    daerah: 'ogan-ilir', tipe: '36/96', kt: 2, km: 1, unit: 298,
    harga: null, dp: 1000000, angsuran20: null, klaim: 'DP mulai 1 juta',
    status: 'tersedia', gbr: 'grand-athmar-indralaya.jpg',
    galeri: ['grand-athmar-indralaya-1.jpg', 'grand-athmar-indralaya-2.jpg', 'grand-athmar-indralaya-3.jpg'],
    siteplan: null,
    fasilitas: ['Masjid', 'Taman', 'Kios', 'Jogging track', 'Playground', 'Pos security'],
    spekBeda: {}
  },
  {
    id: 'grand-athmar-sematang', nama: 'Grand Athmar Sematang Borang', tahap: null,
    kategori: 'subsidi', warna: 'var(--proyek-kayu)',
    lokasi: 'Sematang Borang, Palembang', alamat: null,
    daerah: 'palembang-lain', tipe: '36/98', kt: 2, km: 1, unit: 206,
    harga: null, dp: null, angsuran20: null, klaim: 'Gratis pemasangan air PDAM',
    status: 'tersedia', gbr: 'grand-athmar-sematang.jpg',
    galeri: ['grand-athmar-sematang-1.jpg', 'grand-athmar-sematang-2.jpg', 'grand-athmar-sematang-3.jpg'],
    siteplan: null,
    fasilitas: ['Musholla', 'Taman', 'One gate system', 'PDAM'],
    spekBeda: { 'Air': 'PDAM, gratis biaya pemasangan' }
  },
  {
    id: 'kartika-mataram', nama: 'Kartika Mataram Residence', tahap: 'Tahap 2',
    kategori: 'subsidi', warna: 'var(--proyek-bata)',
    lokasi: 'Talang Kelapa, Banyuasin', alamat: 'Jl. Mataram 2, Kec. Talang Kelapa, Kab. Banyuasin, Sumatera Selatan',
    daerah: 'banyuasin', tipe: '36/84', kt: 2, km: 1, unit: 570,
    harga: null, dp: null, angsuran20: null, klaim: 'Angsuran mulai 1 jutaan',
    status: 'tersedia', gbr: 'kartika-mataram.jpg',
    galeri: ['kartika-mataram-1.jpg', 'kartika-mataram-2.jpg'],
    siteplan: null,
    fasilitas: ['Masjid', 'Taman', 'Jogging track'],
    spekBeda: {}
  },
  {
    id: 'casa-adiva', nama: 'Casa Adiva', tahap: null,
    kategori: 'komersil', warna: 'var(--proyek-tanah)',
    lokasi: 'Suka Maju, Kenten', alamat: null,
    daerah: 'palembang-lain', tipe: '65/85', kt: 3, km: 2, unit: 17,
    harga: null, dp: 0, angsuran20: null, klaim: 'Town house 2 lantai · DP 0, booking 5 juta',
    status: 'tersedia', gbr: 'casa-adiva.jpg',
    galeri: ['casa-adiva-2.jpg', 'casa-adiva-3.jpg', 'casa-adiva-4.jpg'],
    siteplan: 'casa-adiva-siteplan.jpg',
    fasilitas: ['Taman', 'Town house 2 lantai'],
    spekBeda: {}
  }
];

/* Perumahan yang sudah terbangun dan tidak lagi dijual. */
const DATA_PORTOFOLIO = [
  { nama: 'Kartika Mataram Residence',     tahap: 'Tahap 1',   area: 'Talang Kelapa, Banyuasin',     tipe: '36/91', unit: 150 },
  { nama: 'Taman Asri Gandus 2',           tahap: 'Tahap 1',   area: 'Gandus, Palembang',            tipe: '36/96', unit: 150 },
  { nama: 'Taman Asri Gandus 2',           tahap: 'Tahap 2',   area: 'Gandus, Palembang',            tipe: '36/84', unit: 267 },
  { nama: 'Surya Akbar Gemilang',          tahap: null,        area: 'Demang Lebar Daun, Palembang', tipe: '36/91', unit: 317 },
  { nama: 'Grand Talang Betutu Indah',     tahap: null,        area: 'Talang Betutu, Palembang',     tipe: '36/84', unit: 108 },
  { nama: 'Palem Emas 1',                  tahap: null,        area: 'Talang Betutu, Palembang',     tipe: '36/84', unit: 61  },
  { nama: 'Palem Emas 2',                  tahap: null,        area: 'Talang Betutu, Palembang',     tipe: '36/90', unit: 108 },
  { nama: 'Grand Pangkalan Benteng Indah', tahap: null,        area: 'Talang Kelapa, Banyuasin',     tipe: '36/84', unit: 103 },
  { nama: 'Alam Hijau 3',                  tahap: 'dua tahap', area: 'Gandus, Palembang',            tipe: '36/84', unit: 117, proyek: 2 }
];

const DATA_RUKO = [
  { nama: 'Ruko Grand Athmar Indralaya', area: 'Indralaya Utara, Ogan Ilir', tipe: '4×12 / 4×20 m', unit: 37 }
];

/* Spesifikasi standar RTD — dua belas baris, urutannya tidak diubah. */
const DATA_SPEK = [
  ['Pondasi', 'Bata merah + plat setempat'],
  ['Struktur', 'Beton bertulang'],
  ['Dinding', 'Bata merah diplester, plamir, finishing cat'],
  ['Lantai', 'Keramik 40 × 40, kamar mandi keramik 20 × 20'],
  ['Daun pintu', 'Kayu kelas II'],
  ['Pintu kamar mandi', 'PVC standar'],
  ['Daun jendela', 'Aluminium + kaca 5 mm'],
  ['Penutup atap', 'Genteng metal polos'],
  ['Plafon', 'Rangka hollow + silica board'],
  ['Listrik', '1.300 watt'],
  ['Air', 'Sumur gali atau PDAM, sesuai proyek'],
  ['Jalan komplek', 'Cor beton']
];

const DATA_LEGALITAS = [
  { label: 'Akta Pendirian Perusahaan', nilai: 'No. 27',                          tgl: '15 Oktober 2020' },
  { label: 'SK Kemenkumham',            nilai: 'AHU-0054067.AH.01.01.TAHUN 2020', tgl: '19 Oktober 2020' },
  { label: 'NIB',                       nilai: '0220510240235',                   tgl: '3 Desember 2020' },
  { label: 'TDP',                       nilai: '060614601853',                    tgl: '1 Oktober 2023' },
  { label: 'NPWP',                      nilai: '86.139.188.6-301.000',            tgl: null },
  { label: 'SIUJK',                     nilai: '1-1671-2-00156-324222',           tgl: '19 April 2024' },
  { label: 'Sertifikat Keanggotaan PI', nilai: '02.03.2020.102',                  tgl: '21 November 2024' },
  { label: 'Direktur',                  nilai: 'M. Junestrada Diem',              tgl: null },
  { label: 'Komisaris',                 nilai: 'Hj. Meriana Arsyad',              tgl: null }
];

const DATA_LEGALITAS_YAYASAN = [
  { label: 'Akta Pendirian Yayasan', nilai: 'No. 21',                        tgl: '10 Maret 2023' },
  { label: 'SK Kemenkumham',         nilai: 'AHU-0004527.AH.01.04.Tahun 2023', tgl: '15 Maret 2023' },
  { label: 'NPWP',                   nilai: '40.264.000.7-307.000',          tgl: '16 Maret 2023' },
  { label: 'Pendiri / Pembina',      nilai: 'Huda Assalam · M. Junestrada Diem', tgl: null },
  { label: 'Pengawas',               nilai: 'M. Hafizudin',                  tgl: null },
  { label: 'Ketua',                  nilai: 'Ahmad Shiddiq',                 tgl: null }
];

/* Tiga penghargaan yang ditonjolkan, sisanya di balik tombol. */
const DATA_PENGHARGAAN_SOROT = [
  { tahun: '2025', nama: 'The Best Developer Subsidi',
    ket: 'Penilaian Bank BTN atas kinerja penyaluran KPR bersubsidi sepanjang tahun.' },
  { tahun: '2025', nama: 'The Best Developer Yasa Griya',
    ket: 'Untuk kinerja pembiayaan konstruksi perumahan — menilai cara kami membangun, bukan cara kami menjual.' },
  { tahun: '2024', nama: 'The Best Commercial Financing Developer',
    ket: 'Diberikan atas kualitas pembiayaan komersial dan ketepatan realisasi proyek.' }
];

const DATA_PENGHARGAAN_LAIN = [
  { tahun: '2024', nama: 'Pengembang Realisasi Terbanyak KCPS' },
  { tahun: '2024', nama: 'Performance Pengembang Pembiayaan Konstruksi BTN iB di atas 15 M' },
  { tahun: '2024', nama: 'Pengembang Terloyal' },
  { tahun: '2024', nama: 'Investor Recovery Asset BTN KC Syariah Palembang' },
  { tahun: '2024', nama: 'Penghargaan Akad Terbanyak Peringkat 3' },
  { tahun: '2023', nama: 'Mitra Pengembang — Perumahan dengan Sarana dan Prasarana Terbaik' },
  { tahun: '2023', nama: 'Mitra Pengembang — Kinerja Pembiayaan Konstruksi Terbaik' },
  { tahun: '2023', nama: 'Mitra Pengembang — Kontribusi Realisasi Pembiayaan Konstruksi Terbaik' },
  { tahun: '2023', nama: 'Mitra Pengembang — Kontribusi Realisasi KCPS' },
  { tahun: '2023', nama: 'Mitra Pengembang — Realisasi Akad Terbanyak KPR BTN Bersubsidi iB' },
  { tahun: '2023', nama: 'Mitra Pengembang — Terkolaboratif' },
  { tahun: null,   nama: 'Developer dengan kontribusi untuk Bank BTN Syariah' }
];

const DATA_TESTIMONI = [
  {
    isi: 'Sebagai salah satu pengembang properti terdepan di Kota Palembang, RTD Group telah membuktikan diri tidak hanya sebagai developer yang membangun hunian, tetapi juga sebagai market leader dalam pengembangan kawasan yang berkelanjutan. Kepercayaan perbankan, termasuk rating Platinum dari Bank BTN dan BTN Syariah, menjadi bukti nyata atas kapabilitas mereka dalam manajemen keuangan.',
    nama: 'Asti Kumala Sari',
    jabatan: 'Branch Manager PT Bank Syariah Nasional Tbk, Kantor Cabang Palembang'
  },
  {
    isi: 'Kekuatan sinergi dan kolaborasi yang tinggi, itulah kalimat yang tepat menggambarkan budaya kerja RTD Group. RTD Group sangat fokus terhadap kualitas bangunan dan filtering konsumen, sehingga mampu menciptakan kawasan hunian yang baik dan lingkungan yang harmonis.',
    nama: 'M. Saktiardy Wijaya',
    jabatan: 'Commercial, Small and Medium Financing Head, Bank BTN Kantor Cabang Syariah Palembang'
  },
  {
    isi: 'RTD Group adalah pengembang rumah subsidi yang menawarkan skema pembelian sesuai kebutuhan konsumen dengan kualitas bangunan yang melebihi standar.',
    nama: 'Ferdiyan Ganesha, S.H., M.H., C.M.',
    jabatan: 'Kreator Kelacare Hukum'
  },
  {
    isi: 'RTD Group merupakan solusi investasi properti bagi semua konsumen yang ingin memiliki investasi properti yang berkualitas dan amanah.',
    nama: 'Dr. Firmansyah Arifin, S.E., M.M., Ak., C.A., C.S.R.S.',
    jabatan: 'Direktur CV Ghanim Amanah · Anggota IAI'
  }
];

const DATA_TIM = [
  { nama: 'M. Junestrada Diem', jabatan: 'Director', utama: true,
    ket: 'Memimpin RTD Group sejak pendiriannya pada 2020. Juga pendiri dan pembina Yayasan Al-Mukmin Darunnajah Center.' },
  { nama: 'Huda Assalam',       jabatan: 'Director' },
  { nama: 'Ade Saputra',        jabatan: 'Operational Manager' },
  { nama: 'Teddy Wijaya',       jabatan: 'Field Manager' },
  { nama: 'Romi Febriansyah',   jabatan: 'Marketing Manager' },
  { nama: 'Putra Ady Kesuma',   jabatan: 'Finance Manager' },
  { nama: 'Yoga Juniansyah',    jabatan: 'HRGA Manager' },
  { nama: 'Nosvita Sari',       jabatan: 'Administrasi Supervisor' },
  { nama: 'M. Tio Amartha',     jabatan: 'Field Supervisor' }
];

const DATA_REEL = [
  { url: 'https://www.instagram.com/reel/DfZQnz0TMTq/', judul: 'Progres pembangunan', ket: 'Reel Instagram' },
  { url: 'https://www.instagram.com/reel/DfWkUTDTqxS/', judul: 'Unit siap huni',      ket: 'Reel Instagram' },
  { url: 'https://www.instagram.com/reel/DfPEaIcT2hV/', judul: 'Lingkungan perumahan', ket: 'Reel Instagram' },
  { url: 'https://www.instagram.com/reel/DfHq5ijTEKy/', judul: 'Serah terima unit',   ket: 'Reel Instagram' }
];

const DATA_YOUTUBE = {
  kanal: 'https://www.youtube.com/channel/UCeFYjZ3-2V6sVQ38RNnYJ2Q',
  video: [
    { id: '55C3YPLk1eI', judul: 'Profil proyek RTD Group' },
    { id: 'ELZ0bAsGNLI', judul: 'Tur perumahan RTD Group' },
    { id: 'SiczRu4PT9Y', judul: 'Progres pembangunan RTD Group' }
  ]
};

/* Berita dan karier: contoh isi. Ganti dengan materi asli sebelum ditayangkan. */
const DATA_BERITA = [
  { tanggal: '2026-10-28', kategori: 'Proyek', judul: 'The Green Village memasuki tahap serah terima pertama',
    ringkas: 'Unit tahap pertama di Merah Mata mulai diserahkan kepada pembeli. Contoh isi — ganti dengan berita asli.' },
  { tanggal: '2026-09-15', kategori: 'Penghargaan', judul: 'RTD Group menerima The Best Developer Subsidi 2025',
    ringkas: 'Penghargaan diberikan Bank BTN atas kinerja penyaluran KPR bersubsidi. Contoh isi — ganti dengan berita asli.' },
  { tanggal: '2026-08-02', kategori: 'Panduan', judul: 'Syarat dan berkas KPR subsidi yang perlu disiapkan',
    ringkas: 'Panduan singkat bagi pembeli rumah pertama. Contoh isi — ganti dengan artikel asli.' }
];

const DATA_KARIER = [
  { posisi: 'Marketing Executive', tipe: 'Penuh waktu', lokasi: 'Palembang',
    ringkas: 'Memasarkan unit di proyek Gandus dan Banyuasin, mendampingi pembeli sampai akad. Contoh lowongan.' },
  { posisi: 'Site Supervisor', tipe: 'Penuh waktu', lokasi: 'Indralaya, Ogan Ilir',
    ringkas: 'Mengawasi mutu pekerjaan dan ketepatan jadwal di lapangan. Contoh lowongan.' },
  { posisi: 'Drafter', tipe: 'Penuh waktu', lokasi: 'Palembang',
    ringkas: 'Menyiapkan gambar kerja, denah, dan siteplan untuk proyek berjalan. Contoh lowongan.' }
];

const KONTAK = {
  wa: '6282384299234',
  waTampil: '0823-8429-9234',
  email: 'trimitrarama@gmail.com',
  ig: 'ramadevelopmentplg',
  alamat: ['Jl. Letjen Harun Sohar, Komplek Pergudangan', 'Palembang Star, Blok AA01–AA02', 'Kel. Kebun Bunga, Kec. Sukarami', 'Kota Palembang, Sumatera Selatan 30961']
};

const TEKS_STATUS = { tersedia: 'Tersedia', booking: 'Booking', terjual: 'Terjual' };

/* ------------------------------------------------------------- Pembantu -- */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const rupiah = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');

function angsuranBulanan(pokok, bungaTahunan, tahun) {
  const n = tahun * 12;
  if (pokok <= 0 || n <= 0) return 0;
  const i = bungaTahunan / 100 / 12;
  if (i === 0) return pokok / n;
  return (pokok * i) / (1 - Math.pow(1 + i, -n));
}

function angsuranTerendah(p) {
  if (p.angsuran20) return p.angsuran20;
  if (!p.harga) return null;
  return angsuranBulanan(p.harga - (p.dp || 0), 5, 20);
}

const judulLengkap = p => (p.tahap ? `${p.nama} — ${p.tahap}` : p.nama);
const inisial = n => n.replace(/[^A-Za-z. ]/g, '').split(/\s+/).filter(w => w.length > 1).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Prefiks relatif: halaman di dalam /proyek/ perlu "../" */
const AKAR = location.pathname.includes('/proyek/') ? '../' : '';

/* ------------------------------------------------------------- Navigasi -- */

function pasangNavigasi() {
  const nav = $('#nav'), tombol = $('#navTombol');
  if (tombol) {
    tombol.addEventListener('click', () => {
      const buka = nav.classList.toggle('buka');
      tombol.setAttribute('aria-expanded', String(buka));
      tombol.setAttribute('aria-label', buka ? 'Tutup menu' : 'Buka menu');
    });
  }
  $$('.nav__tarik').forEach(btn => {
    const li = btn.parentElement;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const buka = li.classList.toggle('buka');
      btn.setAttribute('aria-expanded', String(buka));
    });
  });
  document.addEventListener('click', e => {
    $$('.nav__menu > li.buka').forEach(li => {
      if (!li.contains(e.target)) {
        li.classList.remove('buka');
        const b = $('.nav__tarik', li);
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    $$('.nav__menu > li.buka').forEach(li => li.classList.remove('buka'));
  });
}

/* ----------------------------------------------------------------- Hero -- */

function pasangHero() {
  const slides = $$('.hero__slide');
  if (slides.length < 2) return;
  const titik = $('#heroTitik');
  let i = 0, timer = null;
  const kurangGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (titik) {
    slides.forEach((_, n) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Tampilkan gambar ${n + 1} dari ${slides.length}`);
      b.setAttribute('aria-current', String(n === 0));
      b.addEventListener('click', () => { ke(n); mulai(); });
      titik.appendChild(b);
    });
  }

  function ke(n) {
    slides[i].classList.remove('on');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('on');
    if (titik) $$('button', titik).forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
  }
  function mulai() {
    if (kurangGerak) return;
    clearInterval(timer);
    timer = setInterval(() => ke(i + 1), 6000);
  }
  const hero = $('.hero');
  hero.addEventListener('mouseenter', () => clearInterval(timer));
  hero.addEventListener('mouseleave', mulai);
  document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(timer) : mulai());
  mulai();
}

/* ---------------------------------------------------------- Kartu proyek -- */

function kartuProyek(p) {
  const ang = angsuranTerendah(p);
  const blokHarga = ang
    ? `<p class="kartu__ang">Angsuran mulai <b>${rupiah(ang)}</b> per bulan · tenor 20 tahun</p>`
    : `<p class="kartu__ang" style="color:var(--tinta-500)">${esc(p.klaim)}<br>
         <span style="color:var(--tinta-700)">Harga dan angsuran: hubungi pemasaran</span></p>`;
  return `
    <a class="kartu" href="${AKAR}proyek/detail.html?id=${p.id}">
      <img class="kartu__gbr" src="${AKAR}img/${p.gbr}" alt="Render rumah tipe ${p.tipe} di perumahan ${esc(judulLengkap(p))}" loading="lazy" width="1200" height="750">
      <div class="kartu__isi">
        <div class="kartu__atas">
          <span class="kategori">${p.kategori === 'subsidi' ? 'Rumah Subsidi' : 'Rumah Komersil'}</span>
          <span class="cip"><i style="background:var(--status-${p.status})"></i>${TEKS_STATUS[p.status]}</span>
        </div>
        <h3>${esc(p.nama)}</h3>
        <div class="kartu__garis" style="background:${p.warna}"></div>
        <p class="kartu__lok">${esc(p.lokasi)}${p.tahap ? ' · ' + esc(p.tahap) : ''} · ${p.unit} unit</p>
        <div class="kartu__meta">
          <span>Tipe <b>${p.tipe}</b></span><span><b>${p.kt}</b> KT</span><span><b>${p.km}</b> KM</span>
        </div>
        ${blokHarga}
        <div class="kartu__aksi">Lihat detail →</div>
      </div>
    </a>`;
}

let saringAktif = 'semua';

function gambarProyek(sel = '#proyekGrid', batas = 0) {
  const grid = $(sel);
  if (!grid) return;
  let hasil = DATA_PROYEK.filter(p => {
    if (saringAktif === 'semua') return true;
    if (saringAktif === 'subsidi' || saringAktif === 'komersil') return p.kategori === saringAktif;
    return p.daerah === saringAktif;
  });
  if (batas) hasil = hasil.slice(0, batas);
  grid.innerHTML = hasil.length
    ? hasil.map(kartuProyek).join('')
    : `<p class="kosong">Belum ada proyek yang cocok. <a href="${AKAR}kontak.html">Tanyakan ke pemasaran</a>.</p>`;
}

function pasangSaring(sel) {
  $$('[data-saring]').forEach(btn => btn.addEventListener('click', () => {
    $$('[data-saring]').forEach(b => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    saringAktif = btn.dataset.saring;
    gambarProyek(sel);
  }));
}

/* ------------------------------------------------------------- Simulasi -- */

function pasangSimulasi() {
  const iHarga = $('#simHarga'), iDp = $('#simDp'), iBunga = $('#simBunga');
  if (!iHarga) return;
  let tenor = 20;

  function hitung() {
    const harga = +iHarga.value, dpPersen = +iDp.value, bunga = +iBunga.value;
    const dp = Math.round(harga * dpPersen / 100);
    const plafon = harga - dp;
    const cicil = angsuranBulanan(plafon, bunga, tenor);

    $('#nilaiHarga').textContent = rupiah(harga);
    $('#nilaiDp').firstChild.nodeValue = rupiah(dp) + ' ';
    $('#nilaiDpPersen').textContent = dpPersen.toLocaleString('id-ID') + '%';
    $('#nilaiBunga').textContent = bunga.toLocaleString('id-ID') + '%';
    $('#hasilAngsuran').innerHTML = rupiah(cicil) + '<span class="hasil__satuan"> / bulan</span>';
    $('#rinciHarga').textContent = rupiah(harga);
    $('#rinciDp').textContent = rupiah(dp);
    $('#rinciPlafon').textContent = rupiah(plafon);
    $('#rinciTenor').textContent = `${tenor} tahun · ${tenor * 12} angsuran`;
  }
  [iHarga, iDp, iBunga].forEach(el => el.addEventListener('input', hitung));
  $$('[data-tenor]').forEach(btn => btn.addEventListener('click', () => {
    $$('[data-tenor]').forEach(b => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    tenor = +btn.dataset.tenor;
    hitung();
  }));
  hitung();
}

/* ---------------------------------------------------- Bagian berulang -- */

function gambarAngka() {
  const unit = DATA_PROYEK.reduce((a, p) => a + (p.unit || 0), 0)
             + DATA_PORTOFOLIO.reduce((a, p) => a + p.unit, 0);
  const proyek = DATA_PROYEK.length + DATA_PORTOFOLIO.reduce((a, p) => a + (p.proyek || 1), 0);
  if ($('#angkaUnit')) $('#angkaUnit').textContent = unit.toLocaleString('id-ID');
  if ($('#angkaProyek')) $('#angkaProyek').textContent = String(proyek);
  if ($('#angkaDijual')) $('#angkaDijual').textContent = String(DATA_PROYEK.length);
}

function gambarPenghargaan() {
  const sorot = $('#pgSorot');
  if (sorot) sorot.innerHTML = DATA_PENGHARGAAN_SOROT.map(p => `
    <article class="pg-kartu">
      <span class="thn">${p.tahun}</span>
      <h3>${esc(p.nama)}</h3>
      <p>${esc(p.ket)}</p>
    </article>`).join('');
  const lain = $('#pgLain');
  if (lain) lain.innerHTML = DATA_PENGHARGAAN_LAIN.map(p =>
    `<li><span class="tahun">${p.tahun || '—'}</span><span>${esc(p.nama)}</span></li>`).join('');
  const jml = $('#pgJumlah');
  if (jml) jml.textContent = String(DATA_PENGHARGAAN_SOROT.length + DATA_PENGHARGAAN_LAIN.length);
}

function gambarTestimoni() {
  const w = $('#testimoniDaftar');
  if (!w) return;
  w.innerHTML = DATA_TESTIMONI.map(t => `
    <figure class="testi">
      <blockquote>${esc(t.isi)}</blockquote>
      <figcaption><b>${esc(t.nama)}</b><span>${esc(t.jabatan)}</span></figcaption>
    </figure>`).join('');
}

function gambarTim() {
  const w = $('#timDaftar');
  if (!w) return;
  w.innerHTML = DATA_TIM.map(t => t.utama ? `
    <div class="orang orang--utama">
      <div class="inisial" aria-hidden="true">${inisial(t.nama)}</div>
      <div><b>${esc(t.nama)}</b><span>${esc(t.jabatan)}</span><p>${esc(t.ket)}</p></div>
    </div>` : `
    <div class="orang">
      <div class="inisial" aria-hidden="true">${inisial(t.nama)}</div>
      <b>${esc(t.nama)}</b><span>${esc(t.jabatan)}</span>
    </div>`).join('');
}

function gambarLegalitas(sel, data) {
  const tb = $(sel);
  if (!tb) return;
  tb.innerHTML = data.map(l =>
    `<tr><th scope="row">${esc(l.label)}</th><td><span class="nilai">${esc(l.nilai)}</span>` +
    (l.tgl ? `<span class="tgl">${esc(l.tgl)}</span>` : '') + `</td></tr>`).join('');
}

function gambarPortofolio() {
  const tb = $('#portofolioTubuh');
  if (!tb) return;
  const baris = DATA_PORTOFOLIO.map(p =>
    `<tr><td>${esc(p.nama)}${p.tahap ? ` <span style="color:var(--tinta-500)">${esc(p.tahap)}</span>` : ''}</td>
         <td>${esc(p.area)}</td><td class="angka-sel">${p.tipe}</td><td class="angka-sel"><b>${p.unit}</b> unit</td></tr>`)
    .concat(DATA_RUKO.map(p =>
    `<tr><td>${esc(p.nama)}</td><td>${esc(p.area)}</td><td class="angka-sel">${p.tipe}</td><td class="angka-sel"><b>${p.unit}</b> unit</td></tr>`));
  tb.innerHTML = baris.join('');
  const t = $('#portofolioTotal');
  if (t) t.textContent = DATA_PORTOFOLIO.reduce((a, p) => a + p.unit, 0).toLocaleString('id-ID');
}

function gambarSpek(sel, beda = {}) {
  const tb = $(sel);
  if (!tb) return;
  tb.innerHTML = DATA_SPEK.map(([k, v]) => {
    const ganti = beda[k];
    return `<tr><th scope="row">${esc(k)}</th><td>${esc(ganti || v)}${ganti ? ' <span style="color:var(--amber-600);font-size:12px">· berbeda dari standar</span>' : ''}</td></tr>`;
  }).join('');
}

function gambarReel() {
  const w = $('#reelDaftar');
  if (!w) return;

  // Sematan resmi Instagram. Bila skrip Instagram gagal dimuat — diblokir
  // jaringan kantor, misalnya — blockquote ini tetap tampil sebagai tautan.
  w.innerHTML = DATA_REEL.map(r => `
    <blockquote class="instagram-media" data-instgrm-permalink="${r.url}"
      data-instgrm-version="14" data-instgrm-captioned>
      <a href="${r.url}" target="_blank" rel="noopener">
        <b>${esc(r.judul)}</b><span>${esc(r.ket)} · buka di Instagram</span>
      </a>
    </blockquote>`).join('');

  const src = 'https://www.instagram.com/embed.js';
  if (!document.querySelector(`script[src="${src}"]`)) {
    const sc = document.createElement('script');
    sc.async = true; sc.src = src;
    document.body.appendChild(sc);
  } else if (window.instgrm) {
    window.instgrm.Embeds.process();
  }
}

function gambarYoutube() {
  const w = $('#ytDaftar');
  if (!w) return;
  w.innerHTML = DATA_YOUTUBE.video.map(v => `
    <div class="yt">
      <iframe src="https://www.youtube-nocookie.com/embed/${v.id}" title="${esc(v.judul)}"
        loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      <div class="yt__judul">${esc(v.judul)}</div>
    </div>`).join('');
  const k = $('#ytKanal');
  if (k) k.href = DATA_YOUTUBE.kanal;
}

function gambarBerita() {
  const w = $('#beritaDaftar');
  if (!w) return;
  w.innerHTML = DATA_BERITA.map(b => `
    <article class="kotak">
      <span class="kategori">${esc(b.kategori)} · ${new Date(b.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      <h3 style="margin-top:12px">${esc(b.judul)}</h3>
      <p>${esc(b.ringkas)}</p>
    </article>`).join('');
}

function gambarKarier() {
  const w = $('#karierDaftar');
  if (!w) return;
  w.innerHTML = DATA_KARIER.map(k => `
    <article class="kotak">
      <span class="kategori">${esc(k.tipe)} · ${esc(k.lokasi)}</span>
      <h3 style="margin-top:12px">${esc(k.posisi)}</h3>
      <p>${esc(k.ringkas)}</p>
      <p style="margin-top:16px"><a class="tbl tbl--halus" href="https://wa.me/${KONTAK.wa}?text=${encodeURIComponent('Halo RTD, saya ingin melamar posisi ' + k.posisi + '.')}" target="_blank" rel="noopener">Lamar lewat WhatsApp →</a></p>
    </article>`).join('');
}

/* ------------------------------------------------------- Halaman detail -- */

function gambarDetail() {
  const wrap = $('#detailProyek');
  if (!wrap) return;
  const id = new URLSearchParams(location.search).get('id');
  const p = DATA_PROYEK.find(x => x.id === id);

  if (!p) {
    wrap.innerHTML = `<div class="isi bagian"><h1>Proyek tidak ditemukan</h1>
      <p style="margin-top:16px;color:var(--tinta-700)">Tautannya mungkin keliru.
      <a href="${AKAR}proyek/">Lihat semua proyek</a>.</p></div>`;
    return;
  }

  document.title = `${judulLengkap(p)} — Rama Trimitra Development Group`;
  const ang = angsuranTerendah(p);
  const utama = p.galeri[0] ? `${AKAR}img/proyek/${p.galeri[0]}` : `${AKAR}img/${p.gbr}`;

  const kotakGaleri = [];
  for (let i = 0; i < 3; i++) {
    const g = p.galeri[i + 1];
    kotakGaleri.push(g
      ? `<img src="${AKAR}img/proyek/${g}" alt="Foto unit ${esc(judulLengkap(p))}" loading="lazy">`
      : `<div class="pd-kosong">Foto menyusul</div>`);
  }

  wrap.innerHTML = `
    <div class="isi">
      <nav class="remah" aria-label="Remah roti">
        <a href="${AKAR}">Beranda</a> › <a href="${AKAR}proyek/">Proyek</a> › ${esc(judulLengkap(p))}
      </nav>
    </div>

    <section class="bagian bagian--rapat">
      <div class="isi">
        <div class="pd-hero">
          <div>
            <span class="kategori">${p.kategori === 'subsidi' ? 'Rumah Subsidi' : 'Rumah Komersil'}</span>
            <h1 style="margin-top:12px">${esc(p.nama)}</h1>
            <div class="kartu__garis" style="background:${p.warna};width:64px;height:4px;margin:16px 0 12px"></div>
            <p style="color:var(--tinta-700);font-size:17px">${esc(p.lokasi)}${p.tahap ? ' · ' + esc(p.tahap) : ''}</p>
            ${p.alamat ? `<p class="catatan" style="margin-top:8px">${esc(p.alamat)}</p>` : ''}

            <div class="angka-grid" style="margin-top:32px">
              <div class="angka"><b>${p.tipe.split('/')[1]}</b><span>Luas tanah m²</span></div>
              <div class="angka"><b>${p.tipe.split('/')[0]}</b><span>Luas bangunan m²</span></div>
              <div class="angka"><b>${p.kt}</b><span>Kamar tidur</span></div>
              <div class="angka"><b>${p.unit}</b><span>Unit di proyek</span></div>
            </div>

            <div class="hasil" style="margin-top:32px">
              <span class="hasil__label">${ang ? 'Angsuran mulai' : 'Penawaran saat ini'}</span>
              <div class="hasil__besar">${ang ? rupiah(ang) + '<span class="hasil__satuan"> / bulan</span>' : esc(p.klaim)}</div>
              ${ang ? `<div class="hasil__rinci">
                  <div class="hasil__baris"><span>Harga jual</span><b>${rupiah(p.harga)}</b></div>
                  <div class="hasil__baris"><span>Uang muka</span><b>${rupiah(p.dp || 0)}</b></div>
                  <div class="hasil__baris"><span>Tenor</span><b>20 tahun</b></div>
                </div>`
                : `<p style="margin-top:16px;font-size:14.5px;opacity:.82">Harga dan angsuran proyek ini belum dipublikasikan. Hubungi pemasaran untuk angka terbaru.</p>`}
              <a class="tbl" href="https://wa.me/${KONTAK.wa}?text=${encodeURIComponent('Halo RTD, saya ingin bertanya tentang ' + judulLengkap(p) + '.')}" target="_blank" rel="noopener">Tanya unit ini lewat WhatsApp</a>
            </div>
          </div>

          <div>
            <img class="pd-utama" src="${utama}" alt="Foto ${esc(judulLengkap(p))}" width="1200" height="900">
            <div class="pd-galeri">${kotakGaleri.join('')}</div>
            <p class="catatan">${p.galeri.length ? 'Foto unit terbangun di lokasi.' : 'Foto unit menyusul.'}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bagian bagian--krem">
      <div class="isi">
        <div class="sim-grid">
          <div>
            <span class="label">Spesifikasi Bangunan</span>
            <h2 style="font-size:clamp(26px,3.2vw,36px)">Standar RTD${Object.keys(p.spekBeda).length ? ', dengan satu penyesuaian' : ', tanpa pengecualian'}</h2>
            <table class="spek-tabel" style="margin-top:24px"><tbody id="pdSpek"></tbody></table>
            <p style="margin-top:20px"><a class="tbl tbl--halus" href="${AKAR}spesifikasi.html">Lihat penjelasan tiap baris →</a></p>
          </div>
          <div>
            <span class="label">Fasilitas Umum</span>
            <ul style="list-style:none;padding:0;margin:16px 0 0;display:grid;gap:10px">
              ${p.fasilitas.map(f => `<li style="display:flex;gap:12px;align-items:baseline;font-size:15px">
                <span style="color:${p.warna};font-weight:800">—</span>${esc(f)}</li>`).join('')}
            </ul>
            ${p.siteplan ? `
              <span class="label" style="margin-top:40px">Siteplan</span>
              <img src="${AKAR}img/proyek/${p.siteplan}" alt="Siteplan ${esc(judulLengkap(p))}"
                   style="border-radius:var(--r-lg);border:1px solid var(--garis-halus);background:#fff" loading="lazy">`
              : `<span class="label" style="margin-top:40px">Siteplan</span>
                 <div class="pd-kosong" style="aspect-ratio:4/3">Siteplan menyusul</div>`}
          </div>
        </div>
      </div>
    </section>`;

  gambarSpek('#pdSpek', p.spekBeda);
}

/* ------------------------------------------------------------- Formulir -- */

function pasangForm() {
  const pilih = $('#fProyek');
  if (pilih) {
    pilih.innerHTML = '<option value="">Belum tahu, mohon dibantu</option>' +
      DATA_PROYEK.map(p => `<option>${esc(judulLengkap(p))}</option>`).join('');
  }
  const form = $('#formKontak');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nama = $('#fNama'), wa = $('#fWa'), pesan = $('#fPesan');
    if (!nama.value.trim()) { nama.focus(); alert('Nama belum diisi.'); return; }
    if (wa.value.replace(/\D/g, '').length < 9) { wa.focus(); alert('Nomor WhatsApp belum lengkap.'); return; }
    const teks = `Halo RTD, saya ${nama.value.trim()}.\n` +
      `Saya ingin bertanya tentang ${pilih && pilih.value ? pilih.value : 'rumah subsidi RTD'}.\n` +
      (pesan && pesan.value.trim() ? `${pesan.value.trim()}\n` : '') +
      `Nomor saya: ${wa.value.trim()}`;
    window.open(`https://wa.me/${KONTAK.wa}?text=` + encodeURIComponent(teks), '_blank', 'noopener');
    $('#pesanSukses').hidden = false;
    form.reset();
  });
}

/* ----------------------------------------------------------------- Mulai -- */

document.addEventListener('DOMContentLoaded', () => {
  pasangNavigasi();
  pasangHero();
  gambarProyek('#proyekGrid', +(($('#proyekGrid') || {}).dataset || {}).batas || 0);
  pasangSaring('#proyekGrid');
  pasangSimulasi();
  gambarAngka();
  gambarPenghargaan();
  gambarTestimoni();
  gambarTim();
  gambarLegalitas('#legalTubuh', DATA_LEGALITAS);
  gambarLegalitas('#legalYayasanTubuh', DATA_LEGALITAS_YAYASAN);
  gambarPortofolio();
  gambarSpek('#spekTubuh');
  gambarReel();
  gambarYoutube();
  gambarBerita();
  gambarKarier();
  gambarDetail();
  pasangForm();
  const th = $('#tahun');
  if (th) th.textContent = new Date().getFullYear();
});
