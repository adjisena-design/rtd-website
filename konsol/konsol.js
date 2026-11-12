/* ==========================================================================
   Konsol RTD — antarmuka. Data lewat api.js, bentuk isian dari skema.js.
   ========================================================================== */
'use strict';

/* ------------------------------------------------------------ pembantu -- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const jadi = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const salin = o => JSON.parse(JSON.stringify(o ?? null));
const kosong = v => v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length);
const slug = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70).replace(/-$/, '');
const AKAR_SITUS = '../';
const gbrUrl = v => (!v ? '' : /^(https?:|data:|blob:)/.test(v) ? v : AKAR_SITUS + 'img/' + v);
const fmtWaktu = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });
const waktu = t => (t ? fmtWaktu.format(new Date(t)) : '—');
function relatif(t) {
  if (!t) return '—';
  const d = (Date.now() - new Date(t)) / 1000;
  if (d < 60) return 'baru saja';
  if (d < 3600) return Math.floor(d / 60) + ' menit lalu';
  if (d < 86400) return Math.floor(d / 3600) + ' jam lalu';
  if (d < 86400 * 7) return Math.floor(d / 86400) + ' hari lalu';
  return waktu(t);
}
const keWa = n => { const d = String(n || '').replace(/\D/g, ''); return 'https://wa.me/' + (d.startsWith('0') ? '62' + d.slice(1) : d); };
const NAMA_PERAN = { pemilik: 'Pemilik', admin: 'Admin', editor: 'Editor', kontributor: 'Kontributor' };
const KET_PERAN = {
  pemilik: 'Akses penuh, termasuk kode admin.',
  admin: 'Akses penuh kecuali kode admin. Bisa menghapus isi dan memulihkan versi.',
  editor: 'Mengubah isi, membaca pesan dan lamaran, menyetujui draf, menerbitkan.',
  kontributor: 'Mengusulkan perubahan. Usulan Anda ditinjau editor sebelum masuk situs.'
};

function roti(teks, galat = false) {
  const d = document.createElement('div');
  d.textContent = teks;
  if (galat) d.className = 'galat';
  $('#roti').appendChild(d);
  setTimeout(() => d.remove(), galat ? 7000 : 3200);
}

/** Dialog sederhana. tombol: [{label, nilai, kelas}]. Mengembalikan nilai tombol yang dipilih (atau null). */
function dialog({ judul, isi = '', html = '', tombol = [{ label: 'Tutup', nilai: null }], saatBuka }) {
  return new Promise(selesai => {
    const d = jadi(`<dialog class="dialog"><form method="dialog">
      <h2>${esc(judul)}</h2>${isi ? `<p>${esc(isi)}</p>` : ''}${html}
      <div class="dialog__aksi">${tombol.map((t, i) => `<button class="tbl ${t.kelas || ''}" value="${i}">${esc(t.label)}</button>`).join('')}</div>
    </form></dialog>`);
    document.body.appendChild(d);
    d.addEventListener('close', () => {
      const i = d.returnValue;
      const t = tombol[+i];
      const hasil = t && t.nilai !== undefined ? (typeof t.nilai === 'function' ? t.nilai(d) : t.nilai) : null;
      d.remove();
      selesai(i === '' ? null : hasil);
    });
    d.showModal();
    if (saatBuka) saatBuka(d);
  });
}
const yakin = (judul, isi, label = 'Ya, lanjutkan', kelas = '') =>
  dialog({ judul, isi, tombol: [{ label: 'Batal', nilai: false, kelas: 'tbl--kedua' }, { label, nilai: true, kelas }] });

async function panggil(nama, args, { diam = false } = {}) {
  try {
    return await Api.panggil(nama, args);
  } catch (e) {
    if (e.kode === 'ERR_SESI') { roti(e.message, true); setTimeout(() => location.reload(), 1500); }
    else if (!diam) roti(e.message, true);
    throw e;
  }
}

/* -------------------------------------------------------------- keadaan -- */
const K = { staf: null, ringkasan: null, cache: {} };
const bisa = {
  sunting: () => ['pemilik', 'admin', 'editor'].includes(K.staf.peran),
  hapus: () => ['pemilik', 'admin'].includes(K.staf.peran),
  pemilik: () => K.staf.peran === 'pemilik'
};
const namaHal = k => (k.startsWith('p:') ? PENGATURAN[k.slice(2)].judul : KOLEKSI[k] ? KOLEKSI[k].judul : (MENU.find(m => m.k === k) || {}).label || k);

/* ---------------------------------------------------------------- mulai -- */
(async function mulai() {
  const app = $('#aplikasi');
  try {
    await Api.siapkan();
    K.staf = await Api.panggil('konsol_saya');
  } catch (e) {
    app.innerHTML = `<div class="masuk"><div class="masuk__kartu"><h1>Konsol tidak bisa dimuat</h1><p class="masuk__lede">${esc(e.message)}</p>
      <button class="tbl" onclick="location.reload()">Coba lagi</button></div></div>`;
    return;
  }
  if (K.staf) bangunKerangka(); else layarMasuk();
})();

/* --------------------------------------------------------- layar masuk -- */
function layarMasuk() {
  const app = $('#aplikasi');
  app.innerHTML = `<main class="masuk">
    <img class="masuk__latar" src="../img/hero/render-1.jpg" srcset="../img/hero/render-1-sm.jpg 820w, ../img/hero/render-1.jpg 1280w" sizes="100vw" alt="">
    <div class="masuk__tirai"></div>
    <div class="masuk__kartu">
      <img class="masuk__logo" src="../img/rtd-logo-navy.png" alt="Rama Trimitra Development Group">
      <h1>Konsol tim RTD</h1>
      <p class="masuk__lede">Masukkan kode akses yang Anda terima dari admin RTD.</p>
      <form id="formMasuk" novalidate>
        <label for="kode">Kode akses</label>
        <input id="kode" autocomplete="one-time-code" autocapitalize="characters" spellcheck="false" placeholder="RTD-XXXX-XXXX" required>
        <button class="tbl" type="submit">Masuk konsol</button>
        <p class="masuk__galat" id="galatMasuk" role="alert" hidden></p>
      </form>
      ${Api.tersambung ? '' : `<div class="masuk__demo">
        <b>Mode demo — belum tersambung ke Supabase</b>
        Semua perubahan hanya tersimpan di tab ini dan tidak mengubah situs. Coba sebagai:
        <ul>${Object.entries(Demo.KODE).map(([k, p]) => `<li><button type="button" data-kode="${k.slice(0, 3)}-${k.slice(3, 7)}-${k.slice(7)}">${k.slice(0, 3)}-${k.slice(3, 7)}-${k.slice(7)}</button> ${NAMA_PERAN[p]}</li>`).join('')}</ul>
      </div>`}
      <p class="masuk__kaki">Kode hilang? Minta admin membuatkan kode baru. Kode membuka konsol selama 12 jam di peramban ini.</p>
    </div>
  </main>`;
  const f = $('#formMasuk'), galat = $('#galatMasuk'), kode = $('#kode');
  $$('[data-kode]').forEach(b => b.addEventListener('click', () => { kode.value = b.dataset.kode; f.requestSubmit(); }));
  kode.focus();
  f.addEventListener('submit', async e => {
    e.preventDefault();
    galat.hidden = true;
    if (kode.value.replace(/[^a-z0-9]/gi, '').length < 8) { galat.textContent = 'Kode akses belum lengkap.'; galat.hidden = false; return; }
    const tbl = $('button[type=submit]', f);
    tbl.disabled = true; tbl.textContent = 'Memeriksa…';
    try {
      const r = await Api.panggil('konsol_masuk', { p_kode: kode.value });
      if (!r.ok) throw new Error(r.pesan);
      K.staf = r.staf;
      bangunKerangka();
    } catch (err) {
      galat.textContent = err.message; galat.hidden = false;
      tbl.disabled = false; tbl.textContent = 'Masuk konsol';
    }
  });
}

/* ------------------------------------------------------------ kerangka -- */
function bangunKerangka() {
  const st = K.staf;
  const menu = MENU.filter(m => !m.peran || m.peran.includes(st.peran));
  // Buang judul kelompok yang tidak punya butir setelah disaring peran.
  const bersih = menu.filter((m, i) => !m.kelompok || (menu[i + 1] && !menu[i + 1].kelompok));
  $('#aplikasi').innerHTML = `
    <div class="atas-ponsel"><button type="button" id="bukaMenu" aria-label="Buka menu">☰</button><b>Konsol RTD</b></div>
    <div class="kerangka">
      <nav class="sisi" id="sisi" aria-label="Menu konsol">
        <button class="sisi__tutup" type="button" id="tutupMenu" aria-label="Tutup menu">×</button>
        <div class="sisi__kepala"><img src="../img/rtd-logo-krem.png" alt=""><span>Konsol</span></div>
        <div class="sisi__menu">${bersih.map(m => m.kelompok
          ? `<div class="sisi__kelompok">${esc(m.kelompok)}</div>`
          : `<a href="#/${m.k}" data-hal="${m.k}"><span>${esc(m.label || namaHal(m.k))}</span><span class="hitung" data-hitung="${m.k}" hidden></span></a>`).join('')}</div>
        <div class="sisi__kaki"><b>${esc(st.nama)}</b><span class="peran">${NAMA_PERAN[st.peran]}</span>
          <a class="tautan" href="${AKAR_SITUS}" target="_blank" rel="noopener">Buka situs ↗</a>
          <button class="tautan" type="button" id="keluar" style="margin-top:8px">Keluar</button></div>
      </nav>
      <div class="utama">
        <div class="pita${Api.tersambung ? '' : ' pita--demo'}" id="pita" hidden></div>
        <main class="isi-utama" id="hal" tabindex="-1"></main>
      </div>
    </div>`;
  $('#keluar').addEventListener('click', async () => { await Api.panggil('konsol_keluar').catch(() => {}); location.hash = ''; location.reload(); });
  $('#bukaMenu').addEventListener('click', () => $('#sisi').classList.add('buka'));
  $('#tutupMenu').addEventListener('click', () => $('#sisi').classList.remove('buka'));
  addEventListener('hashchange', rute);
  rute();
}

async function segarkanRingkasan() {
  try { K.ringkasan = await panggil('konsol_ringkasan', {}, { diam: true }); } catch (e) { return; }
  const r = K.ringkasan, pita = $('#pita');
  const tandai = (k, n) => { const e = $(`[data-hitung="${k}"]`); if (e) { e.hidden = !n; e.textContent = n || ''; } };
  tandai('pesan', r.pesan_baru); tandai('lamaran', r.lamaran_baru); tandai('draf', r.draf_menunggu);
  if (!pita) return;
  const t = r.terbit;
  const demo = Api.tersambung ? '' : '<span><b>Mode demo.</b> Perubahan hanya ada di tab ini.</span>';
  if (t.beda) {
    pita.hidden = false;
    pita.innerHTML = `${demo}<span><b>${t.perubahan || 'Ada'} perubahan</b> belum terbit di situs.</span>
      <span style="display:flex;gap:8px"><a class="tbl tbl--kedua tbl--kecil" href="${AKAR_SITUS}?pratinjau=1" target="_blank" rel="noopener">Pratinjau</a>
      ${bisa.sunting() ? '<button class="tbl tbl--kecil" type="button" data-terbitkan>Terbitkan</button>' : ''}</span>`;
  } else {
    pita.hidden = !demo;
    pita.innerHTML = demo;
  }
  const tb = $('[data-terbitkan]', pita);
  if (tb) tb.addEventListener('click', terbitkan);
}

