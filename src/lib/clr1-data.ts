// CLR-1 Combat Logistics Regiment Mock Data
// Separate file for duty scheduling functionality

import { faker } from '@faker-js/faker';
import type {
  Personnel, Branch, ActiveStatus, ClearanceLevel, ReadinessStatus, ProfileStatus,
  WeaponsQualification, MaritalStatus, Gender, BloodType, Vaccination, Certification,
  MedicalAppointment, Medication, SecurityInvestigation, InvestigationType, PolygraphType,
  AccessStatus, VisionCategory, HearingCategory, DentalClass, PulhesCategory, CertificationLevel,
  CertificationStatus
} from '@/types/personnel';
import { CERTIFICATION_DEFINITIONS, VACCINATION_LIST } from '@/types/personnel';
import type { DutyUnit, DutyPosition, DutyAssignment } from '@/types/duty';

// ============================================
// CLR-1 UNIT DEFINITIONS
// ============================================

export interface CLR1Unit {
  id: DutyUnit;
  name: string;
  shortName: string;
  type: 'Regiment' | 'Battalion';
  parentId: DutyUnit | null;
  commander: string;
  commanderRank: string;
  location: string;
  mission: string;
  // Personnel breakdown
  staffNCO: number;           // E6-E7
  companyGradeOfficer: number; // O1-O3
  nco: number;                // E4-E5
  juniorMarine: number;       // E1-E3
}

// Unit hierarchy and personnel breakdown from user requirements
export const CLR1_UNITS: CLR1Unit[] = [
  {
    id: 'CLR-1',
    name: 'Combat Logistics Regiment 1',
    shortName: 'CLR-1',
    type: 'Regiment',
    parentId: null,
    commander: 'Col James Mitchell',
    commanderRank: 'Colonel',
    location: 'Camp Pendleton, CA',
    mission: 'Provide combat logistics support to I Marine Expeditionary Force',
    staffNCO: 24,
    companyGradeOfficer: 11,
    nco: 49,
    juniorMarine: 62,
  },
  {
    id: 'CLB-1',
    name: 'Combat Logistics Battalion 1',
    shortName: 'CLB-1',
    type: 'Battalion',
    parentId: 'CLR-1',
    commander: 'LtCol Sarah Chen',
    commanderRank: 'Lieutenant Colonel',
    location: 'Camp Pendleton, CA',
    mission: 'Provide direct support combat logistics to 1st Marine Division units',
    staffNCO: 48,
    companyGradeOfficer: 19,
    nco: 148,
    juniorMarine: 59,
  },
  {
    id: 'CLB-5',
    name: 'Combat Logistics Battalion 5',
    shortName: 'CLB-5',
    type: 'Battalion',
    parentId: 'CLR-1',
    commander: 'LtCol Michael Rodriguez',
    commanderRank: 'Lieutenant Colonel',
    location: 'Camp Pendleton, CA',
    mission: 'Provide direct support combat logistics to 5th Marine Regiment',
    staffNCO: 48,
    companyGradeOfficer: 19,
    nco: 148,
    juniorMarine: 59,
  },
  {
    id: 'DSB',
    name: 'Distribution Battalion',
    shortName: 'DSB',
    type: 'Battalion',
    parentId: 'CLR-1',
    commander: 'LtCol David Thompson',
    commanderRank: 'Lieutenant Colonel',
    location: 'Camp Pendleton, CA',
    mission: 'Provide distribution and transportation support across the regiment',
    staffNCO: 60,
    companyGradeOfficer: 27,
    nco: 284,
    juniorMarine: 363,
  },
];

// Get unit by ID
export function getCLR1Unit(unitId: DutyUnit): CLR1Unit | undefined {
  return CLR1_UNITS.find(u => u.id === unitId);
}

// Get total personnel for a unit
export function getTotalPersonnel(unit: CLR1Unit): number {
  return unit.staffNCO + unit.companyGradeOfficer + unit.nco + unit.juniorMarine;
}

// Get CDO-eligible count for a unit (Staff NCO + CGO)
export function getCDOEligibleCount(unit: CLR1Unit): number {
  return unit.staffNCO + unit.companyGradeOfficer;
}

// Get duty driver eligible count for a unit (Junior Marines)
export function getDutyDriverEligibleCount(unit: CLR1Unit): number {
  return unit.juniorMarine;
}

// ============================================
// RANK DEFINITIONS
// ============================================

interface RankInfo {
  rank: string;
  payGrade: string;
  fullRank: string;
}

