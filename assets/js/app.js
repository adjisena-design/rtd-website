/* ==========================================================================
   Rama Trimitra Development Group
   Tanpa kerangka kerja, tanpa dependensi, tanpa proses build.

   Data situs tidak lagi ditulis di berkas ini. Urutan sumbernya:
     1. ?pratinjau=1 dari konsol  -> isi konsol yang belum diterbitkan (perlu sesi konsol)
     2. Supabase, fungsi situs()   -> versi terakhir yang diterbitkan lewat konsol
     3. data/situs.json            -> salinan di repo, dipakai bila Supabase belum disiapkan
                                      atau tidak terjangkau
   Alamat Supabase ada di assets/js/konfigurasi.js. Bentuk tiap koleksi dijelaskan di
   README dan di konsol/skema.js.
   ========================================================================== */

'use strict';

let DATA_PROYEK = [], DATA_PORTOFOLIO = [], DATA_RUKO = [], DATA_SPEK = [], DATA_LEGALITAS = [], DATA_LEGALITAS_YAYASAN = [],
    DATA_PENGHARGAAN_SOROT = [], DATA_PENGHARGAAN_LAIN = [], DATA_TESTIMONI = [], DATA_TIM = [], DATA_REEL = [],
    DATA_YOUTUBE = { kanal: '', video: [] }, DATA_BERITA = [], DATA_KARIER = [], DATA_YAYASAN_FOTO = [], DATA_GALERI = [],
    DATA_PEMASARAN = [], DATA_BANK = [], DATA_HERO = [], DATA_PROMO = [], KONTAK = {}, ANGKA = {}, KPR = {}, TEKS = {};

const KONFIG = window.RTD_KONFIG || {};
const SUPABASE_SIAP = !!(KONFIG.supabaseUrl && KONFIG.supabaseAnonKey);
/* Kunci anon lama berupa JWT dan boleh ikut di Authorization; kunci baru (sb_publishable_…) cukup di apikey. */
const kepalaSupabase = (token, lain = {}) => ({ apikey: KONFIG.supabaseAnonKey,
  ...(token || /^eyJ/.test(KONFIG.supabaseAnonKey) ? { Authorization: `Bearer ${token || KONFIG.supabaseAnonKey}` } : {}), ...lain });

/** Pasang snapshot ke variabel global yang dipakai fungsi gambar di bawah. */
function pakaiData(d) {
  const p = d.pengaturan || {};
  DATA_PROYEK = d.proyek || [];
  DATA_PORTOFOLIO = (d.portofolio || []).filter(x => x.jenis !== 'ruko');
  DATA_RUKO = (d.portofolio || []).filter(x => x.jenis === 'ruko');
  DATA_SPEK = (d.spesifikasi || []).map(s => [s.baris, s.nilai]);
  DATA_LEGALITAS = (d.legalitas || []).filter(l => l.kelompok !== 'yayasan');
  DATA_LEGALITAS_YAYASAN = (d.legalitas || []).filter(l => l.kelompok === 'yayasan');
  DATA_PENGHARGAAN_SOROT = (d.penghargaan || []).filter(x => x.sorot);
  DATA_PENGHARGAAN_LAIN = (d.penghargaan || []).filter(x => !x.sorot);
  DATA_TESTIMONI = d.testimoni || [];
  DATA_TIM = (d.tim || []).map(t => ({ ...t, bio: t.bio || [], cv: t.cv || [] }));
  DATA_PEMASARAN = d.pemasaran || [];
  DATA_REEL = d.reel || [];
  DATA_YOUTUBE = { kanal: (p.kontak || {}).youtube || '', video: d.youtube || [] };
  DATA_BERITA = d.berita || [];
  DATA_KARIER = d.karier || [];
  DATA_YAYASAN_FOTO = d.yayasan_foto || [];
  DATA_GALERI = (d.galeri || []).filter(a => (a.foto || []).length);
  DATA_BANK = d.bank || [];
  DATA_HERO = d.hero || [];
  const kini = new Date().toISOString().slice(0, 10);
  DATA_PROMO = (d.promo || []).filter(x => (!x.mulai || x.mulai <= kini) && (!x.selesai || x.selesai >= kini));
  KONTAK = p.kontak || {};
  ANGKA = p.angka || {};
  KPR = p.kpr || {};
  TEKS = p.teks || {};
}

const tungguMaks = (ms, janji) => Promise.race([janji, new Promise((_, gagal) => setTimeout(() => gagal(new Error('waktu habis')), ms))]);

function tokenKonsol() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (/^sb-.+-auth-token$/.test(k)) return (JSON.parse(localStorage.getItem(k)) || {}).access_token || null;
    }
  } catch (e) { /* penyimpanan diblokir */ }
  return null;
}

