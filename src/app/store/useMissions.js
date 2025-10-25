import { create } from 'zustand';

const useMissions = create((set, get) => ({
  missions: [], // Master missions
  missionLogs: [], // User logs (hari ini)
  loading: false,

  // Load master missions
  loadMissions: async () => {
    set({ loading: true });
    try {
      const response = await fetch('http://localhost:3001/api/missions');
      if (response.ok) {
        const result = await response.json();
        set({ missions: result.data, loading: false });
      }
    } catch (error) {
      console.error('Error loading missions:', error);
      set({ loading: false });
    }
  },

  // Load user mission logs (hari ini)
  loadMissionLogs: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3001/api/missions/log', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        set({ missionLogs: result.data });
      }
    } catch (error) {
      console.error('Error loading mission logs:', error);
    }
  },

  // Auto-create daily missions
  loadDailyMissions: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch('http://localhost:3001/api/missions/daily', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error creating daily missions:', error);
    }
  },

  // Combine missions with logs (hanya return misi yang ada log hari ini)
getCombinedMissions: () => {
  const { missionLogs } = get();
  
  // Map hanya dari missionLogs (2 misi harian), include data misi dari log
  return missionLogs.map(log => ({
    id: log.mission.id,
    title: log.mission.title,
    reward: log.mission.reward,
    target: log.mission.target,
    icon: log.mission.icon,
    progress: log.progress,
    completed: log.completed,
    status: log.status,
    logId: log.id
  }));
},

  // Start mission (update local & server status)
startMission: async (missionId) => {
  const token = localStorage.getItem('token');
  if (!token) return;

  // Get logId from current state
  const { missionLogs } = get();
  const log = missionLogs.find(log => log.mission_id === missionId);
  if (!log) {
    console.error('Log not found for mission:', missionId);
    return;
  }

  // Update local status immediately for better UX
  set((state) => ({
    missionLogs: state.missionLogs.map(log =>
      log.mission_id === missionId ? { ...log, status: 'in_progress' } : log
    )
  }));

  // Update server status
  try {
    const response = await fetch(`http://localhost:3001/api/missions/log/${log.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'in_progress' }) // Only update status, no other fields
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to update mission status on server:', errorText);
      // Optional: Rollback local state if needed
      // set((state) => ({ missionLogs: state.missionLogs.map(log => log.mission_id === missionId ? { ...log, status: 'idle' } : log) }));
    }
  } catch (error) {
    console.error('Error updating mission status:', error);
  }
},


  // Complete mission step (call progress endpoint)
  completeMissionStep: async (missionId, addStickers, onRewardAnimation) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3001/api/missions/progress', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mission_id: missionId })
      });

      console.log(response);
      if (response.ok) {
        const result = await response.json();
        set((state) => ({
          missionLogs: state.missionLogs.map(log =>
            log.mission_id === missionId ? result.data : log
          )
        }));

        if (result.data.completed) {
          const mission = get().missions.find(m => m.id === missionId);
          if (mission) {
            addStickers(mission.reward);
            onRewardAnimation?.();
          }
        }
      }
    } catch (error) {
      console.error('Error completing mission step:', error);
    }
  },

  // Trackers (ensure called only for daily missions)
  trackArticleRead: (addStickers, onRewardAnimation) => {
    get().completeMissionStep(1, addStickers, onRewardAnimation);
  },
  trackShare: (addStickers, onRewardAnimation) => {
    get().completeMissionStep(4, addStickers, onRewardAnimation);
  },
  trackComment: (addStickers, onRewardAnimation) => {
    get().completeMissionStep(5, addStickers, onRewardAnimation);
  },

  // Init: Load all in parallel
  initMissions: async () => {
    await Promise.all([
      get().loadMissions(),
      get().loadDailyMissions(),
      get().loadMissionLogs()
    ]);
  }
}));

export default useMissions;