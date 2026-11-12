/* ==========================================================================
   Skema konsol: setiap koleksi dan pengaturan situs, beserta bidang isiannya.
   Formulir, daftar, dan tinjauan draf dibangun dari berkas ini.

   Jenis bidang:
     teks, panjang (beberapa baris), paragraf (daftar paragraf, dipisah baris kosong),
     daftar (satu butir per baris), angka, rupiah, pilihan, centang, tanggal, tautan,
     gambar, galeri, cv, spekBeda, peta, warna
   Menambah bidang di sini cukup untuk konsol; situs perlu ikut membaca bidang itu di assets/js/app.js.
   ========================================================================== */
'use strict';

const WARNA_PROYEK = [
  ['var(--proyek-tanah)', 'Tanah', '#a85a3c'], ['var(--proyek-hutan)', 'Hutan', '#2f6b4f'], ['var(--proyek-laut)', 'Laut', '#2b5f7a'],
  ['var(--proyek-padi)', 'Padi', '#7d6a1d'], ['var(--proyek-bata)', 'Bata', '#8d3f3f'], ['var(--proyek-batu)', 'Batu', '#5a6472'],
  ['var(--proyek-kayu)', 'Kayu', '#7a5230'], ['var(--proyek-daun)', 'Daun', '#566b2b']
];

const rp = n => (n || n === 0) && n !== '' ? 'Rp ' + Number(n).toLocaleString('id-ID') : null;