const RANK_BY_PAY_GRADE: Record<string, RankInfo> = {
  'E-1': { rank: 'Pvt', payGrade: 'E-1', fullRank: 'Private' },
  'E-2': { rank: 'PFC', payGrade: 'E-2', fullRank: 'Private First Class' },
  'E-3': { rank: 'LCpl', payGrade: 'E-3', fullRank: 'Lance Corporal' },
  'E-4': { rank: 'Cpl', payGrade: 'E-4', fullRank: 'Corporal' },
  'E-5': { rank: 'Sgt', payGrade: 'E-5', fullRank: 'Sergeant' },
  'E-6': { rank: 'SSgt', payGrade: 'E-6', fullRank: 'Staff Sergeant' },
  'E-7': { rank: 'GySgt', payGrade: 'E-7', fullRank: 'Gunnery Sergeant' },
  'O-1': { rank: '2ndLt', payGrade: 'O-1', fullRank: 'Second Lieutenant' },
  'O-2': { rank: '1stLt', payGrade: 'O-2', fullRank: 'First Lieutenant' },
  'O-3': { rank: 'Capt', payGrade: 'O-3', fullRank: 'Captain' },
  'W-1': { rank: 'WO', payGrade: 'W-1', fullRank: 'Warrant Officer' },
  'W-2': { rank: 'CWO2', payGrade: 'W-2', fullRank: 'Chief Warrant Officer 2' },
  'W-3': { rank: 'CWO3', payGrade: 'W-3', fullRank: 'Chief Warrant Officer 3' },
};

// ============================================
// PERSONNEL GENERATION
// ============================================

// Extended Personnel type for CLR-1
export interface CLR1Personnel extends Personnel {
  dutyUnitId: DutyUnit;
  dutyUnitShortName: string;
}

// Years of service ranges by pay grade
const YEARS_OF_SERVICE_BY_GRADE: Record<string, [number, number]> = {
  'E-1': [0, 1], 'E-2': [1, 2], 'E-3': [1, 3], 'E-4': [2, 5], 'E-5': [4, 8],
  'E-6': [6, 12], 'E-7': [10, 18],
  'W-1': [8, 12], 'W-2': [10, 15], 'W-3': [12, 18],
  'O-1': [0, 2], 'O-2': [2, 4], 'O-3': [4, 8],
};

// Static data
const MARITAL_STATUSES: MaritalStatus[] = ['Single', 'Married', 'Divorced', 'Widowed'];
const GENDERS: Gender[] = ['Male', 'Female', 'Other'];
const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const WEAPONS_QUALS: WeaponsQualification[] = ['Marksman', 'Sharpshooter', 'Expert'];
const VISION_CATEGORIES: VisionCategory[] = ['1', '2', '3', '4'];
const HEARING_CATEGORIES: HearingCategory[] = ['H1', 'H2', 'H3', 'H4'];
const DENTAL_CLASSES: DentalClass[] = ['1', '2', '3', '4'];
const CERT_LEVELS: CertificationLevel[] = ['Basic', 'Intermediate', 'Advanced', 'Expert', 'Instructor'];
const POLYGRAPH_TYPES: PolygraphType[] = ['CI', 'Full Scope', 'Lifestyle', 'None'];
const CLEARANCE_LEVELS: ClearanceLevel[] = ['None', 'Confidential', 'Secret', 'Top Secret', 'TS-SCI'];
const READINESS_STATUSES: ReadinessStatus[] = ['Green', 'Yellow', 'Red'];
const PROFILE_STATUSES: ProfileStatus[] = ['Fit', 'Limited', 'Non-deployable'];

// Combat Logistics MOS codes
const MOS_CODES = [
  '0431 - Logistics/Embarkation Specialist',
  '0481 - Landing Support Specialist',
  '0491 - Combat Logistics Officer',
  '1141 - Electrician',
  '1341 - Engineer Equipment Mechanic',
  '1345 - Engineer Equipment Operator',
  '1371 - Combat Engineer',
  '1391 - Bulk Fuel Specialist',
  '3043 - Supply Administration',
  '3051 - Warehouse Clerk',
  '3112 - Traffic Management Specialist',
  '3381 - Food Service Specialist',
  '3521 - Automotive Organizational Mechanic',
  '3531 - Motor Vehicle Operator',
];

const RELIGIONS = [
  'Protestant', 'Catholic', 'Baptist', 'Methodist', 'Lutheran',
  'Jewish', 'Muslim', 'Buddhist', 'Hindu', 'Atheist', 'No Preference',
];

