import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const CONFIGURED_MODEL = 'gemini-2.5-flash';
const MODEL_CANDIDATES = [CONFIGURED_MODEL, 'gemini-2.0-flash', 'gemini-2.5-pro'].filter(Boolean);
const MASTER_ARTICLE_LIST = [
  {
    id: 1,
    title: 'HIV? Gak Usah Panik, Yuk Kenalan Dulu!',
    href: '/article/1',
    image: '/image/article-image-1.png',
    alt: 'Ilustrasi HIV / pencegahan',
    topics: ['hiv', 'penyakit menular seksual', 'pencegahan', 'fakta mitos'],
  },
  {
    id: 2,
    title: 'Seks Itu Apa Sih? Biar Gak Salah Paham dan Bisa Jaga Diri!',
    href: '/article/2',
    image: '/image/article-image-2.png',
    alt: 'Ilustrasi pengertian seks dan edukasi',
    topics: ['seks', 'edukasi seks', 'persetujuan', 'keamanan diri'],
  },
  {
    id: 3,
    title: 'Menstruasi Pertama: Kenapa Bisa Terjadi dan Gak Usah Takut!',
    href: '/article/3',
    image: '/image/article-image-3.png',
    alt: 'Ilustrasi menstruasi pertama',
    topics: ['menstruasi', 'pubertas', 'kesehatan reproduksi'],
  },
  {
    id: 4,
    title: 'HPV? Yuk Kenalan Dulu Biar Gak Salah Paham!',
    href: '/article/4',
    image: '/image/article-image-4.png',
    alt: 'Ilustrasi vaksin HPV',
    topics: ['hpv', 'vaksin', 'kanker serviks', 'pencegahan'],
  },
  {
    id: 5,
    title: 'Pubertas Perempuan: Kenali Tubuhmu dan Jaga Nilai Dirimu!',
    href: '/article/5',
    image: '/image/article-image-5.png',
    alt: 'Ilustrasi pubertas perempuan',
    topics: ['pubertas', 'kesehatan reproduksi', 'remaja', 'self-esteem'],
  },
  {
    id: 6,
    title: 'Lindungi Dirimu! Cara Kenali dan Hadapi Pelecehan Seksual dengan Bijak',
    href: '/article/6',
    image: '/image/article-image-6.jpg',
    alt: 'Ilustrasi pelecehan seksual / keamanan',
    topics: ['pelecehan', 'keamanan digital', 'persetujuan', 'seks'],
  },
  {
    id: 7,
    title: 'Mengenal Fase Menstruasi: Waktunya Tubuhmu "Reset" dan Bersih-Bersih',
    href: '/article/7',
    image: '/image/article-image-7.png',
    alt: 'Ilustrasi fase menstruasi / kram',
    topics: ['menstruasi', 'siklus', 'kram', 'self-care'],
  },
  {
    id: 8,
    title: 'Mengenal Fase Luteal: Waktunya Tubuhmu "Istirahat" Sebelum Bulan Merah',
    href: '/article/8',
    image: '/image/article-image-8.png',
    alt: 'Ilustrasi fase luteal / mood',
    topics: ['luteal', 'siklus', 'pms', 'self-care'],
  },
  {
    id: 9,
    title: 'Mengenal Fase Ovulasi: Waktunya Tubuhmu Siap "Beraksi"!',
    href: '/article/9',
    image: '/image/article-image-9.png',
    alt: 'Ilustrasi fase ovulasi / hormon',
    topics: ['ovulasi', 'siklus', 'kesuburan', 'hormon'],
  },
  {
    id: 10,
    title: 'Mengenal Fase Folikular: Waktunya Tubuhmu Bersinar!',
    href: '/article/10',
    image: '/image/article-image-10.png',
    alt: 'Ilustrasi fase folikular / energi',
    topics: ['folikular', 'siklus', 'hormon', 'energi'],
  },
];

