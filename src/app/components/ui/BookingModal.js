"use client";

import { useEffect, useState } from "react";
import useLabsLocation from "@/app/store/useLabsLocation";
import useVaccineTypes from "@/app/store/useVaccineTypes";
import useBookingData from "@/app/store/useBookingData";

export default function BookingModal({
  show,
  onClose,
  onSubmit,
  selectedVaccine,
}) {
  const { labs, fetchLabs } = useLabsLocation();
  const { vaccineTypes } = useVaccineTypes();
  const { bookingData, updateBookingField } = useBookingData();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLabs();
  }, [fetchLabs]);

  useEffect(() => {
    if (selectedVaccine && show) {
      updateBookingField("vaccineType", selectedVaccine.name);
    }
  }, [selectedVaccine, show, updateBookingField]);

  const handleChange = (e) => {
    updateBookingField(e.target.name, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    // Basic validation: if user is minor, require parental consent
    const age = Number(bookingData.usia || bookingData.age || 0);
    const parentalConsent = bookingData.parental_consent || false;
    if (age < 18 && !parentalConsent) {
      setErrors({
        parental_consent:
          "Izin orang tua diperlukan untuk peserta di bawah 18 tahun",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      // Build final booking data and pass to parent onSubmit.
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      const finalData = {
        ...bookingData,
        nama: bookingData.nama,
        parent_email: bookingData.parent_email || "",
        parent_phone: bookingData.phone || bookingData.parent_phone || "",
        parental_consent: parentalConsent ? true : false,
        recommendationFile: selectedFile || null,
      };

      // Wait for parent handler) to finish so we can
      // keep the button disabled during network activity.
      const result = await onSubmit(finalData);

      // If parent returned an object with success flag, and success true,
      // we can optionally close here or let parent handle modal state.
      // We'll just stop submitting state and let parent continue flow.
      return result;
    } catch (err) {
      console.error("Error submitting booking:", err);
      alert(err.message || "Gagal mengirim data");
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  const userData = localStorage.getItem("user");
  const user = JSON.parse(userData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-md mx-auto border-2 border-pink-200 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-pink-600 mb-4 sm:mb-6 text-center">
            Booking Slot Vaksin HPV
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIK
            </label>
            <input
              name="nik"
              required
              pattern="[0-9]{16}"
              title="NIK harus 16 digit"
              onChange={handleChange}
              value={bookingData.nik}
              placeholder="Masukkan 16 digit NIK"
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              name="nama"
              required
              onChange={handleChange}
              value={bookingData.nama || ""}
              placeholder="Sesuai KTP"
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usia
            </label>
            <input
              name="usia"
              type="number"
              min="9"
              max="45"
              required
              onChange={handleChange}
              value={bookingData.usia}
              placeholder="minimal 9 tahun"
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Kelamin
            </label>
            <select
              name="gender"
              required
              onChange={handleChange}
              value={bookingData.gender}
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Perempuan">Perempuan</option>
              <option value="Laki-laki">Laki-laki</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Orang Tua
            </label>
            <input
              name="parent_email"
              type="email"
              onChange={(e) =>
                updateBookingField("parent_email", e.target.value)
              }
              value={bookingData.parent_email || ""}
              placeholder="Email orang tua/wali"
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor WhatsApp Aktif
            </label>
            <input
              name="parent_phone"
              type="tel"
              pattern="[0-9]{10,15}"
              onChange={(e) =>
                updateBookingField("parent_phone", e.target.value)
              }
              value={bookingData.parent_phone || ""}
              placeholder="Contoh: 08123456789"
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lab Tujuan
            </label>
            <select
              name="lab"
              required
              onChange={handleChange}
              value={bookingData.lab}
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Pilih Lab Prodia</option>
              {labs.map((lab) => (
                <option key={lab.id} value={lab.name}>
                  {lab.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Vaksin
            </label>
            <select
              name="vaccineType"
              required
              onChange={handleChange}
              value={bookingData.vaccineType}
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Pilih Jenis Vaksin HPV</option>
              {vaccineTypes.map((vaccine, index) => (
                <option key={index} value={vaccine.name}>
                  {vaccine.name}
                </option>
              ))}
            </select>
            {selectedVaccine && (
              <p className="text-xs text-pink-600 mt-1">
                ✨ Paket terpilih: {selectedVaccine.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Vaksinasi
            </label>
            <input
              name="tanggal"
              type="date"
              required
              min={
                new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0]
              }
              onChange={handleChange}
              value={bookingData.tanggal}
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jam Vaksinasi
            </label>
            <select
              name="jam"
              required
              onChange={handleChange}
              value={bookingData.jam}
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Pilih Jam</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
            </select>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Masukan surat rekomendasi dokter
            </label>
            <div className="border-2 border-dashed border-pink-200 rounded-lg p-4 bg-pink-50">
              <input
                id="recommendation"
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => {
                  setFileError("");
                  const f = e.target.files && e.target.files[0];
                  if (f) {
                    if (f.size > 10 * 1024 * 1024) {
                      setFileError("File terlalu besar (maks 10 MB)");
                      setSelectedFile(null);
                    } else {
                      setSelectedFile(f);
                    }
                  }
                }}
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-2">
                {selectedFile
                  ? `Dipilih: ${selectedFile.name}`
                  : "Klik atau seret file (PDF atau gambar), maksimal 10 MB."}
              </p>
              {fileError && (
                <p className="text-red-500 text-sm mt-2">{fileError}</p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="parental_consent"
                checked={!!bookingData.parental_consent}
                onChange={(e) =>
                  updateBookingField("parental_consent", e.target.checked)
                }
                className="w-5 h-5 mt-1"
              />
              <span className="text-sm text-gray-700">
                Saya masih di bawah umur dan sudah mendapat izin dari orang tua
                untuk mengikuti program tabungan vaksin ini.
              </span>
            </label>
            {errors.parental_consent && (
              <p className="text-red-500 text-sm mt-1">
                {errors.parental_consent}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 ${
                isSubmitting ? "bg-pink-300 cursor-wait" : "bg-pink-500"
              } text-white rounded-full font-semibold hover:shadow-lg hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base`}
            >
              {isSubmitting ? "Memproses..." : "Booking"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-white text-pink-600 rounded-full font-semibold border-2 border-pink-300 hover:bg-pink-50 hover:border-pink-400 transition-all duration-300 text-sm sm:text-base"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
