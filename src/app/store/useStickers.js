import { create } from "zustand";

const useStickers = create((set, get) => {
  // Initialize stickers from user data
  // const { user } = useAuthStore.getState();
  // const initialStickers = user?.stickers ? user.stickers : 0;

  return {
    stickers: 0,
    initialized: false,

    initStickers: async () => {

      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        set({ stickers: 0, initialized: true });
        return;
      }

      try {
        const user = JSON.parse(userData);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          const newStickers = result.data.stickers || 0;

          // Update localStorage
          const updatedUser = { ...user, stickers: newStickers };
          localStorage.setItem("user", JSON.stringify(updatedUser));

          set({ stickers: newStickers, initialized: true });
        } else {
          set({ stickers: 0, initialized: true });
        }
      } catch (error) {
        console.error("Error fetching user stickers:", error);
        set({ stickers: 0, initialized: true });
      }
    },

    addStickers: async (amount) => {
      const newCount = get().stickers + amount;
      set({ stickers: newCount }); // Update local dulu

      // Auto-sync ke server
      const result = await get().updateStickersToServer(newCount);
      if (!result.success) {
        console.error("Failed to sync stickers to server:", result.error);
      }
    },
    deductStickers: async (amount) => {
      const newCount = get().stickers - amount;
      set({ stickers: newCount }); // Update local dulu

      // Auto-sync ke server
      const result = await get().updateStickersToServer(newCount);
      if (!result.success) {
        console.error("Failed to sync stickers to server:", result.error);
      }
    },

    updateStickersToServer: async (newStickerCount) => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) return { success: false, error: "No auth data" };

      try {
        const user = JSON.parse(userData);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ stickers: newStickerCount }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update stickers");
        }

        return { success: true };
      } catch (error) {
        console.error("Error updating stickers:", error);
        return { success: false, error: error.message };
      }
    },
  };
});

export default useStickers;