const buildPrompt = (answers, score) => {
  const answerDetails = answers
    .map((ans, i) => {
      return `
    Pertanyaan ${i + 1}: "${ans.statement}"
    Jawaban User: ${ans.userAnswer}
    Jawaban Benar: ${ans.correctAnswer || (ans.isCorrect ? ans.userAnswer : 'N/A')}
    Status: ${ans.isCorrect ? 'Benar' : 'Salah'}
  `;
    })
    .join('\n');

  const articleJson = JSON.stringify(MASTER_ARTICLE_LIST, null, 2);

  return `
    Anda adalah "RISA", seorang AI Copilot yang ramah, suportif, dan ahli dalam kesehatan reproduksi remaja.
    Tugas Anda adalah menganalisis hasil kuis Kesehatan Seksual dan Reproduksi seorang pengguna.

    Skor pengguna: ${score}
    Detail jawaban pengguna:
    ${answerDetails}

    Daftar artikel yang tersedia:
    ${articleJson}

    Tugas Anda:
    1.  Tuliskan "analisis_performa" singkat (2-3 kalimat) yang memberikan semangat dan menyoroti secara singkat area di mana pengguna salah (jika ada), lalu ajak pengguna untuk klik artikel dibawah. Jangan menguliahi, bersikaplah seperti teman yang suportif.
    2.  Berdasarkan pertanyaan yang dijawab SALAH, identifikasi topik utamanya (contoh: "menstruasi", "hpv", "hiv", "seks", "siklus", "pelecehan").
    3.  Pilih TEPAT 3 (tiga) artikel dari "Daftar artikel yang tersedia". Prioritaskan topik dari jawaban SALAH. Jika semua salah sudah ter-cover dan masih kurang, ambil sisanya dari topik yang dijawab BENAR untuk memperdalam pemahaman. Jangan ulang artikel yang sama.
    4.  Kembalikan HANYA JSON valid (tanpa teks lain) dengan format berikut:
    {
      "analysis": "string (analisis_performa Anda di sini)",
      "recommendedArticles": [ {"id": number, "title": string, "href": string, "image": string, "alt": string }, ... ] // tepat 3 item
    }

    Contoh jika pengguna salah tentang HPV dan menstruasi:
    {
      "analysis": "Hebat, skor kamu 60! Kamu sudah tahu banyak fakta dasar, tapi sepertinya masih sedikit bingung soal HPV dan menstruasi. Yuk, baca sedikit lagi biar makin paham!",
      "recommendedArticles": [
        { "id": 4, "title": "...", "href": "...", "image": "...", "alt": "..." },
        { "id": 3, "title": "...", "href": "...", "image": "...", "alt": "..." }
      ]
    }
  `;
};

// --- Post processing helpers to always return exactly 3 unique articles ---
const idMap = new Map(MASTER_ARTICLE_LIST.map((a) => [a.id, a]));
const titleMap = new Map(MASTER_ARTICLE_LIST.map((a) => [a.title.toLowerCase(), a]));
const hrefMap = new Map(MASTER_ARTICLE_LIST.map((a) => [a.href, a]));

function normalizeArticleShape(item) {
  if (!item) return null;
  // Prefer by id, fallback to href or title
  if (typeof item.id === 'number' && idMap.has(item.id)) return pickPublic(idMap.get(item.id));
  if (item.href && hrefMap.has(item.href)) return pickPublic(hrefMap.get(item.href));
  if (item.title && titleMap.has(String(item.title).toLowerCase())) return pickPublic(titleMap.get(String(item.title).toLowerCase()));
  return null;
}

function pickPublic(a) {
  const { id, title, href, image, alt } = a;
  return { id, title, href, image, alt };
}

function topicsFromAnswers(answers, preferWrong = true) {
  const pool = Array.isArray(answers) ? answers : [];
  const filtered = preferWrong ? pool.filter((a) => a && a.isCorrect === false) : pool.filter((a) => a && a.isCorrect === true);
  const bag = filtered
    .map((a) => `${a.statement || ''} ${a.userAnswer || ''} ${a.correctAnswer || ''}`)
    .join(' ')
    .toLowerCase();
  const topics = ['hpv', 'menstruasi', 'pubertas', 'pelecehan', 'seks', 'ovulasi', 'luteal', 'folikular'];
  return topics.filter((t) => bag.includes(t));
}

function ensureThreeArticles(recommended, answers) {
  const out = [];
  const seen = new Set();
  // 1) take normalized from AI
  (Array.isArray(recommended) ? recommended : []).forEach((item) => {
    const norm = normalizeArticleShape(item);
    if (norm && !seen.has(norm.id)) {
      seen.add(norm.id);
      out.push(norm);
    }
  });
  // 2) fill from wrong topics
  if (out.length < 3) {
    const wanted = topicsFromAnswers(answers, true);
    const candidates = MASTER_ARTICLE_LIST.filter((a) => a.topics?.some((t) => wanted.includes(t)));
    for (const c of candidates) {
      if (out.length >= 3) break;
      if (!seen.has(c.id)) {
        seen.add(c.id);
        out.push(pickPublic(c));
      }
    }
  }
  // 3) fill from correct topics if still short
  if (out.length < 3) {
    const wanted = topicsFromAnswers(answers, false);
    const candidates = MASTER_ARTICLE_LIST.filter((a) => a.topics?.some((t) => wanted.includes(t)));
    for (const c of candidates) {
      if (out.length >= 3) break;
      if (!seen.has(c.id)) {
        seen.add(c.id);
        out.push(pickPublic(c));
      }
    }
  }
  // 4) fill any remaining from master
  if (out.length < 3) {
    for (const c of MASTER_ARTICLE_LIST) {
      if (out.length >= 3) break;
      if (!seen.has(c.id)) {
        seen.add(c.id);
        out.push(pickPublic(c));
      }
    }
  }
  // Truncate if over
  return out.slice(0, 3);
}

