// Membuat supabase/seed.sql dari data/situs.json: isi awal konsol + terbitan versi pertama.
// Jalankan sekali saat menyiapkan proyek Supabase baru:
//   node alat/buat-seed.mjs
// lalu tempel isi supabase/seed.sql ke SQL Editor (atau `supabase db reset` bila memakai CLI).
import fs from 'node:fs';
import path from 'node:path';

const akar = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const situs = JSON.parse(fs.readFileSync(path.join(akar, 'data/situs.json'), 'utf8'));
delete situs.versi;
delete situs.diterbitkan;
const json = JSON.stringify(situs);
let tanda = 'situs';
while (json.includes(`$${tanda}$`)) tanda += '_';

const sql = `-- Dibuat oleh alat/buat-seed.mjs dari data/situs.json. Jangan disunting manual.
-- Mengisi konsol dengan isi situs saat ini dan menerbitkannya sebagai versi pertama.
-- Aman dijalankan sekali pada proyek baru; menjalankan ulang MENGGANTI semua isi konsol.
select rtd.impor($${tanda}$${json}$${tanda}$::jsonb);
insert into rtd.terbitan (sumber, catatan, data) select 'awal', 'Isi awal dari data/situs.json', rtd.susun_situs();
`;
fs.writeFileSync(path.join(akar, 'supabase/seed.sql'), sql);
console.log(`supabase/seed.sql: ${(sql.length / 1024).toFixed(0)} KB`);