const SCHOOLS = [
  'Basic Combat Training', 'Advanced Individual Training',
  'Combat Lifesaver Course', 'Basic Leader Course', 'Advanced Leader Course',
  'The Basic School', 'Logistics Officer Course', 'Motor Transport Operator Course',
  'Supply Administration Course', 'Combat Logistics Course',
];

const ALLERGIES = [
  'Penicillin', 'Sulfa', 'Aspirin', 'Ibuprofen', 'Codeine',
  'Latex', 'Bee stings', 'Peanuts', 'Shellfish', 'Eggs',
];

const MEDICATIONS = [
  { name: 'Ibuprofen', dosage: '800mg', frequency: 'As needed' },
  { name: 'Acetaminophen', dosage: '500mg', frequency: 'Every 6 hours' },
  { name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily' },
];

const MEDICAL_LIMITATIONS = [
  'No running', 'No lifting over 25 lbs', 'No prolonged standing',
  'No rucking', 'Profile for back', 'Profile for knee',
];

const APPOINTMENT_TYPES = [
  'Annual Physical', 'Dental Cleaning', 'Vision Exam', 'Hearing Test',
  'Mental Health', 'Immunization', 'Lab Work',
];

const PROVIDERS = [
  'Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Jones',
];

const SPECIAL_ACCESS_PROGRAMS = [
  'SAP Alpha', 'SAP Bravo', 'SAP Charlie', 'SAP Delta', 'SAP Echo',
];

const FOREIGN_COUNTRIES = [
  'Germany', 'Japan', 'South Korea', 'United Kingdom', 'Italy',
  'Canada', 'Australia', 'Mexico', 'France', 'Spain',
];

// Generate helper functions
function generateVaccinations(): Vaccination[] {
  const count = faker.number.int({ min: 8, max: 14 });
  const selected = faker.helpers.arrayElements(VACCINATION_LIST, count);
  return selected.map(name => {
    const administered = faker.date.past({ years: 3 });
    const yearsValid = name.includes('Annual') ? 1 : faker.number.int({ min: 3, max: 10 });
    const expiration = new Date(administered);
    expiration.setFullYear(expiration.getFullYear() + yearsValid);
    const now = new Date();
    return {
      name,
      dateAdministered: administered.toISOString().split('T')[0],
      expirationDate: expiration.toISOString().split('T')[0],
      lotNumber: faker.string.alphanumeric(8).toUpperCase(),
      status: expiration < now ? 'Overdue' : expiration < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) ? 'Due' : 'Current',
    };
  });
}

function generateCertifications(yearsOfService: number): Certification[] {
  const certCount = Math.min(Math.floor(yearsOfService / 2) + 2, 12);
  const selected = faker.helpers.arrayElements(CERTIFICATION_DEFINITIONS, certCount);
  return selected.map(cert => {
    const earned = faker.date.past({ years: Math.max(1, Math.min(yearsOfService, 5)) });
    const expiration = new Date(earned);
    expiration.setFullYear(expiration.getFullYear() + faker.number.int({ min: 2, max: 5 }));
    const now = new Date();
    const hoursRequired = faker.number.int({ min: 20, max: 120 });
    return {
      id: cert.id,
      name: cert.name,
      category: cert.category,
      level: faker.helpers.arrayElement(CERT_LEVELS),
      dateEarned: earned.toISOString().split('T')[0],
      expirationDate: expiration.toISOString().split('T')[0],
      status: expiration < now ? 'Expired' : 'Current' as CertificationStatus,
      certifyingAuthority: faker.helpers.arrayElement(['TRADOC', 'TECOM', 'Unit Commander']),
      hoursRequired,
      hoursCompleted: faker.number.int({ min: hoursRequired, max: hoursRequired + 20 }),
    };
  });
}

function generateAppointments(): MedicalAppointment[] {
  const count = faker.number.int({ min: 0, max: 3 });
  return Array.from({ length: count }, () => ({
    type: faker.helpers.arrayElement(APPOINTMENT_TYPES),
    date: faker.date.future({ years: 0.25 }).toISOString().split('T')[0],
    provider: faker.helpers.arrayElement(PROVIDERS),
    location: faker.helpers.arrayElement(['Medical Clinic', 'Dental Clinic', 'TMC', 'Hospital', 'BAS']),
    status: 'Scheduled' as const,
  }));
}

