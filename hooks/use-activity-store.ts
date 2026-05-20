import { create } from 'zustand';

export type ActivityType = 'report' | 'migration' | 'sync' | 'bulk_upload' | 'general' | 'attendance_calculation' | 'report_generation' | 'zkteco_user_sync' | 'zkteco_attendance_sync';

export interface ActivityData {
  id: string | number;
  type: ActivityType;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  current_message: string | null;
  download_url?: string;
  metadata?: Record<string, any>;
}

interface ActivityStore {
  activities: Record<string | number, ActivityData>;
  addActivity: (id: string | number, initialData: Partial<ActivityData> & { name: string, type: ActivityType }) => void;
  updateActivity: (id: string | number, data: Partial<ActivityData>) => void;
  removeActivity: (id: string | number) => void;
}

const getActivityDefaultName = (type?: ActivityType) => {
  switch (type) {
    case 'report':
    case 'report_generation': return 'Laporan';
    case 'attendance_calculation': return 'Kalkulasi Kehadiran';
    case 'migration': return 'Migrasi Data';
    case 'sync': return 'Sinkronisasi';
    case 'zkteco_user_sync': return 'Sinkronisasi Fingerprint';
    case 'zkteco_attendance_sync': return 'Sinkronisasi Absensi';
    case 'bulk_upload': return 'Upload Massal';
    default: return 'Aktivitas Sistem';
  }
};

export const useActivityStore = create<ActivityStore>((set) => ({
  activities: {},
  addActivity: (id, initialData) => set((state) => ({
    activities: {
      ...state.activities,
      [id]: {
        id,
        status: 'pending',
        progress: 0,
        current_message: 'Initializing...',
        ...initialData,
      } as ActivityData
    }
  })),
  updateActivity: (id, data) => set((state) => {
    const existing = state.activities[id];
    
    // If it doesn't exist, only re-add if it's a completion/failure signal
    if (!existing) {
      if (data.status === 'completed' || data.status === 'failed') {
        const type = data.type || 'general';
        return {
          activities: {
            ...state.activities,
            [id]: {
              id,
              name: (data as any).name || getActivityDefaultName(type),
              type: type,
              status: data.status,
              progress: data.progress ?? 100,
              current_message: data.current_message || (data.status === 'completed' ? 'Selesai' : 'Gagal'),
              ...data
            } as ActivityData
          }
        };
      }
      return state;
    }

    return {
      activities: {
        ...state.activities,
        [id]: { ...existing, ...data }
      }
    };
  }),
  removeActivity: (id) => set((state) => {
    const newActivities = { ...state.activities };
    delete newActivities[id];
    return { activities: newActivities };
  }),
}));
