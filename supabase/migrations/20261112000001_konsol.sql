-- =====================================================================
--  Konsol RTD: isi situs, kode akses, log aktivitas, penerbitan, pesan, lamaran
--
--  Semua tabel ada di skema "rtd" yang TIDAK diekspos ke API. Peramban hanya
--  memanggil fungsi di skema public:
--    situs()                      siapa saja: versi terakhir yang diterbitkan
--    kirim_pesan(), kirim_lamaran()  siapa saja: formulir situs (dibatasi per IP)
--    konsol_*()                   sesi konsol yang sudah memasukkan kode akses
--
--  Peran kode akses (sama dengan konsol IEEF):
--    pemilik     satu orang, tidak bisa dicabut; mengelola kode admin
--    admin       semua hal; mengelola kode editor/kontributor; menghapus isi; memulihkan versi
--    editor      mengubah isi, membaca pesan dan lamaran, menyetujui draf, menerbitkan
--    kontributor mengirim draf usulan yang ditinjau editor
--  Peramban memakai sesi anonim Supabase ("Allow anonymous sign-ins" harus aktif);
--  memasukkan kode menautkan sesi itu ke satu baris rtd.staf selama 12 jam.
-- =====================================================================
create extension if not exists pgcrypto with schema extensions;
create schema if not exists rtd;
revoke all on schema rtd from public, anon, authenticated;

-- ---------------------------------------------------------------- tabel
create table rtd.staf (
  id             uuid primary key default gen_random_uuid(),
  nama           text not null check (char_length(nama) between 2 and 80),
  peran          text not null check (peran in ('pemilik', 'admin', 'editor', 'kontributor')),
  kode_hash      text not null unique,
  kode_akhir     text,
  aktif          boolean not null default true,
  catatan        text,
  dibuat         timestamptz not null default now(),
  dibuat_oleh    uuid references rtd.staf (id) on delete set null,
  masuk_terakhir timestamptz
);
create unique index staf_satu_pemilik on rtd.staf ((true)) where peran = 'pemilik';

create table rtd.sesi (
  uid      uuid primary key,
  staf_id  uuid not null references rtd.staf (id) on delete cascade,
  dibuat   timestamptz not null default now(),
  berakhir timestamptz not null
);

create table rtd.percobaan_masuk (
  id      bigserial primary key,
  uid     uuid,
  ip_hash text,
  waktu   timestamptz not null default now(),
  ok      boolean not null
);
create index percobaan_masuk_waktu on rtd.percobaan_masuk (waktu desc);

-- Satu baris per butir koleksi. id = slug yang tampil di ?id= situs.
create table rtd.konten (
  koleksi     text not null,
  id          text not null check (id ~ '^[a-zA-Z0-9][a-zA-Z0-9_-]{0,119}$'),
  urutan      integer not null default 0,
  tampil      boolean not null default true,
  data        jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  dibuat      timestamptz not null default now(),
  diubah      timestamptz not null default now(),
  diubah_oleh uuid references rtd.staf (id) on delete set null,
  primary key (koleksi, id)
);

-- Dokumen tunggal: kontak, angka, kpr, teks.
create table rtd.pengaturan (
  kunci       text primary key,
  data        jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  diubah      timestamptz not null default now(),
  diubah_oleh uuid references rtd.staf (id) on delete set null
);

create table rtd.draf (
  id             uuid primary key default gen_random_uuid(),
  koleksi        text not null,                   -- nama koleksi, atau 'pengaturan'
  butir_id       text,                            -- id butir yang diubah; null = butir baru; kunci bila pengaturan
  data           jsonb not null,                  -- konten: {id, tampil, data}; pengaturan: isi dokumen
  status         text not null default 'menunggu' check (status in ('menunggu', 'disetujui', 'ditolak', 'ditarik')),
  catatan        text,
  dibuat_oleh    uuid references rtd.staf (id) on delete set null,
  dibuat         timestamptz not null default now(),
  ditinjau_oleh  uuid references rtd.staf (id) on delete set null,
  ditinjau       timestamptz,
  catatan_tinjau text
);

create table rtd.terbitan (
  versi   bigserial primary key,
  waktu   timestamptz not null default now(),
  staf_id uuid references rtd.staf (id) on delete set null,
  sumber  text not null default 'terbit' check (sumber in ('awal', 'terbit', 'pulihkan')),
  catatan text,
  data    jsonb not null
);

create table rtd.log (
  id       bigserial primary key,
  waktu    timestamptz not null default now(),
  staf_id  uuid references rtd.staf (id) on delete set null,
  aksi     text not null,
  objek    text,
  objek_id text,
  rincian  jsonb not null default '{}'::jsonb
);
create index log_waktu on rtd.log (waktu desc);

create table rtd.pesan (
  id          uuid primary key default gen_random_uuid(),
  dibuat      timestamptz not null default now(),
  nama        text not null,
  wa          text not null,
  email       text,
  proyek      text,
  isi         text,
  halaman     text,
  status      text not null default 'baru' check (status in ('baru', 'dibaca', 'ditindaklanjuti', 'arsip')),
  catatan     text,
  ditangani   uuid references rtd.staf (id) on delete set null,
  diubah      timestamptz,
  ip_hash     text
);
create index pesan_dibuat on rtd.pesan (dibuat desc);

create table rtd.lamaran (
  id           uuid primary key default gen_random_uuid(),
  dibuat       timestamptz not null default now(),
  lowongan_id  text,
  posisi       text,
  nama         text not null,
  wa           text not null,
  email        text,
  kota         text,
  pendidikan   text,
  pengalaman   text,
  cv_path      text not null unique,
  cv_nama      text,
  status       text not null default 'baru' check (status in ('baru', 'ditinjau', 'wawancara', 'diterima', 'ditolak', 'arsip')),
  catatan      text,
  ditangani    uuid references rtd.staf (id) on delete set null,
  diubah       timestamptz,
  ip_hash      text
);
create index lamaran_dibuat on rtd.lamaran (dibuat desc);