async function terbitkan() {
  const catatan = await dialog({
    judul: 'Terbitkan ke situs?',
    html: `<p>Semua perubahan yang tersimpan akan tampil di situs dalam hitungan detik. Versi sebelumnya tetap bisa dipulihkan.</p>
      <div class="bidang" style="margin-top:18px"><label for="catTerbit">Catatan (opsional)</label>
      <input class="masukan" id="catTerbit" placeholder="mis. Harga Green Nature diperbarui"></div>`,
    tombol: [{ label: 'Batal', nilai: null, kelas: 'tbl--kedua' }, { label: 'Terbitkan sekarang', nilai: d => ({ catatan: $('#catTerbit', d).value }) }]
  });
  if (!catatan) return;
  try {
    const r = await panggil('konsol_terbitkan', { p_catatan: catatan.catatan || null });
    roti(`Terbit sebagai versi ${r.versi}.`);
  } catch (e) { /* sudah diberi tahu */ }
  await segarkanRingkasan();
  if (location.hash === '#/ringkasan' || location.hash === '' || location.hash === '#/versi') rute();
}

/* --------------------------------------------------------------- rute -- */
let laciTerbuka = null;
async function rute() {
  const [, hal = 'ringkasan', butir] = location.hash.match(/^#\/([^/]+)\/?(.*)$/) || [];
  $$('.sisi__menu a').forEach(a => { if (a.dataset.hal === hal) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  $('#sisi').classList.remove('buka');
  if (laciTerbuka) laciTerbuka.tutup(true);
  const w = $('#hal');
  w.onclick = w.onchange = null;
  w.innerHTML = '<p style="color:var(--tinta-500)">Memuat…</p>';
  document.title = namaHal(hal) + ' — Konsol RTD';
  segarkanRingkasan();
  try {
    if (hal === 'ringkasan') await halRingkasan(w);
    else if (KOLEKSI[hal]) await halKoleksi(w, hal, decodeURIComponent(butir || ''));
    else if (hal.startsWith('p:') && PENGATURAN[hal.slice(2)]) await halPengaturan(w, hal.slice(2));
    else if (hal === 'teks') await halTeks(w);
    else if (hal === 'pesan') await halPesan(w);
    else if (hal === 'lamaran') await halLamaran(w);
    else if (hal === 'draf') await halDraf(w);
    else if (hal === 'aktivitas') await halAktivitas(w);
    else if (hal === 'versi') await halVersi(w);
    else if (hal === 'kode') await halKode(w);
    else w.innerHTML = '<div class="kosong">Halaman tidak ditemukan.</div>';
  } catch (e) {
    w.innerHTML = `<div class="kosong">${esc(e.message)}</div>`;
  }
  w.focus({ preventScroll: true });
}

/* ----------------------------------------------------------- ringkasan -- */
async function halRingkasan(w) {
  await segarkanRingkasan();
  const r = K.ringkasan, t = r.terbit, st = K.staf;
  const kartu = (k, label, n, sub, sorot) => `<a class="stat${sorot ? ' stat--sorot' : ''}" href="#/${k}"><b>${n ?? 0}</b><span>${esc(label)}</span>${sub ? `<small>${esc(sub)}</small>` : ''}</a>`;
  w.innerHTML = `
    <div class="kepala-hal"><div><h1>Halo, ${esc(st.nama.split(' ')[0])}</h1>
      <p>Anda masuk sebagai ${NAMA_PERAN[st.peran]}. ${KET_PERAN[st.peran]}</p></div></div>
    <section class="kartu terbit${t.beda ? ' terbit--beda' : ''}">
      <div><h2>Terbitkan ke situs</h2>
        <p>${t.beda ? `<b>${t.perubahan || 'Ada'} perubahan tersimpan belum tampil di situs.</b> ` : 'Situs sudah sama dengan isi konsol. '}
        Terakhir terbit ${waktu(t.waktu)}${t.oleh ? ' oleh ' + esc(t.oleh) : ''} · versi ${t.versi ?? '—'}.</p></div>
      <div class="terbit__aksi">
        ${t.beda && bisa.sunting() ? '<button class="tbl tbl--emas" type="button" id="tblTerbit">Terbitkan sekarang</button>' : ''}
        ${t.beda ? `<a class="tautan" href="${AKAR_SITUS}?pratinjau=1" target="_blank" rel="noopener">Pratinjau</a>` : ''}
        <a class="tautan" href="${AKAR_SITUS}?pratinjau=0" target="_blank" rel="noopener">Buka situs</a>
      </div>
    </section>
    ${st.peran === 'kontributor' ? `<section class="kartu" style="margin-top:20px"><h2>Cara kerja kontributor</h2>
      <p style="margin-top:8px;color:var(--tinta-700)">Buka menu mana pun, ubah isinya, lalu tekan <b>Kirim untuk ditinjau</b>. Editor menyetujui atau mengembalikan usulan Anda; statusnya terlihat di <a href="#/draf">Tinjau draf</a>.</p></section>` : ''}
    <div class="statistik">
      ${r.pesan_baru !== null ? kartu('pesan', 'Pesan baru', r.pesan_baru, 'dari formulir situs', r.pesan_baru) : ''}
      ${r.lamaran_baru !== null ? kartu('lamaran', 'Lamaran baru', r.lamaran_baru, 'dengan CV', r.lamaran_baru) : ''}
      ${kartu('draf', st.peran === 'kontributor' ? 'Usulan Anda menunggu' : 'Draf menunggu tinjauan', r.draf_menunggu, null, r.draf_menunggu && st.peran !== 'kontributor')}
    </div>
    <h2 style="font-size:22px;margin:8px 0 0">Isi situs</h2>
    <div class="statistik">${Object.entries(KOLEKSI).map(([k, d]) => {
      const n = r.koleksi[k] || { jumlah: 0, tampil: 0 };
      return kartu(k, d.judul, n.jumlah, n.jumlah !== n.tampil ? `${n.jumlah - n.tampil} disembunyikan` : null);
    }).join('')}</div>`;
  const b = $('#tblTerbit');
  if (b) b.addEventListener('click', terbitkan);
}

/* ------------------------------------------------------------- koleksi -- */
async function muatKoleksi(k) {
  K.cache[k] = await panggil('konsol_konten', { p_koleksi: k });
  return K.cache[k];
}

async function halKoleksi(w, k, bukaId) {
  const def = KOLEKSI[k];
  const baris = await muatKoleksi(k);
  const sunting = bisa.sunting();
  w.innerHTML = `
    <div class="kepala-hal"><div><h1>${esc(def.judul)}</h1>
      <p>${baris.length} ${esc(def.tunggal)}${sunting ? ' · Seret ⋮⋮ untuk mengubah urutan tampil di situs.' : ''}</p></div>
      <button class="tbl" type="button" id="tblBaru">${sunting ? 'Tambah ' : 'Usulkan '}${esc(def.tunggal)}</button></div>
    <div class="alat"><input class="cari" type="search" id="cari" placeholder="Cari ${esc(def.tunggal)}…" aria-label="Cari"></div>
    <div class="daftar" id="daftar"></div>`;
  const daftar = $('#daftar');
  const gambar = (filter = '') => {
    const f = filter.toLowerCase();
    const tampil = baris.filter(b => !f || JSON.stringify(b.data).toLowerCase().includes(f) || b.id.includes(f));
    daftar.innerHTML = tampil.length ? tampil.map(b => {
      const r = def.ringkas({ id: b.id, ...b.data });
      const gb = r.gbr ? `style="background-image:url('${esc(gbrUrl(r.gbr))}')"` : '';
      const awal = (r.judul || '?').replace(/[^A-Za-z ]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase();
      return `<div class="butir" data-id="${esc(b.id)}" ${sunting && !f ? 'draggable="true"' : ''}>
        ${sunting && !f ? '<button class="pegangan" type="button" aria-label="Pindahkan (panah atas/bawah)" title="Seret untuk mengurutkan">⋮⋮</button>' : ''}
        ${'gbr' in r || r.bulat ? `<div class="butir__gbr${r.bulat ? ' butir__gbr--bulat' : ''}${r.tegak ? ' butir__gbr--tegak' : ''}${r.logo ? ' butir__gbr--logo' : ''}" ${gb}>${r.gbr ? '' : esc(awal)}</div>` : ''}
        <div class="butir__tx" data-buka><b>${esc(r.judul || b.id)}</b>${r.sub ? `<span>${esc(r.sub)}</span>` : ''}</div>
        <div class="butir__aksi">
          ${r.lencana ? `<span class="lencana lencana--amber">${esc(r.lencana)}</span>` : ''}
          <button class="lencana ${b.tampil ? 'lencana--tampil' : 'lencana--sembunyi'}" type="button" data-tampil ${sunting ? '' : 'disabled'}
            title="${sunting ? 'Klik untuk ' + (b.tampil ? 'menyembunyikan' : 'menampilkan') : ''}">${b.tampil ? 'Tampil' : 'Disembunyikan'}</button>
          <button class="ikon-tbl" type="button" data-buka aria-label="Sunting">✎</button>
        </div></div>`;
    }).join('') : `<div class="kosong">${f ? 'Tidak ada yang cocok.' : `Belum ada ${esc(def.tunggal)}.`}</div>`;
  };
  gambar();
  $('#cari').addEventListener('input', e => gambar(e.target.value.trim()));
  $('#tblBaru').addEventListener('click', () => bukaEditor({ k, baris: null }));
  daftar.addEventListener('click', async e => {
    const el = e.target.closest('.butir');
    if (!el) return;
    const b = baris.find(x => x.id === el.dataset.id);
    if (e.target.closest('[data-tampil]')) {
      if (!sunting) return;
      await panggil('konsol_konten_tampil', { p_koleksi: k, p_id: b.id, p_tampil: !b.tampil });
      b.tampil = !b.tampil;
      roti(b.tampil ? 'Ditampilkan setelah terbit berikutnya.' : 'Disembunyikan setelah terbit berikutnya.');
      gambar($('#cari').value.trim()); segarkanRingkasan();
    } else if (e.target.closest('[data-buka]')) {
      location.hash = `#/${k}/${encodeURIComponent(b.id)}`;
    }
  });
  if (sunting) pasangUrut(daftar, '.butir', async urut => {
    const pindah = urut.map(id => baris.find(b => b.id === id));
    baris.splice(0, baris.length, ...pindah);
    await panggil('konsol_konten_urut', { p_koleksi: k, p_id: urut });
    roti('Urutan disimpan.'); segarkanRingkasan();
  });
  if (bukaId) {
    const b = baris.find(x => x.id === bukaId);
    if (b) bukaEditor({ k, baris: b });
    else if (bukaId === 'baru') bukaEditor({ k, baris: null });
  }
}

/** Urutkan dengan seret (tetikus) atau panah atas/bawah pada pegangan (papan ketik). */
function pasangUrut(wadah, sel, simpan) {
  let seret = null;
  const urutan = () => $$(sel, wadah).map(x => x.dataset.id);
  wadah.addEventListener('dragstart', e => { seret = e.target.closest(sel); if (seret) { seret.classList.add('seret'); e.dataTransfer.effectAllowed = 'move'; } });
  wadah.addEventListener('dragover', e => {
    const t = e.target.closest(sel);
    if (!seret || !t || t === seret) return;
    e.preventDefault();
    $$(sel + '.target', wadah).forEach(x => x.classList.remove('target'));
    t.classList.add('target');
    const r = t.getBoundingClientRect();
    t[(e.clientY - r.top) > r.height / 2 ? 'after' : 'before'](seret);
  });
  wadah.addEventListener('dragend', () => {
    if (!seret) return;
    seret.classList.remove('seret'); $$(sel + '.target', wadah).forEach(x => x.classList.remove('target'));
    seret = null; simpan(urutan());
  });
  wadah.addEventListener('keydown', e => {
    if (!e.target.classList.contains('pegangan') || !['ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const b = e.target.closest(sel);
    const tujuan = e.key === 'ArrowUp' ? b.previousElementSibling : b.nextElementSibling;
    if (!tujuan || !tujuan.matches(sel)) return;
    tujuan[e.key === 'ArrowUp' ? 'before' : 'after'](b);
    e.target.focus();
    simpan(urutan());
  });
}

/* ------------------------------------------------------------ penyunting -- */
/**
 * Buka laci penyunting.
 * k: kunci koleksi. baris: {id, tampil, data} atau null (baru).
 * draf: bila membuka draf (tinjau editor atau ubah usulan kontributor).
 */
function bukaEditor({ k, baris, draf = null, mode = null }) {
  const def = KOLEKSI[k];
  const baru = !baris;
  const sunting = bisa.sunting();
  const modeTinjau = mode === 'tinjau';                     // editor menyunting draf lalu menyetujui
  const modeUsul = !sunting || mode === 'ubahUsul';          // kontributor
  const awal = baris ? salin(baris.data) : (typeof def.baru === 'function' ? def.baru() : salin(def.baru || {}));
  const idAwal = baris ? baris.id : '';
  const latar = jadi('<div class="laci-latar"></div>');
  const L = jadi(`<section class="laci" role="dialog" aria-modal="true" aria-labelledby="laciJudul">
    <header class="laci__kepala"><div><small>${modeTinjau ? 'Tinjau draf · ' : ''}${baru ? 'Baru' : 'Sunting'} ${esc(def.tunggal)}</small>
      <h2 id="laciJudul">${esc(baru ? def.judul + ' baru' : def.ringkas({ id: idAwal, ...awal }).judul)}</h2></div>
      <div class="laci__kepala-aksi">${!baru && def.halaman ? `<a class="tautan" href="${AKAR_SITUS}${def.halaman(idAwal)}${'&pratinjau=1'}" target="_blank" rel="noopener">Lihat di situs</a>` : ''}
      <button class="tbl tbl--kedua tbl--kecil" type="button" data-tutup>Tutup</button></div></header>
    <div class="laci__isi"></div>
    <footer class="laci__kaki"></footer></section>`);
  const form = buatForm(def.bagian, awal, { k, idAwal, def, baru });
  $('.laci__isi', L).appendChild(form.el);
  const kaki = $('.laci__kaki', L);
  if (modeTinjau) {
    kaki.innerHTML = `<button class="tbl" type="button" data-simpan>Simpan dan setujui</button><button class="tbl tbl--kedua" type="button" data-tutup>Batal</button>`;
  } else if (modeUsul) {
    kaki.innerHTML = `<input class="laci__catatan" placeholder="Catatan untuk editor (opsional)" value="${esc(draf ? draf.catatan || '' : '')}" data-catatan>
      <button class="tbl" type="button" data-simpan>${draf ? 'Kirim ulang' : 'Kirim untuk ditinjau'}</button><button class="tbl tbl--kedua" type="button" data-tutup>Batal</button>`;
  } else {
    kaki.innerHTML = `<button class="tbl" type="button" data-simpan>Simpan</button><button class="tbl tbl--kedua" type="button" data-tutup>Batal</button>
      ${!baru && bisa.hapus() ? '<button class="tbl tbl--bahaya dorong" type="button" data-hapus>Hapus</button>' : ''}`;
  }
  document.body.append(latar, L);
  document.body.style.overflow = 'hidden';
  const fokusLama = document.activeElement;
  setTimeout(() => { const f = $('input, textarea, select', form.el); if (f) f.focus(); }, 60);

  let berubah = false;
  form.el.addEventListener('input', () => { berubah = true; });
  form.el.addEventListener('change', () => { berubah = true; });

  const tutup = async (paksa = false) => {
    if (!paksa && berubah && !await yakin('Tutup tanpa menyimpan?', 'Perubahan di formulir ini akan hilang.', 'Tutup', 'tbl--bahaya')) return;
    L.remove(); latar.remove(); document.body.style.overflow = '';
    laciTerbuka = null;
    if (!paksa && location.hash.split('/').length > 2) history.replaceState(null, '', `#/${location.hash.split('/')[1]}`);
    if (fokusLama && fokusLama.focus) fokusLama.focus();
  };
  laciTerbuka = { tutup };
  $$('[data-tutup]', L).forEach(b => b.addEventListener('click', () => tutup()));
  latar.addEventListener('click', () => tutup());
  L.addEventListener('keydown', e => { if (e.key === 'Escape' && !document.querySelector('dialog[open]')) tutup(); });

  $('[data-simpan]', L).addEventListener('click', async e => {
    const hasil = form.periksa();
    if (!hasil) { roti('Periksa isian yang ditandai merah.', true); return; }
    const isi = { id: hasil.id, tampil: baris ? baris.tampil : true, data: hasil.data };
    const tbl = e.currentTarget; tbl.disabled = true;
    try {
      if (modeTinjau) {
        await panggil('konsol_draf_tinjau', { p_id: draf.id, p_keputusan: 'setujui', p_catatan: null, p_data: isi });
        roti('Draf disetujui dan disimpan.');
      } else if (modeUsul) {
        await panggil('konsol_draf_kirim', { p_koleksi: k, p_butir_id: idAwal || null, p_data: isi, p_catatan: $('[data-catatan]', L).value || null, p_draf: draf ? draf.id : null });
        roti('Usulan terkirim ke editor.');
      } else {
        const r = await panggil('konsol_konten_simpan', { p_koleksi: k, p_id_lama: idAwal || null, p: isi });
        roti(baru ? 'Tersimpan. Terbitkan agar tampil di situs.' : 'Perubahan tersimpan.');
        if (idAwal && r.id !== idAwal) roti('Alamat web berubah: tautan lama ke butir ini tidak berlaku lagi.');
      }
      berubah = false;
      await tutup(true);
      if (location.hash.split('/').length > 2) history.replaceState(null, '', `#/${location.hash.split('/')[1]}`);
      rute();
    } catch (err) { tbl.disabled = false; }
  });
  const th = $('[data-hapus]', L);
  if (th) th.addEventListener('click', async () => {
    if (!await yakin(`Hapus ${def.tunggal} ini?`, 'Butir hilang dari konsol dan dari situs pada terbit berikutnya. Untuk menyembunyikan sementara, pakai tombol Tampil/Disembunyikan.', 'Hapus', 'tbl--bahaya')) return;
    await panggil('konsol_konten_hapus', { p_koleksi: k, p_id: idAwal });
    roti('Dihapus.');
    await tutup(true);
    history.replaceState(null, '', `#/${k}`);
    rute();
  });
}

/* ---------------------------------------------------------- formulir -- */
/**
 * Bangun formulir dari bagian skema.
 * ctx: { k, idAwal, def, baru } untuk koleksi; null untuk pengaturan.
 * periksa() mengembalikan { id, data } atau null bila ada isian wajib yang kosong.
 */
function buatForm(bagian, data, ctx = null) {
  const el = jadi('<div class="form-konsol"></div>');
  const bidang = [];
  const asli = salin(data) || {};

  // Alamat web / id
  let idBidang = null;
  if (ctx && (ctx.def.alamatWeb || ctx.def.idManual)) {
    const manual = ctx.def.idManual;
    const f = jadi(`<fieldset class="bagian-form"><div class="grid-form"><div class="bidang">
      <label for="f-id">${manual ? 'ID video YouTube' : 'Alamat web'} <span class="wajib">*</span></label>
      <div class="baris-id"><input class="masukan masukan--mono" id="f-id" value="${esc(ctx.idAwal)}" ${manual ? 'placeholder="Tempel tautan YouTube atau ID-nya"' : ''}>
      ${manual ? '' : '<button class="tautan" type="button" data-dari-judul>Buat dari judul</button>'}</div>
      <p class="bantu">${manual ? 'Bagian setelah watch?v= di tautan video.' : `Dipakai di tautan halaman, mis. …?id=<b>${esc(ctx.idAwal || 'nama-perumahan')}</b>. Mengubahnya membuat tautan lama tidak berlaku.`}</p>
    </div></div></fieldset>`);
    el.appendChild(f);
    const inp = $('#f-id', f);
    let disentuh = !ctx.baru;
    inp.addEventListener('input', () => { disentuh = true; });
    if (manual) inp.addEventListener('change', () => {
      const m = inp.value.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
      if (m) inp.value = m[1];
    });
    const dariJudul = () => { const sumber = el.querySelector(`[data-k="${ctx.def.idDari}"]`); if (sumber) inp.value = slug(sumber.value); };
    const dj = $('[data-dari-judul]', f);
    if (dj) dj.addEventListener('click', () => { dariJudul(); disentuh = true; });
    el.addEventListener('input', e => { if (!disentuh && ctx.baru && e.target.dataset && e.target.dataset.k === ctx.def.idDari) inp.value = slug(e.target.value); });
    idBidang = { ambil: () => inp.value.trim(), el: f, inp };
  }

  for (const b of bagian) {
    const fs = jadi(`<fieldset class="bagian-form">${b.judul ? `<legend>${esc(b.judul)}</legend>` : ''}<div class="grid-form"></div></fieldset>`);
    const grid = $('.grid-form', fs);
    for (const d of b.bidang) {
      const r = BIDANG[d.jenis](d, asli[d.k], ctx);
      const wadah = jadi(`<div class="bidang${d.lebar === 'setengah' ? ' bidang--setengah' : ''}"></div>`);
      const idEl = 'f-' + d.k;
      wadah.innerHTML = `<${r.tanpaLabelFor ? 'span class="label"' : `label for="${idEl}"`}>${esc(d.label)}${d.wajib ? ' <span class="wajib">*</span>' : ''}</${r.tanpaLabelFor ? 'span' : 'label'}>`;
      wadah.appendChild(r.el);
      if (d.bantu) wadah.appendChild(jadi(`<p class="bantu">${esc(d.bantu)}</p>`));
      grid.appendChild(wadah);
      bidang.push({ d, r, wadah });
    }
    el.appendChild(fs);
  }

  function periksa() {
    let ok = true;
    $$('.bidang__galat', el).forEach(x => x.remove());
    $$('.bidang--galat', el).forEach(x => x.classList.remove('bidang--galat'));
    const hasil = salin(asli);
    for (const { d, r, wadah } of bidang) {
      const v = r.ambil();
      if (d.wajib && kosong(v)) {
        ok = false; wadah.classList.add('bidang--galat');
        wadah.appendChild(jadi('<p class="bidang__galat">Wajib diisi.</p>'));
      }
      if (r.galat) { ok = false; wadah.classList.add('bidang--galat'); wadah.appendChild(jadi(`<p class="bidang__galat">${esc(r.galat)}</p>`)); }
      hasil[d.k] = v;
    }
    let id = ctx ? ctx.idAwal : null;
    if (idBidang) {
      id = idBidang.ambil();
      if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,119}$/.test(id)) {
        ok = false; idBidang.el.querySelector('.bidang').classList.add('bidang--galat');
        idBidang.el.querySelector('.bidang').appendChild(jadi('<p class="bidang__galat">Huruf kecil, angka, dan tanda hubung saja.</p>'));
      }
    } else if (ctx && ctx.baru) {
      id = (slug(hasil[ctx.def.idDari]) || ctx.k).slice(0, 48) + '-' + Api.acak().slice(0, 4);
    }
    if (!ok) { const g = $('.bidang--galat', el); if (g) g.scrollIntoView({ behavior: 'smooth', block: 'center' }); return null; }
    return { id, data: hasil };
  }
  return { el, periksa };
}

/* --------------------------------------------------------- jenis bidang -- */
const angkaDari = v => { const s = String(v ?? '').replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'); return s === '' || isNaN(+s) ? null : +s; };

const BIDANG = {
  teks(d, v) {
    const saran = d.saran ? `<datalist id="dl-${d.k}">${d.saran.map(s => `<option value="${esc(s)}">`).join('')}</datalist>` : '';
    const el = jadi(`<div>${saran}<input class="masukan" id="f-${d.k}" data-k="${d.k}" value="${esc(v ?? '')}" ${d.saran ? `list="dl-${d.k}"` : ''} ${d.otomatis ? 'data-otomatis="' + d.otomatis + '"' : ''}></div>`);
    return { el, ambil: () => { const x = $('input', el).value.trim(); return x === '' ? null : x; } };
  },
  panjang(d, v) {
    const el = jadi(`<textarea class="masukan" id="f-${d.k}" data-k="${d.k}">${esc(v ?? '')}</textarea>`);
    return { el, ambil: () => el.value.trim() || null };
  },
  paragraf(d, v) {
    const el = jadi(`<textarea class="masukan masukan--tinggi" id="f-${d.k}" data-k="${d.k}">${esc((v || []).join('\n\n'))}</textarea>`);
    return { el, ambil: () => el.value.split(/\n\s*\n/).map(s => s.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean) };
  },
  daftar(d, v) {
    const el = jadi(`<textarea class="masukan" id="f-${d.k}" data-k="${d.k}" rows="5">${esc((v || []).join('\n'))}</textarea>`);
    return { el, ambil: () => { const xs = el.value.split('\n').map(s => s.trim()).filter(Boolean); return d.angka ? xs.map(Number).filter(n => !isNaN(n)) : xs; } };
  },
  angka(d, v) {
    const el = jadi(`<input class="masukan" type="number" inputmode="decimal" id="f-${d.k}" data-k="${d.k}" value="${v ?? ''}" step="${d.langkah || 1}">`);
    return { el, ambil: () => (el.value === '' ? null : +el.value) };
  },
  rupiah(d, v) {
    const fmt = n => (n === null || n === undefined || n === '' ? '' : Number(n).toLocaleString('id-ID'));
    const el = jadi(`<div class="rupiah"><span>Rp</span><input class="masukan" inputmode="numeric" id="f-${d.k}" data-k="${d.k}" value="${fmt(v)}"></div>`);
    const inp = $('input', el);
    inp.addEventListener('blur', () => { inp.value = fmt(angkaDari(inp.value)); });
    return { el, ambil: () => angkaDari(inp.value) };
  },
  pilihan(d, v) {
    const el = jadi(`<select class="masukan" id="f-${d.k}" data-k="${d.k}">${d.opsi.map(([n, l]) => `<option value="${esc(n)}"${n === v ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>`);
    return { el, ambil: () => el.value };
  },
  centang(d, v) {
    const el = jadi(`<label class="centang"><input type="checkbox" id="f-${d.k}" ${v ? 'checked' : ''}> Ya</label>`);
    return { el, ambil: () => $('input', el).checked, tanpaLabelFor: false };
  },
  tanggal(d, v) {
    const el = jadi(`<input class="masukan" type="date" id="f-${d.k}" data-k="${d.k}" value="${esc(v || '')}">`);
    return { el, ambil: () => el.value || null };
  },
  tautan(d, v) {
    const r = { el: jadi(`<input class="masukan" type="url" id="f-${d.k}" data-k="${d.k}" value="${esc(v || '')}" placeholder="https://…">`) };
    r.ambil = () => {
      let x = r.el.value.trim();
      if (/^www\./i.test(x)) x = r.el.value = 'https://' + x;
      r.galat = /\s/.test(x) ? 'Tautan tidak boleh berisi spasi.' : null;
      return x || null;
    };
    return r;
  },
  warna(d, v) {
    const el = jadi(`<div class="warna-pilih" role="radiogroup">${WARNA_PROYEK.map(([n, l, hex], i) =>
      `<input type="radio" name="w-${d.k}" id="w-${d.k}-${i}" value="${n}" ${n === v ? 'checked' : ''}><label for="w-${d.k}-${i}"><i style="background:${hex}"></i>${l}</label>`).join('')}</div>`);
    return { el, ambil: () => (($('input:checked', el) || {}).value || v || null), tanpaLabelFor: true };
  },
  peta(d, v) {
    v = v || {};
    const el = jadi(`<div><div class="peta-baris">
      <input class="masukan" id="f-${d.k}" placeholder="Lintang, mis. -2.89" value="${v.lat ?? ''}" data-p="lat" inputmode="decimal">
      <input class="masukan" placeholder="Bujur, mis. 104.66" value="${v.lng ?? ''}" data-p="lng" inputmode="decimal">
      <input class="masukan masukan--mono" placeholder="Place ID (opsional)" value="${esc(v.id || '')}" data-p="id"></div>
      <p class="bantu">Tempel tautan Google Maps di kolom pertama untuk mengisi lintang dan bujur sekaligus. Kosongkan semua untuk menyembunyikan peta.</p></div>`);
    const lat = $('[data-p=lat]', el), lng = $('[data-p=lng]', el), pid = $('[data-p=id]', el);
    lat.addEventListener('change', () => {
      const m = lat.value.match(/@?(-?\d+\.\d+),\s*(-?\d+\.\d+)/) || lat.value.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (m) { lat.value = m[1]; lng.value = m[2]; }
      const p = lat.value.match(/(ChIJ[\w-]+)/);
      if (p) pid.value = p[1];
    });
    return { el, ambil: () => (lat.value && lng.value ? { lat: +lat.value, lng: +lng.value, id: pid.value.trim() || null } : null), tanpaLabelFor: false };
  },
  gambar(d, v, ctx) {
    let nilai = v || null;
    const el = jadi(`<div class="gbr-bidang">
      <div class="gbr-pratinjau${d.logo ? ' gbr-pratinjau--logo' : ''}" tabindex="0" role="button" aria-label="Unggah ${esc(d.label)}">Klik atau seret gambar ke sini</div>
      <div class="gbr-aksi">
        <button class="tbl tbl--kedua tbl--kecil" type="button" data-unggah>Unggah gambar</button>
        <button class="tbl tbl--kedua tbl--kecil" type="button" data-tempel>Pakai alamat gambar</button>
        <button class="tbl tbl--bahaya tbl--kecil" type="button" data-hapus-gbr>Kosongkan</button>
        <input type="file" accept="image/*" hidden id="f-${d.k}">
      </div></div>`);
    const pr = $('.gbr-pratinjau', el), file = $('input[type=file]', el);
    const segar = () => {
      pr.classList.toggle('ada', !!nilai);
      pr.style.backgroundImage = nilai ? `url("${gbrUrl(nilai)}")` : '';
      pr.title = nilai || '';
      $('[data-hapus-gbr]', el).hidden = !nilai;
    };
    segar();
    const terima = async berkas => {
      if (!berkas || !berkas.type.startsWith('image/')) { roti('Pilih berkas gambar (JPG, PNG, atau WebP).', true); return; }
      pr.classList.add('memuat');
      try {
        nilai = await unggahGambar(berkas, { maks: d.maks || 1600, logo: d.logo, map: ctx ? ctx.k : 'pengaturan', nama: (ctx && ctx.idAwal) || d.k });
        segar();
        el.dispatchEvent(new Event('change', { bubbles: true }));
      } catch (e) { roti(e.message, true); }
      pr.classList.remove('memuat');
    };
    $('[data-unggah]', el).addEventListener('click', () => file.click());
    pr.addEventListener('click', () => file.click());
    pr.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); file.click(); } });
    file.addEventListener('change', () => { terima(file.files[0]); file.value = ''; });
    pr.addEventListener('dragover', e => { e.preventDefault(); pr.classList.add('seret-atas'); });
    pr.addEventListener('dragleave', () => pr.classList.remove('seret-atas'));
    pr.addEventListener('drop', e => { e.preventDefault(); pr.classList.remove('seret-atas'); terima(e.dataTransfer.files[0]); });
    $('[data-hapus-gbr]', el).addEventListener('click', () => { nilai = null; segar(); el.dispatchEvent(new Event('change', { bubbles: true })); });
    $('[data-tempel]', el).addEventListener('click', async () => {
      const r = await dialog({ judul: 'Alamat gambar', html: `<p>Alamat lengkap (https://…) atau jalur di folder img/ situs, mis. <code>hero/render-2.jpg</code>.</p>
        <input class="masukan" id="alamatGbr" style="margin-top:14px" value="${esc(nilai || '')}">`,
        tombol: [{ label: 'Batal', nilai: null, kelas: 'tbl--kedua' }, { label: 'Pakai', nilai: dl => $('#alamatGbr', dl).value.trim() }] });
      if (r !== null) { nilai = r || null; segar(); el.dispatchEvent(new Event('change', { bubbles: true })); }
    });
    return { el, ambil: () => nilai, tanpaLabelFor: true };
  },
  galeri(d, v, ctx) {
    const isi = (v || []).slice();
    const el = jadi(`<div><div class="galeri-bidang"></div><input type="file" accept="image/*" multiple hidden><p class="bantu" data-status></p></div>`);
    const grid = $('.galeri-bidang', el), file = $('input', el), status = $('[data-status]', el);
    const segar = () => {
      grid.innerHTML = isi.map((g, i) => `<div class="galeri-butir" draggable="true" data-id="${i}" style="background-image:url('${esc(gbrUrl(g))}')" title="${esc(g)}">
        <span class="galeri-butir__no">${i + 1}${i === 0 ? ' · utama' : ''}</span>
        <span class="galeri-butir__aksi"><button type="button" data-geser="-1" aria-label="Geser ke kiri">←</button><button type="button" data-geser="1" aria-label="Geser ke kanan">→</button><button type="button" data-buang aria-label="Buang foto">✕</button></span>
      </div>`).join('') + '<button type="button" class="galeri-tambah" data-tambah>+ Tambah foto<br><small>atau seret ke sini</small></button>';
    };
    segar();
    const ubah = () => { segar(); el.dispatchEvent(new Event('change', { bubbles: true })); };
    const terima = async files => {
      const fs = [...files].filter(f => f.type.startsWith('image/'));
      for (let i = 0; i < fs.length; i++) {
        status.textContent = `Mengunggah ${i + 1} dari ${fs.length}…`;
        try { isi.push(await unggahGambar(fs[i], { maks: d.maks || 1600, map: ctx ? ctx.k : 'galeri', nama: (ctx && ctx.idAwal) || 'foto' })); ubah(); }
        catch (e) { roti(e.message, true); }
      }
      status.textContent = '';
    };
    grid.addEventListener('click', e => {
      const b = e.target.closest('.galeri-butir');
      if (e.target.closest('[data-tambah]')) return file.click();
      if (!b) return;
      const i = +b.dataset.id;
      if (e.target.closest('[data-buang]')) { isi.splice(i, 1); ubah(); }
      const g = e.target.closest('[data-geser]');
      if (g) { const j = i + +g.dataset.geser; if (j >= 0 && j < isi.length) { [isi[i], isi[j]] = [isi[j], isi[i]]; ubah(); } }
    });
    file.addEventListener('change', () => { terima(file.files); file.value = ''; });
    let seret = null;
    grid.addEventListener('dragstart', e => { seret = e.target.closest('.galeri-butir'); });
    grid.addEventListener('dragover', e => { e.preventDefault(); const t = e.target.closest('.galeri-butir, .galeri-tambah'); $$('.target', grid).forEach(x => x.classList.remove('target')); if (t && seret) t.classList.add('target'); if (!seret) $('[data-tambah]', grid).classList.add('seret-atas'); });
    grid.addEventListener('drop', e => {
      e.preventDefault();
      $$('.target', grid).forEach(x => x.classList.remove('target'));
      if (!seret) return terima(e.dataTransfer.files);
      const t = e.target.closest('.galeri-butir');
      if (t && t !== seret) { const [x] = isi.splice(+seret.dataset.id, 1); isi.splice(+t.dataset.id, 0, x); ubah(); }
      seret = null;
    });
    grid.addEventListener('dragend', () => { seret = null; });
    return { el, ambil: () => isi.slice(), tanpaLabelFor: true };
  },
  cv(d, v) {
    const isi = salin(v || []);
    const el = jadi('<div><div data-kelompok></div><button class="tbl tbl--kedua tbl--kecil" type="button" data-tambah-kelompok>+ Tambah kelompok</button></div>');
    const w = $('[data-kelompok]', el);
    const segar = () => {
      w.innerHTML = isi.map((c, i) => `<div class="cv-kelompok" data-i="${i}">
        <div class="cv-kelompok__kepala"><input class="masukan" data-judul value="${esc(c.judul)}" placeholder="mis. Pendidikan" aria-label="Nama kelompok">
          <button class="ikon-tbl" type="button" data-naik aria-label="Naikkan kelompok" ${i ? '' : 'disabled'}>↑</button>
          <button class="ikon-tbl" type="button" data-buang-kelompok aria-label="Buang kelompok">✕</button></div>
        ${(c.isi || []).map((x, j) => `<div class="cv-baris" data-j="${j}">
          <input class="masukan" data-tahun value="${esc(x.tahun || '')}" placeholder="2020 – sekarang" aria-label="Tahun">
          <textarea class="masukan" data-ket rows="1" placeholder="Keterangan" aria-label="Keterangan">${esc(x.ket || '')}</textarea>
          <button class="ikon-tbl" type="button" data-buang-baris aria-label="Buang baris">✕</button></div>`).join('')}
        <button class="tautan" type="button" data-tambah-baris>+ Tambah baris</button></div>`).join('');
    };
    const baca = () => {
      $$('.cv-kelompok', w).forEach(k => {
        const c = isi[+k.dataset.i];
        c.judul = $('[data-judul]', k).value;
        c.isi = $$('.cv-baris', k).map(b => ({ tahun: $('[data-tahun]', b).value.trim(), ket: $('[data-ket]', b).value.trim() }));
      });
    };
    segar();
    el.addEventListener('click', e => {
      const k = e.target.closest('.cv-kelompok');
      baca();
      if (e.target.closest('[data-tambah-kelompok]')) isi.push({ judul: '', isi: [{ tahun: '', ket: '' }] });
      else if (!k) return;
      else if (e.target.closest('[data-tambah-baris]')) isi[+k.dataset.i].isi.push({ tahun: '', ket: '' });
      else if (e.target.closest('[data-buang-baris]')) isi[+k.dataset.i].isi.splice(+e.target.closest('.cv-baris').dataset.j, 1);
      else if (e.target.closest('[data-buang-kelompok]')) isi.splice(+k.dataset.i, 1);
      else if (e.target.closest('[data-naik]')) { const i = +k.dataset.i; [isi[i - 1], isi[i]] = [isi[i], isi[i - 1]]; }
      else return;
      segar(); el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    return { el, ambil: () => { baca(); return isi.map(c => ({ judul: c.judul.trim(), isi: c.isi.filter(x => x.tahun || x.ket) })).filter(c => c.judul || c.isi.length); }, tanpaLabelFor: true };
  },
  spekBeda(d, v) {
    const isi = Object.entries(v || {});
    const pilihan = (K.cache.spesifikasi || []).map(s => s.data.baris);
    const el = jadi(`<div><div data-baris></div><button class="tbl tbl--kedua tbl--kecil" type="button" data-tambah>+ Tambah perbedaan</button>
      <datalist id="dl-spek">${pilihan.map(p => `<option value="${esc(p)}">`).join('')}</datalist></div>`);
    const w = $('[data-baris]', el);
    const segar = () => { w.innerHTML = isi.map(([a, b], i) => `<div class="spek-baris" data-i="${i}">
      <input class="masukan" list="dl-spek" value="${esc(a)}" placeholder="Bagian, mis. Air" aria-label="Bagian bangunan">
      <input class="masukan" value="${esc(b)}" placeholder="Spesifikasi di proyek ini" aria-label="Spesifikasi">
      <button class="ikon-tbl" type="button" data-buang aria-label="Buang">✕</button></div>`).join(''); };
    const baca = () => $$('.spek-baris', w).forEach(r => { isi[+r.dataset.i] = $$('input', r).map(i => i.value.trim()); });
    segar();
    if (!K.cache.spesifikasi) muatKoleksi('spesifikasi').then(() => { $('#dl-spek', el).innerHTML = K.cache.spesifikasi.map(s => `<option value="${esc(s.data.baris)}">`).join(''); }).catch(() => {});
    el.addEventListener('click', e => {
      baca();
      if (e.target.closest('[data-tambah]')) isi.push(['', '']);
      else if (e.target.closest('[data-buang]')) isi.splice(+e.target.closest('.spek-baris').dataset.i, 1);
      else return;
      segar();
    });
    return { el, ambil: () => { baca(); return Object.fromEntries(isi.filter(([a, b]) => a && b)); }, tanpaLabelFor: true };
  }
};

/* ------------------------------------------------------------- gambar -- */
/** Perkecil di peramban lalu unggah. Menghasilkan versi besar dan versi -sm untuk srcset situs. */
async function unggahGambar(berkas, { maks = 1600, logo = false, map = 'umum', nama = 'gambar' }) {
  if (berkas.size > 40 * 1024 * 1024) throw new Error('Gambar lebih dari 40 MB. Perkecil dulu.');
  if (!Api.tersambung) maks = Math.min(maks, 900);          // demo menyimpan di tab; jaga tetap kecil
  let bmp;
  try { bmp = await createImageBitmap(berkas, { imageOrientation: 'from-image' }); }
  catch (e) { throw new Error('Gambar tidak bisa dibaca. Coba simpan ulang sebagai JPG atau PNG.'); }
  const ubah = async lebarMaks => {
    const s = Math.min(1, lebarMaks / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
    const g = c.getContext('2d');
    if (!logo) { g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); }
    g.imageSmoothingQuality = 'high';
    g.drawImage(bmp, 0, 0, c.width, c.height);
    let b = await new Promise(r => c.toBlob(r, 'image/webp', 0.84));
    if (!b || b.type !== 'image/webp') b = await new Promise(r => c.toBlob(r, logo ? 'image/png' : 'image/jpeg', 0.86));
    return b;
  };
  const besar = await ubah(maks);
  const ext = besar.type === 'image/webp' ? 'webp' : besar.type === 'image/png' ? 'png' : 'jpg';
  const bulan = new Date().toISOString().slice(0, 7);
  const dasar = `${map}/${bulan}/${slug(nama).slice(0, 40) || 'gambar'}-${Api.acak()}`;
  const url = await Api.unggahMedia(`${dasar}.${ext}`, besar);
  // Versi kecil hanya untuk WebP besar; situs menurunkan nama -sm.webp dari alamat utama.
  if (Api.tersambung && ext === 'webp' && Math.max(bmp.width, bmp.height) > 900 && !logo) {
    await Api.unggahMedia(`${dasar}-sm.webp`, await ubah(820)).catch(() => {});
  }
  bmp.close && bmp.close();
  return url;
}

/* ---------------------------------------------------------- pengaturan -- */
async function halPengaturan(w, kunci) {
  const def = PENGATURAN[kunci];
  const semua = await panggil('konsol_pengaturan');
  const p = semua[kunci] || { data: {} };
  w.innerHTML = `<div class="kepala-hal"><div><h1>${esc(def.judul)}</h1><p>${esc(def.bantu || '')}</p>
    <p style="font-size:14px;color:var(--tinta-500)">Terakhir diubah ${relatif(p.diubah)}${p.diubah_oleh ? ' oleh ' + esc(p.diubah_oleh) : ''}.</p></div></div>
    <section class="kartu" id="wadahForm"></section>`;
  const form = buatForm(def.bagian, p.data, null);
  const wadah = $('#wadahForm');
  wadah.appendChild(form.el);
  const sunting = bisa.sunting();
  wadah.appendChild(jadi(`<div style="display:flex;gap:12px;margin-top:28px;align-items:center;flex-wrap:wrap">
    ${sunting ? '' : '<input class="laci__catatan" placeholder="Catatan untuk editor (opsional)" data-catatan style="max-width:420px">'}
    <button class="tbl" type="button" data-simpan>${sunting ? 'Simpan' : 'Kirim untuk ditinjau'}</button></div>`));
  if (kunci === 'angka') {
    // Tampilkan nilai otomatis sebagai petunjuk.
    const [pr, pf] = await Promise.all([muatKoleksi('proyek'), muatKoleksi('portofolio')]);
    const tampil = xs => xs.filter(x => x.tampil).map(x => x.data);
    const P = tampil(pr), F = tampil(pf).filter(x => x.jenis !== 'ruko');
    const oto = { unit: P.reduce((a, x) => a + (+x.unit || 0), 0) + F.reduce((a, x) => a + (+x.unit || 0), 0), proyek: P.length + F.reduce((a, x) => a + (+x.proyek || 1), 0), dijual: P.length };
    $$('[data-otomatis]', wadah).forEach(i => { i.placeholder = 'Otomatis: ' + oto[i.dataset.otomatis].toLocaleString('id-ID'); });
  }
  $('[data-simpan]', wadah).addEventListener('click', async e => {
    const h = form.periksa();
    if (!h) return roti('Periksa isian yang ditandai merah.', true);
    e.currentTarget.disabled = true;
    try {
      if (sunting) { await panggil('konsol_pengaturan_simpan', { p_kunci: kunci, p_data: h.data }); roti('Tersimpan. Terbitkan agar tampil di situs.'); }
      else { await panggil('konsol_draf_kirim', { p_koleksi: 'pengaturan', p_butir_id: kunci, p_data: h.data, p_catatan: $('[data-catatan]', wadah).value || null }); roti('Usulan terkirim ke editor.'); }
      rute();
    } catch (err) { e.currentTarget.disabled = false; }
  });
}

/* ------------------------------------------------------- teks halaman -- */
async function halTeks(w) {
  const [daftar, semua] = await Promise.all([fetch('../data/teks-halaman.json', { cache: 'no-cache' }).then(r => r.json()), panggil('konsol_pengaturan')]);
  const ubahan = salin(((semua.teks || {}).data) || {});
  const sunting = bisa.sunting();
  const halaman = [...new Set(daftar.map(x => x.halaman))];
  w.innerHTML = `<div class="kepala-hal"><div><h1>Teks halaman</h1>
    <p>Judul dan paragraf tetap di setiap halaman. Tanda <b>|</b> memisahkan bagian judul yang tampil redup, mis. <i>Rumah pertama, | dikerjakan dengan benar.</i> Teks yang dikembalikan ke bawaan mengikuti isi HTML.</p></div>
    <button class="tbl" type="button" data-simpan>${sunting ? 'Simpan semua' : 'Kirim untuk ditinjau'}</button></div>
    <div class="alat"><input class="cari" type="search" id="cariTeks" placeholder="Cari teks…" aria-label="Cari teks">
      <select class="masukan" id="pilihHal" style="max-width:260px"><option value="">Semua halaman</option>${halaman.map(h => `<option>${esc(h)}</option>`).join('')}</select></div>
    <div id="daftarTeks"></div>`;
  const wadah = $('#daftarTeks');
  wadah.innerHTML = halaman.map(h => `<section class="teks-kelompok" data-halaman="${esc(h)}"><h2>${esc(h)}</h2>
    ${daftar.filter(x => x.halaman === h).map(x => {
      const v = ubahan[x.kunci] ?? x.bawaan;
      return `<div class="teks-butir${ubahan[x.kunci] !== undefined ? ' diubah' : ''}" data-kunci="${esc(x.kunci)}">
        <div class="teks-butir__kepala"><span><b>${esc(x.bagian)}</b> · ${esc({ judul: 'Judul', subjudul: 'Subjudul', paragraf: 'Paragraf', butir: 'Butir daftar' }[x.jenis])}</span>
          <button class="tautan" type="button" data-bawaan ${ubahan[x.kunci] === undefined ? 'hidden' : ''}>Kembalikan bawaan</button></div>
        <textarea class="masukan" rows="${x.jenis === 'paragraf' || x.jenis === 'butir' ? 3 : 1}" aria-label="${esc(x.bagian + ' ' + x.jenis)}">${esc(v)}</textarea></div>`;
    }).join('')}</section>`).join('');
  const bawaan = Object.fromEntries(daftar.map(x => [x.kunci, x.bawaan]));
  wadah.addEventListener('input', e => {
    const b = e.target.closest('.teks-butir'); if (!b) return;
    const beda = e.target.value.trim() !== bawaan[b.dataset.kunci];
    b.classList.toggle('diubah', beda); $('[data-bawaan]', b).hidden = !beda;
  });
  wadah.addEventListener('click', e => {
    if (!e.target.closest('[data-bawaan]')) return;
    const b = e.target.closest('.teks-butir');
    $('textarea', b).value = bawaan[b.dataset.kunci];
    b.classList.remove('diubah'); e.target.hidden = true;
  });
  const saring = () => {
    const q = $('#cariTeks').value.toLowerCase(), h = $('#pilihHal').value;
    $$('.teks-kelompok', wadah).forEach(s => {
      let ada = false;
      $$('.teks-butir', s).forEach(b => { const ok = (!h || s.dataset.halaman === h) && (!q || $('textarea', b).value.toLowerCase().includes(q)); b.hidden = !ok; ada = ada || ok; });
      s.hidden = !ada;
    });
  };
  $('#cariTeks').addEventListener('input', saring);
  $('#pilihHal').addEventListener('change', saring);
  $('[data-simpan]', w).addEventListener('click', async e => {
    const data = {};
    $$('.teks-butir', wadah).forEach(b => { const v = $('textarea', b).value.trim(); if (v && v !== bawaan[b.dataset.kunci]) data[b.dataset.kunci] = v; });
    e.currentTarget.disabled = true;
    try {
      if (sunting) { await panggil('konsol_pengaturan_simpan', { p_kunci: 'teks', p_data: data }); roti(`${Object.keys(data).length} teks diubah dari bawaan. Terbitkan agar tampil.`); }
      else { await panggil('konsol_draf_kirim', { p_koleksi: 'pengaturan', p_butir_id: 'teks', p_data: data, p_catatan: null }); roti('Usulan terkirim ke editor.'); }
    } catch (err) { /* diberi tahu */ }
    e.currentTarget.disabled = false;
    segarkanRingkasan();
  });
}

/* ---------------------------------------------------------- unduh csv -- */
function unduhCsv(nama, kolom, baris) {
  const sel = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const isi = '﻿' + [kolom.map(k => sel(k[1])).join(','), ...baris.map(b => kolom.map(k => sel(typeof k[0] === 'function' ? k[0](b) : b[k[0]])).join(','))].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([isi], { type: 'text/csv;charset=utf-8' }));
  a.download = nama; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ---------------------------------------------------------------- pesan -- */
const STATUS_PESAN = { baru: 'Baru', dibaca: 'Dibaca', ditindaklanjuti: 'Ditindaklanjuti', arsip: 'Arsip' };
async function halPesan(w, status = 'aktif') {
  const xs = await panggil('konsol_pesan', { p_status: status });
  w.innerHTML = `<div class="kepala-hal"><div><h1>Pesan</h1><p>Dari formulir Kontak dan beranda. Pengirim tetap bisa melanjutkan lewat WhatsApp.</p></div>
    <button class="tbl tbl--kedua" type="button" data-csv>Unduh CSV</button></div>
    <div class="alat"><div class="tab" role="group" aria-label="Saring status">${[['aktif', 'Aktif'], ['baru', 'Baru'], ['ditindaklanjuti', 'Ditindaklanjuti'], ['arsip', 'Arsip'], ['semua', 'Semua']]
      .map(([k, l]) => `<button type="button" data-status="${k}" aria-pressed="${k === status}">${l}</button>`).join('')}</div></div>
    <div class="daftar">${xs.length ? xs.map(m => `<article class="surat${m.status === 'baru' ? ' surat--baru' : ''}" data-id="${esc(m.id)}">
      <div class="surat__kepala"><div><b>${esc(m.nama)}</b><div class="surat__meta">${waktu(m.dibuat)} · ${esc(m.proyek || 'Belum memilih proyek')}${m.halaman ? ' · dari ' + esc(m.halaman) : ''}</div></div>
        <span class="lencana ${m.status === 'baru' ? 'lencana--amber' : m.status === 'ditindaklanjuti' ? 'lencana--tampil' : 'lencana--sembunyi'}">${STATUS_PESAN[m.status]}</span></div>
      ${m.isi ? `<p class="surat__isi">${esc(m.isi)}</p>` : '<p class="surat__isi" style="color:var(--tinta-500)">Tanpa pesan tambahan.</p>'}
      <div class="surat__alat">
        <a class="tbl tbl--emas tbl--kecil" href="${keWa(m.wa)}?text=${encodeURIComponent(`Halo ${m.nama}, kami dari RTD Group menindaklanjuti pertanyaan Anda${m.proyek ? ' tentang ' + m.proyek : ''}.`)}" target="_blank" rel="noopener" data-balas>WhatsApp ${esc(m.wa)}</a>
        ${m.email ? `<a class="tautan" href="mailto:${esc(m.email)}">${esc(m.email)}</a>` : ''}
        <select aria-label="Status" data-ubah-status>${Object.entries(STATUS_PESAN).map(([k, l]) => `<option value="${k}"${k === m.status ? ' selected' : ''}>${l}</option>`).join('')}</select>
        <input placeholder="Catatan internal, mis. sudah ditelepon" value="${esc(m.catatan || '')}" data-catatan aria-label="Catatan internal">
        ${bisa.hapus() ? '<button class="ikon-tbl" type="button" data-hapus aria-label="Hapus pesan">🗑</button>' : ''}
      </div>
      ${m.ditangani ? `<p class="bantu">Terakhir ditangani ${esc(m.ditangani)} · ${relatif(m.diubah)}</p>` : ''}
    </article>`).join('') : '<div class="kosong">Tidak ada pesan di sini.</div>'}</div>`;
  $$('[data-status]', w).forEach(b => b.addEventListener('click', () => halPesan(w, b.dataset.status)));
  $('[data-csv]', w).addEventListener('click', () => unduhCsv(`pesan-rtd-${new Date().toISOString().slice(0, 10)}.csv`,
    [['dibuat', 'Waktu'], ['nama', 'Nama'], ['wa', 'WhatsApp'], ['email', 'Email'], ['proyek', 'Proyek'], ['isi', 'Pesan'], [m => STATUS_PESAN[m.status], 'Status'], ['catatan', 'Catatan']], xs));
  w.onchange = async e => {
    const s = e.target.closest('.surat'); if (!s) return;
    if (e.target.matches('[data-ubah-status]')) { await panggil('konsol_pesan_ubah', { p_id: s.dataset.id, p: { status: e.target.value } }); roti('Status diperbarui.'); segarkanRingkasan(); }
    if (e.target.matches('[data-catatan]')) { await panggil('konsol_pesan_ubah', { p_id: s.dataset.id, p: { catatan: e.target.value } }); roti('Catatan disimpan.'); }
  };
  w.onclick = async e => {
    const s = e.target.closest('.surat'); if (!s) return;
    const m = xs.find(x => x.id === s.dataset.id);
    if (e.target.closest('[data-balas]') && m.status === 'baru') { await panggil('konsol_pesan_ubah', { p_id: m.id, p: { status: 'dibaca' } }).catch(() => {}); segarkanRingkasan(); }
    if (e.target.closest('[data-hapus]') && await yakin('Hapus pesan ini?', 'Pesan dihapus permanen dari konsol.', 'Hapus', 'tbl--bahaya')) {
      await panggil('konsol_pesan_hapus', { p_id: m.id }); roti('Pesan dihapus.'); halPesan(w, status);
    }
  };
}

/* -------------------------------------------------------------- lamaran -- */
const STATUS_LAMARAN = { baru: 'Baru', ditinjau: 'Ditinjau', wawancara: 'Wawancara', diterima: 'Diterima', ditolak: 'Ditolak', arsip: 'Arsip' };
async function halLamaran(w, status = 'aktif', posisi = '') {
  const semua = await panggil('konsol_lamaran', { p_status: status });
  const xs = semua.filter(x => !posisi || x.posisi === posisi);
  const daftarPosisi = [...new Set(semua.map(x => x.posisi).filter(Boolean))];
  const warna = { baru: 'lencana--amber', wawancara: 'lencana--biru', diterima: 'lencana--tampil', ditolak: 'lencana--merah' };
  w.innerHTML = `<div class="kepala-hal"><div><h1>Lamaran kerja</h1><p>Dari formulir di setiap lowongan. CV tersimpan privat; tautan pembukanya berlaku dua menit.</p></div>
    <button class="tbl tbl--kedua" type="button" data-csv>Unduh CSV</button></div>
    <div class="alat"><div class="tab" role="group" aria-label="Saring status">${[['aktif', 'Aktif'], ...Object.entries(STATUS_LAMARAN), ['semua', 'Semua']]
      .map(([k, l]) => `<button type="button" data-status="${k}" aria-pressed="${k === status}">${l}</button>`).join('')}</div>
      <select class="masukan" data-posisi style="max-width:260px" aria-label="Posisi"><option value="">Semua posisi</option>${daftarPosisi.map(p => `<option${p === posisi ? ' selected' : ''}>${esc(p)}</option>`).join('')}</select></div>
    <div class="daftar">${xs.length ? xs.map(m => `<article class="surat${m.status === 'baru' ? ' surat--baru' : ''}" data-id="${esc(m.id)}">
      <div class="surat__kepala"><div><b>${esc(m.nama)}</b><div class="surat__meta">${esc(m.posisi || '—')} · ${waktu(m.dibuat)}</div></div>
        <span class="lencana ${warna[m.status] || 'lencana--sembunyi'}">${STATUS_LAMARAN[m.status]}</span></div>
      <dl class="surat__rinci">
        ${m.kota ? `<dt>Domisili</dt><dd>${esc(m.kota)}</dd>` : ''}${m.pendidikan ? `<dt>Pendidikan</dt><dd>${esc(m.pendidikan)}</dd>` : ''}
        ${m.email ? `<dt>Email</dt><dd><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></dd>` : ''}
        ${m.pengalaman ? `<dt>Pengalaman</dt><dd style="white-space:pre-wrap">${esc(m.pengalaman)}</dd>` : ''}</dl>
      <div class="surat__alat">
        <button class="tbl tbl--kecil" type="button" data-cv>Buka CV</button>
        <a class="tbl tbl--emas tbl--kecil" href="${keWa(m.wa)}" target="_blank" rel="noopener">WhatsApp ${esc(m.wa)}</a>
        <select aria-label="Status" data-ubah-status>${Object.entries(STATUS_LAMARAN).map(([k, l]) => `<option value="${k}"${k === m.status ? ' selected' : ''}>${l}</option>`).join('')}</select>
        <input placeholder="Catatan HRD" value="${esc(m.catatan || '')}" data-catatan aria-label="Catatan HRD">
        ${bisa.hapus() ? '<button class="ikon-tbl" type="button" data-hapus aria-label="Hapus lamaran dan CV">🗑</button>' : ''}
      </div>
      ${m.ditangani ? `<p class="bantu">Terakhir ditangani ${esc(m.ditangani)} · ${relatif(m.diubah)}</p>` : ''}
    </article>`).join('') : '<div class="kosong">Tidak ada lamaran di sini.</div>'}</div>`;
  $$('[data-status]', w).forEach(b => b.addEventListener('click', () => halLamaran(w, b.dataset.status, posisi)));
  $('[data-posisi]', w).addEventListener('change', e => halLamaran(w, status, e.target.value));
  $('[data-csv]', w).addEventListener('click', () => unduhCsv(`lamaran-rtd-${new Date().toISOString().slice(0, 10)}.csv`,
    [['dibuat', 'Waktu'], ['posisi', 'Posisi'], ['nama', 'Nama'], ['wa', 'WhatsApp'], ['email', 'Email'], ['kota', 'Domisili'], ['pendidikan', 'Pendidikan'],
     ['pengalaman', 'Pengalaman'], [m => STATUS_LAMARAN[m.status], 'Status'], ['catatan', 'Catatan']], xs));
  w.onchange = async e => {
    const s = e.target.closest('.surat'); if (!s) return;
    if (e.target.matches('[data-ubah-status]')) { await panggil('konsol_lamaran_ubah', { p_id: s.dataset.id, p: { status: e.target.value } }); roti('Status diperbarui.'); segarkanRingkasan(); }
    if (e.target.matches('[data-catatan]')) { await panggil('konsol_lamaran_ubah', { p_id: s.dataset.id, p: { catatan: e.target.value } }); roti('Catatan disimpan.'); }
  };
  w.onclick = async e => {
    const s = e.target.closest('.surat'); if (!s) return;
    const m = xs.find(x => x.id === s.dataset.id);
    if (e.target.closest('[data-cv]')) {
      const jendela = window.open('', '_blank');
      try {
        const url = await Api.urlCv(m.cv_path);
        if (jendela) jendela.location = url; else location.href = url;
        if (m.status === 'baru') { await panggil('konsol_lamaran_ubah', { p_id: m.id, p: { status: 'ditinjau' } }); segarkanRingkasan(); halLamaran(w, status, posisi); }
      } catch (err) { if (jendela) jendela.close(); roti(err.message, true); }
    }
    if (e.target.closest('[data-hapus]') && await yakin('Hapus lamaran ini?', 'Data pelamar dan berkas CV-nya dihapus permanen.', 'Hapus', 'tbl--bahaya')) {
      try { await Api.hapusCv(m.cv_path); } catch (err) { roti(err.message, true); return; }
      await panggil('konsol_lamaran_hapus', { p_id: m.id }); roti('Lamaran dihapus.'); halLamaran(w, status, posisi);
    }
  };
}

/* ----------------------------------------------------------------- draf -- */
const namaKoleksi = k => (k === 'pengaturan' ? 'Pengaturan' : (KOLEKSI[k] || {}).judul || k);
function bidangSkema(koleksi, butir) {
  if (koleksi === 'pengaturan') return butir === 'teks' ? null : PENGATURAN[butir].bagian.flatMap(b => b.bidang);
  return KOLEKSI[koleksi].bagian.flatMap(b => b.bidang);
}
function tampilNilai(d, v) {
  if (kosong(v)) return '<span style="color:var(--tinta-500)">—</span>';
  if (d && d.jenis === 'gambar') return `<img src="${esc(gbrUrl(v))}" alt="">`;
  if (d && d.jenis === 'galeri') return v.map(g => `<img src="${esc(gbrUrl(g))}" alt="" style="display:inline-block;width:70px;margin:2px">`).join('');
  if (d && d.jenis === 'rupiah') return 'Rp ' + Number(v).toLocaleString('id-ID');
  if (d && d.jenis === 'centang') return v ? 'Ya' : 'Tidak';
  if (d && d.jenis === 'pilihan') return esc((d.opsi.find(o => o[0] === v) || [v, v])[1]);
  if (Array.isArray(v)) return v.map(x => esc(typeof x === 'object' ? JSON.stringify(x) : x)).join('<br>');
  if (typeof v === 'object') return esc(JSON.stringify(v));
  return esc(v);
}
function tabelBeda(dr) {
  const isBaru = dr.koleksi !== 'pengaturan' ? (dr.data.data || {}) : dr.data;
  const isLama = dr.koleksi !== 'pengaturan' ? ((dr.asli || {}).data || {}) : (dr.asli || {});
  const bidang = bidangSkema(dr.koleksi, dr.butir_id) || Object.keys({ ...isLama, ...isBaru }).map(k => ({ k, label: k }));
  const baris = bidang.filter(d => JSON.stringify(isLama[d.k] ?? null) !== JSON.stringify(isBaru[d.k] ?? null));
  if (dr.koleksi !== 'pengaturan' && dr.asli && dr.data.id !== dr.asli.id) baris.unshift({ k: '__id', label: 'Alamat web' });
  if (!baris.length) return '<p class="bantu">Tidak ada perbedaan dengan isi saat ini.</p>';
  return `<table class="beda"><tbody>${baris.map(d => d.k === '__id'
    ? `<tr><th>Alamat web</th><td class="lama">${esc(dr.asli.id)}</td><td class="baru">${esc(dr.data.id)}</td></tr>`
    : `<tr><th>${esc(d.label)}</th>${dr.asli ? `<td class="lama">${tampilNilai(d, isLama[d.k])}</td>` : ''}<td class="baru">${tampilNilai(d, isBaru[d.k])}</td></tr>`).join('')}</tbody></table>`;
}
async function halDraf(w, status = 'menunggu') {
  const xs = await panggil('konsol_draf', { p_status: status });
  const editor = bisa.sunting();
  const warna = { menunggu: 'lencana--amber', disetujui: 'lencana--tampil', ditolak: 'lencana--merah', ditarik: 'lencana--sembunyi' };
  w.innerHTML = `<div class="kepala-hal"><div><h1>Tinjau draf</h1><p>${editor ? 'Usulan kontributor. Setujui untuk menyimpannya ke konsol; tetap perlu diterbitkan agar tampil di situs.' : 'Usulan yang Anda kirim dan keputusan editor.'}</p></div></div>
    <div class="alat"><div class="tab" role="group">${[['menunggu', 'Menunggu'], ['semua', 'Semua']].map(([k, l]) => `<button type="button" data-status="${k}" aria-pressed="${k === status}">${l}</button>`).join('')}</div></div>
    <div class="daftar">${xs.length ? xs.map(dr => {
      const lbl = dr.koleksi === 'pengaturan' ? (dr.butir_id === 'teks' ? 'Teks halaman' : PENGATURAN[dr.butir_id].judul)
        : KOLEKSI[dr.koleksi].ringkas({ id: dr.data.id, ...(dr.data.data || {}) }).judul;
      return `<article class="surat" data-id="${esc(dr.id)}">
        <div class="surat__kepala"><div><b>${esc(lbl)}</b><div class="surat__meta">${esc(namaKoleksi(dr.koleksi))} · ${dr.butir_id ? 'perubahan' : 'butir baru'} · ${esc(dr.dibuat_oleh_nama || '—')} · ${relatif(dr.dibuat)}</div></div>
          <span class="lencana ${warna[dr.status]}">${esc(dr.status[0].toUpperCase() + dr.status.slice(1))}</span></div>
        ${dr.catatan ? `<p class="surat__isi">“${esc(dr.catatan)}”</p>` : ''}
        ${tabelBeda(dr)}
        ${dr.catatan_tinjau || dr.ditinjau_oleh_nama ? `<p class="bantu">Ditinjau ${esc(dr.ditinjau_oleh_nama || '')} ${dr.ditinjau ? relatif(dr.ditinjau) : ''}${dr.catatan_tinjau ? ': “' + esc(dr.catatan_tinjau) + '”' : ''}</p>` : ''}
        ${dr.status === 'menunggu' ? `<div class="surat__alat">${editor
          ? `<button class="tbl tbl--kecil" type="button" data-setujui>Setujui</button>
             ${dr.koleksi !== 'pengaturan' ? '<button class="tbl tbl--kedua tbl--kecil" type="button" data-sunting>Sunting dulu</button>' : ''}
             <button class="tbl tbl--bahaya tbl--kecil" type="button" data-tolak>Tolak</button>`
          : `${dr.koleksi !== 'pengaturan' ? '<button class="tbl tbl--kedua tbl--kecil" type="button" data-ubah>Ubah usulan</button>' : ''}
             <button class="tbl tbl--bahaya tbl--kecil" type="button" data-tarik>Tarik</button>`}</div>` : ''}
      </article>`;
    }).join('') : '<div class="kosong">Tidak ada draf di sini.</div>'}</div>`;
  $$('[data-status]', w).forEach(b => b.addEventListener('click', () => halDraf(w, b.dataset.status)));
  w.onclick = async e => {
    const s = e.target.closest('.surat'); if (!s) return;
    const dr = xs.find(x => x.id === s.dataset.id);
    if (e.target.closest('[data-setujui]')) { await panggil('konsol_draf_tinjau', { p_id: dr.id, p_keputusan: 'setujui' }); roti('Disetujui. Terbitkan agar tampil di situs.'); halDraf(w, status); segarkanRingkasan(); }
    if (e.target.closest('[data-tolak]')) {
      const c = await dialog({ judul: 'Tolak usulan?', html: '<p>Beri alasan singkat agar kontributor tahu apa yang perlu diperbaiki.</p><input class="masukan" id="alasan" style="margin-top:14px">',
        tombol: [{ label: 'Batal', nilai: null, kelas: 'tbl--kedua' }, { label: 'Tolak', nilai: d => ({ c: $('#alasan', d).value }), kelas: 'tbl--bahaya' }] });
      if (!c) return;
      await panggil('konsol_draf_tinjau', { p_id: dr.id, p_keputusan: 'tolak', p_catatan: c.c || null }); roti('Usulan ditolak.'); halDraf(w, status); segarkanRingkasan();
    }
    if (e.target.closest('[data-tarik]')) { await panggil('konsol_draf_tarik', { p_id: dr.id }); roti('Usulan ditarik.'); halDraf(w, status); segarkanRingkasan(); }
    if (e.target.closest('[data-sunting]') || e.target.closest('[data-ubah]')) {
      bukaEditor({ k: dr.koleksi, baris: { id: dr.data.id, tampil: dr.data.tampil !== false, data: dr.data.data || {} }, draf: dr, mode: e.target.closest('[data-sunting]') ? 'tinjau' : 'ubahUsul' });
    }
  };
}

/* ------------------------------------------------------------ aktivitas -- */
const KATA_AKSI = {
  insert: 'menambah', update: 'mengubah', delete: 'menghapus', tampilkan: 'menampilkan', sembunyikan: 'menyembunyikan', urutkan: 'mengurutkan ulang',
  terbit: 'menerbitkan situs', pulihkan: 'memulihkan situs ke', masuk: 'masuk ke konsol', impor: 'mengimpor isi',
  kode_dibuat: 'membuat kode akses untuk', kode_dicabut: 'mencabut kode', kode_dipulihkan: 'memulihkan kode', kode_diubah: 'mengubah kode', kode_diganti: 'mengganti kode', kode_dihapus: 'menghapus kode',
  draf_dikirim: 'mengusulkan perubahan', draf_disetujui: 'menyetujui usulan', draf_ditolak: 'menolak usulan',
  pesan_ditindaklanjuti: 'menindaklanjuti pesan dari', pesan_arsip: 'mengarsipkan pesan dari', pesan_baru: 'menandai baru pesan dari', pesan_dihapus: 'menghapus pesan dari',
  lamaran_ditinjau: 'meninjau lamaran', lamaran_wawancara: 'memanggil wawancara', lamaran_diterima: 'menerima lamaran', lamaran_ditolak: 'menolak lamaran',
  lamaran_arsip: 'mengarsipkan lamaran', lamaran_baru: 'menandai baru lamaran', lamaran_dihapus: 'menghapus lamaran'
};
function kalimat(l) {
  const objek = ['situs', 'staf', 'pesan', 'lamaran'].includes(l.objek) ? '' : l.objek === 'pengaturan' ? (PENGATURAN[l.objek_id] ? PENGATURAN[l.objek_id].judul : l.objek_id === 'teks' ? 'Teks halaman' : l.objek_id) : namaKoleksi(l.objek);
  const label = (l.rincian || {}).label;
  const versi = l.aksi === 'terbit' ? ` (versi ${l.objek_id})` : '';
  return `<b>${esc(l.staf || 'Sistem')}</b> ${esc(KATA_AKSI[l.aksi] || l.aksi)}${objek ? ' ' + esc(objek) : ''}${label ? ` “${esc(label)}”` : ''}${versi}`;
}
async function halAktivitas(w, saring = {}) {
  const xs = await panggil('konsol_aktivitas', { p_batas: 300, p_staf: saring.staf || null, p_objek: saring.objek || null });
  const orang = [...new Map(xs.filter(l => l.staf_id).map(l => [l.staf_id, l.staf])).entries()];
  w.innerHTML = `<div class="kepala-hal"><div><h1>Aktivitas</h1><p>Siapa mengubah apa, kapan. 300 kegiatan terakhir.</p></div></div>
    <div class="alat"><select class="masukan" data-staf style="max-width:240px" aria-label="Orang"><option value="">Semua orang</option>${orang.map(([id, n]) => `<option value="${esc(id)}"${id === saring.staf ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select>
      <select class="masukan" data-objek style="max-width:240px" aria-label="Bagian"><option value="">Semua bagian</option>${[...Object.keys(KOLEKSI), 'pengaturan', 'situs', 'pesan', 'lamaran', 'staf']
        .map(k => `<option value="${k}"${k === saring.objek ? ' selected' : ''}>${esc({ situs: 'Penerbitan', staf: 'Kode akses', pesan: 'Pesan', lamaran: 'Lamaran' }[k] || namaKoleksi(k))}</option>`).join('')}</select></div>
    <ol class="linimasa">${xs.length ? xs.map(l => `<li><time datetime="${esc(l.waktu)}" title="${waktu(l.waktu)}">${relatif(l.waktu)}</time><span>${kalimat(l)}</span></li>`).join('') : '<li>Belum ada kegiatan.</li>'}</ol>`;
  const ubah = () => halAktivitas(w, { staf: $('[data-staf]', w).value, objek: $('[data-objek]', w).value });
  $('[data-staf]', w).addEventListener('change', ubah);
  $('[data-objek]', w).addEventListener('change', ubah);
}

/* ---------------------------------------------------------------- versi -- */
async function halVersi(w) {
  const xs = await panggil('konsol_terbitan', { p_batas: 60 });
  w.innerHTML = `<div class="kepala-hal"><div><h1>Versi terbit</h1><p>Setiap kali Terbitkan ditekan, isi situs disimpan sebagai satu versi. Situs selalu memakai versi teratas.</p></div></div>
    <table class="tabel"><thead><tr><th>Versi</th><th>Waktu</th><th>Oleh</th><th>Catatan</th><th></th></tr></thead><tbody>
    ${xs.map((t, i) => `<tr data-versi="${t.versi}"><td><b>${t.versi}</b>${i === 0 ? ' <span class="lencana lencana--tampil">Tayang</span>' : ''}</td>
      <td>${waktu(t.waktu)}</td><td>${esc(t.oleh || '—')}</td><td>${esc(t.catatan || '')}${t.sumber === 'pulihkan' ? ' <span class="lencana lencana--biru">Pemulihan</span>' : ''}</td>
      <td style="white-space:nowrap"><button class="tautan" type="button" data-unduh>Unduh</button>
      ${i > 0 && bisa.hapus() ? ' · <button class="tautan" type="button" data-pulihkan>Pulihkan</button>' : ''}</td></tr>`).join('')}</tbody></table>`;
  w.onclick = async e => {
    const tr = e.target.closest('tr[data-versi]'); if (!tr) return;
    const v = +tr.dataset.versi;
    if (e.target.closest('[data-unduh]')) {
      const d = await panggil('konsol_versi_data', { p_versi: v });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 1)], { type: 'application/json' }));
      a.download = `situs-rtd-versi-${v}.json`; a.click();
    }
    if (e.target.closest('[data-pulihkan]')) {
      const r = await dialog({ judul: `Pulihkan versi ${v}?`, html: `<p>Situs langsung kembali menampilkan isi versi ${v}. Versi yang tayang sekarang tetap tersimpan di daftar.</p>
        <label class="centang" style="margin-top:12px"><input type="checkbox" id="isiKonsol"> Kembalikan juga isi konsol ke versi ini</label>
        <p class="bantu">Tanpa centang, perubahan yang belum terbit di konsol tetap ada dan akan ikut pada terbit berikutnya.</p>`,
        tombol: [{ label: 'Batal', nilai: null, kelas: 'tbl--kedua' }, { label: 'Pulihkan', nilai: d => ({ isi: $('#isiKonsol', d).checked }), kelas: 'tbl--bahaya' }] });
      if (!r) return;
      const h = await panggil('konsol_pulihkan', { p_versi: v, p_isi_konsol: r.isi });
      roti(`Situs dipulihkan sebagai versi ${h.versi}.`); halVersi(w); segarkanRingkasan();
    }
  };
}

/* ----------------------------------------------------------- kode akses -- */
async function tampilkanKode(judul, r) {
  await dialog({ judul, html: `<p>Berikan kode ini kepada <b>${esc(r.staf.nama)}</b>. Kode hanya tampil sekali; bila hilang, buat kode pengganti.</p>
    <div class="kode-tampil">${esc(r.kode)}</div>${r.demo ? '<p class="bantu">Mode demo: kode ini tidak bisa dipakai masuk.</p>' : ''}`,
    tombol: [{ label: 'Salin kode', nilai: () => { navigator.clipboard && navigator.clipboard.writeText(r.kode); roti('Kode disalin.'); } }, { label: 'Selesai', nilai: null, kelas: 'tbl--kedua' }] });
}
async function halKode(w) {
  const xs = await panggil('konsol_staf_daftar');
  const pemilik = bisa.pemilik();
  const peranBoleh = pemilik ? ['admin', 'editor', 'kontributor'] : ['editor', 'kontributor'];
  w.innerHTML = `<div class="kepala-hal"><div><h1>Kode akses</h1><p>Satu kode per orang. Kode disimpan teracak; konsol hanya mengenali empat huruf terakhirnya. Mencabut kode langsung mengeluarkan pemegangnya.</p></div></div>
    <section class="kartu"><h2>Buat kode baru</h2>
      <form id="formKode" class="grid-form" style="margin-top:16px;grid-template-columns:2fr 1fr 2fr auto;align-items:end">
        <div class="bidang" style="grid-column:auto"><label for="kNama">Nama pemegang</label><input class="masukan" id="kNama" required></div>
        <div class="bidang" style="grid-column:auto"><label for="kPeran">Peran</label><select class="masukan" id="kPeran">${peranBoleh.map(p => `<option value="${p}"${p === 'editor' ? ' selected' : ''}>${NAMA_PERAN[p]}</option>`).join('')}</select></div>
        <div class="bidang" style="grid-column:auto"><label for="kCatatan">Catatan</label><input class="masukan" id="kCatatan" placeholder="mis. Tim pemasaran Gandus"></div>
        <button class="tbl" type="submit" style="min-height:50px">Buat kode</button>
      </form>
      <p class="bantu" style="margin-top:12px">${peranBoleh.map(p => `<b>${NAMA_PERAN[p]}</b>: ${KET_PERAN[p]}`).join('<br>')}</p></section>
    <table class="tabel" style="margin-top:24px"><thead><tr><th>Nama</th><th>Peran</th><th>Kode</th><th>Masuk terakhir</th><th></th></tr></thead><tbody>
    ${xs.map(s => {
      const bolehUbah = s.peran !== 'pemilik' && (pemilik || s.peran !== 'admin') && s.id !== K.staf.id;
      return `<tr data-id="${esc(s.id)}" style="${s.aktif ? '' : 'opacity:.6'}"><td><b>${esc(s.nama)}</b>${s.catatan ? `<br><small style="color:var(--tinta-500)">${esc(s.catatan)}</small>` : ''}</td>
        <td>${bolehUbah ? `<select class="masukan" data-peran style="min-height:38px;padding:4px 10px">${['admin', 'editor', 'kontributor'].filter(p => pemilik || p !== 'admin').map(p => `<option value="${p}"${p === s.peran ? ' selected' : ''}>${NAMA_PERAN[p]}</option>`).join('')}</select>` : `<span class="peran" style="margin:0">${NAMA_PERAN[s.peran]}</span>`}</td>
        <td><code>RTD-••••-${esc(s.kode_akhir || '????')}</code>${s.aktif ? '' : ' <span class="lencana lencana--merah">Dicabut</span>'}</td>
        <td>${s.masuk_terakhir ? relatif(s.masuk_terakhir) : 'Belum pernah'}</td>
        <td style="white-space:nowrap">${(pemilik || !['pemilik', 'admin'].includes(s.peran) || s.id === K.staf.id) ? '<button class="tautan" type="button" data-ganti>Ganti kode</button>' : ''}
          ${bolehUbah ? ` · <button class="tautan" type="button" data-cabut>${s.aktif ? 'Cabut' : 'Pulihkan'}</button>${s.aktif ? '' : ' · <button class="tautan" type="button" data-hapus>Hapus</button>'}` : ''}</td></tr>`;
    }).join('')}</tbody></table>`;
  $('#formKode').addEventListener('submit', async e => {
    e.preventDefault();
    const r = await panggil('konsol_staf_buat', { p: { nama: $('#kNama').value, peran: $('#kPeran').value, catatan: $('#kCatatan').value } });
    await tampilkanKode('Kode baru dibuat', r);
    halKode(w);
  });
  w.onchange = async e => {
    const tr = e.target.closest('tr[data-id]');
    if (tr && e.target.matches('[data-peran]')) { await panggil('konsol_staf_ubah', { p_id: tr.dataset.id, p: { peran: e.target.value } }); roti('Peran diubah.'); }
  };
  w.onclick = async e => {
    const tr = e.target.closest('tr[data-id]'); if (!tr) return;
    const s = xs.find(x => x.id === tr.dataset.id);
    if (e.target.closest('[data-ganti]') && await yakin(`Ganti kode ${s.nama}?`, 'Kode lama langsung tidak berlaku dan pemegangnya keluar dari konsol.')) {
      await tampilkanKode('Kode pengganti', await panggil('konsol_staf_kode_baru', { p_id: s.id })); halKode(w);
    }
    if (e.target.closest('[data-cabut]')) {
      if (s.aktif && !await yakin(`Cabut kode ${s.nama}?`, 'Pemegangnya langsung keluar dan tidak bisa masuk lagi sampai kodenya dipulihkan.', 'Cabut', 'tbl--bahaya')) return;
      await panggil('konsol_staf_ubah', { p_id: s.id, p: { aktif: !s.aktif } }); roti(s.aktif ? 'Kode dicabut.' : 'Kode dipulihkan.'); halKode(w);
    }
    if (e.target.closest('[data-hapus]') && await yakin(`Hapus ${s.nama} dari daftar?`, 'Riwayat aktivitasnya tetap ada di log.', 'Hapus', 'tbl--bahaya')) {
      await panggil('konsol_staf_hapus', { p_id: s.id }); roti('Kode dihapus.'); halKode(w);
    }
  };
}
