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
  
  currentBookingId: null,
  
  setBookingData: (data) => set({ bookingData: data }),
  
  updateBookingField: (field, value) => set((state) => ({
    bookingData: { ...state.bookingData, [field]: value }
  })),
  
  submitBooking: async (formData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      window.location.href = '/login';
      return { success: false, error: 'No token found' };
    }
    
    // Validate required fields
    if (!formData.tanggal || !formData.jam) {
      return { success: false, error: 'Tanggal dan jam harus diisi' };
    }
    
    // Create datetime with WIB timezone (+07:00)
    const dateTimeString = `${formData.tanggal}T${formData.jam}:00+07:00`;
    console.log('DateTime string:', dateTimeString);
    
    // Map frontend data to backend schema
    const backendData = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      nik: formData.nik,
      user_name: formData.nama,
      phone: formData.phone,
      age: parseInt(formData.usia),
      gender: formData.gender,
      lab_name: formData.lab,
      vaccine_name: formData.vaccineType,
      date_time: dateTimeString
    };
    
    console.log('Sending booking data:', JSON.stringify(backendData, null, 2));
    
    try {
      const response = await fetch('https://server-risa.vercel.app/api/booking', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(backendData)
      });
      
      console.log('Response status:', response.status);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return { success: false, error: 'Unauthorized' };
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API response result:', result);
      const bookingId = result.data?.id || result.id;
      console.log('Setting booking ID:', bookingId);
      set({ currentBookingId: bookingId });
      return { success: true, data: result };
    } catch (error) {
      console.error('Error submitting booking:', error);
      return { success: false, error: error.message };
    }
  },
  
  getBookingById: async (bookingId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      window.location.href = '/login';
      return { success: false, error: 'No token found' };
    }
    
    try {
      const response = await fetch(`https://server-risa.vercel.app/api/booking/${bookingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return { success: false, error: 'Unauthorized' };
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking not found');
      }
      
      const result = await response.json();
      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error fetching booking:', error);
      return { success: false, error: error.message };
    }
  },
  
  resetBookingData: () => set({
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
    }
  }),
}));

export default useBookingData;