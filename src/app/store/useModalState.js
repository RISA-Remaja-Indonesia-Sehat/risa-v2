import { create } from 'zustand';

const useModalState = create((set) => ({
  showVaccineInfo: false,
  showBooking: false,
  showTicket: false,
  selectedVaccine: null,

  setShowVaccineInfo: (show) => set({ showVaccineInfo: show }),
  setShowBooking: (show) => set({ showBooking: show }),
  setShowTicket: (show) => set({ showTicket: show }),
  setSelectedVaccine: (vaccine) => set({ selectedVaccine: vaccine }),

  // Combined actions for better UX flow
  openVaccineInfo: (vaccine) => set({ 
    selectedVaccine: vaccine, 
    showVaccineInfo: true 
  }),
  
  closeVaccineInfo: () => set({ 
    showVaccineInfo: false, 
    selectedVaccine: null 
  }),
  
  proceedToBooking: () => set({ 
    showVaccineInfo: false, 
    showBooking: true 
  }),
  
  closeBooking: () => set({ 
    showBooking: false 
  }),
  
  showTicketAfterBooking: () => {
    console.log('showTicketAfterBooking called - setting showTicket to true');
    set({ 
      showBooking: false, 
      showTicket: true 
    });
  },
  
  closeTicket: () => set({ 
    showTicket: false 
  }),

  resetAllModals: () => set({
    showVaccineInfo: false,
    showBooking: false,
    showTicket: false,
    selectedVaccine: null
  })
}));

export default useModalState;