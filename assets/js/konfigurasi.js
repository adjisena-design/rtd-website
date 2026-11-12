/* Sambungan ke Supabase untuk situs publik dan konsol.
   Kosong = situs memakai data/situs.json dari repo, formulir meneruskan ke WhatsApp,
   dan konsol menampilkan petunjuk penyiapan.

   Isi dengan Project URL dan anon (publishable) key dari Supabase:
   Project Settings → API. Kunci anon memang untuk peramban dan aman ditaruh di repo;
   yang melindungi data adalah aturan RLS dan fungsi di supabase/migrations/.
   JANGAN pernah menaruh service_role key di sini. */
window.RTD_KONFIG = {
  supabaseUrl: '',
  supabaseAnonKey: ''
};
