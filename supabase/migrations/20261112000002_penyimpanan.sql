-- =====================================================================
--  Penyimpanan berkas
--    media    publik  : foto proyek, siteplan, tim, hero, promo, logo bank (diunggah konsol)
--    lamaran  privat  : CV pelamar (PDF). Siapa saja boleh mengunggah ke masuk/;
--                       hanya editor ke atas yang bisa membuka, hanya admin yang bisa menghapus.
-- =====================================================================

/* Peran pemegang sesi konsol saat ini, atau null. Dipakai kebijakan storage. */
create or replace function rtd.peran_kini() returns text
language sql stable security definer set search_path = '' as $$
  select s.peran from rtd.staf s join rtd.sesi ss on ss.staf_id = s.id
   where ss.uid = (select auth.uid()) and ss.berakhir > now() and s.aktif limit 1
$$;
grant usage on schema rtd to anon, authenticated;
revoke all on function rtd.peran_kini() from public;
grant execute on function rtd.peran_kini() to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('media', 'media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']),
  ('lamaran', 'lamaran', false, 5242880, array['application/pdf'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media: staf unggah" on storage.objects;
create policy "media: staf unggah" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select rtd.peran_kini()) is not null);

drop policy if exists "media: staf lihat" on storage.objects;
create policy "media: staf lihat" on storage.objects for select to authenticated
  using (bucket_id = 'media' and (select rtd.peran_kini()) is not null);

drop policy if exists "media: admin hapus" on storage.objects;
create policy "media: admin hapus" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select rtd.peran_kini()) in ('pemilik', 'admin'));

drop policy if exists "lamaran: publik unggah" on storage.objects;
create policy "lamaran: publik unggah" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'lamaran' and name ~ '^masuk/\d{4}-\d{2}-\d{2}/[0-9a-f-]{36}\.pdf$');

drop policy if exists "lamaran: editor buka" on storage.objects;
create policy "lamaran: editor buka" on storage.objects for select to authenticated
  using (bucket_id = 'lamaran' and (select rtd.peran_kini()) in ('pemilik', 'admin', 'editor'));

drop policy if exists "lamaran: admin hapus" on storage.objects;
create policy "lamaran: admin hapus" on storage.objects for delete to authenticated
  using (bucket_id = 'lamaran' and (select rtd.peran_kini()) in ('pemilik', 'admin'));