async function rpc(nama, token) {
  const r = await fetch(`${KONFIG.supabaseUrl}/rest/v1/rpc/${nama}`, {
    method: 'POST',
    headers: kepalaSupabase(token, { 'Content-Type': 'application/json' }),
    body: '{}'
  });
  if (!r.ok) throw new Error(`${nama}: ${r.status}`);
  return r.json();
}

/** Mode pratinjau bertahan selama tab terbuka, supaya tautan antarhalaman tetap memakai isi konsol. */
function modePratinjau() {
  const q = new URLSearchParams(location.search).get('pratinjau');
  try {
    if (q === '1') sessionStorage.setItem('rtd-pratinjau', '1');
    if (q === '0') sessionStorage.removeItem('rtd-pratinjau');
    return sessionStorage.getItem('rtd-pratinjau') === '1';
  } catch (e) { return q === '1'; }
}

async function muatData() {
  // Konsol mode demo (tanpa Supabase) menaruh salinannya di tab yang sama.
  if (!SUPABASE_SIAP && modePratinjau()) {
    try {
      const d = JSON.parse(localStorage.getItem('rtd-demo-pratinjau'));
      if (d && d.proyek) { tandaPratinjau(); return d; }
    } catch (e) { /* tidak ada salinan demo */ }
  }
  if (SUPABASE_SIAP && modePratinjau()) {
    const token = tokenKonsol();
    if (token) {
      try {
        const d = await tungguMaks(8000, rpc('konsol_pratinjau', token));
        if (d) { tandaPratinjau(); return d; }
      } catch (e) { console.warn('Pratinjau gagal dimuat, memakai versi terbit.', e); }
    }
  }
  if (SUPABASE_SIAP) {
    try {
      const d = await tungguMaks(4000, rpc('situs'));
      if (d && d.proyek) return d;
    } catch (e) { console.warn('Supabase tidak terjangkau, memakai data/situs.json.', e); }
  }
  const r = await fetch(`${AKAR}data/situs.json`, { cache: 'no-cache' });
  return r.json();
}

function tandaPratinjau() {
  const b = document.createElement('div');
  b.className = 'pita-pratinjau';
  b.setAttribute('role', 'status');
  b.innerHTML = 'Pratinjau isi konsol — belum diterbitkan. <a href="?pratinjau=0">Keluar dari pratinjau</a>';
  document.body.prepend(b);
}

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
  return angsuranBulanan(p.harga - (p.dp || 0), KPR.bunga || 5, 20);
}

const judulLengkap = p => (p.tahap ? `${p.nama} — ${p.tahap}` : p.nama);
const inisial = n => n.replace(/[^A-Za-z. ]/g, '').split(/\s+/).filter(w => w.length > 1).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Prefiks relatif: halaman di dalam /proyek/ perlu "../" */
const AKAR = location.pathname.includes('/proyek/') ? '../' : '';

/** Gambar: alamat penuh (unggahan konsol) dipakai apa adanya; selain itu relatif terhadap img/. */
const gbr = v => (!v ? '' : /^((https?:)?\/\/|data:|blob:)/.test(v) ? v : `${AKAR}img/${v}`);
/** Versi kecil untuk srcset: render hero lama punya -sm.jpg, unggahan konsol punya -sm.webp. */
const gbrKecil = v => (/^hero\/.+\.jpg$/.test(v || '') ? gbr(v.replace(/\.jpg$/, '-sm.jpg'))
  : /\/media\/.+\.webp$/.test(v || '') && !/-sm\.webp$/.test(v) ? v.replace(/\.webp$/, '-sm.webp') : null);
const srcset = v => { const k = gbrKecil(v); return k ? ` srcset="${k} 820w, ${gbr(v)} 1600w" sizes="100vw"` : ''; };

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

/* Slide hero dari data. Slide pertama di HTML tetap dipakai sampai data siap (gambar LCP). */
function gambarHero() {
  const media = $('.hero__media');
  if (!media || !DATA_HERO.length) return;
  const tirai = $('.hero__tirai', media);
  const lama = $$('.hero__slide img', media).map(i => i.getAttribute('src'));
  const baru = DATA_HERO.map(h => gbr(h.gbr));
  if (lama.join() === baru.join()) return;
  $$('.hero__slide', media).forEach(x => x.remove());
  tirai.insertAdjacentHTML('beforebegin', DATA_HERO.map((h, i) => `<div class="hero__slide${i ? '' : ' on'}"><img src="${gbr(h.gbr)}"${srcset(h.gbr)}
    alt="${esc(h.alt || '')}" ${i ? 'loading="lazy"' : 'fetchpriority="high" loading="eager"'} width="1280" height="720"></div>`).join(''));
}

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

const STATUS_PROYEK = { booking: 'Hampir habis', terjual: 'Terjual habis' };

