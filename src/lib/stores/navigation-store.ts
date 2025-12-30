import { create } from 'zustand';

export type NavSection = 'dashboard' | 'personnel' | 'security' | 'readiness' | 'training' | 'medical' | 'organization' | 'custom-dashboards';

interface NavigationStore {
  activeSection: NavSection;
  setActiveSection: (section: NavSection) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  activeSection: 'dashboard',
  setActiveSection: (section) => set({ activeSection: section }),
}));
