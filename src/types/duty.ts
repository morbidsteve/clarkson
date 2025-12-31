// Duty Scheduling Types for Combat Logistics Regiment 1 (CLR-1)

// Unit identifiers for duty scheduling
export type DutyUnit = 'CLR-1' | 'CLB-1' | 'CLB-5' | 'DSB';

// Duty position types
export type DutyPosition =
  | 'R-CDO'      // Regimental Command Duty Officer
  | 'R-ACDO'     // Regimental Assistant CDO
  | 'DUTY-DRIVER' // Regimental Duty Driver
  | 'OOD'        // Officer of the Day (Battalion level)
  | 'AOOD';      // Assistant OOD (Battalion level)

// Rank categories for duty eligibility
export type RankCategory =
  | 'Staff NCO'           // E6-E7: SSgt, GySgt
  | 'Company Grade Officer' // O1-O3: 2ndLt, 1stLt, Capt
  | 'Warrant Officer'     // W1-W3: WO, CWO2, CWO3
  | 'NCO'                 // E4-E5: Cpl, Sgt
  | 'Junior Marine';      // E1-E3: Pvt, PFC, LCpl

// Pay grades eligible for CDO/ACDO/OOD/AOOD
export const CDO_ELIGIBLE_PAY_GRADES = [
  'E-6', 'E-7',           // Staff NCOs (SSgt, GySgt)
  'O-1', 'O-2', 'O-3',    // Company Grade Officers
  'W-1', 'W-2', 'W-3',    // Warrant Officers
];

// Pay grades eligible for Duty Driver
export const DUTY_DRIVER_ELIGIBLE_PAY_GRADES = [
  'E-1', 'E-2', 'E-3',    // Junior Marines
];

// Unit personnel breakdown
export interface UnitPersonnelBreakdown {
  unitId: DutyUnit;
  unitName: string;
  staffNCO: number;      // E6-E7
  companyGradeOfficer: number; // O1-O3
  warrantOfficer?: number;     // W1-W3
  nco: number;           // E4-E5
  juniorMarine: number;  // E1-E3
}

// CLR-1 Regiment breakdown (provided by user)
export const UNIT_PERSONNEL_BREAKDOWN: UnitPersonnelBreakdown[] = [
  {
    unitId: 'CLR-1',
    unitName: 'Combat Logistics Regiment 1',
    staffNCO: 24,
    companyGradeOfficer: 11,
    nco: 49,
    juniorMarine: 62,
  },
  {
    unitId: 'CLB-1',
    unitName: 'Combat Logistics Battalion 1',
    staffNCO: 48,
    companyGradeOfficer: 19,
    nco: 148,
    juniorMarine: 59,
  },
  {
    unitId: 'CLB-5',
    unitName: 'Combat Logistics Battalion 5',
    staffNCO: 48,
    companyGradeOfficer: 19,
    nco: 148,
    juniorMarine: 59,
  },
  {
    unitId: 'DSB',
    unitName: 'Distribution Battalion',
    staffNCO: 60,
    companyGradeOfficer: 27,
    nco: 284,
    juniorMarine: 363,
  },
];

// Duty schedule configuration
export interface DutyScheduleConfig {
  id: string;
  name: string;
  units: DutyUnit[];           // Units participating in this duty
  positions: DutyPosition[];   // Positions to be filled
  isCombined: boolean;         // Whether this is a combined duty (CLR-1/CLB-1)
  description: string;
}

// Predefined duty schedules
export const DUTY_SCHEDULES: DutyScheduleConfig[] = [
  {
    id: 'regimental-duty',
    name: 'Regimental Duty (CLR-1/CLB-1 Combined)',
    units: ['CLR-1', 'CLB-1'],
    positions: ['R-CDO', 'R-ACDO', 'DUTY-DRIVER'],
    isCombined: true,
    description: 'Combined regimental duty for CLR-1 and CLB-1. CLB-1 duty is combined with regiment.',
  },
  {
    id: 'clb5-duty',
    name: 'CLB-5 Battalion Duty',
    units: ['CLB-5'],
    positions: ['OOD', 'AOOD'],
    isCombined: false,
    description: 'Separate battalion duty for CLB-5.',
  },
  {
    id: 'dsb-duty',
    name: 'DSB Battalion Duty',
    units: ['DSB'],
    positions: ['OOD', 'AOOD'],
    isCombined: false,
    description: 'Separate battalion duty for Distribution Battalion.',
  },
];

// Individual duty assignment
export interface DutyAssignment {
  id: string;
  date: string;             // ISO date string (YYYY-MM-DD)
  position: DutyPosition;
  scheduleId: string;       // Reference to DutyScheduleConfig.id
  personnelId: string;      // Reference to Personnel.id
  personnelName: string;    // Display name
  personnelRank: string;    // Rank abbreviation
  personnelPayGrade: string;
  unitId: DutyUnit;
}

// Monthly duty calendar
export interface DutyCalendarMonth {
  year: number;
  month: number;            // 1-12
  scheduleId: string;
  assignments: DutyAssignment[];
}

// Per capita duty statistics
export interface DutyStatistics {
  unitId: DutyUnit;
  unitName: string;
  totalEligiblePersonnel: number;
  totalDutyDays: number;
  dutyPerCapita: number;    // Total duty days / eligible personnel
  dutyDaysByPosition: Record<DutyPosition, number>;
}

// Comparison analysis for fairness
export interface DutyFairnessAnalysis {
  period: {
    startDate: string;
    endDate: string;
    months: number;
  };
  statisticsByUnit: DutyStatistics[];
  averageDutyPerCapita: number;
  fairnessVariance: number; // Standard deviation from average
  scenario: 'current' | 'with-regimental-pull'; // Current = each unit does own duty
}

// Get total CDO-eligible personnel for a unit
export function getCDOEligibleCount(breakdown: UnitPersonnelBreakdown): number {
  return breakdown.staffNCO + breakdown.companyGradeOfficer + (breakdown.warrantOfficer || 0);
}

// Get total duty driver eligible personnel for a unit
export function getDutyDriverEligibleCount(breakdown: UnitPersonnelBreakdown): number {
  return breakdown.juniorMarine;
}

// Get combined CDO-eligible for multiple units
export function getCombinedCDOEligibleCount(units: DutyUnit[]): number {
  return UNIT_PERSONNEL_BREAKDOWN
    .filter(u => units.includes(u.unitId))
    .reduce((sum, u) => sum + getCDOEligibleCount(u), 0);
}

// Get combined duty driver eligible for multiple units
export function getCombinedDutyDriverEligibleCount(units: DutyUnit[]): number {
  return UNIT_PERSONNEL_BREAKDOWN
    .filter(u => units.includes(u.unitId))
    .reduce((sum, u) => sum + getDutyDriverEligibleCount(u), 0);
}
