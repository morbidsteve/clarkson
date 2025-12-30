import { create } from 'zustand';
import type { Personnel } from '@/types/personnel';
import type { UnitHierarchy } from '@/lib/mock-data';

interface SelectionStore {
  // Personnel selection
  selectedPerson: Personnel | null;
  setSelectedPerson: (person: Personnel | null) => void;

  // Unit selection
  selectedUnit: UnitHierarchy | null;
  setSelectedUnit: (unit: UnitHierarchy | null) => void;

  // Detail view state
  isPersonnelDetailOpen: boolean;
  isUnitDetailOpen: boolean;
  openPersonnelDetail: (person: Personnel) => void;
  openUnitDetail: (unit: UnitHierarchy) => void;
  closeDetail: () => void;
}

export const useSelectionStore = create<SelectionStore>((set) => ({
  selectedPerson: null,
  setSelectedPerson: (person) => set({ selectedPerson: person }),

  selectedUnit: null,
  setSelectedUnit: (unit) => set({ selectedUnit: unit }),

  isPersonnelDetailOpen: false,
  isUnitDetailOpen: false,

  openPersonnelDetail: (person) => set({
    selectedPerson: person,
    isPersonnelDetailOpen: true,
    isUnitDetailOpen: false
  }),

  openUnitDetail: (unit) => set({
    selectedUnit: unit,
    isUnitDetailOpen: true,
    isPersonnelDetailOpen: false
  }),

  closeDetail: () => set({
    isPersonnelDetailOpen: false,
    isUnitDetailOpen: false
  }),
}));
