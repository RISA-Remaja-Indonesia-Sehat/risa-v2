import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useMissions = create(
  persist(
    (set, get) => ({
      missions: [
        { id: 1, title: "Baca Artikel", reward: 1, completed: false, progress: 0, target: 2, status: 'idle', icon: "https://img.icons8.com/dusk/64/overview-pages-1.png" },
        { id: 2, title: "Main Game", reward: 1, completed: false, progress: 0, target: 1, status: 'idle', icon: "https://img.icons8.com/office/40/controller.png" },
        { id: 3, title: "Isi Siklusku", reward: 1, completed: false, progress: 0, target: 1, status: 'idle', icon: "https://img.icons8.com/dusk/64/calendar--v1.png" },
        { id: 4, title: "Share ke Teman", reward: 1, completed: false, progress: 0, target: 5, status: 'idle', icon: "https://img.icons8.com/sci-fi/48/share.png" },
        { id: 5, title: "Beri Komentar", reward: 1, completed: false, progress: 0, target: 2, status: 'idle', icon: "https://img.icons8.com/office/40/chat-message.png" }
      ],
      
      startMission: (missionId) => {
        set((state) => ({
          missions: state.missions.map(mission =>
            mission.id === missionId && mission.status === 'idle'
              ? { ...mission, status: 'in-progress' }
              : mission
          )
        }));
      },
      
      completeMissionStep: (missionId, addStickers, onRewardAnimation) => {
        set((state) => {
          const updatedMissions = state.missions.map(mission => {
            if (mission.id === missionId && mission.status === 'in-progress') {
              const newProgress = mission.progress + 1;
              const isCompleted = newProgress >= mission.target;
              
              if (isCompleted) {
                addStickers(mission.reward);
                onRewardAnimation?.();
                return { ...mission, progress: newProgress, completed: true, status: 'completed' };
              }
              
              return { ...mission, progress: newProgress };
            }
            return mission;
          });
          
          return { missions: updatedMissions };
        });
      },
      
      // Specific mission trackers
      trackArticleRead: (addStickers, onRewardAnimation) => {
        get().completeMissionStep(1, addStickers, onRewardAnimation);
      },
      
      trackShare: (addStickers, onRewardAnimation) => {
        get().completeMissionStep(4, addStickers, onRewardAnimation);
      },
      
      trackComment: (addStickers, onRewardAnimation) => {
        get().completeMissionStep(5, addStickers, onRewardAnimation);
      },
      
      resetDailyMissions: () => {
        set((state) => ({
          missions: state.missions.map(mission => ({
            ...mission,
            completed: false,
            progress: 0,
            status: 'idle'
          }))
        }));
      }
    }),
    {
      name: 'missions-storage'
    }
  )
);

export default useMissions;