const KOLEKSI = {
  proyek: {
    judul: 'Proyek', tunggal: 'proyek', kelompok: 'Penjualan', idDari: 'nama', alamatWeb: true,
    halaman: id => `proyek/detail.html?id=${encodeURIComponent(id)}`,
    ringkas: d => ({ judul: d.nama + (d.tahap ? ' — ' + d.tahap : ''), sub: [d.lokasi, d.tipe && 'Tipe ' + d.tipe, d.unit && d.unit + ' unit', rp(d.harga) || d.klaim].filter(Boolean).join(' · '), gbr: d.gbr,
      lencana: d.status && d.status !== 'tersedia' ? { booking: 'Hampir habis', terjual: 'Terjual habis' }[d.status] : null }),
    baru: { kategori: 'subsidi', warna: 'var(--proyek-hutan)', daerah: 'banyuasin', status: 'tersedia', kt: 2, km: 1, galeri: [], fasilitas: [], spekBeda: {} },
    bagian: [
      { judul: 'Identitas', bidang: [
        { k: 'nama', jenis: 'teks', label: 'Nama perumahan', wajib: true, bantu: 'Ditulis lengkap. Tahap tidak ikut di sini.' },
        { k: 'tahap', jenis: 'teks', label: 'Tahap', bantu: 'mis. Tahap 3. Kosongkan bila tidak bertahap.' },
        { k: 'kategori', jenis: 'pilihan', label: 'Kategori', opsi: [['subsidi', 'Rumah subsidi'], ['komersil', 'Rumah komersil']] },
        { k: 'status', jenis: 'pilihan', label: 'Status penjualan', opsi: [['tersedia', 'Tersedia'], ['booking', 'Hampir habis'], ['terjual', 'Terjual habis']] },
        { k: 'warna', jenis: 'warna', label: 'Warna aksen', bantu: 'Dikunci seumur proyek. Dipakai garis kartu dan fasilitas.' }
      ]},
      { judul: 'Lokasi', bidang: [
        { k: 'lokasi', jenis: 'teks', label: 'Lokasi singkat', wajib: true, bantu: 'Kelurahan/kecamatan, kota. mis. Gandus, Palembang' },
        { k: 'alamat', jenis: 'panjang', label: 'Alamat lengkap', bantu: 'Kosongkan bila belum dikonfirmasi.' },
        { k: 'daerah', jenis: 'pilihan', label: 'Daerah (untuk saringan)', opsi: [['gandus', 'Gandus'], ['banyuasin', 'Banyuasin'], ['ogan-ilir', 'Ogan Ilir'], ['palembang-lain', 'Palembang lainnya']] },
        { k: 'peta', jenis: 'peta', label: 'Titik Google Maps' }
      ]},
      { judul: 'Angka pemasaran', bidang: [
        { k: 'tipe', jenis: 'teks', label: 'Tipe (LB/LT)', bantu: 'mis. 36/84', lebar: 'setengah' },
        { k: 'unit', jenis: 'angka', label: 'Jumlah unit', lebar: 'setengah' },
        { k: 'kt', jenis: 'angka', label: 'Kamar tidur', lebar: 'setengah' },
        { k: 'km', jenis: 'angka', label: 'Kamar mandi', lebar: 'setengah' },
        { k: 'harga', jenis: 'rupiah', label: 'Harga jual', bantu: 'Isi hanya angka yang sudah dikonfirmasi pemasaran. Kosong = kartu menampilkan klaim.', lebar: 'setengah' },
        { k: 'dp', jenis: 'rupiah', label: 'Uang muka (DP)', lebar: 'setengah' },
        { k: 'angsuran20', jenis: 'rupiah', label: 'Angsuran 20 tahun (brosur)', bantu: 'Bila diisi, dipakai apa adanya. Bila kosong, dihitung dari harga, DP, dan bunga simulasi.' },
        { k: 'klaim', jenis: 'teks', label: 'Kalimat penawaran', bantu: 'Tampil bila harga masih kosong, mis. "DP all in 3 juta".' }
      ]},
      { judul: 'Foto dan siteplan', bidang: [
        { k: 'gbr', jenis: 'gambar', label: 'Render sampul', wajib: true, bantu: 'Gambar kartu proyek dan kepala halaman. Mendatar, 16:10.' },
        { k: 'galeri', jenis: 'galeri', label: 'Foto unit', bantu: 'Foto pertama jadi foto utama di halaman proyek. Tiga berikutnya tampil di bawahnya.' },
        { k: 'siteplan', jenis: 'gambar', label: 'Siteplan', maks: 2600, bantu: 'Diperkecil sampai 2600 px agar nomor blok tetap terbaca.' }
      ]},
      { judul: 'Kawasan dan spesifikasi', bidang: [
        { k: 'fasilitas', jenis: 'daftar', label: 'Fasilitas umum', bantu: 'Satu fasilitas per baris.' },
        { k: 'spekBeda', jenis: 'spekBeda', label: 'Beda dari spesifikasi standar', bantu: 'Isi hanya baris yang berbeda di proyek ini.' }
      ]}
    ]
  },

  portofolio: {
    judul: 'Rekam jejak', tunggal: 'perumahan terbangun', kelompok: 'Penjualan', idDari: 'nama',
    ringkas: d => ({ judul: d.nama + (d.tahap ? ' — ' + d.tahap : ''), sub: [d.jenis === 'ruko' ? 'Ruko' : 'Perumahan', d.area, d.unit && d.unit + ' unit'].filter(Boolean).join(' · ') }),
    baru: { jenis: 'perumahan', proyek: 1 },
    bagian: [{ bidang: [
      { k: 'jenis', jenis: 'pilihan', label: 'Jenis', opsi: [['perumahan', 'Perumahan'], ['ruko', 'Ruko']] },
      { k: 'nama', jenis: 'teks', label: 'Nama', wajib: true },
      { k: 'tahap', jenis: 'teks', label: 'Tahap', bantu: 'mis. Tahap 1, atau "dua tahap".' },
      { k: 'area', jenis: 'teks', label: 'Area', bantu: 'mis. Gandus, Palembang' },
      { k: 'tipe', jenis: 'teks', label: 'Tipe', lebar: 'setengah' },
      { k: 'unit', jenis: 'angka', label: 'Jumlah unit', wajib: true, lebar: 'setengah' },
      { k: 'proyek', jenis: 'angka', label: 'Dihitung sebagai berapa perumahan', bantu: 'Biasanya 1. Isi 2 bila satu baris mewakili dua perumahan.' }
    ]}]
  },

  hero: {
    judul: 'Hero beranda', tunggal: 'gambar hero', kelompok: 'Foto pemasaran', idDari: 'alt',
    ringkas: d => ({ judul: d.alt || 'Tanpa keterangan', gbr: d.gbr }),
    bagian: [{ bidang: [
      { k: 'gbr', jenis: 'gambar', label: 'Render', wajib: true, bantu: 'Mendatar 16:9, minimal 1600 px. Gambar pertama dimuat paling dulu.' },
      { k: 'alt', jenis: 'teks', label: 'Keterangan gambar', wajib: true, bantu: 'Untuk pembaca layar, mis. "Render gerbang Taman Asri Gandus 2".' }
    ]}]
  },

  promo: {
    judul: 'Promo', tunggal: 'promo', kelompok: 'Foto pemasaran', idDari: 'judul',
    ringkas: d => ({ judul: d.judul || 'Promo tanpa judul', sub: [d.mulai && 'mulai ' + d.mulai, d.selesai && 'sampai ' + d.selesai].filter(Boolean).join(' · ') || 'Tanpa batas waktu', gbr: d.gbr }),
    bagian: [{ bidang: [
      { k: 'gbr', jenis: 'gambar', label: 'Banner atau brosur', wajib: true, bantu: 'Tampil 16:9 di beranda, di atas daftar proyek.' },
      { k: 'judul', jenis: 'teks', label: 'Judul', bantu: 'mis. DP 0 rupiah sampai akhir tahun' },
      { k: 'ket', jenis: 'panjang', label: 'Keterangan singkat' },
      { k: 'tautan', jenis: 'tautan', label: 'Tautan', bantu: 'Halaman proyek, WhatsApp, atau berkas brosur. Kosongkan bila tidak perlu.' },
      { k: 'label_tombol', jenis: 'teks', label: 'Tulisan tombol', bantu: 'Bawaan: "Lihat promo".' },
      { k: 'mulai', jenis: 'tanggal', label: 'Mulai tampil', lebar: 'setengah' },
      { k: 'selesai', jenis: 'tanggal', label: 'Berhenti tampil setelah', lebar: 'setengah', bantu: 'Promo hilang sendiri setelah tanggal ini.' }
    ]}]
  },

  bank: {
    judul: 'Mitra perbankan', tunggal: 'bank', kelompok: 'Perusahaan', idDari: 'nama',
    ringkas: d => ({ judul: d.nama, sub: { kpr: 'Penyalur KPR', konstruksi: 'Pembiayaan konstruksi', keduanya: 'KPR dan konstruksi' }[d.peran], gbr: d.logo, logo: true }),
    baru: { peran: 'keduanya' },
    bagian: [{ bidang: [
      { k: 'nama', jenis: 'teks', label: 'Nama bank', wajib: true },
      { k: 'logo', jenis: 'gambar', label: 'Logo', maks: 800, logo: true, bantu: 'PNG berlatar transparan paling baik. Tanpa logo, nama bank yang tampil.' },
      { k: 'peran', jenis: 'pilihan', label: 'Peran', opsi: [['keduanya', 'KPR dan pembiayaan konstruksi'], ['kpr', 'Penyalur KPR'], ['konstruksi', 'Pembiayaan konstruksi']] },
      { k: 'ket', jenis: 'teks', label: 'Keterangan di halaman Legalitas', bantu: 'Kosongkan untuk memakai keterangan peran.' },
      { k: 'tautan', jenis: 'tautan', label: 'Situs bank' }
    ]}]
  },

  penghargaan: {
    judul: 'Penghargaan', tunggal: 'penghargaan', kelompok: 'Perusahaan', idDari: 'nama',
    ringkas: d => ({ judul: d.nama, sub: [d.tahun, d.sorot && 'Ditonjolkan'].filter(Boolean).join(' · ') }),
    bagian: [{ bidang: [
      { k: 'nama', jenis: 'teks', label: 'Nama penghargaan', wajib: true },
      { k: 'tahun', jenis: 'teks', label: 'Tahun', lebar: 'setengah' },
      { k: 'sorot', jenis: 'centang', label: 'Tonjolkan di beranda', bantu: 'Tiga yang ditonjolkan tampil sebagai kartu; sisanya di balik tombol.', lebar: 'setengah' },
      { k: 'ket', jenis: 'panjang', label: 'Keterangan', bantu: 'Tampil hanya untuk penghargaan yang ditonjolkan.' }
    ]}]
  },

  testimoni: {
    judul: 'Testimoni', tunggal: 'testimoni', kelompok: 'Perusahaan', idDari: 'nama',
    ringkas: d => ({ judul: d.nama, sub: d.jabatan }),
    bagian: [{ bidang: [
      { k: 'isi', jenis: 'panjang', label: 'Kutipan', wajib: true },
      { k: 'nama', jenis: 'teks', label: 'Nama', wajib: true },
      { k: 'jabatan', jenis: 'teks', label: 'Jabatan dan lembaga' }
    ]}]
  },

  spesifikasi: {
    judul: 'Spesifikasi standar', tunggal: 'baris spesifikasi', kelompok: 'Perusahaan', idDari: 'baris',
    ringkas: d => ({ judul: d.baris, sub: d.nilai }),
    bagian: [{ bidang: [
      { k: 'baris', jenis: 'teks', label: 'Bagian bangunan', wajib: true, bantu: 'mis. Pondasi. Mengubah nama ini memutus "beda dari standar" di proyek yang memakainya.' },
      { k: 'nilai', jenis: 'teks', label: 'Spesifikasi', wajib: true }
    ]}]
  },

  legalitas: {
    judul: 'Legalitas', tunggal: 'baris legalitas', kelompok: 'Perusahaan', idDari: 'label',
    ringkas: d => ({ judul: d.label, sub: [d.kelompok === 'yayasan' ? 'Yayasan' : 'Holding', d.nilai, d.tgl].filter(Boolean).join(' · ') }),
    baru: { kelompok: 'holding' },
    bagian: [{ bidang: [
      { k: 'kelompok', jenis: 'pilihan', label: 'Milik', opsi: [['holding', 'PT RTD Group (holding)'], ['yayasan', 'Yayasan Al-Mukmin Darunnajah Center']] },
      { k: 'label', jenis: 'teks', label: 'Dokumen atau jabatan', wajib: true, bantu: 'mis. NIB, SK Kemenkumham, Direktur' },
      { k: 'nilai', jenis: 'teks', label: 'Nomor atau nama', wajib: true },
      { k: 'tgl', jenis: 'teks', label: 'Tanggal', bantu: 'Ditulis seperti di dokumen, mis. 15 Oktober 2020.' }
    ]}]
  },

  tim: {
    judul: 'Manajemen', tunggal: 'anggota tim', kelompok: 'Orang', idDari: 'nama', alamatWeb: true,
    halaman: id => `tim.html?id=${encodeURIComponent(id)}`,
    ringkas: d => ({ judul: d.panggil || d.nama, sub: [d.jabatan, d.direksi && 'Direksi', !(d.cv || []).length && 'CV belum ada'].filter(Boolean).join(' · '), gbr: d.foto, bulat: true }),
    baru: { direksi: false, bio: [], cv: [] },
    bagian: [
      { judul: 'Profil', bidang: [
        { k: 'nama', jenis: 'teks', label: 'Nama lengkap dengan gelar', wajib: true },
        { k: 'panggil', jenis: 'teks', label: 'Nama tampil', bantu: 'Versi pendek untuk judul, mis. M. Junestrada Diem. Kosongkan bila sama.' },
        { k: 'jabatan', jenis: 'teks', label: 'Jabatan', wajib: true, bantu: 'Huruf kapital di awal kata, mis. Marketing Manager.' },
        { k: 'direksi', jenis: 'centang', label: 'Direksi dan pemilik', bantu: 'Tampil besar di baris atas halaman Profil.' },
        { k: 'foto', jenis: 'gambar', label: 'Foto', maks: 1000, bantu: 'Potret tegak 4:5. Tanpa foto, inisial yang tampil.' },
        { k: 'bio', jenis: 'paragraf', label: 'Profil singkat', bantu: 'Pisahkan paragraf dengan satu baris kosong. Paragraf pertama tampil di kartu.' }
      ]},
      { judul: 'CV', bidang: [
        { k: 'cv', jenis: 'cv', label: 'Riwayat', bantu: 'Kelompok seperti Pendidikan, Pengalaman kerja, Organisasi. Tiap baris: tahun dan keterangan.' }
      ]}
    ]
  },

  pemasaran: {
    judul: 'Tim pemasaran', tunggal: 'anggota pemasaran', kelompok: 'Orang', idDari: 'nama',
    ringkas: d => ({ judul: d.nama, sub: [d.jabatan || 'Marketing', d.wa && 'WA ' + d.wa].filter(Boolean).join(' · '), gbr: d.foto, bulat: true }),
    baru: { jabatan: 'Marketing' },
    bagian: [{ bidang: [
      { k: 'nama', jenis: 'teks', label: 'Nama', wajib: true },
      { k: 'jabatan', jenis: 'teks', label: 'Jabatan', bantu: 'Bawaan: Marketing.' },
      { k: 'foto', jenis: 'gambar', label: 'Foto', maks: 600, bantu: 'Potret wajah, tampil bulat kecil.' },
      { k: 'wa', jenis: 'teks', label: 'Nomor WhatsApp', bantu: 'Format internasional tanpa +, mis. 6281234567890. Bila diisi, nama bisa diklik pengunjung.' }
    ]}]
  },

  berita: {
    judul: 'Berita & artikel', tunggal: 'berita', kelompok: 'Kabar', idDari: 'judul', alamatWeb: true,
    halaman: id => `artikel.html?id=${encodeURIComponent(id)}`,
    ringkas: d => ({ judul: d.judul, sub: [d.tanggal, d.kategori, d.utama && 'Sorotan'].filter(Boolean).join(' · '), gbr: d.gbr }),
    baru: () => ({ tanggal: new Date().toISOString().slice(0, 10), kategori: 'Proyek', utama: false, isi: [] }),
    bagian: [{ bidang: [
      { k: 'judul', jenis: 'teks', label: 'Judul', wajib: true },
      { k: 'tanggal', jenis: 'tanggal', label: 'Tanggal', wajib: true, lebar: 'setengah' },
      { k: 'kategori', jenis: 'teks', label: 'Kategori', bantu: 'mis. Proyek, Penghargaan, Panduan', saran: ['Proyek', 'Penghargaan', 'Panduan', 'Kegiatan'], lebar: 'setengah' },
      { k: 'utama', jenis: 'centang', label: 'Jadikan sorotan', bantu: 'Satu berita sorotan tampil besar di atas. Bila tidak ada, yang terbaru.' },
      { k: 'gbr', jenis: 'gambar', label: 'Gambar utama', wajib: true },
      { k: 'ringkas', jenis: 'panjang', label: 'Ringkasan', wajib: true, bantu: 'Satu-dua kalimat untuk kartu berita.' },
      { k: 'isi', jenis: 'paragraf', label: 'Isi berita', bantu: 'Pisahkan paragraf dengan satu baris kosong.' }
    ]}]
  },

  karier: {
    judul: 'Karier', tunggal: 'lowongan', kelompok: 'Kabar', idDari: 'posisi', alamatWeb: true,
    halaman: id => `lowongan.html?id=${encodeURIComponent(id)}`,
    ringkas: d => ({ judul: d.posisi, sub: [d.buka ? 'Dibuka' : 'Ditutup', d.tipe, d.lokasi, d.batas && 'sampai ' + d.batas].filter(Boolean).join(' · ') }),
    baru: { buka: true, tipe: 'Penuh waktu', lokasi: 'Palembang', tugas: [], syarat: [] },
    bagian: [{ bidang: [
      { k: 'posisi', jenis: 'teks', label: 'Posisi', wajib: true },
      { k: 'buka', jenis: 'centang', label: 'Lowongan dibuka', bantu: 'Matikan untuk menutup lamaran tanpa menghapus lowongan.' },
      { k: 'tipe', jenis: 'teks', label: 'Jenis kerja', saran: ['Penuh waktu', 'Paruh waktu', 'Kontrak', 'Magang'], lebar: 'setengah' },
      { k: 'lokasi', jenis: 'teks', label: 'Lokasi', lebar: 'setengah' },
      { k: 'batas', jenis: 'tanggal', label: 'Batas lamaran', bantu: 'Opsional, hanya ditampilkan.' },
      { k: 'ringkas', jenis: 'panjang', label: 'Ringkasan', wajib: true },
      { k: 'tugas', jenis: 'daftar', label: 'Tanggung jawab', bantu: 'Satu per baris.' },
      { k: 'syarat', jenis: 'daftar', label: 'Kualifikasi', bantu: 'Satu per baris.' }
    ]}]
  },

  galeri: {
    judul: 'Galeri kegiatan', tunggal: 'album', kelompok: 'Kabar', idDari: 'judul', alamatWeb: true,
    halaman: id => `album.html?id=${encodeURIComponent(id)}`,
    ringkas: d => ({ judul: d.judul, sub: [d.waktu, (d.foto || []).length + ' foto'].filter(Boolean).join(' · '), gbr: (d.foto || [])[0] }),
    baru: { foto: [], isi: [] },
    bagian: [{ bidang: [
      { k: 'judul', jenis: 'teks', label: 'Judul album', wajib: true },
      { k: 'waktu', jenis: 'teks', label: 'Waktu', bantu: 'Ditulis bebas, mis. Agustus 2025 atau 27 September 2023.' },
      { k: 'isi', jenis: 'paragraf', label: 'Cerita singkat', bantu: 'Pisahkan paragraf dengan satu baris kosong.' },
      { k: 'foto', jenis: 'galeri', label: 'Foto', bantu: 'Foto pertama jadi sampul album. Album tanpa foto tidak tampil.' }
    ]}]
  },

  yayasan_foto: {
    judul: 'Foto yayasan', tunggal: 'foto yayasan', kelompok: 'Kabar', idDari: 'ket',
    ringkas: d => ({ judul: d.ket || 'Tanpa keterangan', gbr: d.gbr }),
    bagian: [{ bidang: [
      { k: 'gbr', jenis: 'gambar', label: 'Foto kegiatan', wajib: true },
      { k: 'ket', jenis: 'teks', label: 'Keterangan', wajib: true }
    ]}]
  },

  reel: {
    judul: 'Reel Instagram', tunggal: 'reel', kelompok: 'Kabar', idDari: 'judul',
    ringkas: d => ({ judul: d.judul, sub: '@' + (d.akun || ''), gbr: d.gbr, tegak: true }),
    baru: { akun: 'ramadevelopmentplg' },
    bagian: [{ bidang: [
      { k: 'url', jenis: 'tautan', label: 'Tautan reel', wajib: true, bantu: 'mis. https://www.instagram.com/reel/…' },
      { k: 'judul', jenis: 'teks', label: 'Judul singkat', wajib: true },
      { k: 'akun', jenis: 'teks', label: 'Akun Instagram', bantu: 'Tanpa @.' },
      { k: 'gbr', jenis: 'gambar', label: 'Poster', wajib: true, maks: 1080, bantu: 'Tangkapan layar reel, tegak 9:16.' }
    ]}]
  },

  youtube: {
    judul: 'Video YouTube', tunggal: 'video', kelompok: 'Kabar', idManual: true,
    ringkas: d => ({ judul: d.judul, sub: 'youtube.com/watch?v=' + d.id, gbr: `https://i.ytimg.com/vi/${d.id}/mqdefault.jpg` }),
    bagian: [{ bidang: [
      { k: 'judul', jenis: 'teks', label: 'Judul', wajib: true }
    ]}]
  }
};