const generationConfig = {
  temperature: 0.4,
  topK: 1,
  topP: 1,
  maxOutputTokens: 1024,
  responseMimeType: 'application/json',
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export async function POST(req) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const answers = Array.isArray(body?.answers) ? body.answers : [];
    let score = Number(body?.score);
    if (!Number.isFinite(score)) score = 0;

    // Debug: payload from client
    try {
      console.log('========================================');
      console.log('DEBUG: Data Diterima dari Frontend:');
      console.log({
        answers_type: Array.isArray(answers) ? 'array' : typeof answers,
        answers_len: Array.isArray(answers) ? answers.length : 0,
        score,
      });
      console.log('========================================');
    } catch (_) {}

    const prompt = buildPrompt(answers, score);

    let responseText = '';
    let lastError;
    for (const mdl of MODEL_CANDIDATES) {
      try {
        const mdlRef = genAI.getGenerativeModel({ model: mdl });
        const res = await mdlRef.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig,
          safetySettings,
        });
        responseText = res.response.text();
        if (responseText) {
          console.log('Using model:', mdl);
          break;
        }
      } catch (err) {
        lastError = err;
        console.error('Model failed:', mdl, String(err?.message || err));
        continue;
      }
    }
    if (!responseText) {
      throw lastError || new Error('All Gemini model candidates failed');
    }

    // Debug: raw model output
    try {
      console.log('========================================');
      console.log('DEBUG: Teks Mentah dari Gemini:');
      console.log(responseText);
      console.log('========================================');
    } catch (_) {}

    // Clean common wrappers
    let cleaned = responseText
      .replace(/\r/g, '')
      .replace(/```json/gi, '```')
      .replace(/```/g, '')
      .trim();

    const repairJsonIfNeeded = (s) => {
      try {
        return JSON.parse(s);
      } catch (_) {}
      const first = s.indexOf('{');
      const last = s.lastIndexOf('}');
      if (first !== -1) {
        let t = last > first ? s.slice(first, last + 1) : s.slice(first);
        // Balance quotes and brackets/braces
        const quoteCount = (t.match(/"/g) || []).length;
        if (quoteCount % 2 !== 0) t += '"';
        const openBr = (t.match(/\{/g) || []).length;
        const closeBr = (t.match(/\}/g) || []).length;
        for (let i = 0; i < openBr - closeBr; i++) t += '}';
        const openSq = (t.match(/\[/g) || []).length;
        const closeSq = (t.match(/\]/g) || []).length;
        for (let i = 0; i < openSq - closeSq; i++) t += ']';
        try {
          return JSON.parse(t);
        } catch (e3) {
          console.error('JSON repair failed:', e3?.message);
        }
      }
      return null;
    };

    let data = repairJsonIfNeeded(cleaned);

    if (!data || typeof data !== 'object') {
      console.error('Gemini response is not valid JSON. Cleaned:', cleaned.slice(0, 1000));
      // Build a safe fallback response instead of 500
      const text = (answers || [])
        .map((a) => `${a.statement || ''} ${a.isCorrect ? '(benar)' : '(salah)'}`)
        .slice(0, 3)
        .join(' · ');
      const scoreNum = typeof score === 'number' ? score : parseInt(score || 0, 10) || 0;

      const bagOfWords = (answers || [])
        .map((a) => `${a.statement || ''} ${a.userAnswer || ''} ${a.correctAnswer || ''}`)
        .join(' ')
        .toLowerCase();
      const topicHints = ['hpv', 'menstruasi', 'pubertas', 'pelecehan', 'seks', 'ovulasi', 'luteal', 'folikular'];
      const pickedTopics = topicHints.filter((t) => bagOfWords.includes(t));
      let recs = MASTER_ARTICLE_LIST.filter((a) => a.topics?.some((t) => pickedTopics.includes(t)));
      if (recs.length === 0) recs = MASTER_ARTICLE_LIST;
      recs = recs.slice(0, 3).map(({ id, title, href, image, alt }) => ({ id, title, href, image, alt }));

      const fallback = {
        analysis:
          `Skor kamu ${scoreNum}! Kamu sudah melangkah bagus. ` +
          (pickedTopics.length ? `Ayo perdalam topik: ${pickedTopics.slice(0, 2).join(', ')}.` : 'Ayo review kembali poin yang masih membingungkan.') +
          (text ? ` Ringkasan jawaban: ${text}` : ''),
        recommendedArticles: ensureThreeArticles(recs, answers),
        source: 'fallback',
      };
      return NextResponse.json(fallback);
    }

    // Normalize and enforce exactly 3 articles when model returns JSON
    const normalized = Array.isArray(data?.recommendedArticles) ? ensureThreeArticles(data.recommendedArticles, answers) : ensureThreeArticles([], answers);

    return NextResponse.json({
      analysis: String(data?.analysis || '').trim(),
      recommendedArticles: normalized,
    });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    const message = error && typeof error === 'object' && 'message' in error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to generate AI analysis', message }, { status: 500 });
  }
}