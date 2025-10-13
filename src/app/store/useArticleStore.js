import { create } from 'zustand';

const articles = [
  {
    id: 1,
    title: 'HIV? Gak Usah Panik, Yuk Kenalan Dulu!',
    img: '/image/article-image-1.png',
    imgAlt: 'HIV Illustration',
    description: 'Kenalan sama HIV biar gak salah paham dan tetap bisa jaga diri.',
    opinion: `
      <p class="text-gray-700 leading-relaxed mb-6">
        Kamu lagi ngobrol santai sama temen di sekolah, terus tiba-tiba ada yang bilang: <br>
        <em>"Eh, kamu tau gak sih soal HIV? Katanya sih serem banget."</em> <br>
        Kamu jadi penasaran dan mikir, "Sebenarnya HIV itu apa sih? Kok bisa dibilang serem?"
      </p>

      <div class="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl border border-pink-100 shadow-sm mb-6">
        <h3 class="text-lg font-semibold text-pink-800 mb-4 flex items-center">
          <span class="text-2xl mr-2">💭</span>
          Nah, kamu punya tiga pilihan nih:
        </h3>
        
        <form id="hiv-quiz" class="space-y-4">
          <div class="space-y-3">
            <label class="flex items-start p-4 bg-white rounded-xl border-2 border-transparent hover:border-pink-200 cursor-pointer transition-all duration-200 group">
              <input type="radio" name="mini-story" value="1" class="mt-1 mr-3 text-pink-500 focus:ring-pink-400">
              <span class="text-gray-700 group-hover:text-pink-700 transition-colors">
                <strong>Cuekin aja</strong>, takutnya malah makin bingung.
              </span>
            </label>
            
            <label class="flex items-start p-4 bg-white rounded-xl border-2 border-transparent hover:border-pink-200 cursor-pointer transition-all duration-200 group">
              <input type="radio" name="mini-story" value="2" class="mt-1 mr-3 text-pink-500 focus:ring-pink-400">
              <span class="text-gray-700 group-hover:text-pink-700 transition-colors">
                <strong>Percaya aja</strong> sama cerita orang, toh semua sama aja.
              </span>
            </label>
            
            <label class="flex items-start p-4 bg-white rounded-xl border-2 border-transparent hover:border-pink-200 cursor-pointer transition-all duration-200 group">
              <input type="radio" name="mini-story" value="3" class="mt-1 mr-3 text-pink-500 focus:ring-pink-400">
              <span class="text-gray-700 group-hover:text-pink-700 transition-colors">
                <strong>Cari tahu lebih dalam</strong> supaya gak salah paham.
              </span>
            </label>
          </div>
          
          <button type="submit" class="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
            <span class="flex items-center justify-center">
              <span class="mr-2">✨</span>
              Lihat Jawabanku!
            </span>
          </button>
        </form>
        
        <div id="loading-screen" class="hidden text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-4"></div>
          <p class="text-pink-700 font-medium">AI lagi ngecek pilihan kamu, tunggu sebentar ya… ⏳</p>
        </div>
        
        <div id="feedback" class="hidden mt-6 p-4 rounded-xl border-l-4">
          <p id="feedback-text" class="font-medium"></p>
        </div>
      </div>
    `,
    content: `
        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-3xl mr-3">🔬</span>
            Apa sih HIV itu?
        </h2>
        <p class="text-gray-700 leading-relaxed mb-6">
            HIV singkatan dari <strong>Human Immunodeficiency Virus</strong>, yaitu virus yang menyerang sistem kekebalan tubuh kita. Sistem kekebalan ini ibarat tentara yang melindungi tubuh dari penyakit. Kalau kena HIV, tentara ini jadi lemah, jadi tubuh gampang sakit.
        </p>
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
            <p class="text-blue-800 font-medium">
                💡 <strong>Good News:</strong> HIV itu bukan penyakit yang langsung bikin kamu sakit parah. HIV bisa dikontrol dengan obat, jadi orang yang hidup dengan HIV bisa tetap sehat dan aktif.
            </p>
        </div>

        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-3xl mr-3">🦠</span>
            Gimana sih cara penularan HIV?
        </h2>
        <p class="text-gray-700 mb-4">HIV bisa menular lewat:</p>
        <ul class="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4">
            <li>Hubungan seksual tanpa perlindungan yang aman</li>
            <li>Berbagi jarum suntik yang tidak steril</li>
            <li>Dari ibu ke bayi saat hamil, melahirkan, atau menyusui</li>
        </ul>
        <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
            <p class="text-green-800 font-medium">
                ✅ <strong>Yang Aman:</strong> HIV tidak menular lewat sentuhan biasa, pelukan, cipika-cipiki, atau berbagi makanan.
            </p>
        </div>

        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-3xl mr-3">👩</span>
            Kenapa penting buat remaja perempuan tahu soal HIV?
        </h2>
        <p class="text-gray-700 mb-4">Karena kamu lagi di usia yang mulai mengenal dunia pertemanan dan masa depan. Dengan tahu soal HIV, kamu bisa:</p>
        <ul class="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
            <li>Jaga diri supaya gak tertular</li>
            <li>Bantu teman yang mungkin butuh dukungan</li>
            <li>Jadi pahlawan kecil yang sebarkan info benar, bukan hoaks</li>
        </ul>

        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-3xl mr-3">🛡️</span>
            Cara melindungi diri dari HIV:
        </h2>
        <div class="grid gap-4 mb-6">
            <div class="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <p class="text-pink-800">• Hindari berbagi jarum suntik atau alat yang bisa menularkan virus</p>
            </div>
            <div class="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <p class="text-pink-800">• Lakukan tes HIV kalau merasa perlu, supaya tahu status kesehatanmu</p>
            </div>
            <div class="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <p class="text-pink-800">• Bicara terbuka dengan orang dewasa yang kamu percaya</p>
            </div>
        </div>

        <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                Kata Teman-Temanmu
            </h3>
            <div class="space-y-3 text-sm text-gray-600">
                <p><strong>Nina, 17 tahun</strong> - "Awalnya aku takut banget sama HIV, tapi setelah cari tahu, aku jadi ngerti pentingnya jaga diri dan gak gampang percaya mitos."</p>
                <p><strong>Rani, 16 tahun</strong> - "Aku pernah ikut tes HIV bareng temen, rasanya biasa aja kok, malah jadi lebih tenang."</p>
                <p><strong>Sari, 18 tahun</strong> - "Kalau kamu bingung, jangan malu tanya ke guru BK atau orang dewasa yang kamu percaya. Mereka pasti bantu."</p>
            </div>
        </div>
    `
  },
  {
    id: 2,
    title: 'Seks Itu Apa Sih? Biar Gak Salah Paham dan Bisa Jaga Diri!',
    img: '/image/article-image-2.png',
    imgAlt: 'A girl wonder about sex',
    description: 'Seks sering dianggap tabu buat dibahas, padahal dengan pengetahuan yang benar kamu bisa jaga diri, hindari risiko, dan siap buat masa depan yang sehat.',
    opinion: `
        <div class="prose max-w-none mt-4">
            <p class="text-gray-700 leading-relaxed mb-2">
                <em>"Anak sepertimu tidak boleh tahu hal-hal tentang seks. Itu tabu untuk diceritakan."</em> <br>
                Pernah dengar kalimat kayak gitu? Padahal, justru kamu perlu tahu banyak soal seks — bukan cuma soal fisik, tapi juga emosi dan moralnya.
            </p>
            <p class="text-gray-700 leading-relaxed mb-6">
                <strong>Kenapa?</strong> Karena dengan pengetahuan yang benar, kamu bisa bikin keputusan yang tepat dan jaga diri dari hal-hal yang merugikan.
            </p>
        </div>
    `,
    content: `
        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-3xl mr-3">🔍</span>
            Apa Itu Seks?
        </h2>
        <p class="text-gray-700 leading-relaxed mb-6">
            Seks adalah saat seorang pria dan wanita menjadi sangat dekat secara fisik, yang bisa berujung pada kehamilan. Tapi, penting banget kamu tahu bahwa hubungan seks sebelum menikah itu salah dan bisa merugikan, baik dari segi kesehatan fisik maupun mental.
        </p>

        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-3xl mr-3">👎</span>
            Kenapa Hubungan Seks Sebelum Menikah Itu Salah dan Merugikan?
        </h2>
        <p class="text-gray-700 mb-4">Mungkin terlihat menyenangkan dan seru, tapi sebenarnya ada banyak dampak buruknya, seperti:</p>
        <ul class="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4">
            <li>Risiko terkena penyakit menular seksual yang bisa berbahaya.</li>
            <li>Kehamilan yang belum siap, yang bisa mengubah hidup kamu dan pasangan secara drastis.</li>
            <li>Perasaan bersalah, stres, dan sakit hati yang bisa muncul karena hubungan yang belum matang secara emosional.</li>
        </ul>

        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-3xl mr-3">❗</span>
            Media dan Iklan: Jangan Mudah Tertipu!
        </h2>
        <p class="text-gray-700 mb-4">Buku <strong>The Lolita Effect</strong> bilang, "Anak-anak melihat bahan seksual pada usia yang semakin muda, dan media anak yang berbau seksual semakin banyak." Iklan, film, lagu, dan media sosial penuh dengan gambar dan bahasa seksual yang bikin kamu mikir kalau seks itu hal yang sangat penting dan harus cepat dialami.</p>
        <p class="text-gray-700 mb-4">Tapi coba pikir, kenapa ya pengiklan pakai gambar seksi untuk jualan baju atau produk? Jawabannya supaya kamu tertarik dan beli barang itu. Mereka ingin kamu fokus sama penampilan dan keinginan sesaat, bukan nilai dan kesehatanmu.</p>
        
        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-3xl mr-3">🧠</span>
            Bedakan Mana yang Benar dan Salah
        </h2>
        <p class="text-gray-700 mb-4">Tahu soal seks saja tidak cukup. Seperti kamu bisa tahu cara kerja mobil tapi belum tentu bisa nyetir dengan baik, kamu juga harus belajar pakai pengetahuan soal seks untuk bikin keputusan yang benar dan bertanggung jawab.</p>
        <p class="text-gray-700 mb-4">Misalnya, anak laki-laki dan perempuan yang saling mempermainkan bagian tubuh seperti penis atau vulva itu salah, karena itu bukan cara yang sehat dan benar untuk mengenal tubuh.</p>
        
        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-3xl mr-3">💑</span>
            Seks Setelah Menikah: Nikmati dengan Bahagia
        </h2>
        <p class="text-gray-700 mb-4">Nanti, saat kamu sudah dewasa dan menikah, kamu bisa menikmati seks dengan bahagia tanpa rasa takut atau khawatir. Seks yang dilakukan dengan benar dan bertanggung jawab bisa membawa kebahagiaan, bukan penderitaan.</p>
        
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                Kata Teman-Temanmu
            </h3>
            <div class="space-y-3 text-sm text-gray-600">
                <p>
                    <strong>Rina, 17 tahun</strong> - "Dulu aku bingung soal seks, tapi setelah belajar, aku jadi tahu pentingnya jaga diri dan nilai moral." 
                </p>
                <p>
                    <strong>Dina, 16 tahun</strong> - "Media sering bikin aku mikir yang aneh-aneh, tapi aku belajar buat gak gampang percaya iklan dan gosip." 
                </p>
                <p>
                    <strong>Sari, 18 tahun</strong> - "Aku percaya kalau kita sabar dan bertanggung jawab, seks itu bisa jadi hal yang indah di waktu yang tepat."
                </p>
            </div>
        </div>

        <p class="text-gray-700 mb-4">Yuk, jangan takut belajar soal seks! Dengan pengetahuan yang benar, kamu bisa jaga diri, hargai tubuh dan hati, serta siap buat masa depan yang bahagia dan sehat!</p>
    `
  },
  {
    id: 3,
    title: 'Menstruasi Pertama: Kenapa Bisa Terjadi dan Gak Usah Takut!',
    img: '/image/article-image-3.png',
    imgAlt: 'Menstruation Illustration',
    description: 'Menstruasi pertama bisa bikin kaget dan panik, tapi sebenarnya ini tanda sehat dan alami—yuk cari tahu biar kamu lebih siap dan percaya diri.',
    opinion: `
        <p class="text-gray-700 leading-relaxed mb-4">
            <strong>Nina</strong>, seorang remaja perempuan berusia 13 tahun, sedang asyik belajar di kamarnya saat tiba-tiba dia merasakan sesuatu yang berbeda. Dia melihat ada bercak darah di celana dalamnya. Panik dan bingung, Nina merasa takut dan malu. Dia bahkan sempat berpikir, "Apakah aku sakit? Apakah aku kotor?"
        </p>

        <div class="bg-pink-50 p-6 rounded-lg mb-6 border border-pink-100">
            <h3 class="text-lg font-semibold text-pink-800 mb-4 flex items-center">
                <span class="text-2xl mr-2">💭</span>
                Pertanyaan untuk Kamu Renungkan:
            </h3>
            <ol class="space-y-3 text-gray-700">
                <li class="flex items-start">
                    <span class="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">1</span>
                    <span>Menurutmu, jika Nina mempelajari tentang menstruasi sebelum ini terjadi, apakah dia akan merasa lebih tenang dan tidak panik?</span>
                </li>
                <li class="flex items-start">
                    <span class="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">2</span>
                    <span>Apakah menstruasi itu sesuatu yang kotor atau sesuatu yang alami dan sehat?</span>
                </li>
                <li class="flex items-start">
                    <span class="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">3</span>
                    <span>Bagaimana sebaiknya kita menyikapi perubahan tubuh seperti menstruasi agar tetap percaya diri?</span>
                </li>
            </ol>
        </div>
    `,
    content: `
        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-3xl mr-3">🔍</span>
            Apa Itu Menstruasi?
        </h2>
        <div class="text-gray-700 leading-relaxed mb-6">
            Menstruasi adalah proses alami yang terjadi pada tubuh perempuan saat masa pubertas. Ini adalah tanda bahwa tubuh mulai siap untuk suatu saat nanti bisa hamil. Setiap bulan, rahim mempersiapkan diri dengan melapisi dindingnya dengan darah dan jaringan khusus. Jika tidak ada pembuahan, lapisan ini akan luruh dan keluar dari tubuh melalui vagina — itulah yang kita sebut haid atau menstruasi.
        </div>

        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-3xl mr-3">🩸</span>
            Kenapa Menstruasi Bisa Terjadi Mendadak?
        </h2>
        <p class="text-gray-700 mb-4">
            Perubahan pubertas biasanya terjadi secara bertahap, seperti tumbuhnya payudara atau perubahan suara. Tapi menstruasi bisa datang tiba-tiba dan membuat bingung, bahkan menakutkan, terutama jika kamu belum siap atau belum tahu apa yang terjadi. Itulah kenapa penting banget buat kamu belajar tentang menstruasi sebelum mengalaminya.
        </p>

        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-3xl mr-3">👧</span>
            Perubahan Tubuh yang Terjadi Saat Menstruasi
        </h2>
        <p class="text-gray-700 mb-4">Selain keluarnya darah, kamu mungkin juga merasakan beberapa gejala seperti perut kram, mood yang berubah-ubah, atau rasa lelah. Semua itu normal dan bagian dari proses tubuhmu menyesuaikan diri.</p>
        
        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            Tips Menghadapi Menstruasi Pertama
        </h2>
        <ul class="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4">
            <li>Jangan panik, ini hal alami yang dialami semua perempuan.</li>
            <li>Siapkan pembalut atau alat kebersihan lain yang nyaman.</li>
            <li>Jangan malu bertanya pada orang dewasa yang kamu percaya, seperti ibu atau guru.</li>
            <li>Jaga kebersihan agar tetap sehat dan nyaman.</li>
        </ul>

        <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                Kata Teman-Temanmu
            </h3>
            <div class="space-y-3 text-sm text-gray-600">
                <p>
                    <strong>Lia, 14 tahun</strong> - "Waktu haid pertama aku juga kaget, tapi setelah tahu apa itu menstruasi, aku jadi gak takut lagi." 
                </p>
                <p>
                    <strong>Sari, 15 tahun</strong> - "Aku selalu siapin pembalut di tas, jadi kalau haid datang gak panik." 
                </p>
                <p>
                    <strong>Nina, 13 tahun</strong> - "Aku senang bisa cerita sama ibu, jadi aku gak merasa sendirian."
                </p>
            </div>
        </div>

        <p class="text-gray-700 mb-4">Menstruasi itu alami dan sehat, girls! Yuk, kenali tubuhmu, siap-siap, dan jangan takut menghadapi perubahan ini. Kamu keren karena sudah mulai dewasa dan tahu cara jaga diri!</p>
    `
  }
];

const useArticleStore = create((set, get) => ({
  articles,
  
  getArticleById: (id) => {
    return articles.find(article => article.id === parseInt(id));
  },
  
  getAllArticles: () => {
    return articles;
  }
}));

export default useArticleStore;