function generateMedications(): Medication[] {
  const count = faker.number.int({ min: 0, max: 2 });
  return faker.helpers.arrayElements(MEDICATIONS, count).map(med => ({
    ...med,
    prescribedDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    prescribedBy: faker.helpers.arrayElement(PROVIDERS),
  }));
}

function generateInvestigation(clearanceLevel: ClearanceLevel): SecurityInvestigation {
  const invType = clearanceLevel === 'TS-SCI' || clearanceLevel === 'Top Secret'
    ? faker.helpers.arrayElement(['SSBI', 'T5'] as InvestigationType[])
    : faker.helpers.arrayElement(['NACLC', 'T3'] as InvestigationType[]);
  const initiated = faker.date.past({ years: 5 });
  const completed = new Date(initiated);
  completed.setMonth(completed.getMonth() + faker.number.int({ min: 2, max: 12 }));
  const adjudicated = new Date(completed);
  adjudicated.setMonth(adjudicated.getMonth() + faker.number.int({ min: 1, max: 3 }));
  return {
    type: invType,
    initiatedDate: initiated.toISOString().split('T')[0],
    completedDate: completed.toISOString().split('T')[0],
    adjudicatedDate: adjudicated.toISOString().split('T')[0],
    status: 'Closed',
  };
}

// Generate a personnel record for a specific unit and pay grade
function generatePersonnelForUnit(unit: CLR1Unit, gradeKey: string): CLR1Personnel {
  const rankInfo = RANK_BY_PAY_GRADE[gradeKey] || RANK_BY_PAY_GRADE['E-3'];
  const branch: Branch = 'Marines';
  const [minYears, maxYears] = YEARS_OF_SERVICE_BY_GRADE[gradeKey] || [2, 10];
  const yearsOfService = faker.number.int({ min: minYears, max: maxYears });

  const clearanceLevel: ClearanceLevel = faker.helpers.weightedArrayElement([
    { value: 'TS-SCI' as ClearanceLevel, weight: rankInfo.payGrade.startsWith('O') ? 30 : 10 },
    { value: 'Top Secret' as ClearanceLevel, weight: 25 },
    { value: 'Secret' as ClearanceLevel, weight: 40 },
    { value: 'Confidential' as ClearanceLevel, weight: 15 },
    { value: 'None' as ClearanceLevel, weight: 10 },
  ]);

  const medicalReadiness: ReadinessStatus = faker.helpers.weightedArrayElement([
    { value: 'Green' as ReadinessStatus, weight: 75 },
    { value: 'Yellow' as ReadinessStatus, weight: 18 },
    { value: 'Red' as ReadinessStatus, weight: 7 },
  ]);

  const dentalReadiness: ReadinessStatus = faker.helpers.weightedArrayElement([
    { value: 'Green' as ReadinessStatus, weight: 70 },
    { value: 'Yellow' as ReadinessStatus, weight: 22 },
    { value: 'Red' as ReadinessStatus, weight: 8 },
  ]);

  const profileStatus: ProfileStatus = faker.helpers.weightedArrayElement([
    { value: 'Fit' as ProfileStatus, weight: 80 },
    { value: 'Limited' as ProfileStatus, weight: 15 },
    { value: 'Non-deployable' as ProfileStatus, weight: 5 },
  ]);

  const deploymentEligible = profileStatus === 'Fit' && medicalReadiness === 'Green' && dentalReadiness !== 'Red';
  const basicTrainingDate = faker.date.past({ years: Math.max(1, yearsOfService) });
  const aitDate = new Date(basicTrainingDate);
  aitDate.setMonth(aitDate.getMonth() + 4);
  const ptPushups = faker.number.int({ min: 40, max: 100 });
  const ptSitups = faker.number.int({ min: 50, max: 100 });
  const runMinutes = faker.number.int({ min: 12, max: 20 });
  const runSeconds = faker.number.int({ min: 0, max: 59 });
  const gender: Gender = faker.helpers.arrayElement(GENDERS);

  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    middleName: faker.person.middleName(),
    dateOfBirth: faker.date.birthdate({ min: 18, max: 55, mode: 'age' }).toISOString().split('T')[0],
    socialSecurityLastFour: faker.string.numeric(4),
    gender,
    maritalStatus: faker.helpers.arrayElement(MARITAL_STATUSES),
    dependents: faker.number.int({ min: 0, max: 5 }),
    bloodType: faker.helpers.arrayElement(BLOOD_TYPES),
    religion: faker.helpers.arrayElement(RELIGIONS),
    ethnicity: faker.helpers.arrayElement(['White', 'Black', 'Hispanic', 'Asian', 'Native American', 'Pacific Islander', 'Two or More']),
    email: `${faker.person.firstName().toLowerCase()}.${faker.person.lastName().toLowerCase()}@mil.gov`,
    personalEmail: faker.internet.email(),
    phone: `${faker.string.numeric(3)}-${faker.string.numeric(3)}-${faker.string.numeric(4)}`,
    emergencyContact: faker.person.fullName(),
    emergencyPhone: `${faker.string.numeric(3)}-${faker.string.numeric(3)}-${faker.string.numeric(4)}`,
    streetAddress: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode(),
    branch,
    rank: rankInfo.rank,
    payGrade: rankInfo.payGrade,
    mos: faker.helpers.arrayElement(MOS_CODES),
    activeStatus: 'Active' as ActiveStatus,
    activeDutyBaseDate: faker.date.past({ years: 15 }).toISOString().split('T')[0],
    enlistmentDate: faker.date.past({ years: 20 }).toISOString().split('T')[0],
    estimatedTerminationDate: faker.date.future({ years: 5 }).toISOString().split('T')[0],
    yearsOfService,
    dutyStation: unit.location,
    unit: unit.name,
    commandingOfficer: unit.commander,
    clearanceLevel,
    clearanceDate: faker.date.past({ years: 5 }).toISOString().split('T')[0],
    clearanceExpiry: faker.date.future({ years: 5 }).toISOString().split('T')[0],
    polygraphDate: clearanceLevel === 'TS-SCI' ? faker.date.past({ years: 3 }).toISOString().split('T')[0] : '',
    polygraphType: clearanceLevel === 'TS-SCI' ? faker.helpers.arrayElement(POLYGRAPH_TYPES.filter(p => p !== 'None')) : 'None' as PolygraphType,
    specialAccess: clearanceLevel === 'TS-SCI' ? faker.helpers.arrayElements(SPECIAL_ACCESS_PROGRAMS, { min: 1, max: 3 }) : [],
    accessStatus: 'Active' as AccessStatus,
    lastInvestigation: generateInvestigation(clearanceLevel),
    nda: clearanceLevel !== 'None',
    ndaDate: clearanceLevel !== 'None' ? faker.date.past({ years: 5 }).toISOString().split('T')[0] : '',
    foreignContacts: faker.number.int({ min: 0, max: 10 }),
    foreignTravel: faker.helpers.arrayElements(FOREIGN_COUNTRIES, { min: 0, max: 3 }),
    securityIncidents: faker.helpers.weightedArrayElement([
      { value: 0, weight: 90 },
      { value: 1, weight: 8 },
      { value: 2, weight: 2 },
    ]),
    lastSecurityBriefing: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    medicalReadiness,
    dentalReadiness,
    dentalClass: faker.helpers.arrayElement(DENTAL_CLASSES),
    lastPhysicalDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    nextPhysicalDue: faker.date.future({ years: 1 }).toISOString().split('T')[0],
    deploymentEligible,
    profileStatus,
    pulhes: {
      physical: faker.helpers.weightedArrayElement([{ value: 1 as PulhesCategory, weight: 80 }, { value: 2 as PulhesCategory, weight: 15 }, { value: 3 as PulhesCategory, weight: 5 }]),
      upperExtremities: faker.helpers.weightedArrayElement([{ value: 1 as PulhesCategory, weight: 85 }, { value: 2 as PulhesCategory, weight: 12 }, { value: 3 as PulhesCategory, weight: 3 }]),
      lowerExtremities: faker.helpers.weightedArrayElement([{ value: 1 as PulhesCategory, weight: 80 }, { value: 2 as PulhesCategory, weight: 15 }, { value: 3 as PulhesCategory, weight: 5 }]),
      hearing: faker.helpers.weightedArrayElement([{ value: 1 as PulhesCategory, weight: 75 }, { value: 2 as PulhesCategory, weight: 20 }, { value: 3 as PulhesCategory, weight: 5 }]),
      eyes: faker.helpers.weightedArrayElement([{ value: 1 as PulhesCategory, weight: 60 }, { value: 2 as PulhesCategory, weight: 30 }, { value: 3 as PulhesCategory, weight: 10 }]),
      psychiatric: faker.helpers.weightedArrayElement([{ value: 1 as PulhesCategory, weight: 90 }, { value: 2 as PulhesCategory, weight: 8 }, { value: 3 as PulhesCategory, weight: 2 }]),
    },
    visionCategory: faker.helpers.arrayElement(VISION_CATEGORIES),
    hearingCategory: faker.helpers.arrayElement(HEARING_CATEGORIES),
    hivStatus: 'Negative' as const,
    lastHivTest: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    dnaOnFile: faker.datatype.boolean({ probability: 0.95 }),
    vaccinations: generateVaccinations(),
    allergies: faker.helpers.arrayElements(ALLERGIES, { min: 0, max: 3 }),
    currentMedications: faker.datatype.boolean({ probability: 0.2 }) ? generateMedications() : [],
    medicalLimitations: profileStatus !== 'Fit' ? faker.helpers.arrayElements(MEDICAL_LIMITATIONS, { min: 1, max: 3 }) : [],
    lastMentalHealthScreen: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    mentalHealthStatus: faker.helpers.weightedArrayElement([
      { value: 'Green' as ReadinessStatus, weight: 85 },
      { value: 'Yellow' as ReadinessStatus, weight: 12 },
      { value: 'Red' as ReadinessStatus, weight: 3 },
    ]),
    substanceAbuseClear: faker.datatype.boolean({ probability: 0.98 }),
    pregnancyStatus: gender === 'Female' ? faker.helpers.weightedArrayElement([
      { value: 'No' as const, weight: 95 },
      { value: 'Yes' as const, weight: 5 },
    ]) : 'N/A' as const,
    upcomingAppointments: generateAppointments(),
    basicTrainingComplete: true,
    basicTrainingDate: basicTrainingDate.toISOString().split('T')[0],
    aitComplete: true,
    aitDate: aitDate.toISOString().split('T')[0],
    aitMos: faker.helpers.arrayElement(MOS_CODES),
    lastPtTestDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    ptTestScore: faker.number.int({ min: 180, max: 300 }),
    ptPushups,
    ptSitups,
    ptRunTime: `${runMinutes}:${runSeconds.toString().padStart(2, '0')}`,
    weaponsQualification: faker.helpers.arrayElement(WEAPONS_QUALS),
    lastWeaponsQualDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    certifications: generateCertifications(yearsOfService),
    schoolsAttended: faker.helpers.arrayElements(SCHOOLS, { min: 2, max: 6 }),
    totalTrainingHours: faker.number.int({ min: 200, max: 2000 }),
    annualTrainingComplete: faker.datatype.boolean({ probability: 0.85 }),
    annualTrainingDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    specialSkills: faker.helpers.arrayElements([
      'Combat Lifesaver', 'Forklift Operator', 'Hazmat Handler',
      'Convoy Commander', 'Motor Transport Operator', 'Supply Chain Management',
      'Logistics Planning', 'Distribution Management', 'Fuel Handler',
    ], { min: 0, max: 4 }),
    // CLR-1 specific fields
    dutyUnitId: unit.id,
    dutyUnitShortName: unit.shortName,
  };
}

