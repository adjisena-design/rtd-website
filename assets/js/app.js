/* ==========================================================================
   Rama Trimitra Development Group — situs
   Tanpa kerangka kerja, tanpa dependensi. Semua data proyek ada di bawah ini.
   ========================================================================== */

'use strict';

/* --------------------------------------------------------------------------
   DATA PROYEK

   TIM RTD: ini satu-satunya tempat yang perlu diubah untuk menambah,
   menghapus, atau memperbarui proyek. Tidak perlu menyentuh berkas lain.

   Keterangan isian:
     id        kode unik, dipakai juga untuk nama berkas gambar di img/
     nama      nama resmi di materi publik, ditulis lengkap
     tahap     opsional, misal "Tahap 3". Tahap bukan bagian dari nama.
     kategori  "subsidi" atau "komersil"
     warna     warna aksen proyek, dikunci seumur proyek
     lokasi    kelurahan/kecamatan, kota
     daerah    "gandus" | "ogan-ilir" | "palembang-lain"  (untuk penyaring)
     tipe      "36/84" (bangunan/tanah)
     unit      jumlah unit dalam proyek, menurut company profile 2026
     kt, km    jumlah kamar tidur dan kamar mandi
     harga     harga jual dalam rupiah, atau null kalau belum dikonfirmasi
     dp        uang muka dalam rupiah, atau null
     angsuran20  angsuran tenor 20 tahun menurut brosur. Kalau diisi, angka
                 inilah yang ditampilkan — supaya situs sama persis dengan
                 cetakan. Kalau null, dihitung dari harga dengan bunga 5%.
     klaim     kalimat yang dipakai brosur proyek ini kalau harga belum ada
     status    "tersedia" | "booking" | "terjual"
     gbr       nama berkas di folder img/

   PENTING: isi "harga" hanya dengan angka yang sudah dikonfirmasi pemasaran.
   Selama null, kartu menampilkan klaim dari brosur dan ajakan menghubungi
   pemasaran — bukan angka karangan.
   -------------------------------------------------------------------------- */