alter table rtd.staf enable row level security;
alter table rtd.sesi enable row level security;
alter table rtd.percobaan_masuk enable row level security;
alter table rtd.konten enable row level security;
alter table rtd.pengaturan enable row level security;
alter table rtd.draf enable row level security;
alter table rtd.terbitan enable row level security;
alter table rtd.log enable row level security;
alter table rtd.pesan enable row level security;
alter table rtd.lamaran enable row level security;
-- Tanpa policy: tidak ada akses langsung. Semua lewat fungsi security definer di bawah.

-- ---------------------------------------------------------------- daftar sah
create or replace function rtd.koleksi_sah() returns text[] language sql immutable set search_path = '' as $$
  select array['proyek', 'portofolio', 'spesifikasi', 'legalitas', 'penghargaan', 'testimoni', 'tim', 'pemasaran',
               'bank', 'hero', 'promo', 'berita', 'karier', 'galeri', 'yayasan_foto', 'reel', 'youtube']
$$;
create or replace function rtd.pengaturan_sah() returns text[] language sql immutable set search_path = '' as $$
  select array['kontak', 'angka', 'kpr', 'teks']
$$;

-- ---------------------------------------------------------------- pembantu
create or replace function rtd.acak(n int) returns text
language plpgsql volatile set search_path = '' as $$
declare a text := '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; b bytea := extensions.gen_random_bytes(n); r text := ''; i int;
begin
  for i in 0..n - 1 loop r := r || substr(a, (get_byte(b, i) % length(a)) + 1, 1); end loop;
  return r;
end $$;
create or replace function rtd.kode_baru() returns text language sql volatile set search_path = '' as
  $$ select 'RTD-' || rtd.acak(4) || '-' || rtd.acak(4) $$;
create or replace function rtd.normal(t text) returns text language sql immutable set search_path = '' as
  $$ select regexp_replace(upper(coalesce(t, '')), '[^A-Z0-9]', '', 'g') $$;
create or replace function rtd.hash(t text) returns text language sql immutable set search_path = '' as
  $$ select encode(extensions.digest(rtd.normal(t), 'sha256'), 'hex') $$;

/* IP pengunjung dari header permintaan PostgREST, di-hash (tidak pernah disimpan mentah). */
create or replace function rtd.ip_hash() returns text language sql stable set search_path = '' as $$
  select encode(extensions.digest('rtd-ip:' || coalesce(
    split_part(nullif(current_setting('request.headers', true), '')::jsonb ->> 'x-forwarded-for', ',', 1),
    nullif(current_setting('request.headers', true), '')::jsonb ->> 'cf-connecting-ip', 'tanpa-ip'), 'sha256'), 'hex')
$$;

create or replace function rtd.staf_kini() returns rtd.staf
language sql stable security definer set search_path = '' as $$
  select s.* from rtd.staf s join rtd.sesi ss on ss.staf_id = s.id
   where ss.uid = auth.uid() and ss.berakhir > now() and s.aktif limit 1
$$;

create or replace function rtd.wajib(p_peran text[]) returns rtd.staf
language plpgsql stable security definer set search_path = '' as $$
declare st rtd.staf;
begin
  select * into st from rtd.staf_kini();
  if st.id is null then
    raise exception 'Sesi Anda sudah berakhir. Masukkan kode akses lagi.' using hint = 'ERR_SESI', errcode = '28000';
  end if;
  if not (st.peran = any (p_peran)) then
    raise exception 'Kode akses Anda tidak mengizinkan tindakan ini.' using hint = 'ERR_DILARANG', errcode = '42501';
  end if;
  return st;
end $$;

create or replace function rtd.staf_json(s rtd.staf) returns jsonb language sql stable set search_path = '' as $$
  select jsonb_build_object('id', s.id, 'nama', s.nama, 'peran', s.peran, 'kode_akhir', s.kode_akhir, 'aktif', s.aktif,
    'catatan', s.catatan, 'dibuat', s.dibuat, 'masuk_terakhir', s.masuk_terakhir,
    'dibuat_oleh_nama', (select nama from rtd.staf c where c.id = s.dibuat_oleh))
$$;

create or replace function rtd.nama_staf(p uuid) returns text language sql stable set search_path = '' as
  $$ select nama from rtd.staf where id = p $$;

/* Label manusiawi sebuah butir untuk log dan daftar draf. */
create or replace function rtd.label(d jsonb, cadangan text default null) returns text language sql immutable set search_path = '' as $$
  select left(coalesce(d->>'nama', d->>'judul', d->>'posisi', d->>'label', d->>'baris', d->>'alt', d->>'ket', cadangan), 120)
$$;

create or replace function rtd.catat(p_aksi text, p_objek text, p_id text, p_rincian jsonb default '{}'::jsonb)
returns void language sql volatile security definer set search_path = '' as $$
  insert into rtd.log (staf_id, aksi, objek, objek_id, rincian)
  values ((select id from rtd.staf_kini()), p_aksi, p_objek, p_id, coalesce(p_rincian, '{}'::jsonb))
$$;

-- Setiap perubahan isi masuk log dengan nama pemegang kode.
create or replace function rtd.log_konten() returns trigger
language plpgsql security definer set search_path = '' as $$
declare r record := coalesce(new, old); v_aksi text := lower(tg_op);
begin
  if current_setting('rtd.impor', true) = '1' then return null; end if;   -- impor dicatat sekali
  if tg_op = 'UPDATE' and new.data is not distinct from old.data and new.tampil is distinct from old.tampil then
    v_aksi := case when new.tampil then 'tampilkan' else 'sembunyikan' end;
  elsif tg_op = 'UPDATE' and new.data is not distinct from old.data and new.id = old.id and new.tampil = old.tampil then
    return null;                                     -- hanya urutan berubah; dicatat sekali oleh konsol_konten_urut
  end if;
  insert into rtd.log (staf_id, aksi, objek, objek_id, rincian)
  values ((select id from rtd.staf_kini()), v_aksi, r.koleksi, r.id, jsonb_build_object('label', rtd.label(r.data, r.id)));
  return null;
