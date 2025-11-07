# RISA

RISA (Remaja Indonesia SehAt) adalah platform edukasi digital interaktif untuk remaja perempuan Indonesia usia 13–19 tahun yang dirancang agar pembelajaran seputar kesehatan seksual dan reproduksi terasa menyenangkan, aman, dan tidak menggurui.
Dibangun dengan Next.js, RISA menggabungkan mini game interaktif, rekomendasi cerdas berbasis AI, artikel edukatif, serta fitur praktis seperti informasi vaksin HPV.
**Akses disini:** [https://risa-v2.vercel.app](https://risa-v2.vercel.app)

---

## Fitur Utama

### Mini Game Edukasi

* Mitos vs Fakta: Game drag-and-drop yang mengajak pengguna membedakan antara mitos dan fakta seputar kesehatan reproduksi.
* Memory Game: Latih daya ingat sambil mengenal topik kesehatan remaja.
* Elemen Gamifikasi: Kumpulkan poin, buka reward, dan tukar dengan hadiah menarik.

### Pembelajaran Berbasis AI

* RISA AI: Memberikan rekomendasi artikel dan konten berdasarkan hasil permainan dan minat pengguna.
* Analisis Cerdas: AI menilai pola belajar untuk menyarankan topik edukatif yang paling relevan.

### Artikel Edukatif

* Artikel komprehensif dengan bahasa yang ramah remaja dan visual menarik.
* Kategori topik meliputi: menstruasi, pubertas, HIV/AIDS, hubungan sehat, dan perawatan diri.
* Kuis interaktif dan fitur komentar untuk memperdalam pemahaman.

### Alat Kesehatan Digital

* Informasi Vaksin HPV: Panduan lokasi, harga, dan jadwal vaksin.
* Lab Locator: Temukan laboratorium terdekat lewat peta interaktif.

### Sistem Reward

* Dapatkan stiker digital setelah menyelesaikan game, membaca artikel, atau misi harian.
* Tukarkan dengan voucher Laurier atau merchandise bertema self-love hasil kolaborasi UMKM perempuan.
* Leaderboard mingguan menambah motivasi belajar dan kompetisi sehat.

### Layanan Lokasi

* Peta interaktif menggunakan GPS untuk menemukan fasilitas kesehatan, klinik, dan pusat vaksin.

---

## Teknologi yang Digunakan

| Kategori         | Teknologi               |
| ---------------- | ----------------------- |
| Framework        | Next.js 15 (App Router) |
| Frontend         | React 19, Tailwind CSS  |
| State Management | Zustand 5               |
| AI Integration   | Google Generative AI    |
| Maps             | Leaflet + React Leaflet |
| Drag & Drop      | @dnd-kit/core           |
| Autentikasi      | JWT + Google OAuth      |
| Animasi          | GSAP, Canvas Confetti   |
| UI Components    | Radix UI, Lucide Icons  |

---

## Memulai Proyek

### Prasyarat

* Node.js versi 18 atau lebih tinggi
* npm atau yarn

### Langkah Instalasi

1. Clone repositori:

   ```bash
   git clone https://github.com/your-username/risa-v2.git
   cd risa-v2
   ```

2. Instal dependensi:

   ```bash
   npm install
   ```

3. Atur variabel lingkungan.
   Buat file `.env.local` di root proyek:

   ```env
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   NEXT_PUBLIC_API_BASE_URL=your_api_base_url
   ```

4. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

   Lalu buka [http://localhost:3000](http://localhost:3000).

---

## Struktur Proyek

```
src/
├── app/
│   ├── article/          # Halaman & API artikel
│   ├── mini-game/        # Game edukatif interaktif
│   ├── vaksin-hpv/       # Informasi & booking vaksin
│   ├── reward/           # Sistem hadiah & stiker
│   ├── components/       # Komponen UI dan fungsional
│   ├── store/            # Zustand stores
│   └── landing-page/     # Tampilan utama
├── components/           # Komponen global (animasi, card, stack)
└── lib/                  # Utility & fungsi logika
```

---

## Perintah yang Tersedia

| Perintah        | Deskripsi                             |
| --------------- | ------------------------------------- |
| `npm run dev`   | Menjalankan server pengembangan       |
| `npm run build` | Membangun aplikasi untuk produksi     |
| `npm run start` | Menjalankan server produksi           |
| `npm run lint`  | Menjalankan pemeriksaan kode (ESLint) |

---

## Kontribusi

1. Fork repositori ini
2. Buat branch fitur baru

   ```bash
   git checkout -b fitur/fitur-baru
   ```
3. Commit perubahan

   ```bash
   git commit -m "Menambahkan fitur baru"
   ```
4. Push branch

   ```bash
   git push origin fitur/fitur-baru
   ```
5. Buat Pull Request

---

## Lisensi

Proyek ini bersifat privat dan hak cipta dilindungi.
Segala penggunaan di luar pengembangan resmi RISA memerlukan izin tertulis.

