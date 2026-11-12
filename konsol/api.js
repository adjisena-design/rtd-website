/* ==========================================================================
   Lapisan data konsol.
   - Supabase (assets/js/konfigurasi.js terisi): sesi anonim + fungsi konsol_* di database.
   - Mode demo (konfigurasi kosong): fungsi yang sama dijalankan di peramban atas salinan
     data/situs.json. Perubahan hanya tersimpan di tab ini dan tidak pernah sampai ke situs.
   ========================================================================== */
'use strict';

const Api = (() => {
  const K = window.RTD_KONFIG || {};
  const tersambung = !!(K.supabaseUrl && K.supabaseAnonKey);
  let sb = null;

  class GalatApi extends Error {
    constructor(pesan, kode) { super(pesan); this.kode = kode; }
  }

  async function siapkan() {
    if (!tersambung) return Demo.siapkan();
    sb = window.supabase.createClient(K.supabaseUrl, K.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true } });
    const { data } = await sb.auth.getSession();
    if (!data.session) {
      const { error } = await sb.auth.signInAnonymously();
      if (error) throw new GalatApi('Sesi peramban gagal dibuat. Pastikan "Allow anonymous sign-ins" aktif di Supabase (Authentication → Sign In / Providers). ' + error.message);
    }
  }

  async function panggil(nama, args = {}) {
    if (!tersambung) return Demo.panggil(nama, args);
    const { data, error } = await sb.rpc(nama, args);
    if (error) throw new GalatApi(error.message, error.hint);
    return data;
  }

  const acak = () => Math.random().toString(36).slice(2, 8);

  /** Unggah ke bucket media. Mengembalikan alamat publik. */
  async function unggahMedia(jalur, blob) {
    if (!tersambung) return Demo.unggah(blob);
    const { error } = await sb.storage.from('media').upload(jalur, blob, { contentType: blob.type, upsert: false, cacheControl: '31536000' });
    if (error) throw new GalatApi('Gagal mengunggah: ' + error.message);
    return sb.storage.from('media').getPublicUrl(jalur).data.publicUrl;
  }

  async function urlCv(jalur) {
    if (!tersambung) return Demo.cvContoh();
    const { data, error } = await sb.storage.from('lamaran').createSignedUrl(jalur, 120);
    if (error) throw new GalatApi('CV tidak bisa dibuka: ' + error.message);
    return data.signedUrl;
  }

  async function hapusCv(jalur) {
    if (!tersambung) return;
    const { error } = await sb.storage.from('lamaran').remove([jalur]);
    if (error) throw new GalatApi('Berkas CV gagal dihapus: ' + error.message);
  }

  return { siapkan, panggil, unggahMedia, urlCv, hapusCv, tersambung, acak, GalatApi };
})();

/* ==========================================================================
   Backend demo: meniru fungsi SQL di supabase/migrations/ secukupnya.
   ========================================================================== */