const DATA_PROYEK = [
  {
    id: 'green-nature', unit: 106, nama: 'The Green Nature', tahap: null,
    kategori: 'subsidi', warna: 'var(--proyek-hutan)',
    lokasi: 'Pangkalan Benteng', daerah: 'palembang-lain',
    tipe: '36/84', kt: 2, km: 1,
    harga: 166000000, dp: 5700000, angsuran20: 1072000,
    klaim: null, status: 'tersedia', gbr: 'green-nature.jpg'
  },
  {
    id: 'tag-tahap-3', unit: 249, nama: 'Taman Asri Gandus 2', tahap: 'Tahap 3',
    kategori: 'subsidi', warna: 'var(--proyek-laut)',
    lokasi: 'Gandus, Palembang', daerah: 'gandus',
    tipe: '36/84', kt: 2, km: 1,
    harga: null, dp: 3000000,
    klaim: 'DP all in 3 juta', status: 'tersedia', gbr: 'tag-tahap-3.jpg'
  },
  {
    id: 'tag-tahap-4', unit: 251, nama: 'Taman Asri Gandus 2', tahap: 'Tahap 4',
    kategori: 'subsidi', warna: 'var(--proyek-laut)',
    lokasi: 'Gandus, Palembang', daerah: 'gandus',
    tipe: '36/84', kt: 2, km: 1,
    harga: null, dp: 3000000,
    klaim: 'DP all in 3 juta', status: 'tersedia', gbr: 'tag-tahap-4.jpg'
  },
  {
    id: 'tag-tahap-5', unit: 334, nama: 'Taman Asri Gandus 2', tahap: 'Tahap 5',
    kategori: 'subsidi', warna: 'var(--proyek-laut)',
    lokasi: 'Gandus, Palembang', daerah: 'gandus',
    tipe: '36/84', kt: 2, km: 1,
    harga: null, dp: null,
    klaim: 'Angsuran mulai 1 jutaan', status: 'tersedia', gbr: 'tag-tahap-5.jpg'
  },
  {
    id: 'tag-signature', unit: 126, nama: 'TAG Signature', tahap: null,
    kategori: 'komersil', warna: 'var(--proyek-batu)',
    lokasi: 'Jl. Sofyan Kenawas, Gandus, Palembang', daerah: 'gandus',
    tipe: '36/84', kt: 2, km: 1,
    harga: null, dp: null,
    klaim: 'Hubungi pemasaran untuk harga', status: 'tersedia', gbr: 'tag-signature.jpg'
  },
  {
    id: 'green-village', unit: 270, nama: 'The Green Village', tahap: null,
    kategori: 'subsidi', warna: 'var(--proyek-daun)',
    lokasi: 'Merah Mata', daerah: 'palembang-lain',
    tipe: '36/99', kt: 2, km: 1,
    harga: null, dp: null,
    klaim: 'Angsuran mulai 1 juta, langsung huni', status: 'tersedia', gbr: 'green-village.jpg'
  },
  {
    id: 'grand-athmar-indralaya', unit: 298, nama: 'Grand Athmar Indralaya', tahap: null,
    kategori: 'subsidi', warna: 'var(--proyek-kayu)',
    lokasi: 'Desa Tanjung Baru, Indralaya Utara, Ogan Ilir', daerah: 'ogan-ilir',
    tipe: '36/96', kt: 2, km: 1,
    harga: null, dp: 1000000,
    klaim: 'DP mulai 1 juta', status: 'tersedia', gbr: 'grand-athmar-indralaya.jpg'
  },
  {
    id: 'grand-athmar-sematang', unit: 206, nama: 'Grand Athmar Sematang Borang', tahap: null,
    kategori: 'subsidi', warna: 'var(--proyek-kayu)',
    lokasi: 'Sematang Borang, Palembang', daerah: 'palembang-lain',
    tipe: '36/98', kt: 2, km: 1,
    harga: null, dp: null,
    klaim: 'Gratis pemasangan air PDAM', status: 'tersedia', gbr: 'grand-athmar-sematang.jpg'
  },
  {
    id: 'kartika-mataram', unit: 570, nama: 'Kartika Mataram Residence', tahap: 'Tahap 2',
    kategori: 'subsidi', warna: 'var(--proyek-bata)',
    lokasi: 'Palembang', daerah: 'palembang-lain',
    tipe: '36/84', kt: 2, km: 1,
    harga: null, dp: null,
    klaim: 'Angsuran mulai 1 jutaan', status: 'tersedia', gbr: 'kartika-mataram.jpg'
  },
  {
    id: 'casa-adiva', unit: 17, nama: 'Casa Adiva', tahap: null,
    kategori: 'komersil', warna: 'var(--proyek-tanah)',
    lokasi: 'Suka Maju, Kenten', daerah: 'palembang-lain',
    tipe: '65/85', kt: 3, km: 2,
    harga: null, dp: 0,
    klaim: 'Town house 2 lantai · DP 0, booking 5 juta', status: 'tersedia', gbr: 'casa-adiva.jpg'
  }
];

/* --------------------------------------------------------------------------
   PORTOFOLIO — proyek yang sudah terbangun dan tidak lagi dijual.
   Sumber: Company Profile RTD Group 2026. Ditampilkan sebagai rekam jejak.
   -------------------------------------------------------------------------- */

const DATA_PORTOFOLIO = [
  { nama: 'Kartika Mataram Residence',       tahap: 'Tahap 1', area: 'Talang Kelapa, Banyuasin',  tipe: '36/91', unit: 150 },
  { nama: 'Taman Asri Gandus 2',             tahap: 'Tahap 1', area: 'Gandus, Palembang',         tipe: '36/96', unit: 150 },
  { nama: 'Taman Asri Gandus 2',             tahap: 'Tahap 2', area: 'Gandus, Palembang',         tipe: '36/84', unit: 267 },
  { nama: 'Surya Akbar Gemilang',            tahap: null,      area: 'Demang Lebar Daun, Palembang', tipe: '36/91', unit: 317 },
  { nama: 'Grand Talang Betutu Indah',       tahap: null,      area: 'Talang Betutu, Palembang',  tipe: '36/84', unit: 108 },
  { nama: 'Palem Emas 1',                    tahap: null,      area: 'Talang Betutu, Palembang',  tipe: '36/84', unit: 61  },
  { nama: 'Palem Emas 2',                    tahap: null,      area: 'Talang Betutu, Palembang',  tipe: '36/90', unit: 108 },
  { nama: 'Grand Pangkalan Benteng Indah',   tahap: null,      area: 'Talang Kelapa, Banyuasin',  tipe: '36/84', unit: 103 },
  { nama: 'Alam Hijau 3',                    tahap: 'dua tahap', area: 'Gandus, Palembang',       tipe: '36/84', unit: 117, proyek: 2 }
];