function kartuProyek(p) {
  const ang = angsuranTerendah(p);
  const blokHarga = ang
    ? `<p class="kartu__ang">Angsuran mulai <b>${rupiah(ang)}</b> per bulan · tenor 20 tahun</p>`
    : `<p class="kartu__ang" style="color:var(--tinta-500)">${esc(p.klaim || 'Penawaran terbaru')}<br>
         <span style="color:var(--tinta-700)">Harga dan angsuran: hubungi pemasaran</span></p>`;
  return `
    <a class="kartu" href="${AKAR}proyek/detail.html?id=${p.id}">
      <img class="kartu__gbr" src="${gbr(p.gbr)}" alt="Render rumah tipe ${p.tipe} di perumahan ${esc(judulLengkap(p))}" loading="lazy" width="1200" height="750">
      <div class="kartu__isi">
        <span class="kategori">${p.kategori === 'subsidi' ? 'Rumah Subsidi' : 'Rumah Komersil'}</span>${STATUS_PROYEK[p.status] ? `<span class="kartu__status kartu__status--${p.status}">${STATUS_PROYEK[p.status]}</span>` : ''}
        <h3>${esc(p.nama)}</h3>
        <div class="kartu__garis" style="background:${p.warna}"></div>
        <p class="kartu__lok">${esc(p.lokasi)}${p.tahap ? ' · ' + esc(p.tahap) : ''}${p.unit ? ` · ${p.unit} unit` : ''}</p>
        <div class="kartu__meta">
          <span>Tipe <b>${esc(p.tipe || '—')}</b></span><span><b>${p.kt ?? '—'}</b> KT</span><span><b>${p.km ?? '—'}</b> KM</span>
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
let HARGA_MIN = 150e6, HARGA_RENTANG = 600e6;
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

/* Batas simulasi dari konsol (Pengaturan > Simulasi KPR). */
function aturSimulasi() {
  const iHarga = $('#simHarga'), iDp = $('#simDp'), iBunga = $('#simBunga');
  HARGA_MIN = KPR.harga_min || 150e6;
  HARGA_RENTANG = Math.max(10e6, (KPR.harga_maks || 750e6) - HARGA_MIN);
  const jt = h => (h >= 1e9 ? (h / 1e9).toLocaleString('id-ID') + ' M' : Math.round(h / 1e6) + ' jt');
  const bulat = h => Math.round(h / 50e6) * 50e6;
  const titik = [HARGA_MIN, bulat(HARGA_MIN + HARGA_RENTANG / 6), bulat(HARGA_MIN + HARGA_RENTANG * 5 / 12), HARGA_MIN + HARGA_RENTANG];
  const skala = iHarga.parentElement.querySelector('.skala');
  if (skala) skala.innerHTML = titik.map(h => `<span style="left:${(Math.sqrt((h - HARGA_MIN) / HARGA_RENTANG) * 100).toFixed(1)}%">${jt(h)}</span>`).join('');
  const dpMaks = KPR.dp_maks || 20;
  iDp.max = dpMaks;
  iDp.value = KPR.dp_awal ?? 3.5;
  const sDp = iDp.parentElement.querySelector('.skala');
  if (sDp) sDp.innerHTML = [0, dpMaks / 4, dpMaks / 2, dpMaks].map(v => `<span style="left:${v / dpMaks * 100}%">${v.toLocaleString('id-ID')}%</span>`).join('');
  iBunga.min = KPR.bunga_min ?? 5;
  iBunga.max = KPR.bunga_maks ?? 12;
  iBunga.value = KPR.bunga ?? 5;
  const sB = iBunga.parentElement.querySelector('.skala');
  if (sB) sB.innerHTML = `<span style="left:0">${(+iBunga.min).toLocaleString('id-ID')}%${+iBunga.min === (KPR.bunga ?? 5) ? ' · FLPP' : ''}</span><span style="left:100%">${(+iBunga.max).toLocaleString('id-ID')}%</span>`;
  const tenor = (KPR.tenor && KPR.tenor.length ? KPR.tenor : [10, 15, 20]).map(Number).sort((a, b) => a - b);
  const awal = tenor.includes(+KPR.tenor_awal) ? +KPR.tenor_awal : tenor[tenor.length - 1];
  const grup = $('.pilih-tenor');
  if (grup) grup.innerHTML = tenor.map(t => `<button type="button" data-tenor="${t}" aria-pressed="${t === awal}">${t} tahun</button>`).join('');
  return awal;
}

function pasangSimulasi() {
  const iHarga = $('#simHarga'), iDp = $('#simDp'), iBunga = $('#simBunga');
  if (!iHarga) return;
  let tenor = aturSimulasi(), cicilLama = null;
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
  iHarga.value = geserDariHarga(Math.min(HARGA_MIN + HARGA_RENTANG, Math.max(HARGA_MIN, KPR.harga_awal || 166e6)));
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

/* Angka pemasaran: nilai manual dari konsol menang; bila kosong, unit/proyek/dijual dihitung dari data. */
function gambarAngka() {
  const otomatis = {
    unit: DATA_PROYEK.reduce((a, p) => a + (+p.unit || 0), 0) + DATA_PORTOFOLIO.reduce((a, p) => a + (+p.unit || 0), 0),
    proyek: DATA_PROYEK.length + DATA_PORTOFOLIO.reduce((a, p) => a + (+p.proyek || 1), 0),
    dijual: DATA_PROYEK.length
  };
  $$('[data-angka]').forEach(el => {
    const k = el.dataset.angka, manual = ANGKA[k];
    const nilai = manual !== null && manual !== undefined && manual !== '' ? manual : otomatis[k];
    if (nilai !== undefined) $('b', el).textContent = typeof nilai === 'number' ? nilai.toLocaleString('id-ID') : String(nilai);
    if (ANGKA[k + '_label']) $('span', el).textContent = ANGKA[k + '_label'];
  });
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
  ? `<img class="${cls}" src="${gbr(t.foto)}" alt="" loading="lazy">`
  : `<span class="${cls} foto-kosong" aria-hidden="true">${inisial(t.panggil || t.nama)}</span>`;

function gambarTim() {
  const d = $('#timDireksi'), w = $('#timDaftar');
  if (d) d.innerHTML = DATA_TIM.filter(t => t.direksi).map(t => `
    <a class="orang orang--besar" href="tim.html?id=${t.id}">
      ${fotoTim(t, 'orang__foto')}
      <span class="orang__tx">
        <b>${esc(t.panggil || t.nama)}</b><span>${esc(t.jabatan)}</span>
        <span class="orang__ringkas">${esc((t.bio || [])[0] || '')}</span>
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
const heroKecil = (g, label, judul, lede = '') => `
  <section class="page-hero page-hero--kecil">
    <img class="page-hero__gbr" src="${gbr(g)}"${srcset(g)} alt="" fetchpriority="high">
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
            <ol>${(c.isi || []).map(x => `<li><span>${esc(x.tahun || '')}</span><p>${esc(x.ket || '')}</p></li>`).join('')}</ol></div>`).join('')
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
      <img src="${gbr(r.gbr)}" alt="" loading="lazy" width="540" height="960">
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
    <span class="nkartu__gbr"><img src="${gbr(b.gbr)}" alt="" loading="${utama ? 'eager' : 'lazy'}">${utama ? '<span class="nkartu__lencana">Sorotan</span>' : ''}</span>
    <span class="nkartu__tx">
      <span class="nkartu__meta"><time datetime="${b.tanggal}">${tglPanjang(b.tanggal)}</time><span>${esc(b.kategori)}</span></span>
      <b>${esc(b.judul)}</b><span class="nkartu__ringkas">${esc(b.ringkas)}</span>
      <span class="nkartu__aksi">Baca selengkapnya →</span>
    </span>
  </a>`;

function gambarBerita() {
  const w = $('#beritaDaftar');
  if (!w) return;
  const urut = [...DATA_BERITA].sort((a, b) => String(b.tanggal || '').localeCompare(String(a.tanggal || '')));
  const utama = urut.find(b => b.utama) || urut[0];
  if (!utama) { $('#beritaUtama').innerHTML = '<p class="kosong">Belum ada berita.</p>'; w.innerHTML = ''; return; }
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
  w.innerHTML = `${heroKecil(b.gbr || 'hero/render-2.jpg', `${esc(b.kategori)} · ${tglPanjang(b.tanggal)}`, esc(b.judul))}
    <article class="bagian bagian--rapat"><div class="isi baca">
      <a class="tbl tbl--halus" href="berita.html">← Semua berita</a>
      <p class="baca__ringkas">${esc(b.ringkas)}</p>
      ${(b.isi || []).map(x => `<p>${esc(x)}</p>`).join('')}
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
      ${k.batas ? `<p class="catatan">Lamaran diterima sampai ${tglPanjang(k.batas)}.</p>` : ''}
      ${!k.buka ? '<p class="catatan" style="margin-top:40px">Lowongan ini sudah ditutup.</p>'
        : SUPABASE_SIAP ? formLamaran(k)
        : `<p style="margin-top:40px"><a class="tbl tbl--utama" href="${waLamar(k)}" target="_blank" rel="noopener">Lamar lewat WhatsApp</a></p>`}
    </div></section>`;
  pasangLamaran(k);
}

const formLamaran = k => `
  <h2 id="lamarJudul">Kirim lamaran</h2>
  <form class="form form--lamar" id="formLamar" novalidate aria-labelledby="lamarJudul">
    <div><label for="lNama">Nama lengkap</label><input type="text" id="lNama" required autocomplete="name" maxlength="120"></div>
    <div class="form__dua">
      <div><label for="lWa">Nomor WhatsApp</label><input type="tel" id="lWa" inputmode="numeric" placeholder="0812-0000-0000" required autocomplete="tel" maxlength="20"></div>
      <div><label for="lEmail">Email</label><input type="email" id="lEmail" autocomplete="email" maxlength="160"></div>
    </div>
    <div class="form__dua">
      <div><label for="lKota">Kota domisili</label><input type="text" id="lKota" autocomplete="address-level2" maxlength="80"></div>
      <div><label for="lDidik">Pendidikan terakhir</label><input type="text" id="lDidik" placeholder="mis. S1 Teknik Sipil" maxlength="120"></div>
    </div>
    <div><label for="lPengalaman">Pengalaman singkat</label><textarea id="lPengalaman" maxlength="2000" placeholder="Posisi dan tempat kerja terakhir, lama bekerja"></textarea></div>
    <div><label for="lCv">CV (PDF, paling besar 5 MB)</label><input type="file" id="lCv" accept="application/pdf,.pdf" required>
      <p class="bantu">CV hanya dibaca tim HRD RTD Group.</p></div>
    <div class="lewati" aria-hidden="true"><label for="lSitus">Jangan diisi</label><input type="text" id="lSitus" tabindex="-1" autocomplete="off"></div>
    <button class="tbl tbl--utama" type="submit">Kirim lamaran</button>
    <p class="galat" id="lamarGalat" hidden role="alert"></p>
    <p class="bantu">Lebih mudah lewat ponsel? <a href="${waLamar(k)}" target="_blank" rel="noopener">Lamar lewat WhatsApp</a>.</p>
  </form>
  <div class="sukses-kotak" id="lamarSukses" hidden role="status" tabindex="-1">
    <b>Lamaran Anda sudah kami terima.</b>
    <p>Tim HRD menghubungi kandidat yang sesuai lewat WhatsApp. Terima kasih sudah melamar di RTD Group.</p>
  </div>`;

/* Kirim ke Supabase tanpa pustaka: PostgREST untuk fungsi, Storage untuk berkas CV. */
async function kirimRpc(nama, isi) {
  const r = await fetch(`${KONFIG.supabaseUrl}/rest/v1/rpc/${nama}`, {
    method: 'POST',
    headers: kepalaSupabase(null, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(isi)
  });
  const j = await r.json().catch(() => null);
  if (!r.ok) throw new Error((j && j.message) || 'Gagal mengirim. Coba lagi sebentar lagi.');
  return j;
}

async function unggahCv(berkas) {
  const nama = `masuk/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.pdf`;
  const r = await fetch(`${KONFIG.supabaseUrl}/storage/v1/object/lamaran/${nama}`, {
    method: 'POST',
    headers: kepalaSupabase(null, { 'Content-Type': 'application/pdf', 'x-upsert': 'false' }),
    body: berkas
  });
  if (!r.ok) throw new Error('CV gagal diunggah. Pastikan berkasnya PDF dan tidak lebih dari 5 MB.');
  return nama;
}

function pasangLamaran(k) {
  const f = $('#formLamar');
  if (!f) return;
  const galat = $('#lamarGalat');
  f.addEventListener('submit', async e => {
    e.preventDefault();
    galat.hidden = true;
    const nama = $('#lNama'), wa = $('#lWa'), cv = $('#lCv'), tombol = $('button[type=submit]', f);
    const salah = (el, t) => { galat.textContent = t; galat.hidden = false; el.focus(); };
    if (!nama.value.trim()) return salah(nama, 'Nama belum diisi.');
    if (wa.value.replace(/\D/g, '').length < 9) return salah(wa, 'Nomor WhatsApp belum lengkap.');
    const b = cv.files[0];
    if (!b) return salah(cv, 'Lampirkan CV dalam bentuk PDF.');
    if (b.type !== 'application/pdf' && !/\.pdf$/i.test(b.name)) return salah(cv, 'CV harus berupa berkas PDF.');
    if (b.size > 5 * 1024 * 1024) return salah(cv, 'CV lebih dari 5 MB. Perkecil dulu, lalu coba lagi.');
    tombol.disabled = true; tombol.textContent = 'Mengirim…';
    try {
      const jalur = await unggahCv(b);
      await kirimRpc('kirim_lamaran', { p: {
        lowongan_id: k.id, posisi: k.posisi, nama: nama.value.trim(), wa: wa.value.trim(), email: $('#lEmail').value.trim(),
        kota: $('#lKota').value.trim(), pendidikan: $('#lDidik').value.trim(), pengalaman: $('#lPengalaman').value.trim(),
        cv_path: jalur, cv_nama: b.name, situs_web: $('#lSitus').value } });
      f.hidden = true;
      $('#lamarSukses').hidden = false;
      $('#lamarSukses').focus();
    } catch (err) {
      galat.textContent = err.message; galat.hidden = false;
      tombol.disabled = false; tombol.textContent = 'Kirim lamaran';
    }
  });
}

function gambarGaleriYayasan() {
  const w = $('#yysGaleri');
  if (!w) return;
  const n = Math.max(3, DATA_YAYASAN_FOTO.length);
  w.innerHTML = Array.from({ length: n }, (_, i) => DATA_YAYASAN_FOTO[i]
    ? `<figure><img src="${gbr(DATA_YAYASAN_FOTO[i].gbr)}" alt="${esc(DATA_YAYASAN_FOTO[i].ket || '')}" loading="lazy"><figcaption>${esc(DATA_YAYASAN_FOTO[i].ket || '')}</figcaption></figure>`
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
  p.galeri = p.galeri || []; p.fasilitas = p.fasilitas || []; p.spekBeda = p.spekBeda || {};
  const [lb, lt] = String(p.tipe || '').split('/');
  const ang = angsuranTerendah(p);
  const utama = p.galeri[0] ? gbr(p.galeri[0]) : gbr(p.gbr);

  const kotakGaleri = [];
  for (let i = 0; i < 3; i++) {
    const g = p.galeri[i + 1];
    kotakGaleri.push(g
      ? `<img src="${gbr(g)}" alt=""Foto unit ${esc(judulLengkap(p))}" loading="lazy">`
      : `<div class="pd-kosong">Foto menyusul</div>`);
  }

  wrap.innerHTML = `${heroKecil(p.gbr || 'hero/render-2.jpg', p.kategori === 'subsidi' ? 'Rumah Subsidi' : 'Rumah Komersil', esc(p.nama), esc(p.lokasi) + (p.tahap ? ' · ' + esc(p.tahap) : ''))}
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
              <div class="angka"><b>${esc(lt || '—')}</b><span>Luas tanah m²</span></div>
              <div class="angka"><b>${esc(lb || '—')}</b><span>Luas bangunan m²</span></div>
              <div class="angka"><b>${p.kt}</b><span>Kamar tidur</span></div>
              <div class="angka"><b>${p.unit}</b><span>Unit di proyek</span></div>
            </div>

            <div class="hasil" style="margin-top:32px">
              <span class="hasil__label">${ang ? 'Angsuran mulai' : 'Penawaran saat ini'}</span>
              <div class="hasil__besar">${ang ? rupiah(ang) + '<span class="hasil__satuan"> / bulan</span>' : esc(p.klaim || 'Hubungi pemasaran')}</div>
              ${ang ? `<div class="hasil__rinci">
                  ${p.harga ? `<div class="hasil__baris"><span>Harga jual</span><b>${rupiah(p.harga)}</b></div>` : ''}
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
            ? `<figure class="siteplan"><img src="${gbr(p.siteplan)}" alt=""Siteplan ${esc(judulLengkap(p))}" loading="lazy">
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

const fotoGaleri = (a, n) => gbr(a.foto[n - 1]);
const jumlahFoto = a => a.foto.length;

function gambarAlbum() {
  const w = $('#albumDaftar');
  if (!w) return;
  w.innerHTML = DATA_GALERI.map(a => `
    <a class="album" href="album.html?id=${a.id}">
      <span class="album__gbr"><img src="${fotoGaleri(a, 1)}" alt="" loading="lazy"></span>
      <span class="album__tx">
        <span class="album__meta">${a.waktu ? esc(a.waktu) + ' · ' : ''}${jumlahFoto(a)} foto</span>
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
  a.jumlah = jumlahFoto(a); a.isi = a.isi || [];
  const no = Array.from({ length: a.jumlah }, (_, k) => k + 1);
  const lain = DATA_GALERI.filter(x => x !== a).slice(0, 3);
  w.innerHTML = `
    <section class="page-hero page-hero--kecil">
      <img class="page-hero__gbr" src="${fotoGaleri(a, 1)}" alt="" fetchpriority="high">
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
        <span class="album__gbr"><img src="${fotoGaleri(x, 1)}" alt="" loading="lazy"></span>
        <span class="album__tx"><span class="album__meta">${jumlahFoto(x)} foto</span><b>${esc(x.judul)}</b></span></a>`).join('')}</div>
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
  const mgr = DATA_TIM.find(t => /marketing manager|manajer pemasaran/i.test(t.jabatan || ''));
  const wajah = o => o.foto ? `<img class="pemasaran__inisial" src="${gbr(o.foto)}" alt="" loading="lazy">`
    : `<span class="pemasaran__inisial">${inisial(o.panggil || o.nama)}</span>`;
  const orang = (o, jab, utama = false) => {
    const isi = `${wajah(o)}<span><b>${esc(o.panggil || o.nama)}</b><span>${esc(jab)}</span></span>`;
    const cls = `pemasaran__orang${utama ? ' pemasaran__orang--utama' : ''}`;
    return o.wa ? `<a class="${cls}" href="https://wa.me/${esc(o.wa)}?text=${encodeURIComponent('Halo ' + (o.panggil || o.nama) + ', saya ingin bertanya tentang rumah RTD.')}" target="_blank" rel="noopener">${isi}</a>`
      : `<div class="${cls}">${isi}</div>`;
  };
  w.innerHTML = (mgr ? orang(mgr, mgr.jabatan, true) : '') + DATA_PEMASARAN.map(o => orang(o, o.jabatan || 'Marketing')).join('');
}