/* Pengaturan: satu dokumen per kunci. */
const PENGATURAN = {
  kontak: {
    judul: 'Kontak & media sosial', kelompok: 'Situs',
    bantu: 'Dipakai di semua halaman: tombol WhatsApp, kaki halaman, halaman Kontak.',
    bagian: [{ bidang: [
      { k: 'wa', jenis: 'teks', label: 'WhatsApp kantor (format internasional)', wajib: true, bantu: 'Tanpa + dan spasi, mis. 6282384299234.', lebar: 'setengah' },
      { k: 'waTampil', jenis: 'teks', label: 'WhatsApp seperti ditampilkan', bantu: 'mis. 0823-8429-9234', lebar: 'setengah' },
      { k: 'email', jenis: 'teks', label: 'Email', lebar: 'setengah' },
      { k: 'ig', jenis: 'teks', label: 'Akun Instagram', bantu: 'Tanpa @.', lebar: 'setengah' },
      { k: 'youtube', jenis: 'tautan', label: 'Kanal YouTube' },
      { k: 'alamat', jenis: 'daftar', label: 'Alamat kantor', bantu: 'Satu baris per baris alamat, seperti di kaki halaman.' },
      { k: 'jam', jenis: 'teks', label: 'Jam buka', bantu: 'mis. Senin–Sabtu, 08.00–16.00 WIB' },
      { k: 'maps', jenis: 'tautan', label: 'Tautan Google Maps kantor' }
    ]}]
  },
  angka: {
    judul: 'Angka pemasaran', kelompok: 'Penjualan',
    bantu: 'Angka di beranda dan halaman Profil. Unit, perumahan, dan proyek dijual dihitung otomatis dari data proyek dan rekam jejak; isi kolom "manual" hanya bila ingin menimpa.',
    bagian: [
      { judul: 'Dihitung otomatis', bidang: [
        { k: 'unit', jenis: 'teks', label: 'Unit dalam portofolio — manual', otomatis: 'unit', lebar: 'setengah' },
        { k: 'unit_label', jenis: 'teks', label: 'Keterangan', lebar: 'setengah' },
        { k: 'proyek', jenis: 'teks', label: 'Jumlah perumahan — manual', otomatis: 'proyek', lebar: 'setengah' },
        { k: 'proyek_label', jenis: 'teks', label: 'Keterangan', lebar: 'setengah' },
        { k: 'dijual', jenis: 'teks', label: 'Proyek aktif dijual — manual', otomatis: 'dijual', lebar: 'setengah' },
        { k: 'dijual_label', jenis: 'teks', label: 'Keterangan', lebar: 'setengah' }
      ]},
      { judul: 'Ditulis tangan', bidang: [
        { k: 'btn', jenis: 'teks', label: 'Penghargaan Bank BTN', lebar: 'setengah' },
        { k: 'btn_label', jenis: 'teks', label: 'Keterangan', lebar: 'setengah' },
        { k: 'wilayah', jenis: 'teks', label: 'Kota dan kabupaten (Profil)', lebar: 'setengah' },
        { k: 'wilayah_label', jenis: 'teks', label: 'Keterangan', lebar: 'setengah' },
        { k: 'rating', jenis: 'teks', label: 'Rating bank (beranda, penghargaan)', lebar: 'setengah' },
        { k: 'rating_label', jenis: 'teks', label: 'Keterangan', lebar: 'setengah' },
        { k: 'rentang', jenis: 'teks', label: 'Rentang tahun (beranda, penghargaan)', lebar: 'setengah' },
        { k: 'rentang_label', jenis: 'teks', label: 'Keterangan', lebar: 'setengah' }
      ]}
    ]
  },
  kpr: {
    judul: 'Simulasi KPR', kelompok: 'Penjualan',
    bantu: 'Batas dan nilai awal penggeser di beranda. Bunga awal juga dipakai menghitung "angsuran mulai" proyek yang belum punya angka brosur.',
    bagian: [{ bidang: [
      { k: 'bunga', jenis: 'angka', label: 'Bunga awal (% per tahun)', bantu: 'FLPP: 5.', lebar: 'setengah', langkah: 0.25 },
      { k: 'bunga_min', jenis: 'angka', label: 'Bunga terendah', lebar: 'setengah', langkah: 0.25 },
      { k: 'bunga_maks', jenis: 'angka', label: 'Bunga tertinggi', lebar: 'setengah', langkah: 0.25 },
      { k: 'dp_awal', jenis: 'angka', label: 'DP awal (%)', lebar: 'setengah', langkah: 0.5 },
      { k: 'dp_maks', jenis: 'angka', label: 'DP tertinggi (%)', lebar: 'setengah' },
      { k: 'tenor', jenis: 'daftar', label: 'Pilihan tenor (tahun)', angka: true, bantu: 'Satu angka per baris, mis. 10, 15, 20.' },
      { k: 'tenor_awal', jenis: 'angka', label: 'Tenor terpilih di awal', lebar: 'setengah' },
      { k: 'harga_awal', jenis: 'rupiah', label: 'Harga awal', lebar: 'setengah' },
      { k: 'harga_min', jenis: 'rupiah', label: 'Harga terendah', lebar: 'setengah' },
      { k: 'harga_maks', jenis: 'rupiah', label: 'Harga tertinggi', lebar: 'setengah' }
    ]}]
  }
};

