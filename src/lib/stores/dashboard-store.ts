import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SavedView } from '@/types/personnel';

// Default visible columns (a subset of all 50)
const DEFAULT_COLUMNS = [
  'lastName',
  'firstName',
  'rank',
  'branch',
  'dutyStation',
  'unit',
  'clearanceLevel',
  'medicalReadiness',
  'deploymentEligible',
];

// All available columns with their order
const ALL_COLUMNS = [
  // Personal
  'id', 'firstName', 'lastName', 'middleName', 'dateOfBirth', 'socialSecurityLastFour',
  'gender', 'maritalStatus', 'dependents', 'bloodType', 'religion', 'ethnicity',
  // Contact
  'email', 'personalEmail', 'phone', 'emergencyContact', 'emergencyPhone',
  'streetAddress', 'city', 'state', 'zipCode',
  // Service
  'branch', 'rank', 'payGrade', 'mos', 'activeStatus', 'activeDutyBaseDate',
  'enlistmentDate', 'estimatedTerminationDate', 'yearsOfService', 'dutyStation', 'unit', 'commandingOfficer',
  // Security
  'clearanceLevel', 'clearanceDate', 'clearanceExpiry', 'polygraphDate', 'specialAccess',
  // Training
  'basicTrainingComplete', 'aitComplete', 'lastPtTestDate', 'ptTestScore', 'weaponsQualification', 'specialSkills',
  // Health
  'medicalReadiness', 'dentalReadiness', 'lastPhysicalDate', 'deploymentEligible', 'profileStatus', 'vaccinations',
];

interface DashboardStore {
  // Column visibility and order
  visibleColumns: string[];
  columnOrder: string[];

  // Saved views
  savedViews: SavedView[];
  activeViewId: string | null;

  // Search and filters
  globalSearch: string;
  filters: Record<string, unknown>;

  // Actions
  setVisibleColumns: (columns: string[]) => void;
  toggleColumn: (columnId: string) => void;
  setColumnOrder: (order: string[]) => void;
  setGlobalSearch: (search: string) => void;
  setFilter: (key: string, value: unknown) => void;
  clearFilters: () => void;

  // View management
  saveView: (name: string) => void;
  loadView: (viewId: string) => void;
  deleteView: (viewId: string) => void;
  resetToDefault: () => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      visibleColumns: DEFAULT_COLUMNS,
      columnOrder: ALL_COLUMNS,
      savedViews: [],
      activeViewId: null,
      globalSearch: '',
      filters: {},

      setVisibleColumns: (columns) => set({ visibleColumns: columns }),

      toggleColumn: (columnId) =>
        set((state) => ({
          visibleColumns: state.visibleColumns.includes(columnId)
            ? state.visibleColumns.filter((c) => c !== columnId)
            : [...state.visibleColumns, columnId],
        })),

      setColumnOrder: (order) => set({ columnOrder: order }),

      setGlobalSearch: (search) => set({ globalSearch: search }),

      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      clearFilters: () => set({ filters: {}, globalSearch: '' }),

      saveView: (name) => {
        const state = get();
        const newView: SavedView = {
          id: crypto.randomUUID(),
          name,
          createdAt: new Date().toISOString(),
          columns: state.visibleColumns,
          columnOrder: state.columnOrder,
          filters: state.filters,
          sort: [],
        };

        set((state) => ({
          savedViews: [...state.savedViews, newView],
          activeViewId: newView.id,
        }));
      },

      loadView: (viewId) => {
        const state = get();
        const view = state.savedViews.find((v) => v.id === viewId);
        if (view) {
          set({
            visibleColumns: view.columns,
            columnOrder: view.columnOrder,
            filters: view.filters,
            activeViewId: viewId,
          });
        }
      },

      deleteView: (viewId) =>
        set((state) => ({
          savedViews: state.savedViews.filter((v) => v.id !== viewId),
          activeViewId: state.activeViewId === viewId ? null : state.activeViewId,
        })),

      resetToDefault: () =>
        set({
          visibleColumns: DEFAULT_COLUMNS,
          columnOrder: ALL_COLUMNS,
          filters: {},
          globalSearch: '',
          activeViewId: null,
        }),
    }),
    {
      name: 'personnel-dashboard-storage',
    }
  )
);

