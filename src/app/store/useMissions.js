import { create } from "zustand";

// Tambah state untuk track hari terakhir load
let lastLoadDate = null;

// Tambah utility untuk get today in WIB (di frontend)
const getTodayWIBFrontend = () => {
  const now = new Date();
  now.setHours(now.getHours() + 7); // Adjust ke WIB
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).toDateString();
};

const useMissions = create((set, get) => ({
  missions: [], // Master missions
  missionLogs: [], // User logs (hari ini)
  loading: false,

  // Load master missions
  loadMissions: async () => {
    set({ loading: true });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/missions`);
      if (response.ok) {
        const result = await response.json();
        set({ missions: result.data, loading: false });
      }
    } catch (error) {
      console.error("Error loading missions:", error);
      set({ loading: false });
    }
  },

  // Load user mission logs (hari ini)
  loadMissionLogs: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/missions/log`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        set({ missionLogs: result.data });
      }
    } catch (error) {
      console.error("Error loading mission logs:", error);
    }
  },

  // Auto-create daily missions
  loadDailyMissions: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token for loadDailyMissions");
      return;
    }
    try {
      console.log("Calling loadDailyMissions");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/missions/daily`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("loadDailyMissions response status:", response.status);
      if (response.ok) {
        const result = await response.json();
        console.log("Daily missions created:", result);
      } else {
        console.error("Failed to create daily missions:", response.status);
      }
    } catch (error) {
      console.error("Error in loadDailyMissions:", error);
    }
  },

  // Start mission (update local & server status)
  startMission: async (missionId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Get logId from current state
    const { missionLogs } = get();
    const log = missionLogs.find((log) => log.mission_id === missionId);
    if (!log) {
      console.error("Log not found for mission:", missionId);
      return;
    }

    // Update local status immediately for better UX
    set((state) => ({
      missionLogs: state.missionLogs.map((log) =>
        log.mission_id === missionId ? { ...log, status: "in_progress" } : log
      ),
    }));

    // Update server status
    try {
      const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/missions/log/${log.id}/status`,
  {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'in_progress' }),
  }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update mission status on server:", errorText);
      }
    } catch (error) {
      console.error("Error updating mission status:", error);
    }
  },

  // Complete mission step (dengan validasi ketat)
  completeMissionStep: async (missionId, addStickers, onRewardAnimation) => {
    console.log("completeMissionStep called for missionId:", missionId); // Tambah log awal

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    // Tambah log lebih detail
    console.log("completeMissionStep called for missionId:", missionId);

    const { missionLogs } = get();
    const log = missionLogs.find((log) => log.mission_id === missionId);
    console.log("Log found:", log);

    // Hapus validasi completed, atau ubah
    if (!log || log.status !== "in_progress") {
      // Hapus || log.completed
      console.warn("Validation failed: log not valid", {
        hasLog: !!log,
        status: log?.status,
      });
      return;
    }

    // Jika sudah completed, jangan increment lagi
    if (log.completed) {
      console.log("Already completed, skipping");
      return;
    }
    // Pastikan fetch dikirim
    console.log("Sending POST to /progress");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/missions/progress`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mission_id: missionId }),
        }
      );

      console.log("Response received:", response.status);
      if (response.ok) {
        const result = await response.json();
        console.log("Updating state with:", result.data);

        // Update state
        set((state) => ({
          missionLogs: state.missionLogs.map((log) =>
            log.mission_id === missionId ? result.data : log
          ),
        }));

        // Force reload logs untuk sync
        await get().loadMissionLogs();

        // Reward only if newly completed
        if (result.data.completed && !log.completed) {
  console.log('Rewarding for completion');
  const mission = get().missions.find(m => m.id === missionId);
  if (mission) {
    await addStickers(mission.reward); // Sekarang async, akan sync ke server
    onRewardAnimation?.();
  }
}
      } else {
        console.error("Bad response:", response.status, await response.text());
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  },

  // Trackers (tambahkan validasi misi harian)
  trackArticleRead: (addStickers, onRewardAnimation) => {
    const { missionLogs } = get();
    console.log("di dalam track article read");
    const log = missionLogs.find(
      (log) => log.mission_id === 1 && log.status === "in_progress"
    );
    if (log) get().completeMissionStep(1, addStickers, onRewardAnimation);
  },
  trackShare: (addStickers, onRewardAnimation) => {
    const { missionLogs } = get();
    console.log("di dalam track share");
    const log = missionLogs.find(
      (log) => log.mission_id === 4 && log.status === "in_progress"
    );
    if (log) get().completeMissionStep(4, addStickers, onRewardAnimation);
  },
  trackComment: (addStickers, onRewardAnimation) => {
    const { missionLogs } = get();
    console.log("di dalam track comment");
    const log = missionLogs.find(
      (log) => log.mission_id === 5 && log.status === "in_progress"
    );
    if (log) get().completeMissionStep(3, addStickers, onRewardAnimation);
  },
  trackGame: (addStickers, onRewardAnimation) => {
    const { missionLogs } = get();
    console.log("di dalam track mini game");
    const log = missionLogs.find(
      (log) => log.mission_id === 2 && log.status === "in_progress"
    );
    if (log) get().completeMissionStep(2, addStickers, onRewardAnimation);
  },

  initMissions: async () => {
    const today = getTodayWIBFrontend(); // Pastikan ini benar
    if (lastLoadDate !== today) {
      console.log("New day detected, reloading missions");
      lastLoadDate = today;
      // Force reload semua
      await Promise.all([
        get().loadMissions(),
        get().loadDailyMissions(), // Pastikan ini dipanggil
        get().loadMissionLogs(),
      ]);
    } else {
      console.log("Same day, only loading logs");
      await get().loadMissionLogs();
      // Optional: Uncomment untuk force create setiap load (untuk test)
      // await get().loadDailyMissions();
    }
  },
}));

export default useMissions;