/* ------------------------------------------------------ Mitra perbankan -- */

const PERAN_BANK = { kpr: 'Penyalur KPR', konstruksi: 'Pembiayaan konstruksi', keduanya: 'KPR dan pembiayaan konstruksi' };

function gambarBank() {
  $$('[data-bank]').forEach(w => {
    const ringkas = w.dataset.bank === 'ringkas';
    if (!DATA_BANK.length) { w.hidden = true; return; }
    w.innerHTML = DATA_BANK.map(b => {
      const isi = `${b.logo ? `<img src="${gbr(b.logo)}" alt="${esc(b.nama)}" loading="lazy">` : `<b>${esc(b.nama)}</b>`}
        ${ringkas ? '' : `<span>${esc(b.ket || PERAN_BANK[b.peran] || '')}</span>`}`;
      return b.tautan ? `<a class="bank" href="${esc(b.tautan)}" target="_blank" rel="noopener" title="${esc(b.nama)}">${isi}</a>`
        : `<div class="bank" title="${esc(b.nama)}">${isi}</div>`;
    }).join('');
    const kotak = w.closest('[data-bank-bagian]');
    if (kotak) kotak.hidden = false;
  });
}

/* ---------------------------------------------------------------- Promo -- */

function gambarPromo() {
  const w = $('#promoDaftar');
  if (!w) return;
  const bagian = w.closest('section');
  if (!DATA_PROMO.length) { bagian.hidden = true; return; }
  bagian.hidden = false;
  w.innerHTML = DATA_PROMO.map(x => {
    const isi = `<img src="${gbr(x.gbr)}" alt="${esc(x.judul || '')}" loading="lazy">
      ${x.judul || x.ket ? `<span class="promo__tx">${x.judul ? `<b>${esc(x.judul)}</b>` : ''}${x.ket ? `<span>${esc(x.ket)}</span>` : ''}
      ${x.tautan ? `<span class="promo__aksi">${esc(x.label_tombol || 'Lihat promo')} →</span>` : ''}</span>` : ''}`;
    return x.tautan ? `<a class="promo" href="${esc(x.tautan)}"${/^https?:/.test(x.tautan) ? ' target="_blank" rel="noopener"' : ''}>${isi}</a>`
      : `<div class="promo">${isi}</div>`;
  }).join('');
}

