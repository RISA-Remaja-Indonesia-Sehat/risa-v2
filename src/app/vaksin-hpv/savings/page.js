'use client';
import { useState } from 'react';
import VaccineIntakeForm from '../../components/vaccine-savings/VaccineIntakeForm';
import VaccineConsentScreen from '../../components/vaccine-savings/VaccineConsentScreen';
import VaccineBankSetup from '../../components/vaccine-savings/VaccineBankSetup';
import VaccineSavingsTarget from '../../components/vaccine-savings/VaccineSavingsTarget';
import useVaccineSavingsStore from '../../store/useVaccineSavingsStore';
import Link from 'next/link';

export default function VaccineSavingsPage() {
  const { currentStep, setCurrentStep, resetSavings } = useVaccineSavingsStore();

  const handleNext = () => {
    if (currentStep === 4) {
      setCurrentStep(1);
      resetSavings();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const steps = [
    { number: 1, title: 'Data Diri', component: VaccineIntakeForm },
    { number: 2, title: 'Persetujuan', component: VaccineConsentScreen },
    { number: 3, title: 'Bank Setup', component: VaccineBankSetup },
    { number: 4, title: 'Target', component: VaccineSavingsTarget },
  ];

  const CurrentComponent = steps[currentStep - 1]?.component;

  return (
    <div>
      <Link
        href="/vaksin-hpv"
        className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-6 cursor-pointer px-6 pt-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </Link>

      {/* Step Indicators with Connecting Lines */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between relative">
            {/* Connecting Lines */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
              <div
                className="h-full bg-gray-200 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>
            </div>

            {/* Step Indicators */}
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center gap-2 relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    step.number < currentStep
                      ? 'bg-green-500 text-white shadow-lg'
                      : step.number === currentStep
                      ? 'bg-pink-500 text-white shadow-lg scale-110'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.number < currentStep ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`text-xs font-medium text-center transition-colors duration-300 ${
                  step.number <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Step Component */}
      {CurrentComponent && <CurrentComponent onNext={handleNext} />}
    </div>
  );
}
