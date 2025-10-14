import { create } from 'zustand';

const useBookingData = create((set) => ({
  bookingData: {
    nik: '',
    nama: '',
    usia: '',
    gender: '',
    phone: '',
    lab: '',
    tanggal: '',
    jam: '',
    vaccineType: '',
  },
  
  setBookingData: (data) => set({ bookingData: data }),
  
  updateBookingField: (field, value) => set((state) => ({
    bookingData: { ...state.bookingData, [field]: value }
  })),
  
  // resetBookingData: () => set({
  //   bookingData: {
  //     nik: '',
  //     nama: '',
  //     usia: '',
  //     gender: '',
  //     phone: '',
  //     lab: '',
  //     tanggal: '',
  //     jam: '',
  //     vaccineType: '',
  //   }
  // }),
}));

export default useBookingData;