#!/bin/sh
# Jalankan setelah mengubah CSS/JS: memperbarui ?v= di semua halaman agar peramban tidak memakai berkas lama.
V=$(cat assets/css/style.css assets/js/app.js | md5sum | cut -c1-8)
for f in *.html proyek/*.html; do
  sed -i -E "s#(assets/css/style\.css)(\?v=[a-z0-9]+)?\"#\1?v=$V\"#; s#(assets/js/app\.js)(\?v=[a-z0-9]+)?\"#\1?v=$V\"#" "$f"
done
echo "versi $V"