end $$;
create trigger konten_log after insert or update or delete on rtd.konten for each row execute function rtd.log_konten();

create or replace function rtd.log_pengaturan() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.data is not distinct from old.data or current_setting('rtd.impor', true) = '1' then return null; end if;
  insert into rtd.log (staf_id, aksi, objek, objek_id, rincian)
  values ((select id from rtd.staf_kini()), 'update', 'pengaturan', new.kunci, '{}'::jsonb);
  return null;
end $$;
create trigger pengaturan_log after update on rtd.pengaturan for each row execute function rtd.log_pengaturan();

-- ---------------------------------------------------------------- susun snapshot situs
create or replace function rtd.susun_situs() returns jsonb
language sql stable security definer set search_path = '' as $$
  select
    (select jsonb_object_agg(k, coalesce((
        select jsonb_agg(jsonb_build_object('id', c.id) || c.data order by c.urutan, c.id)
          from rtd.konten c where c.koleksi = k and c.tampil), '[]'::jsonb))
       from unnest(rtd.koleksi_sah()) k)
    || jsonb_build_object('pengaturan', coalesce((select jsonb_object_agg(kunci, data) from rtd.pengaturan
                                                    where kunci = any (rtd.pengaturan_sah())), '{}'::jsonb))
$$;

-- ---------------------------------------------------------------- publik: situs dan formulir
create or replace function public.situs() returns jsonb
language sql stable security definer set search_path = '' as $$
  select data || jsonb_build_object('versi', versi, 'diterbitkan', waktu)
    from rtd.terbitan order by versi desc limit 1
$$;

