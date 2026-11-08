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
   peta        titik Google Maps { lat, lng, id: place_id } untuk peta di halaman proyek
   -------------------------------------------------------------------------- */

const DATA_PROYEK = [
  {
    id: 'green-nature', peta: { lat: -2.8927718, lng: 104.6681867, id: 'ChIJadlSWQBzOy4R3dPW1PWr-WA' }, nama: 'The Green Nature', tahap: null,
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
    id: 'tag-tahap-3', peta: { lat: -2.9952323, lng: 104.6713739, id: 'ChIJy7dJKwCfOy4Rnf7UuAKL49U' }, nama: 'Taman Asri Gandus 2', tahap: 'Tahap 3',
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
    id: 'tag-tahap-4', peta: { lat: -2.9952323, lng: 104.6713739, id: 'ChIJy7dJKwCfOy4Rnf7UuAKL49U' }, nama: 'Taman Asri Gandus 2', tahap: 'Tahap 4',
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
    id: 'tag-tahap-5', peta: { lat: -2.9952323, lng: 104.6713739, id: 'ChIJy7dJKwCfOy4Rnf7UuAKL49U' }, nama: 'Taman Asri Gandus 2', tahap: 'Tahap 5',
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
    id: 'tag-signature', peta: { lat: -3.0018211, lng: 104.6738991, id: 'ChIJ3VVtBwCfOy4RhLZBPIoFUr4' }, nama: 'TAG Signature', tahap: null,
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
    id: 'green-village', peta: { lat: -2.9198997, lng: 104.8536817, id: 'ChIJid9RfyN5Oy4RVZHMmQasqaY' }, nama: 'The Green Village', tahap: null,
    kategori: 'subsidi', warna: 'var(--proyek-daun)',
    lokasi: 'Merah Mata, Banyuasin', alamat: '3VJ3+2FV, Lorong Belitung, Perajen, Kec. Banyuasin I, Kab. Banyuasin, Sumatera Selatan',
    daerah: 'banyuasin', tipe: '36/99', kt: 2, km: 1, unit: 270,
    harga: null, dp: null, angsuran20: null, klaim: 'Angsuran mulai 1 juta, langsung huni',
    status: 'tersedia', gbr: 'green-village.jpg',
    galeri: ['green-village-1.jpg', 'green-village-2.jpg'],
    siteplan: 'green-village-siteplan.jpg',
    fasilitas: ['Musholla', 'Taman', 'Playground'],
    spekBeda: {}
  },
  {
    id: 'grand-athmar-indralaya', peta: { lat: -3.2040328, lng: 104.6178108, id: 'ChIJ8YP2AAC9Oy4RYtZt0xDbQ7A' }, nama: 'Grand Athmar Indralaya', tahap: null,
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
    id: 'grand-athmar-sematang', peta: { lat: -2.9122111, lng: 104.8194526, id: 'ChIJVfsGFKlxOy4R7eBf_eUW8Zg' }, nama: 'Grand Athmar Sematang Borang', tahap: null,
    kategori: 'subsidi', warna: 'var(--proyek-kayu)',
    lokasi: 'Sematang Borang, Palembang', alamat: 'Jl. Keramat Belido, Jl. Lumban Meranti, Mariana Ilir, Kec. Banyuasin I, Kab. Banyuasin, Sumatera Selatan',
    daerah: 'palembang-lain', tipe: '36/98', kt: 2, km: 1, unit: 206,
    harga: null, dp: null, angsuran20: null, klaim: 'Gratis pemasangan air PDAM',
    status: 'tersedia', gbr: 'grand-athmar-sematang.jpg',
    galeri: ['grand-athmar-sematang-1.jpg', 'grand-athmar-sematang-2.jpg', 'grand-athmar-sematang-3.jpg'],
    siteplan: null,
    fasilitas: ['Musholla', 'Taman', 'One gate system', 'PDAM'],
    spekBeda: { 'Air': 'PDAM, gratis biaya pemasangan' }
  },
  {
    id: 'kartika-mataram', peta: { lat: -2.8664404, lng: 104.7095115, id: 'ChIJ61BNFntzOy4RYsLfLzguqro' }, nama: 'Kartika Mataram Residence', tahap: 'Tahap 2',
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
    id: 'casa-adiva', peta: { lat: -2.9260484, lng: 104.7572331, id: 'ChIJKwXYawB3Oy4RdY5Fy6Wujxs' }, nama: 'Casa Adiva', tahap: null,
    kategori: 'komersil', warna: 'var(--proyek-tanah)',
    lokasi: 'Suka Maju, Kenten', alamat: 'Jl. Puspa Negara, Suka Maju, Kec. Sako, Kota Palembang, Sumatera Selatan',
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

/* Tim manajemen. foto: berkas di img/tim/ atau null (tampil inisial).
   cv: bagian riwayat; kosongkan bila belum ada, halaman profil menampilkan "menyusul". */
const DATA_TIM = [
  { id: 'junestrada-diem', nama: 'Dr. M. Junestrada Diem, A.Md.Par., S.E., M.Si.', panggil: 'M. Junestrada Diem',
    jabatan: 'Direktur dan Pemilik', direksi: true, foto: null,
    bio: [
      'Mendirikan dan memimpin RTD Group sejak 2020. Sebelumnya hampir sepuluh tahun di Bank Tabungan Negara Kantor Cabang Syariah Palembang, memimpin unit pembiayaan konsumer KPR, pendanaan komersial, dan mutu layanan.',
      'Sejak 2018 menjadi dosen tetap di FEBI UIN Raden Fatah Palembang. Pendidikannya berlapis dari perhotelan, manajemen pemasaran, sampai doktor ilmu manajemen sumber daya manusia. Juga pendiri dan pembina Yayasan Al-Mukmin Darunnajah Center.'
    ],
    cv: [
      { judul: 'Pendidikan', isi: [
        ['2026', 'Program Doktor Ilmu Manajemen (SDM), Pascasarjana Universitas Sriwijaya'],
        ['2014', 'Magister Ilmu Manajemen (SDM), Pascasarjana Universitas Sriwijaya'],
        ['2004', 'Sarjana Manajemen Pemasaran, Fakultas Ekonomi Universitas Sriwijaya'],
        ['2000', 'Perhotelan, Sekolah Tinggi Pariwisata Bandung (NHI)']
      ]},
      { judul: 'Pengalaman kerja', isi: [
        ['2020 – sekarang', 'Direktur, PT Rama Trimitra Development'],
        ['2018 – sekarang', 'Dosen Tetap Non-ASN, FEBI UIN Raden Fatah Palembang'],
        ['2019 – 2020', 'Operational Manager, PT Sumatera Agung Perkasa dan PT Lestari Propertindo Mandiri'],
        ['2008 – 2017', 'Mortgage Consumer Financing Unit Head, Consumer Commercial Funding Unit Head, dan Service Quality Unit Head, PT Bank Tabungan Negara (Persero) Tbk KC Syariah Palembang'],
        ['2007 – 2008', 'Operational Manager, PT Dwi Pantara Tour & Travel Palembang'],
        ['2005 – 2008', 'Supervisor, PT Sriwijaya Air Palembang'],
        ['2005 – 2022', 'Pengajar Kepariwisataan dan Motivasi Kerja, LKPP Palembang']
      ]},
      { judul: 'Organisasi', isi: [
        ['2018 – 2024', 'Pembina DEMAF, KORSA, IPPF, LABS, dan PAKIES FEBI UIN Raden Fatah Palembang'],
        ['2011 – 2015', 'Bidang Diklat, HPI DPC Sumatera Selatan'],
        ['2007 – 2010', 'Koordinator Bidang Organisasi, HPI DPC Sumatera Selatan'],
        ['2007 – 2009', 'Ketua Umum Ikatan Bujang Gadis Kampus Sumatera Selatan'],
        ['2011, 2013', 'Juri Duta Bahasa Sumatera Selatan']
      ]}
    ] },
  { id: 'huda-assalam', nama: 'Huda Assalam', jabatan: 'Direktur dan Pemilik', direksi: true, foto: null,
    bio: ['Bersama M. Junestrada Diem memiliki dan memimpin RTD Group. Juga pendiri dan pembina Yayasan Al-Mukmin Darunnajah Center.'],
    cv: [] },
  { id: 'ade-saputra',      nama: 'Ade Saputra',      jabatan: 'Operational Manager',     foto: null, bio: [], cv: [] },
  { id: 'teddy-wijaya',     nama: 'Teddy Wijaya',     jabatan: 'Field Manager',           foto: null, bio: [], cv: [] },
  { id: 'romi-febriansyah', nama: 'Romi Febriansyah', jabatan: 'Marketing Manager',       foto: null, bio: [], cv: [] },
  { id: 'putra-ady-kesuma', nama: 'Putra Ady Kesuma', jabatan: 'Finance Manager',         foto: null, bio: [], cv: [] },
  { id: 'yoga-juniansyah',  nama: 'Yoga Juniansyah',  jabatan: 'HRGA Manager',            foto: null, bio: [], cv: [] },
  { id: 'nosvita-sari',     nama: 'Nosvita Sari',     jabatan: 'Administrasi Supervisor', foto: null, bio: [], cv: [] },
  { id: 'm-tio-amartha',    nama: 'M. Tio Amartha',   jabatan: 'Field Supervisor',        foto: null, bio: [], cv: [] }
];

/* Reel Instagram. gbr: poster di img/sosial/, diambil dari reel itu sendiri. */
const DATA_REEL = [
  { url: 'https://www.instagram.com/reel/DfZQnz0TMTq/', judul: 'Pindah ke rumah baru',  akun: 'ramadevelopmentplg',  gbr: 'reel-1.jpg' },
  { url: 'https://www.instagram.com/reel/DfWkUTDTqxS/', judul: 'Kerja, kerja, kerja',   akun: 'ramadevelopmentplg',  gbr: 'reel-2.jpg' },
  { url: 'https://www.instagram.com/reel/DfPEaIcT2hV/', judul: 'Townhouse Casa Adiva',  akun: 'rumahbaguspalembang', gbr: 'reel-3.jpg' },
  { url: 'https://www.instagram.com/reel/DfHq5ijTEKy/', judul: 'Cerita dari kantor',    akun: 'ramadevelopmentplg',  gbr: 'reel-4.jpg' }
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
  { id: 'green-village-serah-terima', tanggal: '2026-10-28', kategori: 'Proyek', utama: true, gbr: 'hero/render-3.jpg',
    judul: 'The Green Village memasuki tahap serah terima pertama',
    ringkas: 'Unit tahap pertama di Merah Mata mulai diserahkan kepada pembeli.',
    isi: ['Contoh isi — ganti dengan berita asli. Unit tahap pertama di The Green Village, Merah Mata, mulai diserahkan kepada pembeli bulan ini.',
          'Serah terima dilakukan setelah akad kredit dan pemeriksaan unit bersama pembeli.'] },
  { id: 'best-developer-subsidi-2025', tanggal: '2026-09-15', kategori: 'Penghargaan', gbr: 'hero/render-1.jpg',
    judul: 'RTD Group menerima The Best Developer Subsidi 2025',
    ringkas: 'Penghargaan diberikan Bank BTN atas kinerja penyaluran KPR bersubsidi.',
    isi: ['Contoh isi — ganti dengan berita asli. Bank BTN memberikan penghargaan The Best Developer Subsidi 2025 kepada RTD Group.'] },
  { id: 'syarat-kpr-subsidi', tanggal: '2026-08-02', kategori: 'Panduan', gbr: 'hero/render-4.jpg',
    judul: 'Syarat dan berkas KPR subsidi yang perlu disiapkan',
    ringkas: 'Panduan singkat bagi pembeli rumah pertama.',
    isi: ['Contoh isi — ganti dengan artikel asli. Siapkan KTP, KK, surat nikah, slip gaji atau surat keterangan usaha, rekening koran, NPWP, dan surat keterangan belum memiliki rumah.'] },
  { id: 'gerbang-tag-2', tanggal: '2026-07-10', kategori: 'Proyek', gbr: 'hero/render-5.jpg',
    judul: 'Gerbang baru Taman Asri Gandus 2 mulai dibangun',
    ringkas: 'Gerbang utama dan pos keamanan untuk tahap 3 dan 4.',
    isi: ['Contoh isi — ganti dengan berita asli.'] }
];

/* Lowongan: contoh isi. buka: false untuk lowongan yang sudah ditutup. */
const DATA_KARIER = [
  { id: 'marketing-executive', posisi: 'Marketing Executive', tipe: 'Penuh waktu', lokasi: 'Palembang', buka: true,
    ringkas: 'Memasarkan unit di proyek Gandus dan Banyuasin, mendampingi pembeli sampai akad.',
    tugas: ['Menindaklanjuti calon pembeli dari pameran, media sosial, dan kantor pemasaran.', 'Mendampingi pembeli menyiapkan berkas KPR sampai akad.'],
    syarat: ['Minimal SMA/SMK sederajat.', 'Berpengalaman di penjualan properti menjadi nilai tambah.', 'Memiliki kendaraan sendiri.'] },
  { id: 'site-supervisor', posisi: 'Site Supervisor', tipe: 'Penuh waktu', lokasi: 'Indralaya, Ogan Ilir', buka: true,
    ringkas: 'Mengawasi mutu pekerjaan dan ketepatan jadwal di lapangan.',
    tugas: ['Mengawasi pekerjaan kontraktor sesuai spesifikasi standar RTD.', 'Menyusun laporan progres mingguan.'],
    syarat: ['Minimal D3 Teknik Sipil.', 'Bersedia ditempatkan di lokasi proyek.'] },
  { id: 'drafter', posisi: 'Drafter', tipe: 'Penuh waktu', lokasi: 'Palembang', buka: false,
    ringkas: 'Menyiapkan gambar kerja, denah, dan siteplan untuk proyek berjalan.',
    tugas: ['Menyiapkan gambar kerja dan siteplan.'], syarat: ['Menguasai AutoCAD.'] }
];

/* Foto kegiatan yayasan di img/yayasan/, dari Company Profile Yayasan. */
const DATA_YAYASAN_FOTO = [
  { f: 'belajar.jpg',    ket: 'Kegiatan belajar di LKSA Darul Falah' },
  { f: 'sedekah-subuh.jpg', ket: 'Program Sedekah Subuh' },
  { f: 'belajar-2.jpg',  ket: 'Belajar bersama anak asuh' },
  { f: 'bakti-1.jpg',    ket: 'Bakti sosial yayasan' },
  { f: 'wakaf.jpg',      ket: 'Wakaf Al-Qur’an' },
  { f: 'belajar-3.jpg',  ket: 'Pembinaan agama' },
  { f: 'bakti-2.jpg',    ket: 'Bakti sosial yayasan' },
  { f: 'yatim.jpg',      ket: 'Belanja bersama anak yatim' },
  { f: 'penutup.jpg',    ket: 'Anak asuh LKSA Darul Falah' }
];


/* Galeri kegiatan. Foto di img/galeri/<id>-<n>.jpg, n = 1..jumlah.
   Sumber: rumahidamankita.co.id (situs lama). sampul: nomor foto untuk kartu album. */
const DATA_GALERI = [
  { id: 'akad-massal-2023', judul: 'Akad KPR Massal 2023', waktu: '27 September 2023', jumlah: 8, sampul: 8,
    isi: ['Akad KPR massal bersama RTD Group di Grand Atyasa Convention Center Palembang berjalan lancar, berkat antusiasme dan ketertiban #SobatRTDGroup dalam mengikuti prosedur.',
          'Terima kasih kepada Bank BTN, BTN Syariah, Bank BJB, dan para notaris yang ikut menyukseskan acara ini. Sampai bertemu di akad massal berikutnya.'] },
  { id: 'hut-ri-78', judul: 'HUT RI ke-78', waktu: 'Agustus 2023', jumlah: 24, sampul: 4,
    isi: ['Keseruan tim RTD Group menyambut Hari Kemerdekaan Indonesia ke-78 dengan lomba dan senam bersama di kantor.'] },
  { id: 'grand-opening-tag2-tahap2', judul: 'Grand Opening Taman Asri Gandus 2 Tahap 2', waktu: 'Juli 2023', jumlah: 8, sampul: 1,
    isi: ['Peresmian Perumahan Taman Asri Gandus 2 Tahap 2 dihadiri Bapak H. Herman Deru, Gubernur Sumatera Selatan.',
          'Bersamaan dengan itu diresmikan pula Yayasan Al-Mukmin Darunnajah Center di Jl. TPH. Sofyan Kenawas, Perumahan Taman Asri Gandus 2 Tahap 2, Blok EA 04–EA 05.'] },
  { id: 'employee-gathering-jogja-bandung', judul: 'Employee Gathering Jogja–Bandung', waktu: null, jumlah: 35, sampul: 1,
    isi: ['Perjalanan tim RTD Group: Candi Prambanan, arung jeram di Sungai Elo, Museum Mini Sisa Hartaku, Pantai Parangtritis, Puncak Becici, HeHa Sky View, belanja oleh-oleh khas Jogja, lalu ke Bandung dan D’Castello.'] },
  { id: 'eda-leadership', judul: 'EDA: Leadership & Service Excellence Training', waktu: null, jumlah: 16, sampul: 1,
    isi: ['Employee Development Academy RTD Group: kelas service excellence oleh Carisna Aprianti, S.T.; public speaking & personal branding oleh M. Anggi Dwijaya, S.I.Kom.; asesmen psikologi oleh Gonny T. Wicaksono & tim Alugada; dan kelas kepemimpinan oleh Akhmad Gozali.'] },
  { id: 'eda-damkar', judul: 'EDA: Pelatihan K3 bersama Damkar', waktu: null, jumlah: 3, sampul: 1,
    isi: ['Pelatihan K3 dasar keadaan darurat dan penggunaan APAR bersama Dinas Pemadam Kebakaran Kota Palembang.'] },
  { id: 'hut-ri-77', judul: 'HUT RI ke-77', waktu: '17 Agustus 2022', jumlah: 3, sampul: 1,
    isi: ['Peringatan Hari Kemerdekaan Indonesia ke-77 bersama tim RTD Group.'] },
  { id: 'marketing-gathering-saungbambu', judul: 'Marketing Gathering di Saung Bambu', waktu: null, jumlah: 2, sampul: 1, isi: [] },
  { id: 'employee-gathering-bandung', judul: 'Employee Gathering Bandung', waktu: null, jumlah: 1, sampul: 1, isi: [] }
];

/* Tim pemasaran: nama saja. Manajer pemasaran sudah ada di DATA_TIM. */
const DATA_PEMASARAN = ['Yuyun Safitri', 'Amirul Mukminin', 'Airin Pratiwi', 'Melin Herlina', 'M. Taufiq', 'Eka Pajar Sari',
  'Herdudi', 'Amiril Teng', 'Haydar Putra', 'Ratzarwin Agusmen', 'Deus Muhaimin', 'Midis Purnando', 'Rian Pratama',
  'M. Rommi Adi Dinata', 'Anjas Asmara', 'Imam Samudra', 'M. Sofyan Atsauri', 'Dina Nindi Yanti', 'Rofiko',
  'Arfiaga Prabus', 'Reca Wulansari', 'Esthie Avrillia Anggrieni', 'Ricky Haris Munandar', 'Yudha Pramona'];

const KONTAK = {
  wa: '6282384299234',
  waTampil: '0823-8429-9234',
  email: 'trimitrarama@gmail.com',
  ig: 'ramadevelopmentplg',
  alamat: ['Komplek Pergudangan Palembang Star', 'Jl. Letjen Harun Sohar No. AA02 Blok AA01', 'Kel. Kebun Bunga, Kec. Sukarami', 'Kota Palembang, Sumatera Selatan 30961']
};


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
  const gulir = () => nav.classList.toggle('nav--gulir', scrollY > 8);
  addEventListener('scroll', gulir, { passive: true });
  gulir();
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
        <span class="kategori">${p.kategori === 'subsidi' ? 'Rumah Subsidi' : 'Rumah Komersil'}</span>
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
    $(sel).scrollLeft = 0;
    pasangGeser();
  }));
}