/* Ruko, dicatat terpisah karena bukan rumah tinggal. */
const DATA_RUKO = [
  { nama: 'Ruko Grand Athmar Indralaya', area: 'Indralaya Utara, Ogan Ilir', tipe: '4×12 / 4×20 m', unit: 37 }
];

/* --------------------------------------------------------------------------
   LEGALITAS HOLDING — Company Profile RTD Group 2026
   -------------------------------------------------------------------------- */

const DATA_LEGALITAS = [
  { label: 'Akta Pendirian Perusahaan', nilai: 'No. 27',                              tgl: '15 Oktober 2020' },
  { label: 'SK Kemenkumham',            nilai: 'AHU-0054067.AH.01.01.TAHUN 2020',     tgl: '19 Oktober 2020' },
  { label: 'NIB',                       nilai: '0220510240235',                       tgl: '3 Desember 2020' },
  { label: 'TDP',                       nilai: '060614601853',                        tgl: '1 Oktober 2023' },
  { label: 'NPWP',                      nilai: '86.139.188.6-301.000',                tgl: null },
  { label: 'SIUJK',                     nilai: '1-1671-2-00156-324222',               tgl: '19 April 2024' },
  { label: 'Sertifikat Keanggotaan PI', nilai: '02.03.2020.102',                      tgl: '21 November 2024' },
  { label: 'Direktur',                  nilai: 'M. Junestrada Diem',                  tgl: null },
  { label: 'Komisaris',                 nilai: 'Hj. Meriana Arsyad',                  tgl: null }
];

/* --------------------------------------------------------------------------
   PENGHARGAAN — seluruhnya dari Bank BTN dan BTN Syariah
   -------------------------------------------------------------------------- */