create or replace function public.kirim_pesan(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare v_ip text := rtd.ip_hash(); v_nama text := left(trim(coalesce(p->>'nama', '')), 120);
        v_wa text := left(trim(coalesce(p->>'wa', '')), 30);
begin
  if coalesce(p->>'situs_web', '') <> '' then return jsonb_build_object('ok', true); end if;   -- jebakan bot
  if char_length(v_nama) < 2 then raise exception 'Nama belum diisi.'; end if;
  if char_length(regexp_replace(v_wa, '\D', '', 'g')) < 9 then raise exception 'Nomor WhatsApp belum lengkap.'; end if;
  if (select count(*) from rtd.pesan where ip_hash = v_ip and dibuat > now() - interval '1 hour') >= 5
     or (select count(*) from rtd.pesan where dibuat > now() - interval '10 minutes') >= 60 then
    raise exception 'Terlalu banyak pesan dalam waktu singkat. Silakan hubungi kami lewat WhatsApp.';
  end if;
  insert into rtd.pesan (nama, wa, email, proyek, isi, halaman, ip_hash)
  values (v_nama, v_wa, nullif(left(trim(coalesce(p->>'email', '')), 160), ''), nullif(left(trim(coalesce(p->>'proyek', '')), 160), ''),
          nullif(left(trim(coalesce(p->>'pesan', '')), 4000), ''), left(coalesce(p->>'halaman', ''), 80), v_ip);
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.kirim_lamaran(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare v_ip text := rtd.ip_hash(); v_cv text := coalesce(p->>'cv_path', '');
        v_nama text := left(trim(coalesce(p->>'nama', '')), 120); v_wa text := left(trim(coalesce(p->>'wa', '')), 30);
        v_low jsonb;
begin
  if coalesce(p->>'situs_web', '') <> '' then return jsonb_build_object('ok', true); end if;
  if char_length(v_nama) < 2 then raise exception 'Nama belum diisi.'; end if;
  if char_length(regexp_replace(v_wa, '\D', '', 'g')) < 9 then raise exception 'Nomor WhatsApp belum lengkap.'; end if;
  if v_cv !~ '^masuk/\d{4}-\d{2}-\d{2}/[0-9a-f-]{36}\.pdf$' then raise exception 'CV belum terlampir.'; end if;
  if not exists (select 1 from storage.objects where bucket_id = 'lamaran' and name = v_cv and created_at > now() - interval '2 hours') then
    raise exception 'CV tidak ditemukan. Unggah ulang lalu kirim lagi.';
  end if;
  if (select count(*) from rtd.lamaran where ip_hash = v_ip and dibuat > now() - interval '1 hour') >= 3
     or (select count(*) from rtd.lamaran where dibuat > now() - interval '10 minutes') >= 40 then
    raise exception 'Terlalu banyak lamaran dalam waktu singkat. Coba lagi nanti atau lamar lewat WhatsApp.';
  end if;
  select data || jsonb_build_object('tampil', tampil) into v_low from rtd.konten where koleksi = 'karier' and id = p->>'lowongan_id';
  if v_low is null or not coalesce((v_low->>'buka')::boolean, false) or not (v_low->>'tampil')::boolean then
    raise exception 'Lowongan ini sudah ditutup.';
  end if;
  insert into rtd.lamaran (lowongan_id, posisi, nama, wa, email, kota, pendidikan, pengalaman, cv_path, cv_nama, ip_hash)
  values (p->>'lowongan_id', v_low->>'posisi', v_nama, v_wa,
          nullif(left(trim(coalesce(p->>'email', '')), 160), ''), nullif(left(trim(coalesce(p->>'kota', '')), 80), ''),
          nullif(left(trim(coalesce(p->>'pendidikan', '')), 120), ''), nullif(left(trim(coalesce(p->>'pengalaman', '')), 2000), ''),
          v_cv, left(coalesce(p->>'cv_nama', ''), 160), v_ip);
  return jsonb_build_object('ok', true);
end $$;

-- ---------------------------------------------------------------- masuk / keluar
create or replace function public.konsol_masuk(p_kode text) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare v_uid uuid := auth.uid(); v_ip text := rtd.ip_hash(); st rtd.staf;
begin
  if v_uid is null then raise exception 'Sesi peramban belum siap. Muat ulang halaman.' using hint = 'ERR_SESI'; end if;
  if (select count(*) from rtd.percobaan_masuk where (uid = v_uid or ip_hash = v_ip) and not ok and waktu > now() - interval '15 minutes') >= 8 then
    return jsonb_build_object('ok', false, 'pesan', 'Terlalu banyak kode salah. Tunggu 15 menit, lalu coba lagi.');
  end if;
  select * into st from rtd.staf where kode_hash = rtd.hash(p_kode) and aktif;
  if st.id is null then
    insert into rtd.percobaan_masuk (uid, ip_hash, ok) values (v_uid, v_ip, false);
    return jsonb_build_object('ok', false, 'pesan', 'Kode akses tidak dikenali atau sudah dicabut.');
  end if;
  insert into rtd.percobaan_masuk (uid, ip_hash, ok) values (v_uid, v_ip, true);
  insert into rtd.sesi (uid, staf_id, berakhir) values (v_uid, st.id, now() + interval '12 hours')
  on conflict (uid) do update set staf_id = excluded.staf_id, dibuat = now(), berakhir = excluded.berakhir;
  update rtd.staf set masuk_terakhir = now() where id = st.id;
  insert into rtd.log (staf_id, aksi, objek, objek_id) values (st.id, 'masuk', 'staf', st.id::text);
  return jsonb_build_object('ok', true, 'staf', rtd.staf_json(st));
end $$;

create or replace function public.konsol_saya() returns jsonb
language sql stable security definer set search_path = '' as $$
  select case when s.id is null then null else rtd.staf_json(s) end from rtd.staf_kini() s
$$;

create or replace function public.konsol_keluar() returns jsonb
language sql volatile security definer set search_path = '' as $$
  delete from rtd.sesi where uid = auth.uid();
  select jsonb_build_object('ok', true);
$$;

-- ---------------------------------------------------------------- kode akses
create or replace function public.konsol_staf_daftar() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  perform rtd.wajib(array['pemilik', 'admin']);
  return (select coalesce(jsonb_agg(rtd.staf_json(s) order by array_position(array['pemilik', 'admin', 'editor', 'kontributor'], s.peran),
          not s.aktif, s.nama), '[]'::jsonb) from rtd.staf s);
end $$;

create or replace function public.konsol_staf_buat(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin']); v_peran text := p->>'peran'; v_kode text; x rtd.staf;
begin
  if v_peran not in ('admin', 'editor', 'kontributor') then raise exception 'Peran tidak dikenal.'; end if;
  if v_peran = 'admin' and st.peran <> 'pemilik' then raise exception 'Hanya pemilik yang dapat membuat kode admin.'; end if;
  if char_length(trim(coalesce(p->>'nama', ''))) < 2 then raise exception 'Isi nama orang yang akan memegang kode ini.'; end if;
  v_kode := rtd.kode_baru();
  insert into rtd.staf (nama, peran, kode_hash, kode_akhir, catatan, dibuat_oleh)
  values (trim(p->>'nama'), v_peran, rtd.hash(v_kode), right(v_kode, 4), nullif(trim(coalesce(p->>'catatan', '')), ''), st.id)
  returning * into x;
  insert into rtd.log (staf_id, aksi, objek, objek_id, rincian) values (st.id, 'kode_dibuat', 'staf', x.id::text, jsonb_build_object('label', x.nama, 'peran', x.peran));
  return jsonb_build_object('staf', rtd.staf_json(x), 'kode', v_kode);
end $$;

create or replace function public.konsol_staf_ubah(p_id uuid, p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin']); x rtd.staf; v_peran text;
begin
  select * into x from rtd.staf where id = p_id for update;
  if x.id is null then raise exception 'Kode tidak ditemukan.'; end if;
  if x.peran = 'pemilik' and (p ? 'aktif' or p ? 'peran') then raise exception 'Kode pemilik tidak dapat dicabut atau diubah perannya.'; end if;
  if x.peran = 'pemilik' and st.peran <> 'pemilik' then raise exception 'Hanya pemilik yang dapat mengubah kode pemilik.'; end if;
  if x.peran = 'admin' and st.peran <> 'pemilik' then raise exception 'Hanya pemilik yang dapat mengubah kode admin.'; end if;
  v_peran := coalesce(p->>'peran', x.peran);
  if v_peran not in ('pemilik', 'admin', 'editor', 'kontributor') or (v_peran = 'pemilik' and x.peran <> 'pemilik') then raise exception 'Peran tidak dikenal.'; end if;
  if v_peran = 'admin' and x.peran <> 'admin' and st.peran <> 'pemilik' then raise exception 'Hanya pemilik yang dapat memberi akses admin.'; end if;
  update rtd.staf set
    nama = coalesce(nullif(trim(p->>'nama'), ''), nama),
    peran = v_peran,
    aktif = coalesce((p->>'aktif')::boolean, aktif),
    catatan = case when p ? 'catatan' then nullif(trim(p->>'catatan'), '') else catatan end
  where id = x.id;
  if coalesce((p->>'aktif')::boolean, true) = false then delete from rtd.sesi where staf_id = x.id; end if;
  insert into rtd.log (staf_id, aksi, objek, objek_id, rincian)
  values (st.id, case when (p->>'aktif') = 'false' then 'kode_dicabut' when (p->>'aktif') = 'true' then 'kode_dipulihkan' else 'kode_diubah' end,
          'staf', x.id::text, p || jsonb_build_object('label', x.nama));
  return public.konsol_staf_daftar();
end $$;

create or replace function public.konsol_staf_kode_baru(p_id uuid) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin']); x rtd.staf; v_kode text;
begin
  select * into x from rtd.staf where id = p_id for update;
  if x.id is null then raise exception 'Kode tidak ditemukan.'; end if;
  if x.peran in ('pemilik', 'admin') and st.peran <> 'pemilik' and x.id <> st.id then raise exception 'Hanya pemilik yang dapat mengganti kode ini.'; end if;
  v_kode := rtd.kode_baru();
  update rtd.staf set kode_hash = rtd.hash(v_kode), kode_akhir = right(v_kode, 4) where id = x.id returning * into x;
  delete from rtd.sesi where staf_id = x.id and uid <> auth.uid();
  insert into rtd.log (staf_id, aksi, objek, objek_id, rincian) values (st.id, 'kode_diganti', 'staf', x.id::text, jsonb_build_object('label', x.nama));
  return jsonb_build_object('staf', rtd.staf_json(x), 'kode', v_kode);
end $$;

create or replace function public.konsol_staf_hapus(p_id uuid) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin']); x rtd.staf;
begin
  select * into x from rtd.staf where id = p_id for update;
  if x.id is null then raise exception 'Kode tidak ditemukan.'; end if;
  if x.peran = 'pemilik' or x.id = st.id then raise exception 'Kode ini tidak dapat dihapus.'; end if;
  if x.peran = 'admin' and st.peran <> 'pemilik' then raise exception 'Hanya pemilik yang dapat menghapus kode admin.'; end if;
  if x.aktif then raise exception 'Cabut kodenya dulu, baru hapus.'; end if;
  delete from rtd.staf where id = x.id;
  insert into rtd.log (staf_id, aksi, objek, objek_id, rincian) values (st.id, 'kode_dihapus', 'staf', x.id::text, jsonb_build_object('label', x.nama));
  return public.konsol_staf_daftar();
end $$;

-- ---------------------------------------------------------------- isi: koleksi
create or replace function public.konsol_konten(p_koleksi text) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  perform rtd.wajib(array['pemilik', 'admin', 'editor', 'kontributor']);
  if not (p_koleksi = any (rtd.koleksi_sah())) then raise exception 'Koleksi tidak dikenal.'; end if;
  return (select coalesce(jsonb_agg(jsonb_build_object('id', c.id, 'urutan', c.urutan, 'tampil', c.tampil, 'data', c.data,
            'diubah', c.diubah, 'diubah_oleh', rtd.nama_staf(c.diubah_oleh)) order by c.urutan, c.id), '[]'::jsonb)
          from rtd.konten c where c.koleksi = p_koleksi);
end $$;

/* Terapkan satu butir. p = {id, tampil, data}. p_id_lama null = butir baru. Dipakai simpan langsung dan persetujuan draf. */
create or replace function rtd.terapkan_konten(p_koleksi text, p_id_lama text, p jsonb, p_staf uuid) returns text
language plpgsql volatile security definer set search_path = '' as $$
declare v_id text := trim(coalesce(p->>'id', '')); v_data jsonb := coalesce(p->'data', '{}'::jsonb) - 'id';
        v_tampil boolean := coalesce((p->>'tampil')::boolean, true); n int;
begin
  if not (p_koleksi = any (rtd.koleksi_sah())) then raise exception 'Koleksi tidak dikenal.'; end if;
  if v_id !~ '^[a-zA-Z0-9][a-zA-Z0-9_-]{0,119}$' then
    raise exception 'Alamat web (id) hanya boleh huruf, angka, tanda hubung, dan garis bawah.';
  end if;
  if jsonb_typeof(v_data) <> 'object' then raise exception 'Isian tidak valid.'; end if;
  if p_id_lama is null then
    if exists (select 1 from rtd.konten where koleksi = p_koleksi and id = v_id) then
      raise exception 'Alamat web "%" sudah dipakai butir lain. Ganti alamatnya.', v_id;
    end if;
    insert into rtd.konten (koleksi, id, urutan, tampil, data, diubah_oleh)
    values (p_koleksi, v_id, coalesce((select max(urutan) + 1 from rtd.konten where koleksi = p_koleksi), 0), v_tampil, v_data, p_staf);
  else
    if v_id <> p_id_lama and exists (select 1 from rtd.konten where koleksi = p_koleksi and id = v_id) then
      raise exception 'Alamat web "%" sudah dipakai butir lain. Ganti alamatnya.', v_id;
    end if;
    update rtd.konten set id = v_id, tampil = v_tampil, data = v_data, diubah = now(), diubah_oleh = p_staf
     where koleksi = p_koleksi and id = p_id_lama;
    get diagnostics n = row_count;
    if n = 0 then raise exception 'Butir aslinya sudah tidak ada. Muat ulang daftar.'; end if;
  end if;
  return v_id;
end $$;

create or replace function public.konsol_konten_simpan(p_koleksi text, p_id_lama text, p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin', 'editor']);
begin
  return jsonb_build_object('ok', true, 'id', rtd.terapkan_konten(p_koleksi, nullif(p_id_lama, ''), p, st.id));
end $$;

create or replace function public.konsol_konten_tampil(p_koleksi text, p_id text, p_tampil boolean) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin', 'editor']);
begin
  update rtd.konten set tampil = p_tampil, diubah = now(), diubah_oleh = st.id where koleksi = p_koleksi and id = p_id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.konsol_konten_urut(p_koleksi text, p_id text[]) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin', 'editor']);
begin
  update rtd.konten c set urutan = u.n - 1, diubah = now(), diubah_oleh = st.id
    from unnest(p_id) with ordinality as u(id, n)
   where c.koleksi = p_koleksi and c.id = u.id and c.urutan <> u.n - 1;
  insert into rtd.log (staf_id, aksi, objek) values (st.id, 'urutkan', p_koleksi);
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.konsol_konten_hapus(p_koleksi text, p_id text) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin']);
begin
  delete from rtd.konten where koleksi = p_koleksi and id = p_id;
  return jsonb_build_object('ok', true);
end $$;

-- ---------------------------------------------------------------- isi: pengaturan
create or replace function public.konsol_pengaturan() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  perform rtd.wajib(array['pemilik', 'admin', 'editor', 'kontributor']);
  return coalesce((select jsonb_object_agg(kunci, jsonb_build_object('data', data, 'diubah', diubah, 'diubah_oleh', rtd.nama_staf(diubah_oleh)))
                   from rtd.pengaturan), '{}'::jsonb);
end $$;

create or replace function rtd.terapkan_pengaturan(p_kunci text, p_data jsonb, p_staf uuid) returns void
language plpgsql volatile security definer set search_path = '' as $$
begin
  if not (p_kunci = any (rtd.pengaturan_sah())) then raise exception 'Pengaturan tidak dikenal.'; end if;
  if jsonb_typeof(p_data) <> 'object' then raise exception 'Isian tidak valid.'; end if;
  insert into rtd.pengaturan (kunci, data, diubah_oleh) values (p_kunci, p_data, p_staf)
  on conflict (kunci) do update set data = excluded.data, diubah = now(), diubah_oleh = excluded.diubah_oleh;
end $$;

create or replace function public.konsol_pengaturan_simpan(p_kunci text, p_data jsonb) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin', 'editor']);
begin
  perform rtd.terapkan_pengaturan(p_kunci, p_data, st.id);
  return jsonb_build_object('ok', true);
end $$;

-- ---------------------------------------------------------------- draf (kontributor) dan tinjauan
create or replace function public.konsol_draf_kirim(p_koleksi text, p_butir_id text, p_data jsonb, p_catatan text default null, p_draf uuid default null) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin', 'editor', 'kontributor']); d rtd.draf;
begin
  if not (p_koleksi = any (rtd.koleksi_sah()) or (p_koleksi = 'pengaturan' and p_butir_id = any (rtd.pengaturan_sah()))) then
    raise exception 'Jenis isi tidak dikenal.';
  end if;
  if p_draf is not null then
    update rtd.draf set data = p_data, catatan = p_catatan, dibuat = now()
     where id = p_draf and dibuat_oleh = st.id and status = 'menunggu' returning * into d;
    if d.id is null then raise exception 'Draf ini sudah tidak dapat diubah.'; end if;
  else
    insert into rtd.draf (koleksi, butir_id, data, catatan, dibuat_oleh) values (p_koleksi, nullif(p_butir_id, ''), p_data, p_catatan, st.id) returning * into d;
  end if;
  insert into rtd.log (staf_id, aksi, objek, objek_id, rincian)
  values (st.id, 'draf_dikirim', p_koleksi, coalesce(p_butir_id, d.id::text), jsonb_build_object('label', rtd.label(p_data->'data', p_data->>'id')));
  return jsonb_build_object('ok', true, 'id', d.id);
end $$;

create or replace function public.konsol_draf(p_status text default 'menunggu') returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin', 'editor', 'kontributor']);
begin
  return (select coalesce(jsonb_agg(jsonb_build_object('id', d.id, 'koleksi', d.koleksi, 'butir_id', d.butir_id, 'data', d.data,
      'status', d.status, 'catatan', d.catatan, 'dibuat', d.dibuat, 'catatan_tinjau', d.catatan_tinjau, 'ditinjau', d.ditinjau,
      'dibuat_oleh', d.dibuat_oleh, 'dibuat_oleh_nama', rtd.nama_staf(d.dibuat_oleh), 'ditinjau_oleh_nama', rtd.nama_staf(d.ditinjau_oleh),
      'asli', case when d.koleksi = 'pengaturan' then (select data from rtd.pengaturan where kunci = d.butir_id)
                   else (select jsonb_build_object('id', c.id, 'tampil', c.tampil, 'data', c.data) from rtd.konten c
                          where c.koleksi = d.koleksi and c.id = d.butir_id) end) order by d.dibuat desc), '[]'::jsonb)
    from rtd.draf d
    where (p_status = 'semua' or d.status = p_status)
      and (st.peran <> 'kontributor' or d.dibuat_oleh = st.id));
end $$;

create or replace function public.konsol_draf_tinjau(p_id uuid, p_keputusan text, p_catatan text default null, p_data jsonb default null) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin', 'editor']); d rtd.draf; v_id text;
begin
  select * into d from rtd.draf where id = p_id for update;
  if d.id is null or d.status <> 'menunggu' then raise exception 'Draf ini sudah ditangani.'; end if;
  if p_keputusan = 'setujui' then
    if d.koleksi = 'pengaturan' then
      perform rtd.terapkan_pengaturan(d.butir_id, coalesce(p_data, d.data), st.id);
      v_id := d.butir_id;
    else
      v_id := rtd.terapkan_konten(d.koleksi, d.butir_id, coalesce(p_data, d.data), st.id);
    end if;
  elsif p_keputusan <> 'tolak' then raise exception 'Keputusan tidak dikenal.';
  end if;
  update rtd.draf set status = case when p_keputusan = 'setujui' then 'disetujui' else 'ditolak' end,
    ditinjau_oleh = st.id, ditinjau = now(), catatan_tinjau = p_catatan, data = coalesce(p_data, data) where id = d.id;
  insert into rtd.log (staf_id, aksi, objek, objek_id, rincian)
  values (st.id, case when p_keputusan = 'setujui' then 'draf_disetujui' else 'draf_ditolak' end, d.koleksi, coalesce(v_id, d.butir_id),
          jsonb_build_object('label', rtd.label(d.data->'data', d.data->>'id'), 'oleh', rtd.nama_staf(d.dibuat_oleh)));
  return jsonb_build_object('ok', true, 'id', v_id);
end $$;

create or replace function public.konsol_draf_tarik(p_id uuid) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin', 'editor', 'kontributor']);
begin
  update rtd.draf set status = 'ditarik' where id = p_id and dibuat_oleh = st.id and status = 'menunggu';
  return jsonb_build_object('ok', true);
end $$;

-- ---------------------------------------------------------------- terbitkan dan pratinjau
create or replace function public.konsol_pratinjau() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  perform rtd.wajib(array['pemilik', 'admin', 'editor', 'kontributor']);
  return rtd.susun_situs() || jsonb_build_object('versi', null, 'diterbitkan', null, 'pratinjau', true);
end $$;

create or replace function public.konsol_status_terbit() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare t rtd.terbitan;
begin
  perform rtd.wajib(array['pemilik', 'admin', 'editor', 'kontributor']);
  select * into t from rtd.terbitan order by versi desc limit 1;
  return jsonb_build_object(
    'versi', t.versi, 'waktu', t.waktu, 'oleh', rtd.nama_staf(t.staf_id),
    'beda', t.versi is null or rtd.susun_situs() is distinct from t.data,
    'perubahan', (select count(*) from rtd.log l where l.waktu > coalesce(t.waktu, '-infinity'::timestamptz)
                    and (l.objek = 'pengaturan' or l.objek = any (rtd.koleksi_sah()))
                    and l.aksi in ('insert', 'update', 'delete', 'tampilkan', 'sembunyikan', 'urutkan', 'draf_disetujui')));
end $$;

create or replace function public.konsol_terbitkan(p_catatan text default null) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin', 'editor']); v_data jsonb := rtd.susun_situs(); v_versi bigint;
begin
  if (select data from rtd.terbitan order by versi desc limit 1) is not distinct from v_data then
    raise exception 'Tidak ada perubahan sejak penerbitan terakhir.';
  end if;
  insert into rtd.terbitan (staf_id, catatan, data) values (st.id, nullif(trim(coalesce(p_catatan, '')), ''), v_data) returning versi into v_versi;
  insert into rtd.log (staf_id, aksi, objek, objek_id, rincian) values (st.id, 'terbit', 'situs', v_versi::text, jsonb_build_object('label', p_catatan));
  return jsonb_build_object('ok', true, 'versi', v_versi);
end $$;

create or replace function public.konsol_terbitan(p_batas int default 30) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  perform rtd.wajib(array['pemilik', 'admin', 'editor']);
  return (select coalesce(jsonb_agg(jsonb_build_object('versi', versi, 'waktu', waktu, 'oleh', rtd.nama_staf(staf_id), 'sumber', sumber,
            'catatan', catatan, 'ukuran', octet_length(data::text)) order by versi desc), '[]'::jsonb)
          from (select * from rtd.terbitan order by versi desc limit least(greatest(p_batas, 1), 200)) t);
end $$;

create or replace function public.konsol_versi_data(p_versi bigint) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  perform rtd.wajib(array['pemilik', 'admin', 'editor']);
  return (select data from rtd.terbitan where versi = p_versi);
end $$;

/* Pulihkan: terbitkan ulang isi versi lama. Isi konsol tidak ikut berubah, kecuali p_isi_konsol = true. */
create or replace function public.konsol_pulihkan(p_versi bigint, p_isi_konsol boolean default false) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin']); v_data jsonb; v_baru bigint;
begin
  select data into v_data from rtd.terbitan where versi = p_versi;
  if v_data is null then raise exception 'Versi tidak ditemukan.'; end if;
  insert into rtd.terbitan (staf_id, sumber, catatan, data) values (st.id, 'pulihkan', 'Dipulihkan dari versi ' || p_versi, v_data)
  returning versi into v_baru;
  if p_isi_konsol then perform rtd.impor(v_data, st.id); end if;
  insert into rtd.log (staf_id, aksi, objek, objek_id, rincian)
  values (st.id, 'pulihkan', 'situs', v_baru::text, jsonb_build_object('label', 'Versi ' || p_versi, 'isi_konsol', p_isi_konsol));
  return jsonb_build_object('ok', true, 'versi', v_baru);
end $$;

-- ---------------------------------------------------------------- pesan dan lamaran
create or replace function public.konsol_pesan(p_status text default 'aktif') returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  perform rtd.wajib(array['pemilik', 'admin', 'editor']);
  return (select coalesce(jsonb_agg(jsonb_build_object('id', id, 'dibuat', dibuat, 'nama', nama, 'wa', wa, 'email', email, 'proyek', proyek,
            'isi', isi, 'halaman', halaman, 'status', status, 'catatan', catatan, 'ditangani', rtd.nama_staf(ditangani), 'diubah', diubah)
            order by dibuat desc), '[]'::jsonb)
          from rtd.pesan where p_status = 'semua' or (p_status = 'aktif' and status <> 'arsip') or status = p_status);
end $$;

create or replace function public.konsol_pesan_ubah(p_id uuid, p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin', 'editor']); x rtd.pesan;
begin
  update rtd.pesan set status = coalesce(p->>'status', status),
    catatan = case when p ? 'catatan' then nullif(trim(p->>'catatan'), '') else catatan end,
    ditangani = st.id, diubah = now()
  where id = p_id returning * into x;
  if x.id is null then raise exception 'Pesan tidak ditemukan.'; end if;
  if p ? 'status' and x.status <> 'dibaca' then
    insert into rtd.log (staf_id, aksi, objek, objek_id, rincian) values (st.id, 'pesan_' || x.status, 'pesan', x.id::text, jsonb_build_object('label', x.nama));
  end if;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.konsol_pesan_hapus(p_id uuid) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin']); v_nama text;
begin
  delete from rtd.pesan where id = p_id returning nama into v_nama;
  insert into rtd.log (staf_id, aksi, objek, objek_id, rincian) values (st.id, 'pesan_dihapus', 'pesan', p_id::text, jsonb_build_object('label', v_nama));
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.konsol_lamaran(p_status text default 'aktif') returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  perform rtd.wajib(array['pemilik', 'admin', 'editor']);
  return (select coalesce(jsonb_agg(jsonb_build_object('id', id, 'dibuat', dibuat, 'lowongan_id', lowongan_id, 'posisi', posisi,
            'nama', nama, 'wa', wa, 'email', email, 'kota', kota, 'pendidikan', pendidikan, 'pengalaman', pengalaman,
            'cv_path', cv_path, 'cv_nama', cv_nama, 'status', status, 'catatan', catatan, 'ditangani', rtd.nama_staf(ditangani), 'diubah', diubah)
            order by dibuat desc), '[]'::jsonb)
          from rtd.lamaran where p_status = 'semua' or (p_status = 'aktif' and status not in ('arsip', 'ditolak')) or status = p_status);
end $$;

create or replace function public.konsol_lamaran_ubah(p_id uuid, p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin', 'editor']); x rtd.lamaran;
begin
  update rtd.lamaran set status = coalesce(p->>'status', status),
    catatan = case when p ? 'catatan' then nullif(trim(p->>'catatan'), '') else catatan end,
    ditangani = st.id, diubah = now()
  where id = p_id returning * into x;
  if x.id is null then raise exception 'Lamaran tidak ditemukan.'; end if;
  if p ? 'status' then
    insert into rtd.log (staf_id, aksi, objek, objek_id, rincian)
    values (st.id, 'lamaran_' || x.status, 'lamaran', x.id::text, jsonb_build_object('label', x.nama || ' · ' || coalesce(x.posisi, '')));
  end if;
  return jsonb_build_object('ok', true);
end $$;

-- Berkas CV dihapus konsol lewat Storage API (perlu kebijakan admin di storage), baru barisnya lewat fungsi ini.
create or replace function public.konsol_lamaran_hapus(p_id uuid) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin']); v_nama text;
begin
  delete from rtd.lamaran where id = p_id returning nama into v_nama;
  insert into rtd.log (staf_id, aksi, objek, objek_id, rincian) values (st.id, 'lamaran_dihapus', 'lamaran', p_id::text, jsonb_build_object('label', v_nama));
  return jsonb_build_object('ok', true);
end $$;

-- ---------------------------------------------------------------- ringkasan dan aktivitas
create or replace function public.konsol_ringkasan() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare st rtd.staf := rtd.wajib(array['pemilik', 'admin', 'editor', 'kontributor']);
begin
  return jsonb_build_object(
    'koleksi', (select coalesce(jsonb_object_agg(k, jsonb_build_object(
        'jumlah', (select count(*) from rtd.konten c where c.koleksi = k),
        'tampil', (select count(*) from rtd.konten c where c.koleksi = k and c.tampil))), '{}'::jsonb) from unnest(rtd.koleksi_sah()) k),
    'pesan_baru', case when st.peran = 'kontributor' then null else (select count(*) from rtd.pesan where status = 'baru') end,
    'lamaran_baru', case when st.peran = 'kontributor' then null else (select count(*) from rtd.lamaran where status = 'baru') end,
    'draf_menunggu', (select count(*) from rtd.draf where status = 'menunggu' and (st.peran <> 'kontributor' or dibuat_oleh = st.id)),
    'terbit', public.konsol_status_terbit());
end $$;

create or replace function public.konsol_aktivitas(p_batas int default 150, p_staf uuid default null, p_objek text default null) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  perform rtd.wajib(array['pemilik', 'admin', 'editor']);
  return (select coalesce(jsonb_agg(jsonb_build_object('waktu', l.waktu, 'aksi', l.aksi, 'objek', l.objek, 'objek_id', l.objek_id,
      'rincian', l.rincian, 'staf_id', l.staf_id, 'staf', rtd.nama_staf(l.staf_id)) order by l.waktu desc), '[]'::jsonb)
    from (select * from rtd.log
           where (p_staf is null or staf_id = p_staf) and (p_objek is null or objek = p_objek)
           order by waktu desc limit least(greatest(p_batas, 1), 1000)) l);
end $$;

-- ---------------------------------------------------------------- impor dan pemilik pertama (SQL Editor saja)
/* Isi koleksi dan pengaturan dari satu snapshot (bentuk data/situs.json). Mengganti isi konsol sepenuhnya. */
create or replace function rtd.impor(d jsonb, p_staf uuid default null) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
declare k text; b jsonb; i int; n int := 0;
begin
  perform set_config('rtd.impor', '1', true);
  foreach k in array rtd.koleksi_sah() loop
    delete from rtd.konten where koleksi = k;
    i := 0;
    for b in select * from jsonb_array_elements(coalesce(d->k, '[]'::jsonb)) loop
      insert into rtd.konten (koleksi, id, urutan, tampil, data, diubah_oleh)
      values (k, b->>'id', i, true, b - 'id', p_staf);
      i := i + 1; n := n + 1;
    end loop;
  end loop;
  foreach k in array rtd.pengaturan_sah() loop
    insert into rtd.pengaturan (kunci, data, diubah_oleh) values (k, coalesce(d->'pengaturan'->k, '{}'::jsonb), p_staf)
    on conflict (kunci) do update set data = excluded.data, diubah = now(), diubah_oleh = excluded.diubah_oleh;
  end loop;
  perform set_config('rtd.impor', '0', true);
  insert into rtd.log (staf_id, aksi, objek, rincian) values (p_staf, 'impor', 'situs', jsonb_build_object('label', n || ' butir'));
  return jsonb_build_object('butir', n);
end $$;

/* Jalankan sekali di SQL Editor: select rtd.buat_pemilik('Nama Anda');  -- kodenya tampil sekali. */
create or replace function rtd.buat_pemilik(p_nama text) returns text
language plpgsql volatile security definer set search_path = '' as $$
declare v_kode text := rtd.kode_baru();
begin
  if exists (select 1 from rtd.staf where peran = 'pemilik') then
    raise exception 'Kode pemilik sudah ada. Untuk menggantinya, masuk ke konsol sebagai pemilik → Kode akses → Ganti kode.';
  end if;
  insert into rtd.staf (nama, peran, kode_hash, kode_akhir) values (p_nama, 'pemilik', rtd.hash(v_kode), right(v_kode, 4));
  return v_kode;
end $$;

-- ---------------------------------------------------------------- hak jalankan
revoke all on all functions in schema rtd from public, anon, authenticated;
revoke all on all tables in schema rtd from public, anon, authenticated;
do $$
declare f text;
begin
  for f in select p.oid::regprocedure::text from pg_proc p join pg_namespace n on n.oid = p.pronamespace
            where n.nspname = 'public' and (p.proname like 'konsol\_%' or p.proname in ('situs', 'kirim_pesan', 'kirim_lamaran')) loop
    execute format('revoke all on function %s from public', f);
  end loop;
  for f in select p.oid::regprocedure::text from pg_proc p join pg_namespace n on n.oid = p.pronamespace
            where n.nspname = 'public' and p.proname like 'konsol\_%' loop
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
grant execute on function public.situs() to anon, authenticated;
grant execute on function public.kirim_pesan(jsonb) to anon, authenticated;
grant execute on function public.kirim_lamaran(jsonb) to anon, authenticated;