/* Urutan menu samping. */
const MENU = [
  { k: 'ringkasan', label: 'Ringkasan' },
  { kelompok: 'Penjualan' },
  { k: 'proyek' }, { k: 'portofolio' }, { k: 'p:angka' }, { k: 'p:kpr' },
  { kelompok: 'Foto pemasaran' },
  { k: 'hero' }, { k: 'promo' },
  { kelompok: 'Perusahaan' },
  { k: 'tim' }, { k: 'pemasaran' }, { k: 'bank' }, { k: 'penghargaan' }, { k: 'testimoni' }, { k: 'spesifikasi' }, { k: 'legalitas' },
  { kelompok: 'Kabar' },
  { k: 'berita' }, { k: 'karier' }, { k: 'galeri' }, { k: 'yayasan_foto' }, { k: 'reel' }, { k: 'youtube' },
  { kelompok: 'Situs' },
  { k: 'teks', label: 'Teks halaman' }, { k: 'p:kontak' },
  { kelompok: 'Kotak masuk', peran: ['pemilik', 'admin', 'editor'] },
  { k: 'pesan', label: 'Pesan', peran: ['pemilik', 'admin', 'editor'] },
  { k: 'lamaran', label: 'Lamaran kerja', peran: ['pemilik', 'admin', 'editor'] },
  { kelompok: 'Kerja tim' },
  { k: 'draf', label: 'Tinjau draf' },
  { k: 'aktivitas', label: 'Aktivitas', peran: ['pemilik', 'admin', 'editor'] },
  { k: 'versi', label: 'Versi terbit', peran: ['pemilik', 'admin', 'editor'] },
  { k: 'kode', label: 'Kode akses', peran: ['pemilik', 'admin'] }
];
