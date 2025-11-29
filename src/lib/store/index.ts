import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  isGuest: boolean;
  guestDetectionsCount: number;
  freeDetectionsCount: number;
  preferredLanguage: string;
  role: 'user' | 'expert' | 'admin';
}

interface Detection {
  id: string;
  imageUrl: string;
  diseaseName: string;
  confidence: number;
  severity: number;
  affectedArea: number;
  createdAt: string;
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  
  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Detection state
  currentDetection: Detection | null;
  detectionHistory: Detection[];
  setCurrentDetection: (detection: Detection | null) => void;
  addDetection: (detection: Detection) => void;
  clearHistory: () => void;
  
  // Offline state
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  pendingSyncs: unknown[];
  addPendingSync: (item: unknown) => void;
  clearPendingSyncs: () => void;
  
  // Language
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  
  // Notifications
  unreadNotifications: number;
  setUnreadNotifications: (count: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set): AppState => ({
      // User state
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      // UI state
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      
      // Detection state
      currentDetection: null,
      detectionHistory: [],
      setCurrentDetection: (detection) => set({ currentDetection: detection }),
      addDetection: (detection) => set((state) => ({
        detectionHistory: [detection, ...state.detectionHistory].slice(0, 100)
      })),
      clearHistory: () => set({ detectionHistory: [] }),
      
      // Offline state
      isOnline: true,
      setIsOnline: (online) => set({ isOnline: online }),
      pendingSyncs: [],
      addPendingSync: (item) => set((state) => ({
        pendingSyncs: [...state.pendingSyncs, item]
      })),
      clearPendingSyncs: () => set({ pendingSyncs: [] }),
      
      // Language
      currentLanguage: 'en',
      setLanguage: (lang) => set({ currentLanguage: lang }),
      
      // Notifications
      unreadNotifications: 0,
      setUnreadNotifications: (count) => set({ unreadNotifications: count }),
    }),
    {
      name: 'agrisakhi-storage',
      partialize: (state) => ({
        theme: state.theme,
        currentLanguage: state.currentLanguage,
        detectionHistory: state.detectionHistory,
      }),
    }
  )
);