// ============================================
// PERSONNEL DATA GENERATION
// ============================================

// Cache for generated CLR-1 personnel data
const CLR1_CACHE_VERSION = 1;
let cachedCLR1Personnel: CLR1Personnel[] | null = null;
let cachedCLR1Version = 0;

// Generate all CLR-1 personnel based on unit breakdowns
export function generateCLR1Personnel(): CLR1Personnel[] {
  if (cachedCLR1Personnel && cachedCLR1Version === CLR1_CACHE_VERSION) {
    return cachedCLR1Personnel;
  }

  faker.seed(98765); // Consistent seed for CLR-1 data

  const allPersonnel: CLR1Personnel[] = [];

  CLR1_UNITS.forEach(unit => {
    // Staff NCOs (E-6 and E-7)
    const e6Count = Math.floor(unit.staffNCO * 0.6);
    const e7Count = unit.staffNCO - e6Count;

    for (let i = 0; i < e6Count; i++) {
      allPersonnel.push(generatePersonnelForUnit(unit, 'E-6'));
    }
    for (let i = 0; i < e7Count; i++) {
      allPersonnel.push(generatePersonnelForUnit(unit, 'E-7'));
    }

    // Company Grade Officers (O-1, O-2, O-3)
    const o1Count = Math.floor(unit.companyGradeOfficer * 0.30);
    const o2Count = Math.floor(unit.companyGradeOfficer * 0.35);
    const o3Count = unit.companyGradeOfficer - o1Count - o2Count;

    for (let i = 0; i < o1Count; i++) {
      allPersonnel.push(generatePersonnelForUnit(unit, 'O-1'));
    }
    for (let i = 0; i < o2Count; i++) {
      allPersonnel.push(generatePersonnelForUnit(unit, 'O-2'));
    }
    for (let i = 0; i < o3Count; i++) {
      allPersonnel.push(generatePersonnelForUnit(unit, 'O-3'));
    }

    // NCOs (E-4 and E-5)
    const e4Count = Math.floor(unit.nco * 0.55);
    const e5Count = unit.nco - e4Count;

    for (let i = 0; i < e4Count; i++) {
      allPersonnel.push(generatePersonnelForUnit(unit, 'E-4'));
    }
    for (let i = 0; i < e5Count; i++) {
      allPersonnel.push(generatePersonnelForUnit(unit, 'E-5'));
    }

    // Junior Marines (E-1, E-2, E-3)
    const e1Count = Math.floor(unit.juniorMarine * 0.15);
    const e2Count = Math.floor(unit.juniorMarine * 0.25);
    const e3Count = unit.juniorMarine - e1Count - e2Count;

    for (let i = 0; i < e1Count; i++) {
      allPersonnel.push(generatePersonnelForUnit(unit, 'E-1'));
    }
    for (let i = 0; i < e2Count; i++) {
      allPersonnel.push(generatePersonnelForUnit(unit, 'E-2'));
    }
    for (let i = 0; i < e3Count; i++) {
      allPersonnel.push(generatePersonnelForUnit(unit, 'E-3'));
    }
  });

  cachedCLR1Personnel = allPersonnel;
  cachedCLR1Version = CLR1_CACHE_VERSION;
  return cachedCLR1Personnel;
}

