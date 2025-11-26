import { create } from 'zustand';

const useVaccineSavingsStore = create((set) => ({
  savingsData: {
    full_name: '',
    age: '',
    gender: '',
    previous_doses: 0,
    parent_email: '',
    parent_phone: '',
    parental_consent: false,
    consent_acknowledged: false,
    bank_account_status: 'pending',
    profile_status: 'pending',
    vaccine_type: '',
    vaccine_price: 0,
    daily_savings_target: 0,
    estimated_days: 0,
    total_saved: 0,
    vaccine_status: 'pending',
    dose1_date: null,
    dose2_date: null,
  },
  currentStep: 1,
  deposits: [],

  setSavingsData: (data) =>
    set((state) => ({
      savingsData: { ...state.savingsData, ...data },
    })),

  setCurrentStep: (step) => set({ currentStep: step }),

  addDeposit: (amount) =>
    set((state) => ({
      savingsData: {
        ...state.savingsData,
        total_saved: state.savingsData.total_saved + amount,
      },
      deposits: [
        ...state.deposits,
        {
          id: Date.now(),
          amount,
          date: new Date(),
        },
      ],
    })),

  resetSavings: () =>
    set({
      savingsData: {
        full_name: '',
        age: '',
        gender: '',
        previous_doses: 0,
        parent_email: '',
        parent_phone: '',
        parental_consent: false,
        consent_acknowledged: false,
        bank_account_status: 'pending',
        profile_status: 'pending',
        vaccine_type: '',
        vaccine_price: 0,
        daily_savings_target: 0,
        estimated_days: 0,
        total_saved: 0,
        vaccine_status: 'pending',
        dose1_date: null,
        dose2_date: null,
      },
      currentStep: 1,
      deposits: [],
    }),
}));

export default useVaccineSavingsStore;
