// Military Personnel Data Types - Enhanced with comprehensive fields

export type Branch = 'Army' | 'Navy' | 'Air Force' | 'Marines' | 'Space Force' | 'Coast Guard';
export type ActiveStatus = 'Active' | 'Reserve' | 'Guard';
export type ClearanceLevel = 'None' | 'Confidential' | 'Secret' | 'Top Secret' | 'TS-SCI';
export type ReadinessStatus = 'Green' | 'Yellow' | 'Red';
export type ProfileStatus = 'Fit' | 'Limited' | 'Non-deployable';
export type WeaponsQualification = 'Marksman' | 'Sharpshooter' | 'Expert';
export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed';
export type Gender = 'Male' | 'Female' | 'Other';

// Security Types
export type InvestigationType = 'NACLC' | 'SSBI' | 'SSBI-PR' | 'T3' | 'T5' | 'T5R';
export type PolygraphType = 'CI' | 'Full Scope' | 'Lifestyle' | 'None';
export type AccessStatus = 'Active' | 'Suspended' | 'Revoked' | 'Pending';

// Medical Types
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type HIVStatus = 'Negative' | 'Pending';
export type VisionCategory = '1' | '2' | '3' | '4';
export type HearingCategory = 'H1' | 'H2' | 'H3' | 'H4';
export type DentalClass = '1' | '2' | '3' | '4';
export type PulhesCategory = 1 | 2 | 3 | 4;

// Training Types
export type CertificationLevel = 'Basic' | 'Intermediate' | 'Advanced' | 'Expert' | 'Instructor';
export type CertificationStatus = 'Current' | 'Expired' | 'Pending' | 'Waived';

export interface Vaccination {
  name: string;
  dateAdministered: string;
  expirationDate: string;
  lotNumber: string;
  status: 'Current' | 'Due' | 'Overdue';
}

export interface MedicalAppointment {
  type: string;
  date: string;
  provider: string;
  location: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show';
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescribedDate: string;
  prescribedBy: string;
}

export interface SecurityInvestigation {
  type: InvestigationType;
  initiatedDate: string;
  completedDate: string;
  adjudicatedDate: string;
  status: 'Open' | 'Closed' | 'Pending';
}

export interface Certification {
  id: string;
  name: string;
  category: 'Weapons' | 'Medical' | 'Technical' | 'Leadership' | 'Physical' | 'Language' | 'Specialty';
  level: CertificationLevel;
  dateEarned: string;
  expirationDate: string;
  status: CertificationStatus;
  certifyingAuthority: string;
  hoursRequired: number;
  hoursCompleted: number;
}

export interface Personnel {
  // Personal Information (12 fields)
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  socialSecurityLastFour: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  dependents: number;
  bloodType: BloodType;
  religion: string;
  ethnicity: string;

  // Contact Information (9 fields)
  email: string;
  personalEmail: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;

  // Military Service (12 fields)
  branch: Branch;
  rank: string;
  payGrade: string;
  mos: string;
  activeStatus: ActiveStatus;
  activeDutyBaseDate: string;
  enlistmentDate: string;
  estimatedTerminationDate: string;
  yearsOfService: number;
  dutyStation: string;
  unit: string;
  commandingOfficer: string;

  // Security & Clearance - Enhanced
  clearanceLevel: ClearanceLevel;
  clearanceDate: string;
  clearanceExpiry: string;
  polygraphDate: string;
  polygraphType: PolygraphType;
  specialAccess: string[];
  accessStatus: AccessStatus;
  lastInvestigation: SecurityInvestigation;
  nda: boolean;
  ndaDate: string;
  foreignContacts: number;
  foreignTravel: string[];
  securityIncidents: number;
  lastSecurityBriefing: string;

  // Medical - Enhanced
  medicalReadiness: ReadinessStatus;
  dentalReadiness: ReadinessStatus;
  dentalClass: DentalClass;
  lastPhysicalDate: string;
  nextPhysicalDue: string;
  deploymentEligible: boolean;
  profileStatus: ProfileStatus;
  pulhes: {
    physical: PulhesCategory;
    upperExtremities: PulhesCategory;
    lowerExtremities: PulhesCategory;
    hearing: PulhesCategory;
    eyes: PulhesCategory;
    psychiatric: PulhesCategory;
  };
  visionCategory: VisionCategory;
  hearingCategory: HearingCategory;
  hivStatus: HIVStatus;
  lastHivTest: string;
  dnaOnFile: boolean;
  vaccinations: Vaccination[];
  allergies: string[];
  currentMedications: Medication[];
  medicalLimitations: string[];
  lastMentalHealthScreen: string;
  mentalHealthStatus: ReadinessStatus;
  substanceAbuseClear: boolean;
  pregnancyStatus: 'N/A' | 'Yes' | 'No';
  upcomingAppointments: MedicalAppointment[];

