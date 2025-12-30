import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Personnel } from '@/types/personnel';

interface PersonnelStore {
  // Locally added personnel (persisted)
  addedPersonnel: Personnel[];

  // Actions
  addPersonnel: (personnel: Omit<Personnel, 'id'>) => string;
  updatePersonnel: (id: string, updates: Partial<Personnel>) => void;
  deletePersonnel: (id: string) => void;
  getPersonnel: (id: string) => Personnel | undefined;
}

export const usePersonnelStore = create<PersonnelStore>()(
  persist(
    (set, get) => ({
      addedPersonnel: [],

      addPersonnel: (personnelData) => {
        const id = crypto.randomUUID();
        const newPersonnel: Personnel = {
          ...personnelData,
          id,
        } as Personnel;

        set((state) => ({
          addedPersonnel: [...state.addedPersonnel, newPersonnel],
        }));

        return id;
      },

      updatePersonnel: (id, updates) => {
        set((state) => ({
          addedPersonnel: state.addedPersonnel.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deletePersonnel: (id) => {
        set((state) => ({
          addedPersonnel: state.addedPersonnel.filter((p) => p.id !== id),
        }));
      },

      getPersonnel: (id) => {
        return get().addedPersonnel.find((p) => p.id === id);
      },
    }),
    {
      name: 'personnel-storage',
    }
  )
);