// Get personnel by duty unit
export function getPersonnelByDutyUnit(dutyUnit: DutyUnit): CLR1Personnel[] {
  return generateCLR1Personnel().filter(p => p.dutyUnitId === dutyUnit);
}

// Get CDO-eligible personnel for a unit (E6-E7, O1-O3, W1-W3)
export function getCDOEligiblePersonnel(dutyUnit: DutyUnit): CLR1Personnel[] {
  const eligibleGrades = ['E-6', 'E-7', 'O-1', 'O-2', 'O-3', 'W-1', 'W-2', 'W-3'];
  return getPersonnelByDutyUnit(dutyUnit).filter(p => eligibleGrades.includes(p.payGrade));
}

// Get duty driver eligible personnel for a unit (E1-E3)
export function getDutyDriverEligiblePersonnel(dutyUnit: DutyUnit): CLR1Personnel[] {
  const eligibleGrades = ['E-1', 'E-2', 'E-3'];
  return getPersonnelByDutyUnit(dutyUnit).filter(p => eligibleGrades.includes(p.payGrade));
}

// Get combined CDO-eligible personnel for multiple units
export function getCombinedCDOEligiblePersonnel(dutyUnits: DutyUnit[]): CLR1Personnel[] {
  const eligibleGrades = ['E-6', 'E-7', 'O-1', 'O-2', 'O-3', 'W-1', 'W-2', 'W-3'];
  return generateCLR1Personnel().filter(
    p => dutyUnits.includes(p.dutyUnitId) && eligibleGrades.includes(p.payGrade)
  );
}