// Quick view presets
export const QUICK_VIEWS = {
  personal: {
    name: 'Personal Info',
    columns: ['firstName', 'lastName', 'middleName', 'dateOfBirth', 'gender', 'maritalStatus', 'dependents', 'bloodType'],
  },
  contact: {
    name: 'Contact Info',
    columns: ['firstName', 'lastName', 'email', 'phone', 'streetAddress', 'city', 'state', 'zipCode'],
  },
  service: {
    name: 'Military Service',
    columns: ['lastName', 'firstName', 'branch', 'rank', 'payGrade', 'mos', 'dutyStation', 'unit', 'yearsOfService'],
  },
  security: {
    name: 'Security & Clearance',
    columns: ['lastName', 'firstName', 'clearanceLevel', 'clearanceDate', 'clearanceExpiry', 'polygraphDate', 'specialAccess'],
  },
  training: {
    name: 'Training & Quals',
    columns: ['lastName', 'firstName', 'basicTrainingComplete', 'aitComplete', 'ptTestScore', 'weaponsQualification', 'specialSkills'],
  },
  health: {
    name: 'Health & Readiness',
    columns: ['lastName', 'firstName', 'medicalReadiness', 'dentalReadiness', 'deploymentEligible', 'profileStatus', 'lastPhysicalDate'],
  },
};

export const COLUMN_METADATA: Record<string, { label: string; category: string }> = {
  // Personal
  id: { label: 'ID', category: 'Personal' },
  firstName: { label: 'First Name', category: 'Personal' },
  lastName: { label: 'Last Name', category: 'Personal' },
  middleName: { label: 'Middle Name', category: 'Personal' },
  dateOfBirth: { label: 'Date of Birth', category: 'Personal' },
  socialSecurityLastFour: { label: 'SSN (Last 4)', category: 'Personal' },
  gender: { label: 'Gender', category: 'Personal' },
  maritalStatus: { label: 'Marital Status', category: 'Personal' },
  dependents: { label: 'Dependents', category: 'Personal' },
  bloodType: { label: 'Blood Type', category: 'Personal' },
  religion: { label: 'Religion', category: 'Personal' },
  ethnicity: { label: 'Ethnicity', category: 'Personal' },

  // Contact
  email: { label: 'Military Email', category: 'Contact' },
  personalEmail: { label: 'Personal Email', category: 'Contact' },
  phone: { label: 'Phone', category: 'Contact' },
  emergencyContact: { label: 'Emergency Contact', category: 'Contact' },
  emergencyPhone: { label: 'Emergency Phone', category: 'Contact' },
  streetAddress: { label: 'Street Address', category: 'Contact' },
  city: { label: 'City', category: 'Contact' },
  state: { label: 'State', category: 'Contact' },
  zipCode: { label: 'ZIP Code', category: 'Contact' },

  // Service
  branch: { label: 'Branch', category: 'Service' },
  rank: { label: 'Rank', category: 'Service' },
  payGrade: { label: 'Pay Grade', category: 'Service' },
  mos: { label: 'MOS', category: 'Service' },
  activeStatus: { label: 'Active Status', category: 'Service' },
  activeDutyBaseDate: { label: 'Active Duty Base Date', category: 'Service' },
  enlistmentDate: { label: 'Enlistment Date', category: 'Service' },
  estimatedTerminationDate: { label: 'ETS Date', category: 'Service' },
  yearsOfService: { label: 'Years of Service', category: 'Service' },
  dutyStation: { label: 'Duty Station', category: 'Service' },
  unit: { label: 'Unit', category: 'Service' },
  commandingOfficer: { label: 'Commanding Officer', category: 'Service' },

  // Security
  clearanceLevel: { label: 'Clearance Level', category: 'Security' },
  clearanceDate: { label: 'Clearance Date', category: 'Security' },
  clearanceExpiry: { label: 'Clearance Expiry', category: 'Security' },
  polygraphDate: { label: 'Polygraph Date', category: 'Security' },
  specialAccess: { label: 'Special Access', category: 'Security' },

  // Training
  basicTrainingComplete: { label: 'Basic Training', category: 'Training' },
  aitComplete: { label: 'AIT Complete', category: 'Training' },
  lastPtTestDate: { label: 'Last PT Test', category: 'Training' },
  ptTestScore: { label: 'PT Score', category: 'Training' },
  weaponsQualification: { label: 'Weapons Qual', category: 'Training' },
  specialSkills: { label: 'Special Skills', category: 'Training' },

  // Health
  medicalReadiness: { label: 'Medical Readiness', category: 'Health' },
  dentalReadiness: { label: 'Dental Readiness', category: 'Health' },
  lastPhysicalDate: { label: 'Last Physical', category: 'Health' },
  deploymentEligible: { label: 'Deployment Eligible', category: 'Health' },
  profileStatus: { label: 'Profile Status', category: 'Health' },
  vaccinations: { label: 'Vaccinations', category: 'Health' },
};
