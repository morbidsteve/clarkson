import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DutyUnit, DutyPosition, DutyAssignment } from '@/types/duty';
import {
  CLR1_UNITS,
  DUTY_SCHEDULES,
  generateMonthlyDutySchedule,
  calculateDutyStatistics,
  analyzeDutyFairness,
  type DutyScheduleConfig,
  type DutyStatsByUnit,
  type FairnessAnalysis,
} from '@/lib/clr1-data';

export type ViewMode = 'calendar' | 'analysis';
export type AnalysisScenario = 'organic' | 'regimental-pull';

interface DutyState {
  // Current view state
  viewMode: ViewMode;
  selectedScheduleId: string;
  selectedYear: number;
  selectedMonth: number;
  analysisScenario: AnalysisScenario;

  // Generated assignments cache
  assignmentsCache: Record<string, DutyAssignment[]>;

  // Actions
  setViewMode: (mode: ViewMode) => void;
  setSelectedSchedule: (scheduleId: string) => void;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
  setAnalysisScenario: (scenario: AnalysisScenario) => void;
  navigateMonth: (direction: 'prev' | 'next') => void;

  // Data getters
  getScheduleConfig: () => DutyScheduleConfig | undefined;
  getMonthlyAssignments: (scheduleId: string, year: number, month: number) => DutyAssignment[];
  getAllScheduleAssignments: (year: number, month: number) => Record<string, DutyAssignment[]>;
  getUnitStatistics: (year: number, months: number) => DutyStatsByUnit[];
  getFairnessAnalysis: (year: number, months: number, scenario: AnalysisScenario) => FairnessAnalysis;
}

// Helper to generate a cache key
function getCacheKey(scheduleId: string, year: number, month: number): string {
  return `${scheduleId}-${year}-${month}`;
}

export const useDutyStore = create<DutyState>()(
  persist(
    (set, get) => ({
      // Default state
      viewMode: 'calendar',
      selectedScheduleId: 'regimental-duty',
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth() + 1,
      analysisScenario: 'organic',
      assignmentsCache: {},

      // Actions
      setViewMode: (mode) => set({ viewMode: mode }),

      setSelectedSchedule: (scheduleId) => set({ selectedScheduleId: scheduleId }),

      setSelectedYear: (year) => set({ selectedYear: year }),

      setSelectedMonth: (month) => set({ selectedMonth: month }),

      setAnalysisScenario: (scenario) => set({ analysisScenario: scenario }),

      navigateMonth: (direction) => {
        const { selectedYear, selectedMonth } = get();
        if (direction === 'prev') {
          if (selectedMonth === 1) {
            set({ selectedYear: selectedYear - 1, selectedMonth: 12 });
          } else {
            set({ selectedMonth: selectedMonth - 1 });
          }
        } else {
          if (selectedMonth === 12) {
            set({ selectedYear: selectedYear + 1, selectedMonth: 1 });
          } else {
            set({ selectedMonth: selectedMonth + 1 });
          }
        }
      },

      // Data getters
      getScheduleConfig: () => {
        const { selectedScheduleId } = get();
        return DUTY_SCHEDULES.find(s => s.id === selectedScheduleId);
      },

      getMonthlyAssignments: (scheduleId, year, month) => {
        const state = get();
        const cacheKey = getCacheKey(scheduleId, year, month);

        // Check cache first
        if (state.assignmentsCache[cacheKey]) {
          return state.assignmentsCache[cacheKey];
        }

        // Generate and cache
        const config = DUTY_SCHEDULES.find(s => s.id === scheduleId);
        if (!config) return [];

        const assignments = generateMonthlyDutySchedule(config, year, month);

        // Update cache
        set({
          assignmentsCache: {
            ...state.assignmentsCache,
            [cacheKey]: assignments,
          },
        });

        return assignments;
      },

      getAllScheduleAssignments: (year, month) => {
        const result: Record<string, DutyAssignment[]> = {};
        DUTY_SCHEDULES.forEach(schedule => {
          result[schedule.id] = get().getMonthlyAssignments(schedule.id, year, month);
        });
        return result;
      },

      getUnitStatistics: (year, months) => {
        // Collect all assignments for the period
        const allAssignments: DutyAssignment[] = [];
        const { selectedMonth } = get();

        for (let m = 0; m < months; m++) {
          let targetMonth = selectedMonth - m;
          let targetYear = year;
          if (targetMonth <= 0) {
            targetMonth += 12;
            targetYear -= 1;
          }

          DUTY_SCHEDULES.forEach(schedule => {
            const assignments = get().getMonthlyAssignments(schedule.id, targetYear, targetMonth);
            allAssignments.push(...assignments);
          });
        }

        // Calculate statistics for all units
        return calculateDutyStatistics(
          allAssignments,
          CLR1_UNITS.map(u => u.id)
        );
      },

      getFairnessAnalysis: (year, months, scenario) => {
        const { selectedMonth } = get();
        const allAssignments: DutyAssignment[] = [];

        // Collect assignments for the period
        for (let m = 0; m < months; m++) {
          let targetMonth = selectedMonth - m;
          let targetYear = year;
          if (targetMonth <= 0) {
            targetMonth += 12;
            targetYear -= 1;
          }

          DUTY_SCHEDULES.forEach(schedule => {
            const assignments = get().getMonthlyAssignments(schedule.id, targetYear, targetMonth);
            allAssignments.push(...assignments);
          });
        }

        // Calculate period string
        const startDate = new Date(year, selectedMonth - months, 1);
        const endDate = new Date(year, selectedMonth - 1, 1);
        const period = `${startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;

        return analyzeDutyFairness(
          allAssignments,
          CLR1_UNITS.map(u => u.id),
          scenario === 'organic' ? 'Current (Organic)' : 'With Regimental Pull',
          period
        );
      },
    }),
    {
      name: 'clarkson-duty-storage',
      partialize: (state) => ({
        viewMode: state.viewMode,
        selectedScheduleId: state.selectedScheduleId,
        selectedYear: state.selectedYear,
        selectedMonth: state.selectedMonth,
        analysisScenario: state.analysisScenario,
        // Don't persist cache
      }),
    }
  )
);