const DATA_PENGHARGAAN = [
  { tahun: '2025', nama: 'The Best Developer Yasa Griya' },
  { tahun: '2025', nama: 'The Best Developer Subsidi' },
  { tahun: '2024', nama: 'The Best Commercial Financing Developer' },
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

/* --------------------------------------------------------------------------
   TESTIMONI — Company Profile RTD Group 2026
   -------------------------------------------------------------------------- */

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

/* --------------------------------------------------------------------------
   TIM MANAJEMEN — Company Profile RTD Group 2026
   -------------------------------------------------------------------------- */

const DATA_TIM = [
  { nama: 'M. Junestrada Diem',  jabatan: 'Director' },
  { nama: 'Huda Assalam',        jabatan: 'Director' },
  { nama: 'Ade Saputra',         jabatan: 'Operational Manager' },
  { nama: 'Teddy Wijaya',        jabatan: 'Field Manager' },
  { nama: 'Romi Febriansyah',    jabatan: 'Marketing Manager' },
  { nama: 'Putra Ady Kesuma',    jabatan: 'Finance Manager' },
  { nama: 'Yoga Juniansyah',     jabatan: 'HRGA Manager' },
  { nama: 'Nosvita Sari',        jabatan: 'Administrasi Supervisor' },
  { nama: 'M. Tio Amartha',      jabatan: 'Field Supervisor' }
];

const TEKS_STATUS = { tersedia: 'Tersedia', booking: 'Booking', terjual: 'Terjual' };

/* ------------------------------------------------------------- Pembantu -- */

const $  = (sel, induk = document) => induk.querySelector(sel);
const $$ = (sel, induk = document) => Array.from(induk.querySelectorAll(sel));

/** Format rupiah penuh: 1287000 -> "Rp 1.287.000" */
function rupiah(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

/**
 * Angsuran bulanan metode anuitas.
 * @param {number} pokok  plafon kredit
 * @param {number} bungaTahunan  persen per tahun, misal 5
 * @param {number} tahun  tenor
 */
function angsuranBulanan(pokok, bungaTahunan, tahun) {
  const n = tahun * 12;
  if (pokok <= 0 || n <= 0) return 0;
  const i = bungaTahunan / 100 / 12;
  if (i === 0) return pokok / n;
  return (pokok * i) / (1 - Math.pow(1 + i, -n));
}

/** Angsuran terendah sebuah proyek (tenor 20 tahun, bunga subsidi 5%). */
function angsuranTerendah(p) {
  if (p.angsuran20) return p.angsuran20;
  if (!p.harga) return null;
  return angsuranBulanan(p.harga - (p.dp || 0), 5, 20);
}

/* ---------------------------------------------------------- Kartu proyek -- */

function kartuProyek(p) {
  const el = document.createElement('article');
  el.className = 'kartu';
  el.dataset.kategori = p.kategori;
  el.dataset.daerah = p.daerah;
  el.dataset.lokasi = p.lokasi;

  const ang = angsuranTerendah(p);
  el.dataset.angsuran = ang ? Math.round(ang) : '';

  const judulLengkap = p.tahap ? `${p.nama} — ${p.tahap}` : p.nama;
  const lokasiBaris = p.tahap ? `${p.lokasi} · ${p.tahap}` : p.lokasi;

  const blokHarga = ang
    ? `<p class="kartu__ang">Angsuran mulai
         <b>${rupiah(ang)}</b>
         per bulan · tenor 20 tahun</p>`
    : `<p class="kartu__ang" style="color:var(--tinta-500)">${p.klaim}<br>
         <span style="color:var(--tinta-700)">Harga dan angsuran: hubungi pemasaran</span></p>`;

  el.innerHTML = `
    <img class="kartu__gbr" src="img/${p.gbr}" alt="Render rumah tipe ${p.tipe} di perumahan ${judulLengkap}, ${p.lokasi}" loading="lazy" width="1200" height="750">
    <div class="kartu__isi">
      <div class="kartu__atas">
        <span class="kategori">${p.kategori === 'subsidi' ? 'Rumah Subsidi' : 'Rumah Komersil'}</span>
        <span class="cip"><i style="background:var(--status-${p.status})"></i>${TEKS_STATUS[p.status]}</span>
      </div>
      <h3>${p.nama}</h3>
      <div class="kartu__garis" style="background:${p.warna}"></div>
      <p class="kartu__lok">${lokasiBaris}</p>
      <div class="kartu__meta">
        <span>Tipe <b>${p.tipe}</b></span>
        <span><b>${p.kt}</b> KT</span>
        <span><b>${p.km}</b> KM</span>
      </div>
      ${blokHarga}
      <div class="kartu__aksi">
        <a class="tbl tbl--kedua" href="#kontak" data-pilih-proyek="${judulLengkap}">Tanya unit ini</a>
      </div>
    </div>`;
  return el;
}

/* ----------------------------------------------------- Tampilkan proyek -- */

const grid = $('#proyekGrid');
let saringAktif = 'semua';
let saringLokasi = '';
let saringAngsuran = 0;

function cocok(p) {
  if (saringAktif === 'subsidi'   && p.kategori !== 'subsidi')   return false;
  if (saringAktif === 'komersil'  && p.kategori !== 'komersil')  return false;
  if (saringAktif === 'gandus'    && p.daerah   !== 'gandus')    return false;
  if (saringAktif === 'ogan-ilir' && p.daerah   !== 'ogan-ilir') return false;
  if (saringLokasi && !p.lokasi.toLowerCase().includes(saringLokasi.toLowerCase())) return false;
  if (saringAngsuran) {
    const a = angsuranTerendah(p);
    // Proyek yang harganya belum dikonfirmasi tetap ditampilkan, dengan catatan.
    if (a && a > saringAngsuran) return false;
  }
  return true;
}

function gambarProyek() {
  if (!grid) return;
  const hasil = DATA_PROYEK.filter(cocok);
  grid.innerHTML = '';

  if (!hasil.length) {
    grid.innerHTML = `<p class="kosong">Belum ada proyek yang cocok dengan pilihan itu.
      Coba longgarkan penyaringnya, atau <a href="#kontak">tanyakan langsung ke pemasaran</a>.</p>`;
    return;
  }
  hasil.forEach(p => grid.appendChild(kartuProyek(p)));

  if (saringAngsuran) {
    const belum = hasil.filter(p => !angsuranTerendah(p)).length;
    if (belum) {
      const nota = document.createElement('p');
      nota.className = 'kosong';
      nota.style.textAlign = 'left';
      nota.style.padding = '0';
      nota.style.marginTop = '8px';
      nota.textContent = `${belum} proyek di atas harganya belum dikonfirmasi, jadi tetap ditampilkan.`;
      grid.appendChild(nota);
    }
  }
}

/* -------------------------------------------------------- Tombol saring -- */

function pasangSaring() {
  $$('[data-saring]').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('[data-saring]').forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      saringAktif = btn.dataset.saring;
      gambarProyek();
    });
  });

  $$('[data-cari-tipe]').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('[data-cari-tipe]').forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      const t = btn.dataset.cariTipe;
      saringAktif = t;
      $$('[data-saring]').forEach(b =>
        b.setAttribute('aria-pressed', b.dataset.saring === t ? 'true' : 'false'));
      gambarProyek();
    });
  });
}

