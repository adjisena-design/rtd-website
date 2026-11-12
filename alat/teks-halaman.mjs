// Membuat data/teks-halaman.json: daftar semua elemen [data-teks] di halaman HTML,
// beserta teks bawaannya. Konsol memakai daftar ini untuk menu "Teks halaman".
// Jalankan ulang setiap kali menambah atau mengubah data-teks di HTML:
//   node alat/teks-halaman.mjs
import fs from 'node:fs';
import path from 'node:path';

const akar = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const halaman = {
  'index.html': 'Beranda', 'tentang.html': 'Profil & Manajemen', 'yayasan.html': 'Yayasan', 'legalitas.html': 'Legalitas',
  'spesifikasi.html': 'Spesifikasi', 'berita.html': 'Berita', 'karier.html': 'Karier', 'galeri.html': 'Galeri',
  'kontak.html': 'Kontak', 'proyek/index.html': 'Proyek'
};
const entitas = s => s.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

/** HTML isi elemen -> teks yang bisa disunting: span.redup jadi "| ...", <br> jadi baris baru. */
export const keTeks = isi => entitas(isi
  .replace(/\s+/g, ' ')
  .replace(/\s*<span class="redup">([\s\S]*?)<\/span>/g, ' | $1')
  .replace(/<br\s*\/?>/g, '\n')
  .replace(/<[^>]+>/g, ''))
  .split('\n').map(b => b.replace(/\s+/g, ' ').trim()).join('\n').trim();

const daftar = [];
for (const [berkas, nama] of Object.entries(halaman)) {
  const s = fs.readFileSync(path.join(akar, berkas), 'utf8');
  let bagian = nama;
  const re = /<span class="label"[^>]*>([\s\S]*?)<\/span>|<(h1|h2|h3|p|li)((?:\s[^>]*)?)\sdata-teks="([^"]+)"((?:\s[^>]*)?)>([\s\S]*?)<\/\2>/g;
  for (const m of s.matchAll(re)) {
    if (m[1] !== undefined) { bagian = keTeks(m[1]); continue; }
    const tag = m[2];
    daftar.push({
      kunci: m[4], halaman: nama, berkas, bagian,
      jenis: tag === 'h1' || tag === 'h2' ? 'judul' : tag === 'h3' ? 'subjudul' : tag === 'li' ? 'butir' : 'paragraf',
      bawaan: keTeks(m[6])
    });
  }
}
fs.writeFileSync(path.join(akar, 'data/teks-halaman.json'), JSON.stringify(daftar, null, 1) + '\n');
console.log(`${daftar.length} teks dari ${Object.keys(halaman).length} halaman`);
