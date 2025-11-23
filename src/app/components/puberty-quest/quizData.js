export const QUIZ_DATA = {
  chapter1: [
    {
      question: 'Apa itu pubertas?',
      options: [
        'Masa tubuh jadi lebih pendek',
        'Masa perubahan fisik & emosional menuju dewasa',
        'Masa bermain-main',
        'Masa ujian nasional'
      ],
      correct: 1,
      explanation: 'Pubertas adalah masa tubuh & hormon berubah menjadi lebih dewasa'
    },
    {
      question: 'Di usia sekitar berapa pubertas biasanya mulai pada perempuan?',
      options: ['5–7 tahun', '8–13 tahun', '15–20 tahun', '21–25 tahun'],
      correct: 1,
      explanation: 'Pubertas pada perempuan umumnya dimulai antara usia 8-13 tahun'
    },
    {
      question: 'Salah satu perubahan tubuh saat pubertas adalah…',
      options: [
        'Tinggi badan berhenti bertambah',
        'Suara jadi hilang',
        'Payudara mulai berkembang',
        'Tidak merasa lapar'
      ],
      correct: 2,
      explanation: 'Perkembangan payudara adalah salah satu tanda pubertas pada perempuan'
    }
  ],
  chapter2: [
    {
      question: 'Fungsi ovarium adalah…',
      options: [
        'Menyaring udara',
        'Menghasilkan sel telur',
        'Menghasilkan urin',
        'Mengolah makanan'
      ],
      correct: 1,
      explanation: 'Ovarium berfungsi menghasilkan sel telur setiap bulan'
    },
    {
      question: 'Fungsi rahim adalah…',
      options: [
        'Tempat tumbuhnya janin',
        'Tempat menyimpan makanan',
        'Tempat hormon diproduksi',
        'Tempat air disimpan'
      ],
      correct: 0,
      explanation: 'Rahim adalah tempat janin tumbuh dan berkembang'
    },
    {
      question: 'Vagina adalah…',
      options: [
        'Saluran pencernaan',
        'Saluran lahir & menstruasi',
        'Saluran pernapasan',
        'Saluran urin'
      ],
      correct: 1,
      explanation: 'Vagina adalah saluran untuk proses kelahiran dan keluarnya darah menstruasi'
    }
  ],
  chapter3: [
    {
      question: 'Menstruasi biasanya muncul setiap…',
      options: ['2–3 hari', '28–35 hari', '60 hari', 'Tidak ada angka pasti'],
      correct: 1,
      explanation: 'Siklus menstruasi normal berkisar antara 28-35 hari'
    },
    {
      question: 'Nyeri menstruasi ringan biasanya…',
      options: [
        'Normal',
        'Tanda penyakit berat pasti',
        'Wajib operasi',
        'Tidak boleh diobati'
      ],
      correct: 0,
      explanation: 'Nyeri menstruasi ringan adalah hal yang normal dan bisa diatasi'
    }
  ],
  chapter4: [
    {
      question: 'Mengapa emosi bisa berubah-ubah saat pubertas?',
      options: [
        'Karena cuaca',
        'Karena hormon berubah',
        'Karena tidak sarapan',
        'Karena rambut panjang'
      ],
      correct: 1,
      explanation: 'Perubahan hormon saat pubertas mempengaruhi emosi dan mood'
    }
  ],
  chapter5: [
    {
      question: 'Cara menjaga kebersihan organ kewanitaan yang benar adalah…',
      options: [
        'Membersihkan dengan sabun wangi setiap hari',
        'Membersihkan dari depan ke belakang',
        'Membersihkan dengan alkohol',
        'Tidak perlu dibersihkan'
      ],
      correct: 1,
      explanation: 'Membersihkan dari depan ke belakang mencegah infeksi'
    }
  ]
};

export const TTS_SCRIPTS = {
  intro: "Hei kamu! Selamat datang di Puberty Quest! Aku Risa, partner belajarmu! Siap seru-seruan sambil kenalan sama tubuh sendiri? Let's gooo!",
  chapter1: {
    intro: "Pubertas tuh kayak level naik di hidup kamu! Tubuh berubah, pikiran berubah, semuanya lagi upgrade! Dan itu normal banget!",
    game: "Oke, waktunya main! Cari perubahan tubuh yang terjadi saat pubertas. Siap? Fokus! Gaskeun!",
    complete: "KAMU BERHASIL! Chapter ini selesai! Aku bangga banget sama kamu! Let's go Chapter berikutnyaaa!"
  },
  chapter2: {
    intro: "Tubuh kita punya organ reproduksi yang keren-keren! Masing-masing punya tugas spesial! Yuk kenalan biar makin ngerti!",
    game: "Waktunya jadi penjelajah tubuh! Klik organ yang kamu ingin kenal! Siap… 3… 2… 1… explore!",
    complete: "Keren banget! Kamu udah explore semua organ! Tubuhmu luar biasa ya!"
  },
  chapter3: {
    intro: "Siklus menstruasi biasanya sekitar 28 sampai 35 hari. Tapi santai ya… setiap orang beda-beda kok! Itu normal!",
    game: "Sekarang kamu jadi sutradara tubuh! Pilih tindakan terbaik untuk setiap fase siklus! Make smart choices yaa!",
    complete: "Keren banget! Kamu berhasil melewati seluruh siklus!"
  },
  chapter4: {
    intro: "Kadang happy, kadang mellow… itu normal banget! Ayo bantu aku memilih respon terbaik!",
    game: "Pilih respon yang paling bijak untuk setiap situasi. Kamu pasti bisa!",
    complete: "Level complete, mood stabil! Good job!"
  },
  chapter5: {
    intro: "Rawat tubuhmu dengan baik, ya! Tubuhmu adalah sahabat terbaikmu!",
    game: "Yuk susun rutinitas perawatan yang tepat! Tarik… dan lepas di urutan yang benar!",
    complete: "Congratulations! Kamu berhasil bikin care routine terbaik!"
  }
};