// Get combined duty driver eligible personnel for multiple units
export function getCombinedDutyDriverEligiblePersonnel(dutyUnits: DutyUnit[]): CLR1Personnel[] {
  const eligibleGrades = ['E-1', 'E-2', 'E-3'];
  return generateCLR1Personnel().filter(
    p => dutyUnits.includes(p.dutyUnitId) && eligibleGrades.includes(p.payGrade)
  );
}

// ============================================
// DUTY SCHEDULE GENERATION
// ============================================

// Duty schedule configuration
export interface DutyScheduleConfig {
  id: string;
  name: string;
  units: DutyUnit[];
  positions: DutyPosition[];
  isCombined: boolean;
  description: string;
}

export const DUTY_SCHEDULES: DutyScheduleConfig[] = [
  {
    id: 'regimental-duty',
    name: 'Regimental Duty (CLR-1/CLB-1 Combined)',
    units: ['CLR-1', 'CLB-1'],
    positions: ['R-CDO', 'R-ACDO', 'DUTY-DRIVER'],
    isCombined: true,
    description: 'Combined regimental duty. CLB-1 duty is combined with regiment.',
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

// Get days in a month
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// Generate duty schedule for a month
export function generateMonthlyDutySchedule(
  scheduleConfig: DutyScheduleConfig,
  year: number,
  month: number
): DutyAssignment[] {
  faker.seed(year * 100 + month + scheduleConfig.id.charCodeAt(0)); // Consistent per month/schedule

  const daysInMonth = getDaysInMonth(year, month);
  const assignments: DutyAssignment[] = [];

  // Get eligible personnel based on positions
  const cdoPositions: DutyPosition[] = ['R-CDO', 'R-ACDO', 'OOD', 'AOOD'];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    scheduleConfig.positions.forEach(position => {
      let eligiblePersonnel: CLR1Personnel[];

      if (position === 'DUTY-DRIVER') {
        eligiblePersonnel = getCombinedDutyDriverEligiblePersonnel(scheduleConfig.units);
      } else {
        eligiblePersonnel = getCombinedCDOEligiblePersonnel(scheduleConfig.units);
      }

      if (eligiblePersonnel.length === 0) return;

      // Select a random person for this duty day
      // In a real system, you'd want to track who has stood duty recently
      const selectedPerson = faker.helpers.arrayElement(eligiblePersonnel);

      assignments.push({
        id: `${scheduleConfig.id}-${dateStr}-${position}`,
        date: dateStr,
        position,
        scheduleId: scheduleConfig.id,
        personnelId: selectedPerson.id,
        personnelName: `${selectedPerson.rank} ${selectedPerson.lastName}`,
        personnelRank: selectedPerson.rank,
        personnelPayGrade: selectedPerson.payGrade,
        unitId: selectedPerson.dutyUnitId,
      });
    });
  }

  return assignments;
}

// ============================================
// DUTY STATISTICS & ANALYSIS
// ============================================

export interface DutyStatsByUnit {
  unitId: DutyUnit;
  unitName: string;
  totalEligible: number;
  cdoEligible: number;
  driverEligible: number;
  totalDutyDays: number;
  dutyDaysByPosition: Record<DutyPosition, number>;
  dutyPerCapita: number;
}

// Calculate duty statistics for analysis
export function calculateDutyStatistics(
  assignments: DutyAssignment[],
  dutyUnits: DutyUnit[]
): DutyStatsByUnit[] {
  const stats: DutyStatsByUnit[] = [];

  dutyUnits.forEach(unitId => {
    const unit = getCLR1Unit(unitId);
    if (!unit) return;

    const unitAssignments = assignments.filter(a => a.unitId === unitId);
    const dutyDaysByPosition: Record<DutyPosition, number> = {
      'R-CDO': 0,
      'R-ACDO': 0,
      'DUTY-DRIVER': 0,
      'OOD': 0,
      'AOOD': 0,
    };

    unitAssignments.forEach(a => {
      dutyDaysByPosition[a.position]++;
    });

    const cdoEligible = getCDOEligibleCount(unit);
    const driverEligible = getDutyDriverEligibleCount(unit);
    const totalDutyDays = unitAssignments.length;

    stats.push({
      unitId,
      unitName: unit.name,
      totalEligible: getTotalPersonnel(unit),
      cdoEligible,
      driverEligible,
      totalDutyDays,
      dutyDaysByPosition,
      dutyPerCapita: cdoEligible > 0 ? totalDutyDays / cdoEligible : 0,
    });
  });

  return stats;
}

// Calculate fairness analysis comparing scenarios
export interface FairnessAnalysis {
  scenario: string;
  period: string;
  statistics: DutyStatsByUnit[];
  averageDutyPerCapita: number;
  maxDutyPerCapita: number;
  minDutyPerCapita: number;
  variance: number;
}

export function analyzeDutyFairness(
  assignments: DutyAssignment[],
  dutyUnits: DutyUnit[],
  scenario: string,
  period: string
): FairnessAnalysis {
  const statistics = calculateDutyStatistics(assignments, dutyUnits);

  const perCapitaValues = statistics
    .filter(s => s.cdoEligible > 0)
    .map(s => s.dutyPerCapita);

  const average = perCapitaValues.length > 0
    ? perCapitaValues.reduce((a, b) => a + b, 0) / perCapitaValues.length
    : 0;

  const max = perCapitaValues.length > 0 ? Math.max(...perCapitaValues) : 0;
  const min = perCapitaValues.length > 0 ? Math.min(...perCapitaValues) : 0;

  const variance = perCapitaValues.length > 0
    ? perCapitaValues.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / perCapitaValues.length
    : 0;

  return {
    scenario,
    period,
    statistics,
    averageDutyPerCapita: average,
    maxDutyPerCapita: max,
    minDutyPerCapita: min,
    variance: Math.sqrt(variance),
  };
}