const Demo = (() => {
  const KUNCI = 'rtd-konsol-demo';
  const KODE = { 'RTDDEMOPMLK': 'pemilik', 'RTDDEMOADMN': 'admin', 'RTDDEMOEDTR': 'editor', 'RTDDEMOKTRB': 'kontributor' };
  const NAMA = { pemilik: 'Daffa Adjisena', admin: 'Admin Demo', editor: 'Editor Demo', kontributor: 'Kontributor Demo' };
  const KOLEKSI_SAH = Object.keys(KOLEKSI), PENGATURAN_SAH = ['kontak', 'angka', 'kpr', 'teks'];
  let S = null;

  const kini = () => new Date().toISOString();
  const salin = o => JSON.parse(JSON.stringify(o));
  const simpan = () => { try { sessionStorage.setItem(KUNCI, JSON.stringify(S)); } catch (e) { /* penuh */ } };
  const galat = (p, kode) => { throw new Api.GalatApi(p, kode); };

  async function siapkan() {
    try { S = JSON.parse(sessionStorage.getItem(KUNCI)); } catch (e) { S = null; }
    if (S && S.versiSkema === 2) return;
    const d = await (await fetch('../data/situs.json', { cache: 'no-cache' })).json();
    const t = new Date();
    const lalu = jam => new Date(t - jam * 36e5).toISOString();
    S = {
      versiSkema: 2, sesi: null,
      staf: Object.entries(NAMA).map(([peran, nama], i) => ({ id: 'demo-' + peran, nama, peran, aktif: true, kode_akhir: Object.keys(KODE)[i].slice(-4),
        catatan: null, dibuat: lalu(400), masuk_terakhir: null, dibuat_oleh_nama: i ? 'Daffa Adjisena' : null })),
      konten: Object.fromEntries(KOLEKSI_SAH.map(k => [k, (d[k] || []).map((b, i) => {
        const { id, ...data } = b; return { id, urutan: i, tampil: true, data, diubah: lalu(72), diubah_oleh: 'Daffa Adjisena' };
      })])),
      pengaturan: Object.fromEntries(PENGATURAN_SAH.map(k => [k, { data: (d.pengaturan || {})[k] || {}, diubah: lalu(72), diubah_oleh: 'Daffa Adjisena' }])),
      draf: [], log: [{ waktu: lalu(72), aksi: 'impor', objek: 'situs', rincian: { label: 'isi awal' }, staf: 'Daffa Adjisena' }],
      terbitan: [], pesan: [
        { id: 'p1', dibuat: lalu(2), nama: 'Rina Marlina', wa: '081377712345', email: null, proyek: 'Taman Asri Gandus 2 — Tahap 3', isi: 'Apakah unit hook masih ada? Saya karyawan swasta, gaji 4,5 juta.', halaman: 'kontak.html', status: 'baru', catatan: null },
        { id: 'p2', dibuat: lalu(30), nama: 'Hendra', wa: '082280011223', email: null, proyek: 'The Green Nature', isi: null, halaman: 'index.html', status: 'ditindaklanjuti', catatan: 'Sudah survei Sabtu, minta simulasi DP.', ditangani: 'Editor Demo' }
      ],
      lamaran: [
        { id: 'l1', dibuat: lalu(5), lowongan_id: 'marketing-executive', posisi: 'Marketing Executive', nama: 'Siti Aminah', wa: '081266634455', email: 'siti@contoh.id',
          kota: 'Palembang', pendidikan: 'D3 Manajemen Pemasaran', pengalaman: '2 tahun sales properti di developer Banyuasin.', cv_path: 'contoh.pdf', cv_nama: 'CV Siti Aminah.pdf', status: 'baru', catatan: null }
      ]
    };
    S.terbitan.push({ versi: 1, waktu: lalu(72), oleh: null, sumber: 'awal', catatan: 'Isi awal dari data/situs.json', data: susun() });
    simpan();
  }

  const saya = () => S.staf.find(s => s.id === S.sesi && s.aktif) || null;
  function wajib(peran) {
    const st = saya();
    if (!st) galat('Sesi Anda sudah berakhir. Masukkan kode akses lagi.', 'ERR_SESI');
    if (!peran.includes(st.peran)) galat('Kode akses Anda tidak mengizinkan tindakan ini.', 'ERR_DILARANG');
    return st;
  }
  const SEMUA = ['pemilik', 'admin', 'editor', 'kontributor'], EDITOR = ['pemilik', 'admin', 'editor'], ADMIN = ['pemilik', 'admin'];
  const label = (d, c) => (d && (d.nama || d.judul || d.posisi || d.label || d.baris || d.alt || d.ket)) || c;
  const catat = (aksi, objek, objek_id, rincian = {}) => S.log.unshift({ waktu: kini(), aksi, objek, objek_id, rincian, staf: (saya() || {}).nama, staf_id: (saya() || {}).id });

  function susun() {
    const o = {};
    for (const k of KOLEKSI_SAH) o[k] = S.konten[k].filter(b => b.tampil).sort((a, b) => a.urutan - b.urutan).map(b => ({ id: b.id, ...salin(b.data) }));
    o.pengaturan = Object.fromEntries(PENGATURAN_SAH.map(k => [k, salin(S.pengaturan[k].data)]));
    return o;
  }

  function terapkanKonten(koleksi, idLama, p) {
    const id = String(p.id || '').trim();
    if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,119}$/.test(id)) galat('Alamat web (id) hanya boleh huruf, angka, tanda hubung, dan garis bawah.');
    const daftar = S.konten[koleksi];
    if (!daftar) galat('Koleksi tidak dikenal.');
    const data = salin(p.data || {}); delete data.id;
    const nama = (saya() || {}).nama;
    if (!idLama) {
      if (daftar.some(b => b.id === id)) galat(`Alamat web "${id}" sudah dipakai butir lain. Ganti alamatnya.`);
      daftar.push({ id, urutan: Math.max(-1, ...daftar.map(b => b.urutan)) + 1, tampil: p.tampil !== false, data, diubah: kini(), diubah_oleh: nama });
      catat('insert', koleksi, id, { label: label(data, id) });
    } else {
      const b = daftar.find(x => x.id === idLama);
      if (!b) galat('Butir aslinya sudah tidak ada. Muat ulang daftar.');
      if (id !== idLama && daftar.some(x => x.id === id)) galat(`Alamat web "${id}" sudah dipakai butir lain. Ganti alamatnya.`);
      Object.assign(b, { id, tampil: p.tampil !== false, data, diubah: kini(), diubah_oleh: nama });
      catat('update', koleksi, id, { label: label(data, id) });
    }
    return id;
  }
  function terapkanPengaturan(k, data) {
    if (!PENGATURAN_SAH.includes(k)) galat('Pengaturan tidak dikenal.');
    S.pengaturan[k] = { data: salin(data), diubah: kini(), diubah_oleh: (saya() || {}).nama };
    catat('update', 'pengaturan', k);
  }
  const statusTerbit = () => {
    const t = S.terbitan[S.terbitan.length - 1];
    return { versi: t.versi, waktu: t.waktu, oleh: t.oleh, beda: JSON.stringify(susun()) !== JSON.stringify(t.data),
      perubahan: S.log.filter(l => l.waktu > t.waktu && (l.objek === 'pengaturan' || KOLEKSI_SAH.includes(l.objek))).length };
  };

  const F = {
    konsol_masuk({ p_kode }) {
      const peran = KODE[String(p_kode || '').toUpperCase().replace(/[^A-Z0-9]/g, '')];
      const st = peran && S.staf.find(s => s.peran === peran && s.aktif);
      if (!st) return { ok: false, pesan: 'Kode tidak dikenali. Di mode demo, pakai salah satu kode contoh di bawah.' };
      S.sesi = st.id; st.masuk_terakhir = kini(); catat('masuk', 'staf', st.id);
      return { ok: true, staf: st };
    },
    konsol_saya: () => saya(),
    konsol_keluar() { S.sesi = null; return { ok: true }; },
    konsol_ringkasan() {
      const st = wajib(SEMUA);
      return { koleksi: Object.fromEntries(KOLEKSI_SAH.map(k => [k, { jumlah: S.konten[k].length, tampil: S.konten[k].filter(b => b.tampil).length }])),
        pesan_baru: st.peran === 'kontributor' ? null : S.pesan.filter(p => p.status === 'baru').length,
        lamaran_baru: st.peran === 'kontributor' ? null : S.lamaran.filter(p => p.status === 'baru').length,
        draf_menunggu: S.draf.filter(d => d.status === 'menunggu' && (st.peran !== 'kontributor' || d.dibuat_oleh === st.id)).length,
        terbit: statusTerbit() };
    },
    konsol_status_terbit() { wajib(SEMUA); return statusTerbit(); },
    konsol_konten({ p_koleksi }) { wajib(SEMUA); return salin(S.konten[p_koleksi].slice().sort((a, b) => a.urutan - b.urutan)); },
    konsol_konten_simpan({ p_koleksi, p_id_lama, p }) { wajib(EDITOR); return { ok: true, id: terapkanKonten(p_koleksi, p_id_lama, p) }; },
    konsol_konten_tampil({ p_koleksi, p_id, p_tampil }) {
      wajib(EDITOR); const b = S.konten[p_koleksi].find(x => x.id === p_id);
      if (b) { b.tampil = p_tampil; catat(p_tampil ? 'tampilkan' : 'sembunyikan', p_koleksi, p_id, { label: label(b.data, p_id) }); }
      return { ok: true };
    },
    konsol_konten_urut({ p_koleksi, p_id }) { wajib(EDITOR); p_id.forEach((id, i) => { const b = S.konten[p_koleksi].find(x => x.id === id); if (b) b.urutan = i; }); catat('urutkan', p_koleksi); return { ok: true }; },
    konsol_konten_hapus({ p_koleksi, p_id }) {
      wajib(ADMIN); const b = S.konten[p_koleksi].find(x => x.id === p_id);
      S.konten[p_koleksi] = S.konten[p_koleksi].filter(x => x.id !== p_id); catat('delete', p_koleksi, p_id, { label: label(b && b.data, p_id) }); return { ok: true };
    },
    konsol_pengaturan() { wajib(SEMUA); return salin(S.pengaturan); },
    konsol_pengaturan_simpan({ p_kunci, p_data }) { wajib(EDITOR); terapkanPengaturan(p_kunci, p_data); return { ok: true }; },
    konsol_draf_kirim({ p_koleksi, p_butir_id, p_data, p_catatan, p_draf }) {
      const st = wajib(SEMUA);
      let d = p_draf && S.draf.find(x => x.id === p_draf && x.dibuat_oleh === st.id && x.status === 'menunggu');
      if (p_draf && !d) galat('Draf ini sudah tidak dapat diubah.');
      if (d) Object.assign(d, { data: p_data, catatan: p_catatan, dibuat: kini() });
      else S.draf.unshift(d = { id: 'd' + Date.now(), koleksi: p_koleksi, butir_id: p_butir_id || null, data: p_data, status: 'menunggu', catatan: p_catatan, dibuat_oleh: st.id, dibuat_oleh_nama: st.nama, dibuat: kini() });
      catat('draf_dikirim', p_koleksi, p_butir_id || d.id, { label: label(p_data.data || p_data, p_data.id) });
      return { ok: true, id: d.id };
    },
    konsol_draf({ p_status = 'menunggu' }) {
      const st = wajib(SEMUA);
      return salin(S.draf.filter(d => (p_status === 'semua' || d.status === p_status) && (st.peran !== 'kontributor' || d.dibuat_oleh === st.id)).map(d => ({ ...d,
        asli: d.koleksi === 'pengaturan' ? (S.pengaturan[d.butir_id] || {}).data
          : (b => b ? { id: b.id, tampil: b.tampil, data: b.data } : null)(S.konten[d.koleksi].find(x => x.id === d.butir_id)) })));
    },
    konsol_draf_tinjau({ p_id, p_keputusan, p_catatan, p_data }) {
      const st = wajib(EDITOR); const d = S.draf.find(x => x.id === p_id);
      if (!d || d.status !== 'menunggu') galat('Draf ini sudah ditangani.');
      let id = null;
      if (p_keputusan === 'setujui') {
        if (d.koleksi === 'pengaturan') { terapkanPengaturan(d.butir_id, p_data || d.data); id = d.butir_id; }
        else id = terapkanKonten(d.koleksi, d.butir_id, p_data || d.data);
      }
      Object.assign(d, { status: p_keputusan === 'setujui' ? 'disetujui' : 'ditolak', ditinjau: kini(), ditinjau_oleh_nama: st.nama, catatan_tinjau: p_catatan, data: p_data || d.data });
      catat(p_keputusan === 'setujui' ? 'draf_disetujui' : 'draf_ditolak', d.koleksi, id || d.butir_id, { label: label(d.data.data || d.data, d.data.id), oleh: d.dibuat_oleh_nama });
      return { ok: true, id };
    },
    konsol_draf_tarik({ p_id }) { const st = wajib(SEMUA); const d = S.draf.find(x => x.id === p_id && x.dibuat_oleh === st.id); if (d) d.status = 'ditarik'; return { ok: true }; },
    konsol_pratinjau() { wajib(SEMUA); return { ...susun(), pratinjau: true }; },
    konsol_terbitkan({ p_catatan }) {
      const st = wajib(EDITOR);
      if (!statusTerbit().beda) galat('Tidak ada perubahan sejak penerbitan terakhir.');
      const versi = S.terbitan.length + 1;
      S.terbitan.push({ versi, waktu: kini(), oleh: st.nama, sumber: 'terbit', catatan: p_catatan || null, data: susun() });
      catat('terbit', 'situs', String(versi), { label: p_catatan });
      return { ok: true, versi };
    },
    konsol_terbitan() {
      wajib(EDITOR);
      return S.terbitan.slice().reverse().map(({ data, ...t }) => ({ ...t, ukuran: JSON.stringify(data).length }));
    },
    konsol_pulihkan({ p_versi, p_isi_konsol }) {
      const st = wajib(ADMIN); const t = S.terbitan.find(x => x.versi === p_versi);
      if (!t) galat('Versi tidak ditemukan.');
      const versi = S.terbitan.length + 1;
      S.terbitan.push({ versi, waktu: kini(), oleh: st.nama, sumber: 'pulihkan', catatan: 'Dipulihkan dari versi ' + p_versi, data: salin(t.data) });
      if (p_isi_konsol) {
        for (const k of KOLEKSI_SAH) S.konten[k] = (t.data[k] || []).map((b, i) => { const { id, ...data } = b; return { id, urutan: i, tampil: true, data, diubah: kini(), diubah_oleh: st.nama }; });
        for (const k of PENGATURAN_SAH) S.pengaturan[k] = { data: salin(t.data.pengaturan[k] || {}), diubah: kini(), diubah_oleh: st.nama };
      }
      catat('pulihkan', 'situs', String(versi), { label: 'Versi ' + p_versi, isi_konsol: !!p_isi_konsol });
      return { ok: true, versi };
    },
    konsol_versi_data({ p_versi }) { wajib(EDITOR); const t = S.terbitan.find(x => x.versi === p_versi); return t ? salin(t.data) : null; },
    konsol_pesan({ p_status = 'aktif' }) { wajib(EDITOR); return salin(S.pesan.filter(p => p_status === 'semua' || (p_status === 'aktif' && p.status !== 'arsip') || p.status === p_status)); },
    konsol_pesan_ubah({ p_id, p }) {
      const st = wajib(EDITOR); const x = S.pesan.find(m => m.id === p_id);
      if (!x) galat('Pesan tidak ditemukan.');
      if ('status' in p) x.status = p.status; if ('catatan' in p) x.catatan = p.catatan || null;
      x.ditangani = st.nama; x.diubah = kini();
      if ('status' in p && p.status !== 'dibaca') catat('pesan_' + p.status, 'pesan', p_id, { label: x.nama });
      return { ok: true };
    },
    konsol_pesan_hapus({ p_id }) { wajib(ADMIN); const x = S.pesan.find(m => m.id === p_id); S.pesan = S.pesan.filter(m => m.id !== p_id); catat('pesan_dihapus', 'pesan', p_id, { label: x && x.nama }); return { ok: true }; },
    konsol_lamaran({ p_status = 'aktif' }) { wajib(EDITOR); return salin(S.lamaran.filter(p => p_status === 'semua' || (p_status === 'aktif' && !['arsip', 'ditolak'].includes(p.status)) || p.status === p_status)); },
    konsol_lamaran_ubah({ p_id, p }) {
      const st = wajib(EDITOR); const x = S.lamaran.find(m => m.id === p_id);
      if (!x) galat('Lamaran tidak ditemukan.');
      if ('status' in p) x.status = p.status; if ('catatan' in p) x.catatan = p.catatan || null;
      x.ditangani = st.nama; x.diubah = kini();
      if ('status' in p) catat('lamaran_' + p.status, 'lamaran', p_id, { label: x.nama + ' · ' + x.posisi });
      return { ok: true };
    },
    konsol_lamaran_hapus({ p_id }) { wajib(ADMIN); const x = S.lamaran.find(m => m.id === p_id); S.lamaran = S.lamaran.filter(m => m.id !== p_id); catat('lamaran_dihapus', 'lamaran', p_id, { label: x && x.nama }); return { ok: true }; },
    konsol_aktivitas({ p_staf, p_objek } = {}) {
      wajib(EDITOR);
      return salin(S.log.filter(l => (!p_staf || l.staf_id === p_staf) && (!p_objek || l.objek === p_objek)).slice(0, 300));
    },
    konsol_staf_daftar() { wajib(ADMIN); return salin(S.staf); },
    konsol_staf_buat({ p }) {
      const st = wajib(ADMIN);
      if (!['admin', 'editor', 'kontributor'].includes(p.peran)) galat('Peran tidak dikenal.');
      if (p.peran === 'admin' && st.peran !== 'pemilik') galat('Hanya pemilik yang dapat membuat kode admin.');
      if (!p.nama || p.nama.trim().length < 2) galat('Isi nama orang yang akan memegang kode ini.');
      const kode = 'RTD-' + Api.acak().slice(0, 4).toUpperCase() + '-' + Api.acak().slice(0, 4).toUpperCase();
      const x = { id: 'demo-' + Date.now(), nama: p.nama.trim(), peran: p.peran, aktif: true, kode_akhir: kode.slice(-4), catatan: p.catatan || null, dibuat: kini(), dibuat_oleh_nama: st.nama };
      S.staf.push(x); catat('kode_dibuat', 'staf', x.id, { label: x.nama, peran: x.peran });
      return { staf: x, kode, demo: true };
    },
    konsol_staf_ubah({ p_id, p }) {
      const st = wajib(ADMIN); const x = S.staf.find(s => s.id === p_id);
      if (x.peran === 'pemilik' && ('aktif' in p || 'peran' in p)) galat('Kode pemilik tidak dapat dicabut atau diubah perannya.');
      if (x.peran === 'admin' && st.peran !== 'pemilik') galat('Hanya pemilik yang dapat mengubah kode admin.');
      if (p.peran === 'admin' && st.peran !== 'pemilik') galat('Hanya pemilik yang dapat memberi akses admin.');
      Object.assign(x, p); catat('aktif' in p ? (p.aktif ? 'kode_dipulihkan' : 'kode_dicabut') : 'kode_diubah', 'staf', x.id, { label: x.nama });
      return salin(S.staf);
    },
    konsol_staf_kode_baru({ p_id }) {
      wajib(ADMIN); const x = S.staf.find(s => s.id === p_id);
      const kode = 'RTD-' + Api.acak().slice(0, 4).toUpperCase() + '-' + Api.acak().slice(0, 4).toUpperCase();
      x.kode_akhir = kode.slice(-4); catat('kode_diganti', 'staf', x.id, { label: x.nama });
      return { staf: x, kode, demo: true };
    },
    konsol_staf_hapus({ p_id }) {
      const st = wajib(ADMIN); const x = S.staf.find(s => s.id === p_id);
      if (x.peran === 'pemilik' || x.id === st.id) galat('Kode ini tidak dapat dihapus.');
      if (x.aktif) galat('Cabut kodenya dulu, baru hapus.');
      S.staf = S.staf.filter(s => s.id !== p_id); catat('kode_dihapus', 'staf', p_id, { label: x.nama });
      return salin(S.staf);
    }
  };

  async function panggil(nama, args) {
    if (!F[nama]) galat('Fungsi demo tidak ada: ' + nama);
    await new Promise(r => setTimeout(r, 120));
    const hasil = F[nama](args || {});
    simpan();
    // Pratinjau situs di tab yang sama membaca salinan ini.
    try { localStorage.setItem('rtd-demo-pratinjau', JSON.stringify(susun())); } catch (e) { /* penuh */ }
    return hasil;
  }

  /** Di demo, gambar disimpan sebagai data URL kecil agar bertahan saat tab dimuat ulang. */
  async function unggah(blob) {
    return new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(blob); });
  }
  const cvContoh = () => 'data:text/plain;charset=utf-8,' + encodeURIComponent('Mode demo: CV asli tersimpan privat di Supabase dan dibuka lewat tautan sementara.');

  return { siapkan, panggil, unggah, cvContoh, KODE };
})();
