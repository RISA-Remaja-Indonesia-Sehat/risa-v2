'use client';
import { useEffect } from 'react';

export function initHivQuiz(articleId) {
  const form = document.getElementById('hiv-quiz');
  const loadingScreen = document.getElementById('loading-screen');
  const feedback = document.getElementById('feedback');
  const feedbackText = document.getElementById('feedback-text');

  if (!form) return;

  const hivFeedbacks = {
    '1': {
      text: 'Kalau dicuekin, kamu malah bisa tetap bingung. Yuk, kita bahas bareng-bareng soal HIV supaya kamu nggak termakan mitos.',
      style: 'border-yellow-400 bg-yellow-50 text-yellow-800'
    },
    '2': {
      text: 'Hmm, hati-hati ya. Kalau cuma percaya cerita orang tanpa cek kebenarannya, bisa bikin kamu salah paham tentang HIV. Yuk, kita bahas bareng-bareng soal HIV supaya kamu makin paham dan bisa jaga diri.',
      style: 'border-red-400 bg-red-50 text-red-800'
    },
    '3': {
      text: 'Keren! kamu udah langkah yang tepat! Yuk, kita bahas bareng-bareng soal HIV supaya kamu makin paham dan bisa jaga diri.',
      style: 'border-green-400 bg-green-50 text-green-800'
    }
  };

  const hpvFeedbacks = {
    '1': {
      text: 'Kalau dicuekin, kamu mungkin melewatkan kesempatan cegah risiko HPV yang bisa berkembang jadi masalah serius. Yuk, kita bahas bareng-bareng soal vaksin HPV supaya kamu makin paham dan bisa jaga diri.',
      style: 'border-yellow-400 bg-yellow-50 text-yellow-800'
    },
    '2': {
      text: 'Hmm, hati-hati ya. Kalau cuma percaya cerita temen tanpa cek kebenarannya, bisa bikin kamu salah paham tentang vaksin HPV dan risikonya. Yuk, kita bahas bareng-bareng soal HPV supaya kamu makin paham dan bisa jaga diri.',
      style: 'border-red-400 bg-red-50 text-red-800'
    },
    '3': {
      text: 'Keren! Kamu udah langkah yang tepat! Yuk, kita bahas bareng-bareng soal HPV dan vaksinnya supaya kamu makin paham dan bisa jaga diri dari risiko kanker leher rahim.',
      style: 'border-green-400 bg-green-50 text-green-800'
    }
  };

  const feedbacks = articleId === '4' ? hpvFeedbacks : hivFeedbacks;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const selectedValue = form.querySelector('input[name="mini-story"]:checked')?.value;
    
    if (!selectedValue) {
      alert('Pilih salah satu jawaban dulu ya! 😊');
      return;
    }

    // Save to localStorage
    localStorage.setItem('hiv-quiz-answer', selectedValue);

    // Show loading screen
    form.style.display = 'none';
    loadingScreen.classList.remove('hidden');

    // Show feedback after 3 seconds
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      
      const selectedFeedback = feedbacks[selectedValue];
      feedbackText.textContent = selectedFeedback.text;
      feedback.className = `mt-6 p-4 rounded-xl border-l-4 ${selectedFeedback.style}`;
      feedback.classList.remove('hidden');
    }, 3000);
  });
}

export default function HIVQuiz({ articleId }) {
  useEffect(() => {
    initHivQuiz(articleId);
  }, [articleId]);

  return null; // This component only handles logic
}