  // Training & Qualifications - Enhanced
  basicTrainingComplete: boolean;
  basicTrainingDate: string;
  aitComplete: boolean;
  aitDate: string;
  aitMos: string;
  lastPtTestDate: string;
  ptTestScore: number;
  ptPushups: number;
  ptSitups: number;
  ptRunTime: string;
  weaponsQualification: WeaponsQualification;
  lastWeaponsQualDate: string;
  certifications: Certification[];
  schoolsAttended: string[];
  totalTrainingHours: number;
  annualTrainingComplete: boolean;
  annualTrainingDate: string;
  specialSkills: string[];
}

export interface PersonnelStats {
  total: number;
  deploymentReady: number;
  deploymentReadyPercent: number;
  medicalGreen: number;
  medicalGreenPercent: number;
  avgYearsOfService: string;
  branchDistribution: { name: string; value: number }[];
  clearanceDistribution: { name: string; value: number }[];
  readinessDistribution: { name: string; value: number; color: string }[];
}

export interface PersonnelResponse {
  data: Personnel[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  stats: PersonnelStats;
}

export interface SavedView {
  id: string;
  name: string;
  createdAt: string;
  columns: string[];
  columnOrder: string[];
  filters: Record<string, unknown>;
  sort: { field: string; direction: 'asc' | 'desc' }[];
}

export interface DashboardState {
  visibleColumns: string[];
  columnOrder: string[];
  savedViews: SavedView[];
  activeViewId: string | null;
  globalSearch: string;
  filters: Record<string, unknown>;
}

export interface ColumnMeta {
  id: keyof Personnel;
  label: string;
  category: 'personal' | 'contact' | 'service' | 'security' | 'training' | 'health';
  filterable: boolean;
  filterType?: 'text' | 'select' | 'date' | 'number' | 'boolean';
  filterOptions?: string[];
}

// Training/Certification definitions
export const CERTIFICATION_DEFINITIONS = [
  // Weapons (5)
  { id: 'weapons-rifle', name: 'M4/M16 Rifle Qualification', category: 'Weapons' as const },
  { id: 'weapons-pistol', name: 'M9/M17 Pistol Qualification', category: 'Weapons' as const },
  { id: 'weapons-mg', name: 'M240/M249 Machine Gun', category: 'Weapons' as const },
  { id: 'weapons-grenade', name: 'Hand Grenade Qualification', category: 'Weapons' as const },
  { id: 'weapons-at', name: 'Anti-Tank Weapons (AT-4/Javelin)', category: 'Weapons' as const },

  // Medical (4)
  { id: 'med-cpr', name: 'CPR/First Aid', category: 'Medical' as const },
  { id: 'med-combat', name: 'Combat Lifesaver (CLS)', category: 'Medical' as const },
  { id: 'med-tccc', name: 'Tactical Combat Casualty Care', category: 'Medical' as const },
  { id: 'med-emt', name: 'Emergency Medical Technician', category: 'Medical' as const },

  // Technical (4)
  { id: 'tech-commo', name: 'Radio Communications', category: 'Technical' as const },
  { id: 'tech-nbc', name: 'NBC/CBRN Defense', category: 'Technical' as const },
  { id: 'tech-demo', name: 'Demolitions', category: 'Technical' as const },
  { id: 'tech-cyber', name: 'Cyber Operations', category: 'Technical' as const },

  // Leadership (4)
  { id: 'lead-blc', name: 'Basic Leader Course (BLC)', category: 'Leadership' as const },
  { id: 'lead-alc', name: 'Advanced Leader Course (ALC)', category: 'Leadership' as const },
  { id: 'lead-slc', name: 'Senior Leader Course (SLC)', category: 'Leadership' as const },
  { id: 'lead-bolc', name: 'Basic Officer Leader Course', category: 'Leadership' as const },

  // Physical (3)
  { id: 'phys-airborne', name: 'Airborne', category: 'Physical' as const },
  { id: 'phys-airassault', name: 'Air Assault', category: 'Physical' as const },
  { id: 'phys-ranger', name: 'Ranger', category: 'Physical' as const },

  // Language (3)
  { id: 'lang-dlpt', name: 'Defense Language Proficiency Test', category: 'Language' as const },
  { id: 'lang-interpreter', name: 'Military Interpreter', category: 'Language' as const },
  { id: 'lang-cultural', name: 'Cultural Awareness', category: 'Language' as const },

  // Specialty (4)
  { id: 'spec-driver', name: 'Military Vehicle Operator', category: 'Specialty' as const },
  { id: 'spec-sniper', name: 'Sniper School', category: 'Specialty' as const },
  { id: 'spec-pathfinder', name: 'Pathfinder', category: 'Specialty' as const },
  { id: 'spec-sere', name: 'SERE (Survival, Evasion, Resistance, Escape)', category: 'Specialty' as const },
];

export const VACCINATION_LIST = [
  'COVID-19',
  'Influenza (Annual)',
  'Tetanus/Diphtheria (Td)',
  'Tetanus/Diphtheria/Pertussis (Tdap)',
  'Hepatitis A',
  'Hepatitis B',
  'Typhoid',
  'Yellow Fever',
  'Anthrax',
  'Smallpox',
  'Meningococcal',
  'MMR (Measles, Mumps, Rubella)',
  'Polio (IPV)',
  'Japanese Encephalitis',
  'Rabies (Pre-exposure)',
  'Adenovirus',
];
