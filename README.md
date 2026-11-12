# CV Digital Dimas

## Kebutuhan sistem

- Node.js 26 LTS dan npm 11 atau lebih baru.
- Git untuk mengambil dan mengelola project.

## Menjalankan project

```powershell
npm install
npm run dev
```

Buka http://localhost:3000 atau http://localhost:3000/cv.

Untuk build produksi:

```powershell
npm run build
npm start
```

## Mengganti foto

- Ganti foto sekolah di `app/dimas/foto/smk-telkom`, `prottab`, atau `sd-btn-pemda`. Pertahankan nama `1.jpg` sampai `5.jpg`.
- Ganti sertifikat di folder terkait dalam `app/dimas/foto/sertifikat`. Untuk galeri sertifikat berisi 2–5 gambar, tambahkan import gambarnya dan masukkan ke array sertifikat yang sesuai di `app/dimas/foto/index.ts`.
- Gunakan nama file dan huruf besar/kecil yang sama dengan import di `index.ts`.
- Foto profil, gambar proyek, dan file unduhan CV berada di `public/`.

## Mengubah terjemahan

Ubah teks bahasa Inggris (`en`) atau Indonesia (`id`) di `app/dimas/i18n/dictionary.ts`. Pertahankan bentuk dan susunan properti kedua dictionary agar semua teks memiliki padanan.