/* ------------------------------------------------------------- Simulasi -- */

// Harga memakai skala kuadrat: separuh lintasan pertama mencakup 150–300 jt,
// rentang rumah subsidi dan komersil kecil, sehingga geseran pendek tetap berarti.
const HARGA_MIN = 150e6, HARGA_RENTANG = 600e6;
const hargaDariGeser = v => { const h = HARGA_MIN + HARGA_RENTANG * (v / 1000) ** 2; return Math.round(h / (h < 300e6 ? 1e6 : 5e6)) * (h < 300e6 ? 1e6 : 5e6); };
const geserDariHarga = h => Math.round(Math.sqrt((h - HARGA_MIN) / HARGA_RENTANG) * 1000);
const KURANG_GERAK = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Angka bergulir: hanya digit yang berubah yang bergerak, naik bila nilainya
   bertambah dan turun bila berkurang, dengan blur selama transisi. */
function gulir(el, teks, naik) {
  const lama = el.dataset.v;
  if (lama === teks) return;
  el.dataset.v = teks;
  if (KURANG_GERAK || lama === undefined) { el.textContent = teks; return; }
  const n = Math.max(lama.length, teks.length);
  const a = lama.padStart(n, ' '), b = teks.padStart(n, ' ');
  el.textContent = '';
  const arah = naik ? 1 : -1;
  for (let i = 0; i < n; i++) {
    const sel = document.createElement('span');
    sel.className = 'gulir__c';
    sel.textContent = b[i] === ' ' ? '' : b[i];
    el.appendChild(sel);
    if (a[i] === b[i]) continue;
    const t = (n - 1 - i) * 18; // digit kanan bergerak lebih dulu
    sel.animate([{ transform: `translateY(${55 * arah}%)`, filter: 'blur(5px)', opacity: 0 }, { transform: 'none', filter: 'blur(0)', opacity: 1 }],
      { duration: 420, delay: t, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
    if (a[i] !== ' ') {
      const keluar = document.createElement('span');
      keluar.className = 'gulir__keluar'; keluar.textContent = a[i];
      sel.appendChild(keluar);
      keluar.animate([{ transform: 'none', filter: 'blur(0)', opacity: 1 }, { transform: `translateY(${-55 * arah}%)`, filter: 'blur(5px)', opacity: 0 }],
        { duration: 360, delay: t, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }).onfinish = () => keluar.remove();
    }
  }
}

/* Goyang kecil pada kenop: miring searah gerak saat digeser, memantul saat dilepas. */
function pasangGoyang(input) {
  let x0 = +input.value, diam;
  const isi = () => input.style.setProperty('--isi', ((input.value - input.min) / (input.max - input.min) * 100) + '%');
  input.addEventListener('input', () => {
    isi();
    if (KURANG_GERAK) return;
    const d = +input.value - x0; x0 = +input.value;
    const miring = Math.max(-14, Math.min(14, d / (input.max - input.min) * 900));
    input.style.setProperty('--miring', miring.toFixed(1) + 'deg');
    input.classList.add('digeser');
    clearTimeout(diam);
    diam = setTimeout(() => { input.style.setProperty('--miring', '0deg'); }, 90);
  });
  const lepas = () => {
    if (!input.classList.contains('digeser')) return;
    input.classList.remove('digeser');
    input.classList.remove('memantul'); void input.offsetWidth; input.classList.add('memantul');
  };
  ['change', 'pointerup', 'touchend'].forEach(ev => input.addEventListener(ev, lepas));
  input.addEventListener('animationend', () => input.classList.remove('memantul'));
  isi();
}

function pasangSimulasi() {
  const iHarga = $('#simHarga'), iDp = $('#simDp'), iBunga = $('#simBunga');
  if (!iHarga) return;
  let tenor = 20, cicilLama = null;
  const sebelum = {};

  function hitung() {
    const harga = hargaDariGeser(+iHarga.value), dpPersen = +iDp.value, bunga = +iBunga.value;
    const dp = Math.round(harga * dpPersen / 100);
    const plafon = harga - dp;
    const cicil = Math.round(angsuranBulanan(plafon, bunga, tenor));

    iHarga.setAttribute('aria-valuetext', rupiah(harga));
    $('#nilaiHarga').textContent = rupiah(harga);
    $('#nilaiDp').firstChild.nodeValue = rupiah(dp) + ' ';
    $('#nilaiDpPersen').textContent = dpPersen.toLocaleString('id-ID') + '%';
    $('#nilaiBunga').textContent = bunga.toLocaleString('id-ID') + '%';

    const nilai = { hasilAngsuran: cicil, rinciHarga: harga, rinciDp: dp, rinciPlafon: plafon };
    for (const [id, v] of Object.entries(nilai)) {
      gulir($('#' + id), rupiah(v), sebelum[id] === undefined || v >= sebelum[id]);
      sebelum[id] = v;
    }
    $('#rinciTenor').textContent = `${tenor} tahun · ${tenor * 12} angsuran`;
    if (cicil !== cicilLama) {
      cicilLama = cicil;
      clearTimeout(hitung.sr);
      hitung.sr = setTimeout(() => { $('#hasilSr').textContent = `Perkiraan angsuran ${rupiah(cicil)} per bulan`; }, 600);
    }
  }
  iHarga.value = geserDariHarga(166e6);
  [iHarga, iDp, iBunga].forEach(el => { el.addEventListener('input', hitung); pasangGoyang(el); });
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

const fotoTim = (t, cls = '') => t.foto
  ? `<img class="${cls}" src="${AKAR}img/tim/${t.foto}" alt="" loading="lazy">`
  : `<span class="${cls} foto-kosong" aria-hidden="true">${inisial(t.panggil || t.nama)}</span>`;

function gambarTim() {
  const d = $('#timDireksi'), w = $('#timDaftar');
  if (d) d.innerHTML = DATA_TIM.filter(t => t.direksi).map(t => `
    <a class="orang orang--besar" href="tim.html?id=${t.id}">
      ${fotoTim(t, 'orang__foto')}
      <span class="orang__tx">
        <b>${esc(t.panggil || t.nama)}</b><span>${esc(t.jabatan)}</span>
        <span class="orang__ringkas">${esc(t.bio[0] || '')}</span>
        <span class="orang__aksi">Lihat profil →</span>
      </span>
    </a>`).join('');
  if (w) w.innerHTML = DATA_TIM.filter(t => !t.direksi).map(t => `
    <a class="orang" href="tim.html?id=${t.id}">
      ${fotoTim(t, 'orang__foto')}
      <span class="orang__tx"><b>${esc(t.nama)}</b><span>${esc(t.jabatan)}</span></span>
    </a>`).join('');
}

/* Kepala halaman kecil untuk halaman yang dibangun dari data (?id=). */
const heroKecil = (gbr, label, judul, lede = '') => `
  <section class="page-hero page-hero--kecil">
    <img class="page-hero__gbr" src="${AKAR}img/${gbr}"${gbr.startsWith('hero/') ? ` srcset="${AKAR}img/${gbr.replace('.jpg', '-sm.jpg')} 820w, ${AKAR}img/${gbr} 1280w" sizes="100vw"` : ''} alt="" fetchpriority="high">
    <div class="isi page-hero__isi"><div class="page-hero__kotak">
      <span class="label">${label}</span><h1>${judul}</h1>${lede ? `<p>${lede}</p>` : ''}
    </div></div>
  </section>`;

const tidakAda = (apa, balik, teks) => `${heroKecil('hero/render-2.jpg', apa, 'Tidak ditemukan')}
  <div class="isi bagian"><p>Tautannya mungkin keliru. <a href="${balik}">${teks}</a>.</p></div>`;

function gambarProfilTim() {
  const w = $('#profilTim');
  if (!w) return;
  const t = DATA_TIM.find(x => x.id === new URLSearchParams(location.search).get('id'));
  if (!t) { w.innerHTML = tidakAda('Profil', 'tentang.html#tim', 'Kembali ke tim manajemen'); return; }
  document.title = `${t.panggil || t.nama} — Rama Trimitra Development Group`;
  const lain = DATA_TIM.filter(x => x !== t).slice(0, 4);
  w.innerHTML = `${heroKecil('hero/render-2.jpg', t.direksi ? 'Direksi' : 'Tim Manajemen', esc(t.panggil || t.nama), (t.panggil ? esc(t.nama) + ' · ' : '') + esc(t.jabatan))}
    <section class="bagian bagian--rapat"><div class="isi profil">
      <aside class="profil__sisi">${fotoTim(t, 'profil__foto')}
        <a class="tbl tbl--kedua" href="tentang.html#tim">← Semua tim</a></aside>
      <div class="profil__isi">
        ${t.bio.length ? t.bio.map(b => `<p class="profil__bio">${esc(b)}</p>`).join('') : '<p class="profil__bio">Profil lengkap menyusul.</p>'}
        <h2 class="profil__cv-judul">Riwayat</h2>
        ${t.cv.length ? t.cv.map(c => `
          <div class="cv"><h3>${esc(c.judul)}</h3>
            <ol>${c.isi.map(([th, ket]) => `<li><span>${esc(th)}</span><p>${esc(ket)}</p></li>`).join('')}</ol></div>`).join('')
          : '<div class="pd-kosong cv-kosong">CV menyusul</div>'}
      </div>
    </div></section>
    <section class="bagian bagian--krem bagian--rapat"><div class="isi">
      <h2 class="tim-kelompok">Anggota tim lainnya</h2>
      <div class="tim-grid tim-grid--4">${lain.map(x => `<a class="orang" href="tim.html?id=${x.id}">${fotoTim(x, 'orang__foto')}
        <span class="orang__tx"><b>${esc(x.panggil || x.nama)}</b><span>${esc(x.jabatan)}</span></span></a>`).join('')}</div>
    </div></section>`;
}

function gambarLegalitas(sel, data) {
  const tb = $(sel);
  if (!tb) return;
  tb.innerHTML = data.map(l =>
    `<tr><th scope="row">${esc(l.label)}</th><td><span class="nilai">${esc(l.nilai)}</span>` +
    (l.tgl ? `<span class="tgl">${esc(l.tgl)}</span>` : '') + `</td></tr>`).join('');
}

function gambarPortofolio() {
  const ol = $('#portofolioDaftar');
  if (!ol) return;
  const semua = DATA_PORTOFOLIO.concat(DATA_RUKO.map(r => ({ ...r, ruko: true })));
  const maks = Math.max(...semua.map(p => p.unit));
  ol.innerHTML = semua.map(p => `
    <li class="rekam__baris">
      <div class="rekam__nama"><b>${esc(p.nama)}</b>${p.tahap ? `<span>${esc(p.tahap)}</span>` : ''}</div>
      <div class="rekam__meta">${esc(p.area)} · ${p.ruko ? 'Ruko ' : 'Tipe '}${p.tipe}</div>
      <div class="rekam__unit"><i style="width:${(p.unit / maks * 100).toFixed(1)}%"></i><b>${p.unit}</b> unit</div>
    </li>`).join('');
  const isi = (id, v) => { const e = $(id); if (e) e.textContent = v.toLocaleString('id-ID'); };
  isi('#portofolioTotal', DATA_PORTOFOLIO.reduce((a, p) => a + p.unit, 0));
  isi('#portofolioJumlah', DATA_PORTOFOLIO.reduce((a, p) => a + (p.proyek || 1), 0));
  isi('#rukoTotal', DATA_RUKO.reduce((a, p) => a + p.unit, 0));
}

function gambarSpek(sel, beda = {}) {
  const tb = $(sel);
  if (!tb) return;
  tb.innerHTML = DATA_SPEK.map(([k, v]) => {
    const ganti = beda[k];
    return `<tr><th scope="row">${esc(k)}</th><td>${esc(ganti || v)}${ganti ? ' <span style="color:var(--amber-600);font-size:12px">· berbeda dari standar</span>' : ''}</td></tr>`;
  }).join('');
}

const ikonMain = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';

function gambarReel() {
  const w = $('#reelDaftar');
  if (!w) return;
  w.innerHTML = DATA_REEL.map(r => `
    <a class="media-kartu media-kartu--reel" href="${r.url}" target="_blank" rel="noopener">
      <img src="${AKAR}img/sosial/${r.gbr}" alt="" loading="lazy" width="540" height="960">
      <span class="media-kartu__main">${ikonMain}</span>
      <span class="media-kartu__kaki"><b>${esc(r.judul)}</b><span>@${esc(r.akun)} · Instagram</span></span>
    </a>`).join('');
}

// Video dimuat hanya saat diklik: tiga iframe YouTube sekaligus memberatkan halaman.
function gambarYoutube() {
  const w = $('#ytDaftar');
  if (!w) return;
  w.innerHTML = DATA_YOUTUBE.video.map(v => `
    <button type="button" class="media-kartu media-kartu--yt" data-yt="${v.id}" aria-label="Putar video: ${esc(v.judul)}">
      <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360">
      <span class="media-kartu__main">${ikonMain}</span>
      <span class="media-kartu__kaki"><b>${esc(v.judul)}</b><span>YouTube</span></span>
    </button>`).join('');
  w.addEventListener('click', e => {
    const b = e.target.closest('[data-yt]');
    if (!b) return;
    const v = DATA_YOUTUBE.video.find(x => x.id === b.dataset.yt);
    b.outerHTML = `<div class="media-kartu media-kartu--yt media-kartu--putar"><iframe src="https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1" title="${esc(v.judul)}"
      allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
  });
  const k = $('#ytKanal');
  if (k) k.href = DATA_YOUTUBE.kanal;
}

const tglPanjang = t => new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

const kartuBerita = (b, utama = false) => `
  <a class="nkartu${utama ? ' nkartu--utama' : ''}" href="artikel.html?id=${b.id}" data-kategori="${esc(b.kategori)}">
    <span class="nkartu__gbr"><img src="${AKAR}img/${b.gbr}" alt="" loading="${utama ? 'eager' : 'lazy'}">${utama ? '<span class="nkartu__lencana">Sorotan</span>' : ''}</span>
    <span class="nkartu__tx">
      <span class="nkartu__meta"><time datetime="${b.tanggal}">${tglPanjang(b.tanggal)}</time><span>${esc(b.kategori)}</span></span>
      <b>${esc(b.judul)}</b><span class="nkartu__ringkas">${esc(b.ringkas)}</span>
      <span class="nkartu__aksi">Baca selengkapnya →</span>
    </span>
  </a>`;

function gambarBerita() {
  const w = $('#beritaDaftar');
  if (!w) return;
  const urut = [...DATA_BERITA].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  const utama = urut.find(b => b.utama) || urut[0];
  const sisa = urut.filter(b => b !== utama);
  $('#beritaUtama').innerHTML = kartuBerita(utama, true);
  w.innerHTML = sisa.map(b => kartuBerita(b)).join('');
  const kat = [...new Set(sisa.map(b => b.kategori))];
  const saring = $('#beritaSaring');
  saring.innerHTML = ['Semua', ...kat].map((k, i) =>
    `<button type="button" class="tbl tbl--kedua" data-kat="${esc(k)}" aria-pressed="${i === 0}">${esc(k)}</button>`).join('');
  saring.addEventListener('click', e => {
    const b = e.target.closest('[data-kat]');
    if (!b) return;
    $$('[data-kat]', saring).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    $$('.nkartu', w).forEach(c => { c.hidden = b.dataset.kat !== 'Semua' && c.dataset.kategori !== b.dataset.kat; });
    w.scrollLeft = 0;
    pasangGeser();
  });
}

function gambarArtikel() {
  const w = $('#artikelIsi');
  if (!w) return;
  const b = DATA_BERITA.find(x => x.id === new URLSearchParams(location.search).get('id'));
  if (!b) { w.innerHTML = tidakAda('Berita', 'berita.html', 'Lihat semua berita'); return; }
  document.title = `${b.judul} — Rama Trimitra Development Group`;
  w.innerHTML = `${heroKecil(b.gbr, `${esc(b.kategori)} · ${tglPanjang(b.tanggal)}`, esc(b.judul))}
    <article class="bagian bagian--rapat"><div class="isi baca">
      <a class="tbl tbl--halus" href="berita.html">← Semua berita</a>
      <p class="baca__ringkas">${esc(b.ringkas)}</p>
      ${b.isi.map(x => `<p>${esc(x)}</p>`).join('')}
    </div></article>`;
}

const waLamar = k => `https://wa.me/${KONTAK.wa}?text=${encodeURIComponent('Halo RTD, saya ingin melamar posisi ' + k.posisi + '.')}`;

function gambarKarier() {
  const w = $('#karierDaftar');
  if (!w) return;
  const urut = [...DATA_KARIER].sort((a, b) => Number(b.buka) - Number(a.buka));
  w.innerHTML = urut.map(k => `
    <li><a class="lowongan" href="lowongan.html?id=${k.id}">
      <span>
        <span class="status${k.buka ? '' : ' status--tutup'}">${k.buka ? 'Dibuka' : 'Ditutup'}</span>
        <b>${esc(k.posisi)}</b>
        <span class="lowongan__meta">${esc(k.tipe)} · ${esc(k.lokasi)}</span>
        <span class="lowongan__ringkas">${esc(k.ringkas)}</span>
      </span>
      <span class="lowongan__aksi">Lihat posisi →</span>
    </a></li>`).join('');
}

function gambarLowongan() {
  const w = $('#lowonganIsi');
  if (!w) return;
  const k = DATA_KARIER.find(x => x.id === new URLSearchParams(location.search).get('id'));
  if (!k) { w.innerHTML = tidakAda('Karier', 'karier.html', 'Lihat semua lowongan'); return; }
  document.title = `${k.posisi} — Karier RTD Group`;
  const daftar = (j, xs) => xs.length ? `<h2>${j}</h2><ul class="poin">${xs.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  w.innerHTML = `${heroKecil('hero/render-3.jpg', `Karier · ${k.buka ? 'Dibuka' : 'Ditutup'}`, esc(k.posisi), `${esc(k.tipe)} · ${esc(k.lokasi)}`)}
    <section class="bagian bagian--rapat"><div class="isi baca">
      <a class="tbl tbl--halus" href="karier.html">← Semua lowongan</a>
      <p class="baca__ringkas">${esc(k.ringkas)}</p>
      ${daftar('Tanggung jawab', k.tugas)}${daftar('Kualifikasi', k.syarat)}
      ${k.buka ? `<p style="margin-top:40px"><a class="tbl tbl--utama" href="${waLamar(k)}" target="_blank" rel="noopener">Lamar lewat WhatsApp</a></p>`
               : '<p class="catatan" style="margin-top:40px">Lowongan ini sudah ditutup.</p>'}
      <p class="catatan">Contoh lowongan — ganti dengan materi asli sebelum ditayangkan.</p>
    </div></section>`;
}

function gambarGaleriYayasan() {
  const w = $('#yysGaleri');
  if (!w) return;
  const n = Math.max(3, DATA_YAYASAN_FOTO.length);
  w.innerHTML = Array.from({ length: n }, (_, i) => DATA_YAYASAN_FOTO[i]
    ? `<figure><img src="img/yayasan/${DATA_YAYASAN_FOTO[i].f}" alt="${esc(DATA_YAYASAN_FOTO[i].ket)}" loading="lazy"><figcaption>${esc(DATA_YAYASAN_FOTO[i].ket)}</figcaption></figure>`
    : `<div class="pd-kosong">Foto kegiatan menyusul</div>`).join('');
}

/* ------------------------------------------------------- Halaman detail -- */

function gambarDetail() {
  const wrap = $('#detailProyek');
  if (!wrap) return;
  const id = new URLSearchParams(location.search).get('id');
  const p = DATA_PROYEK.find(x => x.id === id);

  if (!p) {
    wrap.innerHTML = tidakAda('Proyek', `${AKAR}proyek/`, 'Lihat semua proyek');
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

  wrap.innerHTML = `${heroKecil(p.gbr, p.kategori === 'subsidi' ? 'Rumah Subsidi' : 'Rumah Komersil', esc(p.nama), esc(p.lokasi) + (p.tahap ? ' · ' + esc(p.tahap) : ''))}
    <div class="isi">
      <nav class="remah" aria-label="Remah roti">
        <a href="${AKAR}">Beranda</a> › <a href="${AKAR}proyek/">Proyek</a> › ${esc(judulLengkap(p))}
      </nav>
    </div>

    <section class="bagian bagian--rapat">
      <div class="isi">
        <div class="pd-hero">
          <div>
            <div class="kartu__garis" style="background:${p.warna};width:64px;height:4px;margin:0 0 12px"></div>
            ${p.alamat ? `<p style="color:var(--tinta-700)">${esc(p.alamat)}</p>` : ''}

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

    <section class="bagian bagian--krem" aria-labelledby="kawasanJudul">
      <div class="isi">
        <div class="kepala">
          <span class="label">Kawasan</span>
          <h2 id="kawasanJudul">Fasilitas dan siteplan</h2>
          <p>${p.fasilitas.length} fasilitas umum di dalam ${esc(judulLengkap(p))}${p.siteplan ? ', beserta pembagian bloknya.' : '.'}</p>
        </div>
        <div class="kawasan${p.siteplan ? '' : ' kawasan--tanpa-siteplan'}">
          <ul class="fasilitas" aria-label="Fasilitas umum">
            ${p.fasilitas.map(f => `<li><span style="background:${p.warna}"></span>${esc(f)}</li>`).join('')}
          </ul>
          ${p.siteplan
            ? `<figure class="siteplan"><img src="${AKAR}img/proyek/${p.siteplan}" alt="Siteplan ${esc(judulLengkap(p))}" loading="lazy">
                 <figcaption>Siteplan ${esc(judulLengkap(p))}. Ketersediaan blok terbaru dapat ditanyakan ke pemasaran.</figcaption></figure>`
            : `<div class="siteplan siteplan--kosong"><b>Siteplan menyusul</b>
                 <span>Minta siteplan dan blok yang masih tersedia langsung ke pemasaran.</span>
                 <a class="tbl tbl--kedua" href="https://wa.me/${KONTAK.wa}?text=${encodeURIComponent('Halo RTD, saya ingin meminta siteplan ' + judulLengkap(p) + '.')}" target="_blank" rel="noopener">Minta siteplan lewat WhatsApp</a></div>`}
        </div>
      </div>
    </section>

    <section class="bagian" aria-labelledby="spekJudul">
      <div class="isi">
        <div class="kepala">
          <span class="label">Spesifikasi Bangunan</span>
          <h2 id="spekJudul">Standar RTD${Object.keys(p.spekBeda).length ? ', dengan satu penyesuaian' : ', tanpa pengecualian'}</h2>
          <p>Dua belas baris yang sama di semua proyek. <a class="tbl tbl--halus" href="${AKAR}spesifikasi.html">Lihat penjelasan tiap baris →</a></p>
        </div>
        <table class="spek-tabel spek-tabel--dua"><tbody id="pdSpek"></tbody></table>
      </div>
    </section>

    ${p.peta ? `<section class="bagian" aria-labelledby="lokasiJudul">
      <div class="isi">
        <div class="kepala">
          <span class="label">Lokasi</span>
          <h2 id="lokasiJudul">${esc(judulLengkap(p))}</h2>
          ${p.alamat ? `<p>${esc(p.alamat)}</p>` : ''}
        </div>
        <div class="peta">
          <iframe src="${sematPeta(p.peta)}" title="Peta lokasi ${esc(judulLengkap(p))}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
          <div class="peta__kartu">
            <b>${esc(p.nama)}</b>
            <span>${esc(p.lokasi)}</span>
            <a class="tbl tbl--utama" href="${tautanPeta(p.peta, p.nama)}" target="_blank" rel="noopener">Buka di Google Maps</a>
          </div>
        </div>
        <p style="margin-top:24px;text-align:center"><a class="tbl tbl--emas" href="https://wa.me/${KONTAK.wa}?text=${encodeURIComponent('Halo RTD, saya ingin bertanya lokasi ' + judulLengkap(p) + '.')}" target="_blank" rel="noopener">Tanya lokasi lewat WhatsApp</a></p>
      </div>
    </section>` : ''}`;

  gambarSpek('#pdSpek', p.spekBeda);
}

/* ------------------------------------------------------------- Galeri -- */

const fotoGaleri = (a, n) => `${AKAR}img/galeri/${a.id}-${n}.jpg`;

function gambarAlbum() {
  const w = $('#albumDaftar');
  if (!w) return;
  w.innerHTML = DATA_GALERI.map(a => `
    <a class="album" href="album.html?id=${a.id}">
      <span class="album__gbr"><img src="${fotoGaleri(a, a.sampul)}" alt="" loading="lazy"></span>
      <span class="album__tx">
        <span class="album__meta">${a.waktu ? esc(a.waktu) + ' · ' : ''}${a.jumlah} foto</span>
        <b>${esc(a.judul)}</b>
      </span>
    </a>`).join('');
}

function gambarIsiAlbum() {
  const w = $('#albumIsi');
  if (!w) return;
  const i = DATA_GALERI.findIndex(x => x.id === new URLSearchParams(location.search).get('id'));
  const a = DATA_GALERI[i];
  if (!a) { w.innerHTML = tidakAda('Galeri', 'galeri.html', 'Lihat semua album'); return; }
  document.title = `${a.judul} — Galeri RTD Group`;
  const no = Array.from({ length: a.jumlah }, (_, k) => k + 1);
  const lain = DATA_GALERI.filter(x => x !== a).slice(0, 3);
  w.innerHTML = `
    <section class="page-hero page-hero--kecil">
      <img class="page-hero__gbr" src="${fotoGaleri(a, a.sampul)}" alt="" fetchpriority="high">
      <div class="isi page-hero__isi"><div class="page-hero__kotak">
        <span class="label">Galeri Kegiatan${a.waktu ? ' · ' + esc(a.waktu) : ''}</span><h1>${esc(a.judul)}</h1>
        <p>${a.jumlah} foto</p>
      </div></div>
    </section>
    <section class="bagian bagian--rapat"><div class="isi">
      <a class="tbl tbl--halus" href="galeri.html">← Semua album</a>
      ${a.isi.length ? `<div class="baca" style="margin-bottom:var(--space-7)">${a.isi.map(x => `<p>${esc(x)}</p>`).join('')}</div>` : ''}
      <div class="foto-grid">${no.map(n => `<button type="button" class="foto-grid__item" data-n="${n}" aria-label="Buka foto ${n} dari ${a.jumlah}">
        <img src="${fotoGaleri(a, n)}" alt="" loading="lazy"></button>`).join('')}</div>
    </div></section>
    <section class="bagian bagian--krem bagian--rapat"><div class="isi">
      <h2 class="tim-kelompok">Album lainnya</h2>
      <div class="album-grid album-grid--kecil">${lain.map(x => `<a class="album" href="album.html?id=${x.id}">
        <span class="album__gbr"><img src="${fotoGaleri(x, x.sampul)}" alt="" loading="lazy"></span>
        <span class="album__tx"><span class="album__meta">${x.jumlah} foto</span><b>${esc(x.judul)}</b></span></a>`).join('')}</div>
    </div></section>
    <dialog class="kotak-foto" id="kotakFoto" aria-label="${esc(a.judul)}">
      <img alt="">
      <p class="kotak-foto__no" aria-live="polite"></p>
      <button type="button" class="kotak-foto__tutup" aria-label="Tutup">×</button>
      <button type="button" class="kotak-foto__geser kotak-foto__geser--kiri" data-arah="-1" aria-label="Foto sebelumnya">‹</button>
      <button type="button" class="kotak-foto__geser kotak-foto__geser--kanan" data-arah="1" aria-label="Foto berikutnya">›</button>
    </dialog>`;

  const d = $('#kotakFoto'), img = $('img', d), lbl = $('.kotak-foto__no', d);
  let cur = 1;
  const tampil = n => { cur = (n - 1 + a.jumlah) % a.jumlah + 1; img.src = fotoGaleri(a, cur); img.alt = `${a.judul}, foto ${cur}`; lbl.textContent = `${cur} / ${a.jumlah}`; };
  $('.foto-grid', w).addEventListener('click', e => { const b = e.target.closest('[data-n]'); if (!b) return; tampil(+b.dataset.n); d.showModal(); });
  $$('[data-arah]', d).forEach(b => b.addEventListener('click', () => tampil(cur + +b.dataset.arah)));
  $('.kotak-foto__tutup', d).addEventListener('click', () => d.close());
  d.addEventListener('click', e => { if (e.target === d) d.close(); });
  d.addEventListener('keydown', e => { if (e.key === 'ArrowRight') tampil(cur + 1); if (e.key === 'ArrowLeft') tampil(cur - 1); });
  let x0 = null;
  d.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  d.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) tampil(cur + (dx < 0 ? 1 : -1)); x0 = null; });
}

function gambarPemasaran() {
  const w = $('#timPemasaran');
  if (!w) return;
  const mgr = DATA_TIM.find(t => t.jabatan === 'Marketing Manager');
  w.innerHTML = (mgr ? `<div class="pemasaran__orang pemasaran__orang--utama"><span class="pemasaran__inisial">${inisial(mgr.nama)}</span>
      <span><b>${esc(mgr.nama)}</b><span>Marketing Manager</span></span></div>` : '') +
    DATA_PEMASARAN.map(n => `<div class="pemasaran__orang"><span class="pemasaran__inisial">${inisial(n)}</span><span><b>${esc(n)}</b><span>Marketing</span></span></div>`).join('');
}

/* -------------------------------------------------- Kepala halaman siap -- */

// Kotak kaca baru ditampilkan setelah gambar latarnya terurai. Tanpa ini,
// sesaat kotak tampak padat karena blur-nya belum punya gambar di belakangnya.
function pasangKepala() {
  $$('.page-hero').forEach(h => {
    const img = $('.page-hero__gbr', h);
    const siap = () => h.classList.add('siap');
    if (!img || (img.complete && img.naturalWidth)) return siap();
    (img.decode ? img.decode() : Promise.reject()).then(siap, () => { img.addEventListener('load', siap); img.addEventListener('error', siap); });
    setTimeout(siap, 2500);
  });
}

/* ------------------------------------------------------- Geser di ponsel -- */

const GESER = '.album-grid--kecil, .proyek-grid, .pg-sorot, .testi-grid, .langkah-grid, .yys-galeri, .yys-program, .yys-rumah, .berita-grid';

// Titik penanda di bawah tiap baris geser. Hanya tampil di layar sempit (CSS).
function pasangGeser() {
  $$(GESER).forEach(g => {
    if (g.nextElementSibling && g.nextElementSibling.classList.contains('geser-titik')) g.nextElementSibling.remove();
    const anak = [...g.children].filter(c => !c.hidden);
    if (anak.length < 2) return;
    const t = document.createElement('div');
    t.className = 'geser-titik';
    t.setAttribute('aria-hidden', 'true');
    t.innerHTML = anak.map(() => '<i></i>').join('');
    g.after(t);
    const titik = [...t.children];
    const tandai = () => {
      const lebar = anak[0].getBoundingClientRect().width || 1;
      const i = Math.min(anak.length - 1, Math.round(g.scrollLeft / (lebar + 12)));
      titik.forEach((d, k) => d.classList.toggle('on', k === i));
    };
    g.onscroll = tandai;
    tandai();
  });
}

/* -------------------------------------------------------------- Peta -- */

const tautanPeta = (pt, nama) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nama)}&query_place_id=${pt.id}`;
const sematPeta = pt => `https://maps.google.com/maps?q=${pt.lat},${pt.lng}&z=16&hl=id&output=embed`;

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
  gambarProfilTim();
  gambarLegalitas('#legalTubuh', DATA_LEGALITAS);
  gambarLegalitas('#legalYayasanTubuh', DATA_LEGALITAS_YAYASAN);
  gambarPortofolio();
  gambarSpek('#spekTubuh');
  gambarReel();
  gambarYoutube();
  gambarBerita();
  gambarKarier();
  gambarArtikel();
  gambarLowongan();
  gambarGaleriYayasan();
  gambarAlbum();
  gambarIsiAlbum();
  gambarPemasaran();
  gambarDetail();
  pasangForm();
  pasangKepala();
  pasangGeser();
  const th = $('#tahun');
  if (th) th.textContent = new Date().getFullYear();
});
