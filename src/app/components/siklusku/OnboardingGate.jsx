'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import CustomButton from '../ui/CustomButton';

export default function OnboardingGate({ open, onBelum, onSudah, requiresAuth = false, reducedMotion = false }) {
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!open || !containerRef.current) return;

    const overlay = containerRef.current;
    const panel = overlay.querySelector('.gate-panel');

    let ctx;
    if (!reducedMotion) {
      ctx = gsap.context((localCtx) => {
        gsap.set(overlay, { autoAlpha: 0 });
        gsap.set(panel, { autoAlpha: 0, scale: 0.92, y: 24 });

        gsap
          .timeline({ defaults: { ease: 'power2.out' } })
          .to(overlay, { autoAlpha: 1, duration: 0.2 })
          .to(panel, { autoAlpha: 1, scale: 1, y: 0, duration: 0.35 }, '<');

        const buttons = panel.querySelectorAll("[data-gate-button][data-ripple='true']");
        buttons.forEach((button) => {
          const hoverTl = gsap.timeline({ paused: true }).to(button, {
            scale: 1.05,
            duration: 0.18,
            ease: 'power2.out',
          });

          const enter = () => hoverTl.play();
          const leave = () => hoverTl.reverse();

          button.addEventListener('pointerenter', enter);
          button.addEventListener('pointerleave', leave);
          button.addEventListener('pointercancel', leave);

          localCtx.add(() => {
            button.removeEventListener('pointerenter', enter);
            button.removeEventListener('pointerleave', leave);
            button.removeEventListener('pointercancel', leave);
          });
        });

        const onVis = () => (document.hidden ? gsap.globalTimeline.pause() : gsap.globalTimeline.resume());
        document.addEventListener('visibilitychange', onVis);
        localCtx.add(() => document.removeEventListener('visibilitychange', onVis));
      }, containerRef);
    } else {
      overlay.style.opacity = '1';
      panel.style.opacity = '1';
      panel.style.transform = 'none';
    }

    const allCandidates = Array.from(overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]'));

    const focusables = allCandidates.filter((el) => {
      const tab = el.getAttribute('tabindex');
      const isNeg = tab !== null ? parseInt(tab, 10) < 0 : false;
      const hasDisabled = 'disabled' in el;
      const disabled = hasDisabled ? el.disabled : el.getAttribute('disabled') !== null;
      const ariaHidden = el.getAttribute('aria-hidden') === 'true';
      return !isNeg && !disabled && !ariaHidden;
    });

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const handleKeyDown = (event) => {
      if (event.key === 'Tab' && focusables.length > 1) {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
      if (event.key === 'Escape' && !requiresAuth) {
        event.preventDefault();
      }
    };

    overlay.addEventListener('keydown', handleKeyDown);
    first?.focus();

    return () => {
      overlay.removeEventListener('keydown', handleKeyDown);
      if (ctx) ctx.revert();
    };
  }, [open, reducedMotion, requiresAuth]);

  if (!open) return null;

  function handleChoice(callback) {
    if (!containerRef.current || reducedMotion) {
      callback();
      return;
    }
    const overlay = containerRef.current;
    const panel = overlay.querySelector('.gate-panel');

    gsap
      .timeline({ defaults: { ease: 'power2.in' }, onComplete: callback })
      .to(panel, { autoAlpha: 0, y: -20, scale: 0.94, duration: 0.22 })
      .to(overlay, { autoAlpha: 0, duration: 0.18 }, '<0.05');
  }

  if (requiresAuth) {
    return (
      <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="auth-required-title" aria-describedby="auth-required-subtitle">
        <div className="gate-panel w-full max-w-2xl rounded-[32px] bg-white/95 p-6 shadow-2xl sm:p-10">
          <div className="space-y-6 text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-pink-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <div>
              <h2 id="auth-required-title" className="text-3xl font-semibold text-slate-900">
                Halo, masuk dulu yuk!
              </h2>
              <p id="auth-required-subtitle" className="mt-3 text-base text-slate-600 max-w-md mx-auto">
                Untuk mengakses fitur Siklusku dan menyimpan data dengan aman, silakan masuk ke akunmu terlebih dahulu.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4 pt-2">
              <CustomButton title="Login" className="px-6 py-3 text-sm tracking-wide" data-gate-button data-ripple="true" onClick={() => handleChoice(() => router.push('/login'))} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="onboarding-title" aria-describedby="onboarding-subtitle">
      <div className="gate-panel w-full max-w-3xl rounded-[32px] bg-white/95 p-6 shadow-2xl sm:p-8">
        <div className="grid gap-6 sm:grid-cols-[1.1fr_0.9fr] sm:items-center">
          <div className="space-y-5 text-center sm:text-left">
            <div className="mx-auto h-24 w-48 sm:hidden">
              <img src="/image/placeholder-gate.png" alt="Kartu sambutan Siklusku" className="h-full w-full object-contain" />
            </div>

            <div>
              <h2 id="onboarding-title" className="text-4xl font-semibold text-slate-900 text-center">
                Apakah kamu sudah mengalami haid?
              </h2>
              <p id="onboarding-subtitle" className="mt-3 text-m text-slate-600 text-center">
                Ayo kenali lebih dalam diri kamu dengan membangun kebiasaan jurnaling siklus dan suasana hatimu. <br />
                Psstt.. kalo kamu gak tau apa itu haid,
                <br />
                klik belum😉
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <CustomButton title="Belum" className="min-h-[52px] w-full sm:flex-1 tracking-wide flex justify-center text-center" data-gate-button data-ripple="true" onClick={() => handleChoice(onBelum)} />

              <CustomButton
                title="Sudah"
                className="min-h-[52px] w-full sm:flex-1 tracking-wide bg-white text-pink-600 text-center flex justify-center border-pink-200 before:bg-pink-50 before:shadow-pink-300 hover:bg-white"
                data-gate-button
                data-ripple="true"
                onClick={() => handleChoice(onSudah)}
              />
            </div>
          </div>

          <div className="relative hidden justify-center sm:flex">
            <div className="relative h-64 w-64">
              <div className="absolute inset-0 rounded-full bg-pink-100 blur-3xl" aria-hidden="true" />
              <img src="/image/placeholder-gate.png" alt="Ilustrasi remaja menunjuk kalender menstruasi" className="relative z-10 h-full w-full object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