/* --------------------------------------------------------- Teks halaman -- */

/* Teks yang diubah lewat konsol. "|" memisahkan bagian judul yang redup; baris baru jadi <br>. */
function terapkanTeks() {
  $$('[data-teks]').forEach(el => {
    const v = TEKS[el.dataset.teks];
    if (typeof v !== 'string' || !v.trim()) return;
    const [utama, ...redup] = v.split('|');
    const baris = t => esc(t.trim()).replace(/\n/g, '<br>');
    el.innerHTML = baris(utama) + (redup.length ? ` <span class="redup">${baris(redup.join('|'))}</span>` : '');
  });
}

/* Nomor WhatsApp, email, Instagram, alamat, dan jam buka yang tertulis di HTML ikut pengaturan kontak. */
function pasangKontak() {
  if (KONTAK.wa) $$('a[href*="wa.me/"]').forEach(a => {
    a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + KONTAK.wa);
    if (/^[\d\s\-+()]{9,}$/.test(a.textContent.trim()) && KONTAK.waTampil) a.textContent = KONTAK.waTampil;
  });
  if (KONTAK.email) $$('a[href^="mailto:"]').forEach(a => {
    a.href = 'mailto:' + KONTAK.email;
    if (a.textContent.includes('@')) a.textContent = KONTAK.email;
  });
  if (KONTAK.ig) $$('a[href*="instagram.com/"]').forEach(a => {
    if (/instagram\.com\/(reel|p)\//.test(a.href)) return;
    a.href = 'https://instagram.com/' + KONTAK.ig;
    a.textContent = a.textContent.replace(/@[\w.]+/, '@' + KONTAK.ig);
  });
  if (KONTAK.youtube) $$('a[href*="youtube.com/channel"], a[href*="youtube.com/@"]').forEach(a => { a.href = KONTAK.youtube; });
  if (KONTAK.maps) $$('a[href*="google.com/maps/search"][href*="Rama+Trimitra"]').forEach(a => { a.href = KONTAK.maps; });
  if (KONTAK.alamat && KONTAK.alamat.length) $$('[data-kontak="alamat"]').forEach(el => { el.innerHTML = KONTAK.alamat.map(esc).join(',<br>'); });
  if (KONTAK.jam) $$('[data-kontak="jam"]').forEach(el => { el.textContent = KONTAK.jam; });
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
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const nama = $('#fNama'), wa = $('#fWa'), pesan = $('#fPesan'), sukses = $('#pesanSukses');
    if (!nama.value.trim()) { nama.focus(); alert('Nama belum diisi.'); return; }
    if (wa.value.replace(/\D/g, '').length < 9) { wa.focus(); alert('Nomor WhatsApp belum lengkap.'); return; }
    const proyek = pilih && pilih.value ? pilih.value : '';
    const teks = `Halo RTD, saya ${nama.value.trim()}.\n` +
      `Saya ingin bertanya tentang ${proyek || 'rumah subsidi RTD'}.\n` +
      (pesan && pesan.value.trim() ? `${pesan.value.trim()}\n` : '') +
      `Nomor saya: ${wa.value.trim()}`;
    const keWa = `https://wa.me/${KONTAK.wa}?text=` + encodeURIComponent(teks);
    // Tanpa Supabase: langsung ke WhatsApp seperti semula.
    if (!SUPABASE_SIAP) {
      window.open(keWa, '_blank', 'noopener');
      sukses.hidden = false;
      form.reset();
      return;
    }
    const tombol = $('button[type=submit]', form);
    tombol.disabled = true;
    try {
      await kirimRpc('kirim_pesan', { p: { nama: nama.value.trim(), wa: wa.value.trim(), proyek, pesan: pesan ? pesan.value.trim() : '',
        halaman: location.pathname.split('/').pop() || 'index.html', situs_web: ($('#fSitus') || {}).value || '' } });
      sukses.innerHTML = `Terima kasih, pesan Anda sudah kami terima. Tim kami menghubungi Anda di hari kerja yang sama.
        <a class="tbl tbl--kedua" href="${keWa}" target="_blank" rel="noopener">Lanjutkan lewat WhatsApp</a>`;
      form.reset();
    } catch (err) {
      sukses.innerHTML = `Pesan belum terkirim (${esc(err.message)}). <a class="tbl tbl--kedua" href="${keWa}" target="_blank" rel="noopener">Kirim lewat WhatsApp</a>`;
    }
    sukses.hidden = false;
    tombol.disabled = false;
  });
}

