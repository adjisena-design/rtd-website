#!/bin/sh
# Jalankan setelah mengubah CSS/JS: memperbarui ?v= agar peramban tidak memakai berkas lama.
V=$(cat assets/css/style.css assets/js/app.js assets/js/konfigurasi.js | md5sum | cut -c1-8)
for f in *.html proyek/*.html; do
  sed -i -E "s#(assets/css/style\.css)(\?v=[a-z0-9]+)?\"#\1?v=$V\"#; s#(assets/js/(app|konfigurasi)\.js)(\?v=[a-z0-9]+)?\"#\1?v=$V\"#" "$f"
done
K=$(cat konsol/konsol.css konsol/konsol.js konsol/skema.js konsol/api.js assets/js/konfigurasi.js | md5sum | cut -c1-8)
sed -i -E "s#(konsol\.css|konsol\.js|skema\.js|api\.js|assets/js/konfigurasi\.js)(\?v=[a-z0-9]+)?\"#\1?v=$K\"#g" konsol/index.html
echo "situs $V · konsol $K"