function pasangPencarian() {
  const form = $('#formCari');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    saringLokasi = $('#cariLokasi').value;
    saringAngsuran = Number($('#cariAngsuran').value) || 0;
    gambarProyek();
    $('#proyek').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ------------------------------------------------------ Simulasi KPR -- */

function pasangSimulasi() {
  const iHarga = $('#simHarga'), iDp = $('#simDp'), iBunga = $('#simBunga');
  if (!iHarga) return;

  let tenor = 20;

  function hitung() {
    const harga = Number(iHarga.value);
    const dpPersen = Number(iDp.value);
    const bunga = Number(iBunga.value);
    const dp = Math.round(harga * dpPersen / 100);
    const plafon = harga - dp;
    const cicil = angsuranBulanan(plafon, bunga, tenor);

    $('#nilaiHarga').textContent = rupiah(harga);
    $('#nilaiDp').firstChild.nodeValue = rupiah(dp) + ' ';
    $('#nilaiDpPersen').textContent = dpPersen.toLocaleString('id-ID') + '%';
    $('#nilaiBunga').textContent = bunga.toLocaleString('id-ID') + '%';

    $('#hasilAngsuran').innerHTML =
      rupiah(cicil) + '<span class="hasil__satuan"> / bulan</span>';
    $('#rinciHarga').textContent  = rupiah(harga);
    $('#rinciDp').textContent     = rupiah(dp);
    $('#rinciPlafon').textContent = rupiah(plafon);
    $('#rinciTenor').textContent  = `${tenor} tahun · ${tenor * 12} angsuran`;
    $('#rinciTotal').textContent  = rupiah(cicil * tenor * 12 + dp);
  }

  [iHarga, iDp, iBunga].forEach(el => el.addEventListener('input', hitung));

  $$('[data-tenor]').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('[data-tenor]').forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      tenor = Number(btn.dataset.tenor);
      hitung();
    });
  });

  hitung();
}

/* ------------------------------------------------------------- Navigasi -- */