/* ----------------------------------------------------------------- Mulai -- */

document.addEventListener('DOMContentLoaded', async () => {
  pasangNavigasi();
  try {
    pakaiData(await muatData());
  } catch (e) {
    console.error('Data situs gagal dimuat.', e);
  }
  const jalankan = (nama, f) => { try { f(); } catch (e) { console.error(nama, e); } };
  jalankan('teks', terapkanTeks);
  jalankan('kontak', pasangKontak);
  jalankan('hero', () => { gambarHero(); pasangHero(); });
  jalankan('proyek', () => { gambarProyek('#proyekGrid', +(($('#proyekGrid') || {}).dataset || {}).batas || 0); pasangSaring('#proyekGrid'); });
  jalankan('simulasi', pasangSimulasi);
  jalankan('angka', gambarAngka);
  jalankan('promo', gambarPromo);
  jalankan('bank', gambarBank);
  jalankan('penghargaan', gambarPenghargaan);
  jalankan('testimoni', gambarTestimoni);
  jalankan('tim', gambarTim);
  jalankan('profil', gambarProfilTim);
  jalankan('legalitas', () => { gambarLegalitas('#legalTubuh', DATA_LEGALITAS); gambarLegalitas('#legalYayasanTubuh', DATA_LEGALITAS_YAYASAN); });
  jalankan('portofolio', gambarPortofolio);
  jalankan('spek', () => gambarSpek('#spekTubuh'));
  jalankan('reel', gambarReel);
  jalankan('youtube', gambarYoutube);
  jalankan('berita', gambarBerita);
  jalankan('karier', gambarKarier);
  jalankan('artikel', gambarArtikel);
  jalankan('lowongan', gambarLowongan);
  jalankan('yayasan', gambarGaleriYayasan);
  jalankan('album', gambarAlbum);
  jalankan('isi album', gambarIsiAlbum);
  jalankan('pemasaran', gambarPemasaran);
  jalankan('detail', gambarDetail);
  jalankan('form', pasangForm);
  pasangKepala();
  pasangGeser();
  document.documentElement.classList.add('data-siap');
  // Konten yang dibangun JavaScript menggeser tata letak setelah peramban melompat ke #jangkar; lompat sekali lagi setelah data masuk.
  if (location.hash.length > 1) { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView({ behavior: 'instant' }); }
  const th = $('#tahun');
  if (th) th.textContent = new Date().getFullYear();
});