function pasangNavigasi() {
  const nav = $('#nav'), tombol = $('#navTombol');
  if (!tombol) return;

  tombol.addEventListener('click', () => {
    const buka = nav.classList.toggle('buka');
    tombol.setAttribute('aria-expanded', String(buka));
    tombol.setAttribute('aria-label', buka ? 'Tutup menu' : 'Buka menu');
  });

  $$('#navMenu a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('buka');
    tombol.setAttribute('aria-expanded', 'false');
  }));

  // Sorot bagian yang sedang dibaca
  const tautan = $$('#navMenu a[href^="#"]');
  const bagian = tautan
    .map(a => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  if ('IntersectionObserver' in window && bagian.length) {
    const pengamat = new IntersectionObserver(entri => {
      entri.forEach(e => {
        if (!e.isIntersecting) return;
        tautan.forEach(a => a.classList.toggle(
          'aktif', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    bagian.forEach(b => pengamat.observe(b));
  }
}

/* --------------------------------------------------------------- Kontak -- */

function pasangKontak() {
  const pilih = $('#fProyek');
  if (pilih) {
    pilih.innerHTML = '<option value="">Belum tahu, mohon dibantu</option>';
    DATA_PROYEK.forEach(p => {
      const o = document.createElement('option');
      o.value = o.textContent = p.tahap ? `${p.nama} — ${p.tahap}` : p.nama;
      pilih.appendChild(o);
    });
  }

  // Tombol "Tanya unit ini" mengisi pilihan proyek lebih dulu
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-pilih-proyek]');
    if (!t || !pilih) return;
    pilih.value = t.dataset.pilihProyek;
  });

  const form = $('#formKontak');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nama = $('#fNama'), wa = $('#fWa');

    if (!nama.value.trim()) { nama.focus(); alert('Nama belum diisi.'); return; }
    if (wa.value.replace(/\D/g, '').length < 9) { wa.focus(); alert('Nomor WhatsApp belum lengkap.'); return; }

    // Belum ada peladen. Sementara, kirimkan lewat WhatsApp kantor pemasaran.
    const pesan =
      `Halo RTD, saya ${nama.value.trim()}.\n` +
      `Saya ingin bertanya tentang ${pilih && pilih.value ? pilih.value : 'rumah subsidi RTD'}.\n` +
      `Nomor saya: ${wa.value.trim()}`;
    window.open('https://wa.me/6282384299234?text=' + encodeURIComponent(pesan), '_blank', 'noopener');

    $('#pesanSukses').hidden = false;
    form.reset();
  });
}


/* ----------------------------------------------------- Bagian tambahan -- */

function gambarPortofolio() {
  const tb = $('#portofolioTubuh');
  if (!tb) return;
  const baris = [];

  DATA_PORTOFOLIO.forEach(p => {
    const nama = p.tahap ? `${p.nama} <span class="redup2">${p.tahap}</span>` : p.nama;
    baris.push(`<tr><td>${nama}</td><td>${p.area}</td><td class="angka-sel">${p.tipe}</td><td class="angka-sel"><b>${p.unit}</b> unit</td></tr>`);
  });
  DATA_RUKO.forEach(p => {
    baris.push(`<tr><td>${p.nama}</td><td>${p.area}</td><td class="angka-sel">${p.tipe}</td><td class="angka-sel"><b>${p.unit}</b> unit</td></tr>`);
  });
  tb.innerHTML = baris.join('');

  const total = DATA_PORTOFOLIO.reduce((a, p) => a + p.unit, 0);
  const el = $('#portofolioTotal');
  if (el) el.textContent = total.toLocaleString('id-ID');
}

function gambarLegalitas() {
  const tb = $('#legalTubuh');
  if (!tb) return;
  tb.innerHTML = DATA_LEGALITAS.map(l =>
    `<tr><th scope="row">${l.label}</th><td><span class="nilai">${l.nilai}</span>` +
    (l.tgl ? `<span class="tgl">${l.tgl}</span>` : '') + `</td></tr>`
  ).join('');
}

function gambarPenghargaan() {
  const ul = $('#penghargaanDaftar');
  if (!ul) return;
  ul.innerHTML = DATA_PENGHARGAAN.map(p =>
    `<li><span class="tahun">${p.tahun || '—'}</span><span>${p.nama}</span></li>`
  ).join('');
}

function gambarTestimoni() {
  const wrap = $('#testimoniDaftar');
  if (!wrap) return;
  wrap.innerHTML = DATA_TESTIMONI.map(t => `
    <figure class="testi">
      <blockquote>${t.isi}</blockquote>
      <figcaption><b>${t.nama}</b><span>${t.jabatan}</span></figcaption>
    </figure>`).join('');
}

function gambarTim() {
  const wrap = $('#timDaftar');
  if (!wrap) return;
  wrap.innerHTML = DATA_TIM.map(t =>
    `<div class="orang"><b>${t.nama}</b><span>${t.jabatan}</span></div>`
  ).join('');
}

/** Jumlahkan unit dari seluruh portofolio untuk pita angka. */
function gambarAngka() {
  const aktif = DATA_PROYEK.reduce((a, p) => a + (p.unit || 0), 0);
  const lama  = DATA_PORTOFOLIO.reduce((a, p) => a + p.unit, 0);
  const el = $('#angkaUnit');
  if (el) el.textContent = (aktif + lama).toLocaleString('id-ID');
  const jml = DATA_PROYEK.length +
              DATA_PORTOFOLIO.reduce((a, p) => a + (p.proyek || 1), 0);
  const ep = $('#angkaProyek');
  if (ep) ep.textContent = String(jml);
}

/* ----------------------------------------------------------------- Mulai -- */

document.addEventListener('DOMContentLoaded', () => {
  gambarProyek();
  gambarPortofolio();
  gambarLegalitas();
  gambarPenghargaan();
  gambarTestimoni();
  gambarTim();
  gambarAngka();
  pasangSaring();
  pasangPencarian();
  pasangSimulasi();
  pasangNavigasi();
  pasangKontak();
  const th = $('#tahun');
  if (th) th.textContent = new Date().getFullYear();
});
