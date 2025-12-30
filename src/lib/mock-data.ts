import { faker } from '@faker-js/faker';
import type {
  Personnel, Branch, ActiveStatus, ClearanceLevel, ReadinessStatus, ProfileStatus,
  WeaponsQualification, MaritalStatus, Gender, BloodType, Vaccination, Certification,
  MedicalAppointment, Medication, SecurityInvestigation, InvestigationType, PolygraphType,
  AccessStatus, VisionCategory, HearingCategory, DentalClass, PulhesCategory, CertificationLevel,
  CertificationStatus
} from '@/types/personnel';
import { CERTIFICATION_DEFINITIONS, VACCINATION_LIST } from '@/types/personnel';

// Military-specific data
const BRANCHES: Branch[] = ['Army', 'Navy', 'Air Force', 'Marines', 'Space Force', 'Coast Guard'];
const ACTIVE_STATUSES: ActiveStatus[] = ['Active', 'Reserve', 'Guard'];
const CLEARANCE_LEVELS: ClearanceLevel[] = ['None', 'Confidential', 'Secret', 'Top Secret', 'TS-SCI'];
const READINESS_STATUSES: ReadinessStatus[] = ['Green', 'Yellow', 'Red'];
const PROFILE_STATUSES: ProfileStatus[] = ['Fit', 'Limited', 'Non-deployable'];
const WEAPONS_QUALS: WeaponsQualification[] = ['Marksman', 'Sharpshooter', 'Expert'];
const MARITAL_STATUSES: MaritalStatus[] = ['Single', 'Married', 'Divorced', 'Widowed'];
const GENDERS: Gender[] = ['Male', 'Female', 'Other'];
const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const INVESTIGATION_TYPES: InvestigationType[] = ['NACLC', 'SSBI', 'SSBI-PR', 'T3', 'T5', 'T5R'];
const POLYGRAPH_TYPES: PolygraphType[] = ['CI', 'Full Scope', 'Lifestyle', 'None'];
const ACCESS_STATUSES: AccessStatus[] = ['Active', 'Suspended', 'Revoked', 'Pending'];
const VISION_CATEGORIES: VisionCategory[] = ['1', '2', '3', '4'];
const HEARING_CATEGORIES: HearingCategory[] = ['H1', 'H2', 'H3', 'H4'];
const DENTAL_CLASSES: DentalClass[] = ['1', '2', '3', '4'];
const CERT_LEVELS: CertificationLevel[] = ['Basic', 'Intermediate', 'Advanced', 'Expert', 'Instructor'];
const CERT_STATUSES: CertificationStatus[] = ['Current', 'Expired', 'Pending', 'Waived'];

// ============================================
// UNIT HIERARCHY - Based on Marine Corps Structure
// ============================================
// Staff position for unit leadership
export interface StaffPosition {
  title: string;        // Full title, e.g., "Commanding General"
  abbreviation: string; // Short form, e.g., "CG"
  rank: string;         // Rank title, e.g., "Lieutenant General"
  name: string;         // Personnel name
  payGrade: string;     // Pay grade, e.g., "O-9"
}

export interface UnitHierarchy {
  id: string;
  name: string;
  type: 'MEF' | 'Division' | 'Regiment' | 'Battalion' | 'Company' | 'Platoon' | 'Squad' | 'Team';
  commander: string;
  commanderRank: string;
  parentId: string | null;
  personnelCount: number;
  location: string;
  mission: string;
  staffPositions: StaffPosition[];
}

// Staff position templates by echelon level (USMC structure)
type StaffTemplate = Omit<StaffPosition, 'name'>;

const STAFF_POSITIONS_BY_ECHELON: Record<string, StaffTemplate[]> = {
  'MEF': [
    { title: 'Commanding General', abbreviation: 'CG', rank: 'Lieutenant General', payGrade: 'O-9' },
    { title: 'Deputy Commanding General', abbreviation: 'DCG', rank: 'Major General', payGrade: 'O-8' },
    { title: 'Chief of Staff', abbreviation: 'CoS', rank: 'Colonel', payGrade: 'O-6' },
    { title: 'Sergeant Major', abbreviation: 'SgtMaj', rank: 'Sergeant Major', payGrade: 'E-9' },
    { title: 'Personnel Officer', abbreviation: 'G-1', rank: 'Colonel', payGrade: 'O-6' },
    { title: 'Intelligence Officer', abbreviation: 'G-2', rank: 'Colonel', payGrade: 'O-6' },
    { title: 'Operations Officer', abbreviation: 'G-3', rank: 'Colonel', payGrade: 'O-6' },
    { title: 'Logistics Officer', abbreviation: 'G-4', rank: 'Colonel', payGrade: 'O-6' },
    { title: 'Plans Officer', abbreviation: 'G-5', rank: 'Colonel', payGrade: 'O-6' },
    { title: 'Communications Officer', abbreviation: 'G-6', rank: 'Colonel', payGrade: 'O-6' },
    { title: 'Staff Judge Advocate', abbreviation: 'SJA', rank: 'Colonel', payGrade: 'O-6' },
    { title: 'Chaplain', abbreviation: 'Chap', rank: 'Captain', payGrade: 'O-3' },
    { title: 'Public Affairs Officer', abbreviation: 'PAO', rank: 'Major', payGrade: 'O-4' },
  ],
  'Division': [
    { title: 'Commanding General', abbreviation: 'CG', rank: 'Major General', payGrade: 'O-8' },
    { title: 'Assistant Division Commander', abbreviation: 'ADC', rank: 'Brigadier General', payGrade: 'O-7' },
    { title: 'Chief of Staff', abbreviation: 'CoS', rank: 'Colonel', payGrade: 'O-6' },
    { title: 'Sergeant Major', abbreviation: 'SgtMaj', rank: 'Sergeant Major', payGrade: 'E-9' },
    { title: 'Personnel Officer', abbreviation: 'G-1', rank: 'Lieutenant Colonel', payGrade: 'O-5' },
    { title: 'Intelligence Officer', abbreviation: 'G-2', rank: 'Lieutenant Colonel', payGrade: 'O-5' },
    { title: 'Operations Officer', abbreviation: 'G-3', rank: 'Lieutenant Colonel', payGrade: 'O-5' },
    { title: 'Logistics Officer', abbreviation: 'G-4', rank: 'Lieutenant Colonel', payGrade: 'O-5' },
  ],
  'Regiment': [
    { title: 'Commanding Officer', abbreviation: 'CO', rank: 'Colonel', payGrade: 'O-6' },
    { title: 'Executive Officer', abbreviation: 'XO', rank: 'Lieutenant Colonel', payGrade: 'O-5' },
    { title: 'Sergeant Major', abbreviation: 'SgtMaj', rank: 'Sergeant Major', payGrade: 'E-9' },
    { title: 'Personnel Officer', abbreviation: 'S-1', rank: 'Major', payGrade: 'O-4' },
    { title: 'Intelligence Officer', abbreviation: 'S-2', rank: 'Major', payGrade: 'O-4' },
    { title: 'Operations Officer', abbreviation: 'S-3', rank: 'Major', payGrade: 'O-4' },
    { title: 'Logistics Officer', abbreviation: 'S-4', rank: 'Major', payGrade: 'O-4' },
  ],
  'Battalion': [
    { title: 'Commanding Officer', abbreviation: 'CO', rank: 'Lieutenant Colonel', payGrade: 'O-5' },
    { title: 'Executive Officer', abbreviation: 'XO', rank: 'Major', payGrade: 'O-4' },
    { title: 'Sergeant Major', abbreviation: 'SgtMaj', rank: 'Sergeant Major', payGrade: 'E-9' },
    { title: 'Personnel Officer', abbreviation: 'S-1', rank: 'Captain', payGrade: 'O-3' },
    { title: 'Intelligence Officer', abbreviation: 'S-2', rank: 'Captain', payGrade: 'O-3' },
    { title: 'Operations Officer', abbreviation: 'S-3', rank: 'Captain', payGrade: 'O-3' },
    { title: 'Logistics Officer', abbreviation: 'S-4', rank: 'Captain', payGrade: 'O-3' },
    { title: 'Battalion Gunner', abbreviation: 'Gunner', rank: 'Chief Warrant Officer 3', payGrade: 'W-3' },
  ],
  'Company': [
    { title: 'Commanding Officer', abbreviation: 'CO', rank: 'Captain', payGrade: 'O-3' },
    { title: 'Executive Officer', abbreviation: 'XO', rank: 'First Lieutenant', payGrade: 'O-2' },
    { title: 'First Sergeant', abbreviation: '1stSgt', rank: 'First Sergeant', payGrade: 'E-8' },
    { title: 'Company Gunnery Sergeant', abbreviation: 'GySgt', rank: 'Gunnery Sergeant', payGrade: 'E-7' },
  ],
  'Platoon': [
    { title: 'Platoon Commander', abbreviation: 'PltCmdr', rank: 'First Lieutenant', payGrade: 'O-2' },
    { title: 'Platoon Sergeant', abbreviation: 'PltSgt', rank: 'Staff Sergeant', payGrade: 'E-6' },
  ],
  'Squad': [
    { title: 'Squad Leader', abbreviation: 'SL', rank: 'Sergeant', payGrade: 'E-5' },
    { title: 'Assistant Squad Leader', abbreviation: 'ASL', rank: 'Corporal', payGrade: 'E-4' },
  ],
  'Team': [
    { title: 'Team Leader', abbreviation: 'TL', rank: 'Corporal', payGrade: 'E-4' },
  ],
};

// Generate staff positions with random names for a unit type
function generateStaffPositions(unitType: string): StaffPosition[] {
  const templates = STAFF_POSITIONS_BY_ECHELON[unitType] || [];
  return templates.map(template => ({
    ...template,
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
  }));
}

// Helper function to generate sub-units for a battalion
function generateBattalionSubUnits(
  battalionId: string,
  battalionShortName: string,
  location: string
): UnitHierarchy[] {
  const units: UnitHierarchy[] = [];
  const companyNames = ['Alpha', 'Bravo', 'Charlie', 'Weapons', 'H&S'];
  const companyCommanders = [
    { name: 'Capt Jason Miller', rank: 'Captain' },
    { name: 'Capt Lisa Rodriguez', rank: 'Captain' },
    { name: 'Capt Mark Johnson', rank: 'Captain' },
    { name: 'Capt Emily Chen', rank: 'Captain' },
    { name: 'Capt Robert Taylor', rank: 'Captain' },
  ];
  const platoonCommanders = [
    { name: '1stLt Kevin Williams', rank: 'First Lieutenant' },
    { name: '2ndLt Sarah Adams', rank: 'Second Lieutenant' },
    { name: '1stLt Daniel Martinez', rank: 'First Lieutenant' },
  ];
  const squadCommanders = [
    { name: 'SSgt Michael Brown', rank: 'Staff Sergeant' },
    { name: 'Sgt James Wilson', rank: 'Sergeant' },
    { name: 'Sgt Patricia Garcia', rank: 'Sergeant' },
  ];
  const teamCommanders = [
    { name: 'Cpl David Martinez', rank: 'Corporal' },
    { name: 'Cpl Jennifer Lee', rank: 'Corporal' },
    { name: 'Cpl Robert Thompson', rank: 'Corporal' },
  ];

  // Generate Companies
  companyNames.forEach((companyName, companyIdx) => {
    const companyLetter = companyName === 'Weapons' ? 'w' : companyName === 'H&S' ? 'hq' : companyName.toLowerCase()[0];
    const companyId = `co-${companyLetter}-${battalionId}`;
    const displayName = companyName === 'Weapons' || companyName === 'H&S'
      ? `${companyName} Company, ${battalionShortName}`
      : `${companyName} Company, ${battalionShortName}`;

    units.push({
      id: companyId,
      name: displayName,
      type: 'Company',
      commander: faker.helpers.arrayElement(companyCommanders).name.replace(/^(Capt|1stLt|2ndLt|Maj)\s/, 'Capt ') + ` ${faker.person.lastName()}`,
      commanderRank: 'Captain',
      parentId: battalionId,
      personnelCount: companyName === 'H&S' ? 195 : companyName === 'Weapons' ? 165 : 180,
      location,
      mission: companyName === 'Weapons' ? 'Heavy weapons and fire support' :
               companyName === 'H&S' ? 'Headquarters and support services' :
               'Rifle company',
      staffPositions: generateStaffPositions('Company'),
    });

    // Generate 3 Platoons per Company (except Weapons and H&S which have fewer)
    const numPlatoons = (companyName === 'Weapons' || companyName === 'H&S') ? 0 : 3;
    for (let platoonNum = 1; platoonNum <= numPlatoons; platoonNum++) {
      const platoonId = `plt-${platoonNum}-${companyLetter}-${battalionId}`;
      const platoonCmdr = platoonCommanders[(platoonNum - 1) % platoonCommanders.length];

      // Create short identifiers for unique naming
      const platoonOrdinal = platoonNum === 1 ? '1st' : platoonNum === 2 ? '2nd' : '3rd';
      const platoonDisplayName = `${platoonOrdinal} Plt, ${companyName}/${battalionShortName}`;

      units.push({
        id: platoonId,
        name: platoonDisplayName,
        type: 'Platoon',
        commander: `${platoonCmdr.name.split(' ')[0]} ${faker.person.lastName()}`,
        commanderRank: platoonCmdr.rank,
        parentId: companyId,
        personnelCount: 43,
        location,
        mission: 'Assault platoon',
        staffPositions: generateStaffPositions('Platoon'),
      });

      // Generate 3 Squads per Platoon
      for (let squadNum = 1; squadNum <= 3; squadNum++) {
        const squadId = `sqd-${squadNum}-${platoonNum}-${companyLetter}-${battalionId}`;
        const squadCmdr = squadCommanders[(squadNum - 1) % squadCommanders.length];
        const squadOrdinal = squadNum === 1 ? '1st' : squadNum === 2 ? '2nd' : '3rd';
        const squadDisplayName = `${squadOrdinal} Sqd, ${platoonOrdinal} Plt, ${companyName}/${battalionShortName}`;

        units.push({
          id: squadId,
          name: squadDisplayName,
          type: 'Squad',
          commander: `${squadCmdr.name.split(' ')[0]} ${faker.person.lastName()}`,
          commanderRank: squadCmdr.rank,
          parentId: platoonId,
          personnelCount: 13,
          location,
          mission: 'Fire team leadership',
          staffPositions: generateStaffPositions('Squad'),
        });

        // Generate 3 Fire Teams per Squad
        const teamNames = ['Alpha', 'Bravo', 'Charlie'];
        teamNames.forEach((teamName, teamIdx) => {
          const teamId = `tm-${teamName.toLowerCase()[0]}-${squadNum}-${platoonNum}-${companyLetter}-${battalionId}`;
          const teamCmdr = teamCommanders[teamIdx % teamCommanders.length];
          const teamDisplayName = `${teamName} Tm, ${squadOrdinal} Sqd, ${platoonOrdinal} Plt, ${companyName}/${battalionShortName}`;

          units.push({
            id: teamId,
            name: teamDisplayName,
            type: 'Team',
            commander: `${teamCmdr.name.split(' ')[0]} ${faker.person.lastName()}`,
            commanderRank: teamCmdr.rank,
            parentId: squadId,
            personnelCount: 4,
            location,
            mission: 'Fire team element',
            staffPositions: generateStaffPositions('Team'),
          });
        });
      }
    }
  });

  return units;
}

// Define the base unit hierarchy (MEF through Battalion)
const BASE_UNIT_HIERARCHY: UnitHierarchy[] = [
  // MEFs (Top Level)
  {
    id: 'mef-1',
    name: 'I Marine Expeditionary Force',
    type: 'MEF',
    commander: 'Lt Gen Marcus Williams',
    commanderRank: 'Lieutenant General',
    parentId: null,
    personnelCount: 45000,
    location: 'Camp Pendleton, CA',
    mission: 'Pacific Theater operations and rapid response force',
    staffPositions: generateStaffPositions('MEF'),
  },
  {
    id: 'mef-2',
    name: 'II Marine Expeditionary Force',
    type: 'MEF',
    commander: 'Lt Gen Robert Hayes',
    commanderRank: 'Lieutenant General',
    parentId: null,
    personnelCount: 48000,
    location: 'Camp Lejeune, NC',
    mission: 'Atlantic Theater operations and NATO support',
    staffPositions: generateStaffPositions('MEF'),
  },

  // Divisions (under MEFs)
  {
    id: 'div-1',
    name: '1st Marine Division',
    type: 'Division',
    commander: 'MajGen Thomas Chen',
    commanderRank: 'Major General',
    parentId: 'mef-1',
    personnelCount: 19000,
    location: 'Camp Pendleton, CA',
    mission: 'Ground combat element for I MEF',
    staffPositions: generateStaffPositions('Division'),
  },
  {
    id: 'div-2',
    name: '2nd Marine Division',
    type: 'Division',
    commander: 'MajGen Sarah Mitchell',
    commanderRank: 'Major General',
    parentId: 'mef-2',
    personnelCount: 18500,
    location: 'Camp Lejeune, NC',
    mission: 'Ground combat element for II MEF',
    staffPositions: generateStaffPositions('Division'),
  },
  {
    id: 'div-3',
    name: '3rd Marine Division',
    type: 'Division',
    commander: 'MajGen James Nakamura',
    commanderRank: 'Major General',
    parentId: 'mef-1',
    personnelCount: 17000,
    location: 'Okinawa, Japan',
    mission: 'Forward deployed Pacific forces',
    staffPositions: generateStaffPositions('Division'),
  },

  // Regiments (under Divisions)
  {
    id: 'reg-1',
    name: '1st Marine Regiment',
    type: 'Regiment',
    commander: 'Col David Foster',
    commanderRank: 'Colonel',
    parentId: 'div-1',
    personnelCount: 3500,
    location: 'Camp Pendleton, CA',
    mission: 'Infantry operations and ground assault',
    staffPositions: generateStaffPositions('Regiment'),
  },
  {
    id: 'reg-5',
    name: '5th Marine Regiment',
    type: 'Regiment',
    commander: 'Col Maria Santos',
    commanderRank: 'Colonel',
    parentId: 'div-1',
    personnelCount: 3200,
    location: 'Camp Pendleton, CA',
    mission: 'Combined arms maneuver warfare',
    staffPositions: generateStaffPositions('Regiment'),
  },
  {
    id: 'reg-7',
    name: '7th Marine Regiment',
    type: 'Regiment',
    commander: 'Col Brian Thompson',
    commanderRank: 'Colonel',
    parentId: 'div-1',
    personnelCount: 3100,
    location: 'Twentynine Palms, CA',
    mission: 'Desert warfare and mechanized operations',
    staffPositions: generateStaffPositions('Regiment'),
  },
  {
    id: 'reg-2',
    name: '2nd Marine Regiment',
    type: 'Regiment',
    commander: 'Col Jennifer Walsh',
    commanderRank: 'Colonel',
    parentId: 'div-2',
    personnelCount: 3300,
    location: 'Camp Lejeune, NC',
    mission: 'Amphibious assault operations',
    staffPositions: generateStaffPositions('Regiment'),
  },
  {
    id: 'reg-6',
    name: '6th Marine Regiment',
    type: 'Regiment',
    commander: 'Col Michael Brown',
    commanderRank: 'Colonel',
    parentId: 'div-2',
    personnelCount: 3400,
    location: 'Camp Lejeune, NC',
    mission: 'Expeditionary operations',
    staffPositions: generateStaffPositions('Regiment'),
  },
  {
    id: 'reg-8',
    name: '8th Marine Regiment',
    type: 'Regiment',
    commander: 'Col Patricia Lee',
    commanderRank: 'Colonel',
    parentId: 'div-2',
    personnelCount: 3000,
    location: 'Camp Lejeune, NC',
    mission: 'Urban warfare and MOUT',
    staffPositions: generateStaffPositions('Regiment'),
  },

  // Battalions (under Regiments)
  {
    id: 'bn-1-1',
    name: '1st Battalion, 1st Marines',
    type: 'Battalion',
    commander: 'LtCol Andrew Kim',
    commanderRank: 'Lieutenant Colonel',
    parentId: 'reg-1',
    personnelCount: 900,
    location: 'Camp Pendleton, CA',
    mission: 'Rifle battalion - light infantry',
    staffPositions: generateStaffPositions('Battalion'),
  },
  {
    id: 'bn-2-1',
    name: '2nd Battalion, 1st Marines',
    type: 'Battalion',
    commander: 'LtCol Christopher Davis',
    commanderRank: 'Lieutenant Colonel',
    parentId: 'reg-1',
    personnelCount: 850,
    location: 'Camp Pendleton, CA',
    mission: 'Rifle battalion - light infantry',
    staffPositions: generateStaffPositions('Battalion'),
  },
  {
    id: 'bn-3-1',
    name: '3rd Battalion, 1st Marines',
    type: 'Battalion',
    commander: 'LtCol Rachel Green',
    commanderRank: 'Lieutenant Colonel',
    parentId: 'reg-1',
    personnelCount: 920,
    location: 'Camp Pendleton, CA',
    mission: 'Rifle battalion - mechanized',
    staffPositions: generateStaffPositions('Battalion'),
  },
  {
    id: 'bn-1-5',
    name: '1st Battalion, 5th Marines',
    type: 'Battalion',
    commander: 'LtCol Steven Park',
    commanderRank: 'Lieutenant Colonel',
    parentId: 'reg-5',
    personnelCount: 880,
    location: 'Camp Pendleton, CA',
    mission: 'Rifle battalion - air assault',
    staffPositions: generateStaffPositions('Battalion'),
  },
  {
    id: 'bn-2-5',
    name: '2nd Battalion, 5th Marines',
    type: 'Battalion',
    commander: 'LtCol Amanda White',
    commanderRank: 'Lieutenant Colonel',
    parentId: 'reg-5',
    personnelCount: 860,
    location: 'Camp Pendleton, CA',
    mission: 'Rifle battalion - light infantry',
    staffPositions: generateStaffPositions('Battalion'),
  },
  // 7th Marine Regiment Battalions
  {
    id: 'bn-1-7',
    name: '1st Battalion, 7th Marines',
    type: 'Battalion',
    commander: 'LtCol James Harrison',
    commanderRank: 'Lieutenant Colonel',
    parentId: 'reg-7',
    personnelCount: 870,
    location: 'Twentynine Palms, CA',
    mission: 'Rifle battalion - desert warfare',
    staffPositions: generateStaffPositions('Battalion'),
  },
  {
    id: 'bn-2-7',
    name: '2nd Battalion, 7th Marines',
    type: 'Battalion',
    commander: 'LtCol Michelle Garcia',
    commanderRank: 'Lieutenant Colonel',
    parentId: 'reg-7',
    personnelCount: 890,
    location: 'Twentynine Palms, CA',
    mission: 'Rifle battalion - mechanized',
    staffPositions: generateStaffPositions('Battalion'),
  },
  {
    id: 'bn-3-7',
    name: '3rd Battalion, 7th Marines',
    type: 'Battalion',
    commander: 'LtCol Daniel Park',
    commanderRank: 'Lieutenant Colonel',
    parentId: 'reg-7',
    personnelCount: 850,
    location: 'Twentynine Palms, CA',
    mission: 'Rifle battalion - light infantry',
    staffPositions: generateStaffPositions('Battalion'),
  },
  // 2nd Marine Regiment Battalions
  {
    id: 'bn-1-2',
    name: '1st Battalion, 2nd Marines',
    type: 'Battalion',
    commander: 'LtCol Robert Wilson',
    commanderRank: 'Lieutenant Colonel',
    parentId: 'reg-2',
    personnelCount: 880,
    location: 'Camp Lejeune, NC',
    mission: 'Rifle battalion - amphibious',
    staffPositions: generateStaffPositions('Battalion'),
  },
  {
    id: 'bn-2-2',
    name: '2nd Battalion, 2nd Marines',
    type: 'Battalion',
    commander: 'LtCol Sarah Thompson',
    commanderRank: 'Lieutenant Colonel',
    parentId: 'reg-2',
    personnelCount: 860,
    location: 'Camp Lejeune, NC',
    mission: 'Rifle battalion - light infantry',
    staffPositions: generateStaffPositions('Battalion'),
  },
  {
    id: 'bn-3-2',
    name: '3rd Battalion, 2nd Marines',
    type: 'Battalion',
    commander: 'LtCol Kevin Martinez',
    commanderRank: 'Lieutenant Colonel',
    parentId: 'reg-2',
    personnelCount: 870,
    location: 'Camp Lejeune, NC',
    mission: 'Rifle battalion - assault',
    staffPositions: generateStaffPositions('Battalion'),
  },
  // 6th Marine Regiment Battalions
  {
    id: 'bn-1-6',
    name: '1st Battalion, 6th Marines',
    type: 'Battalion',
    commander: 'LtCol Jennifer Adams',
    commanderRank: 'Lieutenant Colonel',
    parentId: 'reg-6',
    personnelCount: 890,
    location: 'Camp Lejeune, NC',
    mission: 'Rifle battalion - expeditionary',
    staffPositions: generateStaffPositions('Battalion'),
  },
  {
    id: 'bn-2-6',
    name: '2nd Battalion, 6th Marines',
    type: 'Battalion',
    commander: 'LtCol Michael Chen',
    commanderRank: 'Lieutenant Colonel',
    parentId: 'reg-6',
    personnelCount: 875,
    location: 'Camp Lejeune, NC',
    mission: 'Rifle battalion - air assault',
    staffPositions: generateStaffPositions('Battalion'),
  },
  {
    id: 'bn-3-6',
    name: '3rd Battalion, 6th Marines',
    type: 'Battalion',
    commander: 'LtCol Patricia Lee',
    commanderRank: 'Lieutenant Colonel',
    parentId: 'reg-6',
    personnelCount: 865,
    location: 'Camp Lejeune, NC',
    mission: 'Rifle battalion - light infantry',
    staffPositions: generateStaffPositions('Battalion'),
  },
  // 8th Marine Regiment Battalions
  {
    id: 'bn-1-8',
    name: '1st Battalion, 8th Marines',
    type: 'Battalion',
    commander: 'LtCol David Johnson',
    commanderRank: 'Lieutenant Colonel',
    parentId: 'reg-8',
    personnelCount: 860,
    location: 'Camp Lejeune, NC',
    mission: 'Rifle battalion - urban warfare',
    staffPositions: generateStaffPositions('Battalion'),
  },
  {
    id: 'bn-2-8',
    name: '2nd Battalion, 8th Marines',
    type: 'Battalion',
    commander: 'LtCol Emily Rodriguez',
    commanderRank: 'Lieutenant Colonel',
    parentId: 'reg-8',
    personnelCount: 880,
    location: 'Camp Lejeune, NC',
    mission: 'Rifle battalion - MOUT',
    staffPositions: generateStaffPositions('Battalion'),
  },
  {
    id: 'bn-3-8',
    name: '3rd Battalion, 8th Marines',
    type: 'Battalion',
    commander: 'LtCol Thomas Williams',
    commanderRank: 'Lieutenant Colonel',
    parentId: 'reg-8',
    personnelCount: 855,
    location: 'Camp Lejeune, NC',
    mission: 'Rifle battalion - light infantry',
    staffPositions: generateStaffPositions('Battalion'),
  },
];

// Battalion info for generating sub-units
const BATTALION_INFO: { id: string; shortName: string; location: string }[] = [
  // 1st Marine Regiment
  { id: 'bn-1-1', shortName: '1/1', location: 'Camp Pendleton, CA' },
  { id: 'bn-2-1', shortName: '2/1', location: 'Camp Pendleton, CA' },
  { id: 'bn-3-1', shortName: '3/1', location: 'Camp Pendleton, CA' },
  // 5th Marine Regiment
  { id: 'bn-1-5', shortName: '1/5', location: 'Camp Pendleton, CA' },
  { id: 'bn-2-5', shortName: '2/5', location: 'Camp Pendleton, CA' },
  // 7th Marine Regiment
  { id: 'bn-1-7', shortName: '1/7', location: 'Twentynine Palms, CA' },
  { id: 'bn-2-7', shortName: '2/7', location: 'Twentynine Palms, CA' },
  { id: 'bn-3-7', shortName: '3/7', location: 'Twentynine Palms, CA' },
  // 2nd Marine Regiment
  { id: 'bn-1-2', shortName: '1/2', location: 'Camp Lejeune, NC' },
  { id: 'bn-2-2', shortName: '2/2', location: 'Camp Lejeune, NC' },
  { id: 'bn-3-2', shortName: '3/2', location: 'Camp Lejeune, NC' },
  // 6th Marine Regiment
  { id: 'bn-1-6', shortName: '1/6', location: 'Camp Lejeune, NC' },
  { id: 'bn-2-6', shortName: '2/6', location: 'Camp Lejeune, NC' },
  { id: 'bn-3-6', shortName: '3/6', location: 'Camp Lejeune, NC' },
  // 8th Marine Regiment
  { id: 'bn-1-8', shortName: '1/8', location: 'Camp Lejeune, NC' },
  { id: 'bn-2-8', shortName: '2/8', location: 'Camp Lejeune, NC' },
  { id: 'bn-3-8', shortName: '3/8', location: 'Camp Lejeune, NC' },
];

// Generate all sub-units for all battalions
const generatedSubUnits: UnitHierarchy[] = [];
BATTALION_INFO.forEach(bn => {
  generatedSubUnits.push(...generateBattalionSubUnits(bn.id, bn.shortName, bn.location));
});

// Export the complete unit hierarchy
export const UNIT_HIERARCHY: UnitHierarchy[] = [
  ...BASE_UNIT_HIERARCHY,
  ...generatedSubUnits,
];

// Get unit by ID
export function getUnitById(id: string): UnitHierarchy | undefined {
  return UNIT_HIERARCHY.find(u => u.id === id);
}

// Get child units
export function getChildUnits(parentId: string): UnitHierarchy[] {
  return UNIT_HIERARCHY.filter(u => u.parentId === parentId);
}

// Get unit chain of command (from unit up to MEF)
export function getChainOfCommand(unitId: string): UnitHierarchy[] {
  const chain: UnitHierarchy[] = [];
  let current = getUnitById(unitId);
  while (current) {
    chain.unshift(current);
    current = current.parentId ? getUnitById(current.parentId) : undefined;
  }
  return chain;
}

// ============================================
// RANKS BY BRANCH
// ============================================
const RANKS_BY_BRANCH: Record<Branch, string[]> = {
  'Army': ['Private', 'Private First Class', 'Specialist', 'Corporal', 'Sergeant', 'Staff Sergeant', 'Sergeant First Class', 'Master Sergeant', 'First Sergeant', 'Sergeant Major', 'Second Lieutenant', 'First Lieutenant', 'Captain', 'Major', 'Lieutenant Colonel', 'Colonel'],
  'Navy': ['Seaman Recruit', 'Seaman Apprentice', 'Seaman', 'Petty Officer Third Class', 'Petty Officer Second Class', 'Petty Officer First Class', 'Chief Petty Officer', 'Senior Chief Petty Officer', 'Master Chief Petty Officer', 'Ensign', 'Lieutenant Junior Grade', 'Lieutenant', 'Lieutenant Commander', 'Commander', 'Captain'],
  'Air Force': ['Airman Basic', 'Airman', 'Airman First Class', 'Senior Airman', 'Staff Sergeant', 'Technical Sergeant', 'Master Sergeant', 'Senior Master Sergeant', 'Chief Master Sergeant', 'Second Lieutenant', 'First Lieutenant', 'Captain', 'Major', 'Lieutenant Colonel', 'Colonel'],
  'Marines': ['Private', 'Private First Class', 'Lance Corporal', 'Corporal', 'Sergeant', 'Staff Sergeant', 'Gunnery Sergeant', 'Master Sergeant', 'First Sergeant', 'Master Gunnery Sergeant', 'Sergeant Major', 'Second Lieutenant', 'First Lieutenant', 'Captain', 'Major', 'Lieutenant Colonel', 'Colonel'],
  'Space Force': ['Specialist 1', 'Specialist 2', 'Specialist 3', 'Specialist 4', 'Sergeant', 'Technical Sergeant', 'Master Sergeant', 'Senior Master Sergeant', 'Chief Master Sergeant', 'Second Lieutenant', 'First Lieutenant', 'Captain', 'Major', 'Lieutenant Colonel', 'Colonel'],
  'Coast Guard': ['Seaman Recruit', 'Seaman Apprentice', 'Seaman', 'Petty Officer Third Class', 'Petty Officer Second Class', 'Petty Officer First Class', 'Chief Petty Officer', 'Senior Chief Petty Officer', 'Master Chief Petty Officer', 'Ensign', 'Lieutenant Junior Grade', 'Lieutenant', 'Lieutenant Commander', 'Commander', 'Captain'],
};

const PAY_GRADES = ['E-1', 'E-2', 'E-3', 'E-4', 'E-5', 'E-6', 'E-7', 'E-8', 'E-9', 'O-1', 'O-2', 'O-3', 'O-4', 'O-5', 'O-6', 'W-1', 'W-2', 'W-3', 'W-4', 'W-5'];

// Rank and pay grade mappings for Marines (primary branch)
interface RankInfo {
  rank: string;
  payGrade: string;
}

const RANK_BY_PAY_GRADE: Record<string, RankInfo> = {
  // Enlisted
  'E-1': { rank: 'Pvt', payGrade: 'E-1' },
  'E-2': { rank: 'PFC', payGrade: 'E-2' },
  'E-3': { rank: 'LCpl', payGrade: 'E-3' },
  'E-4': { rank: 'Cpl', payGrade: 'E-4' },
  'E-5': { rank: 'Sgt', payGrade: 'E-5' },
  'E-6': { rank: 'SSgt', payGrade: 'E-6' },
  'E-7': { rank: 'GySgt', payGrade: 'E-7' },
  'E-8-MSG': { rank: 'MSgt', payGrade: 'E-8' },
  'E-8-1SG': { rank: '1stSgt', payGrade: 'E-8' },
  'E-9-MGS': { rank: 'MGySgt', payGrade: 'E-9' },
  'E-9-SGM': { rank: 'SgtMaj', payGrade: 'E-9' },
  // Warrant Officers
  'W-1': { rank: 'WO', payGrade: 'W-1' },
  'W-2': { rank: 'CWO2', payGrade: 'W-2' },
  'W-3': { rank: 'CWO3', payGrade: 'W-3' },
  'W-4': { rank: 'CWO4', payGrade: 'W-4' },
  'W-5': { rank: 'CWO5', payGrade: 'W-5' },
  // Officers
  'O-1': { rank: '2ndLt', payGrade: 'O-1' },
  'O-2': { rank: '1stLt', payGrade: 'O-2' },
  'O-3': { rank: 'Capt', payGrade: 'O-3' },
  'O-4': { rank: 'Maj', payGrade: 'O-4' },
  'O-5': { rank: 'LtCol', payGrade: 'O-5' },
  'O-6': { rank: 'Col', payGrade: 'O-6' },
  'O-7': { rank: 'BGen', payGrade: 'O-7' },
  'O-8': { rank: 'MajGen', payGrade: 'O-8' },
  'O-9': { rank: 'LtGen', payGrade: 'O-9' },
  'O-10': { rank: 'Gen', payGrade: 'O-10' },
};

// Define appropriate rank distributions for each unit echelon
interface EchelonStaffing {
  roles: { grade: string; count: number; role: string }[];
}

const ECHELON_STAFFING: Record<string, EchelonStaffing> = {
  'MEF': {
    roles: [
      { grade: 'O-9', count: 1, role: 'Commanding General' },
      { grade: 'O-8', count: 1, role: 'Deputy Commander' },
      { grade: 'O-7', count: 1, role: 'Assistant Commander' },
      { grade: 'O-6', count: 2, role: 'Staff Officer' },
      { grade: 'O-5', count: 3, role: 'Branch Chief' },
      { grade: 'O-4', count: 3, role: 'Staff Officer' },
      { grade: 'E-9-SGM', count: 1, role: 'Command Sergeant Major' },
      { grade: 'E-8-MSG', count: 2, role: 'Staff NCOIC' },
      { grade: 'E-7', count: 3, role: 'Section Chief' },
    ],
  },
  'Division': {
    roles: [
      { grade: 'O-8', count: 1, role: 'Commanding General' },
      { grade: 'O-7', count: 1, role: 'Assistant Division Commander' },
      { grade: 'O-6', count: 2, role: 'G-Staff Director' },
      { grade: 'O-5', count: 3, role: 'Branch Chief' },
      { grade: 'O-4', count: 3, role: 'Staff Officer' },
      { grade: 'E-9-SGM', count: 1, role: 'Division Sergeant Major' },
      { grade: 'E-8-MSG', count: 2, role: 'Staff NCOIC' },
      { grade: 'E-7', count: 3, role: 'Section Chief' },
    ],
  },
  'Regiment': {
    roles: [
      { grade: 'O-6', count: 1, role: 'Regimental Commander' },
      { grade: 'O-5', count: 1, role: 'Executive Officer' },
      { grade: 'O-4', count: 2, role: 'S-Staff Officer' },
      { grade: 'O-3', count: 2, role: 'Staff Officer' },
      { grade: 'E-9-SGM', count: 1, role: 'Regimental Sergeant Major' },
      { grade: 'E-8-MSG', count: 2, role: 'Staff NCOIC' },
      { grade: 'E-7', count: 3, role: 'Section Chief' },
    ],
  },
  'Battalion': {
    roles: [
      { grade: 'O-5', count: 1, role: 'Battalion Commander' },
      { grade: 'O-4', count: 1, role: 'Executive Officer' },
      { grade: 'O-3', count: 2, role: 'S-Staff Officer' },
      { grade: 'W-3', count: 1, role: 'Battalion Gunner' },
      { grade: 'E-9-SGM', count: 1, role: 'Battalion Sergeant Major' },
      { grade: 'E-8-1SG', count: 1, role: 'Operations Chief' },
      { grade: 'E-7', count: 3, role: 'Staff NCOIC' },
      { grade: 'E-6', count: 4, role: 'Section Chief' },
    ],
  },
  'Company': {
    roles: [
      { grade: 'O-3', count: 1, role: 'Company Commander' },
      { grade: 'O-2', count: 1, role: 'Executive Officer' },
      { grade: 'E-8-1SG', count: 1, role: 'First Sergeant' },
      { grade: 'E-7', count: 1, role: 'Company Gunnery Sergeant' },
      { grade: 'E-6', count: 2, role: 'Platoon Sergeant' },
      { grade: 'E-5', count: 3, role: 'Squad Leader' },
      { grade: 'E-4', count: 4, role: 'Team Leader' },
      { grade: 'E-3', count: 6, role: 'Rifleman' },
      { grade: 'E-2', count: 3, role: 'Rifleman' },
      { grade: 'E-1', count: 2, role: 'Rifleman' },
    ],
  },
  'Platoon': {
    roles: [
      { grade: 'O-2', count: 1, role: 'Platoon Commander' },
      { grade: 'E-6', count: 1, role: 'Platoon Sergeant' },
      { grade: 'E-5', count: 2, role: 'Squad Leader' },
      { grade: 'E-4', count: 3, role: 'Team Leader' },
      { grade: 'E-3', count: 5, role: 'Rifleman' },
      { grade: 'E-2', count: 3, role: 'Rifleman' },
      { grade: 'E-1', count: 2, role: 'Rifleman' },
    ],
  },
  'Squad': {
    roles: [
      { grade: 'E-5', count: 1, role: 'Squad Leader' },
      { grade: 'E-4', count: 2, role: 'Fire Team Leader' },
      { grade: 'E-3', count: 5, role: 'Rifleman' },
      { grade: 'E-2', count: 3, role: 'Rifleman' },
      { grade: 'E-1', count: 2, role: 'Rifleman' },
    ],
  },
  'Team': {
    roles: [
      { grade: 'E-4', count: 1, role: 'Fire Team Leader' },
      { grade: 'E-3', count: 2, role: 'Rifleman' },
      { grade: 'E-2', count: 1, role: 'Automatic Rifleman' },
    ],
  },
};

// Get rank info for a specific grade
function getRankInfo(gradeKey: string): RankInfo {
  return RANK_BY_PAY_GRADE[gradeKey] || RANK_BY_PAY_GRADE['E-3'];
}

const MOS_CODES = [
  '0311 - Rifleman', '0331 - Machine Gunner', '0341 - Mortarman', '0351 - Infantry Assaultman',
  '0352 - Anti-Tank Guided Missileman', '0369 - Infantry Unit Leader', '0811 - Field Artillery Cannoneer',
  '0861 - Fire Support Man', '1371 - Combat Engineer', '1391 - Bulk Fuel Specialist',
  '2311 - Ammunition Technician', '2651 - Electronics Maintenance Technician', '2841 - Ground Radio Repairer',
  '3043 - Supply Administration', '3381 - Food Service Specialist', '3451 - Finance Technician',
  '5811 - Military Police', '5831 - Correctional Specialist', '6042 - Aircraft Maintenance Admin',
  '6531 - Aviation Ordnance Technician', '7041 - Aviation Operations Specialist', '7212 - Low Altitude Air Defense Gunner',
];

const SPECIAL_ACCESS_PROGRAMS = [
  'SAP Alpha', 'SAP Bravo', 'SAP Charlie', 'SAP Delta', 'SAP Echo',
  'BIGOT List', 'Compartmented', 'GAMMA', 'TALENT KEYHOLE', 'UMBRA',
  'ORCON', 'NOFORN', 'SI-G', 'TK', 'HCS',
];

const FOREIGN_COUNTRIES = [
  'Germany', 'Japan', 'South Korea', 'United Kingdom', 'Italy',
  'Canada', 'Australia', 'Mexico', 'France', 'Spain',
];

const ALLERGIES = [
  'Penicillin', 'Sulfa', 'Aspirin', 'Ibuprofen', 'Codeine',
  'Latex', 'Bee stings', 'Peanuts', 'Shellfish', 'Eggs',
];

const MEDICATIONS = [
  { name: 'Ibuprofen', dosage: '800mg', frequency: 'As needed' },
  { name: 'Acetaminophen', dosage: '500mg', frequency: 'Every 6 hours' },
  { name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily' },
  { name: 'Fluoxetine', dosage: '20mg', frequency: 'Once daily' },
  { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
  { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
  { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily' },
];

const MEDICAL_LIMITATIONS = [
  'No running', 'No lifting over 25 lbs', 'No prolonged standing',
  'No rucking', 'Profile for back', 'Profile for knee',
  'No overhead work', 'No airborne operations',
];

const RELIGIONS = [
  'Protestant', 'Catholic', 'Baptist', 'Methodist', 'Lutheran',
  'Jewish', 'Muslim', 'Buddhist', 'Hindu', 'Atheist', 'No Preference',
];

const SCHOOLS = [
  'Basic Combat Training', 'Advanced Individual Training', 'Airborne School',
  'Air Assault School', 'Ranger School', 'Pathfinder School',
  'Sniper School', 'SERE School', 'Jumpmaster Course',
  'Combat Lifesaver Course', 'Basic Leader Course', 'Advanced Leader Course',
  'Senior Leader Course', 'Sergeant Major Academy', 'Officer Candidate School',
  'The Basic School', 'Infantry Officer Course', 'Expeditionary Warfare School',
];

const APPOINTMENT_TYPES = [
  'Annual Physical', 'Dental Cleaning', 'Vision Exam', 'Hearing Test',
  'Mental Health', 'Immunization', 'Lab Work', 'Specialty Referral',
  'Physical Therapy', 'Behavioral Health',
];

const PROVIDERS = [
  'Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Jones',
  'Dr. Garcia', 'Dr. Miller', 'Dr. Davis', 'Dr. Rodriguez', 'Dr. Martinez',
];

// Generate vaccinations
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

// Generate certifications
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
      certifyingAuthority: faker.helpers.arrayElement(['TRADOC', 'TECOM', 'NETC', 'AETC', 'Unit Commander']),
      hoursRequired,
      hoursCompleted: faker.number.int({ min: hoursRequired, max: hoursRequired + 20 }),
    };
  });
}

// Generate medical appointments
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

// Generate medications
function generateMedications(): Medication[] {
  const count = faker.number.int({ min: 0, max: 3 });
  return faker.helpers.arrayElements(MEDICATIONS, count).map(med => ({
    ...med,
    prescribedDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    prescribedBy: faker.helpers.arrayElement(PROVIDERS),
  }));
}

// Generate security investigation
function generateInvestigation(clearanceLevel: ClearanceLevel): SecurityInvestigation {
  const invType = clearanceLevel === 'TS-SCI' || clearanceLevel === 'Top Secret'
    ? faker.helpers.arrayElement(['SSBI', 'SSBI-PR', 'T5', 'T5R'] as InvestigationType[])
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

// Generate a single personnel record
function generatePersonnel(): Personnel {
  const branch = faker.helpers.arrayElement(BRANCHES);
  const enlistmentDate = faker.date.past({ years: 20 });
  const yearsOfService = Math.floor((Date.now() - enlistmentDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const clearanceLevel = faker.helpers.arrayElement(CLEARANCE_LEVELS);

  const medicalReadiness = faker.helpers.weightedArrayElement([
    { value: 'Green' as ReadinessStatus, weight: 70 },
    { value: 'Yellow' as ReadinessStatus, weight: 20 },
    { value: 'Red' as ReadinessStatus, weight: 10 },
  ]);

  const dentalReadiness = faker.helpers.weightedArrayElement([
    { value: 'Green' as ReadinessStatus, weight: 75 },
    { value: 'Yellow' as ReadinessStatus, weight: 18 },
    { value: 'Red' as ReadinessStatus, weight: 7 },
  ]);

  const profileStatus = faker.helpers.weightedArrayElement([
    { value: 'Fit' as ProfileStatus, weight: 80 },
    { value: 'Limited' as ProfileStatus, weight: 15 },
    { value: 'Non-deployable' as ProfileStatus, weight: 5 },
  ]);

  const deploymentEligible = profileStatus === 'Fit' && medicalReadiness === 'Green' && dentalReadiness !== 'Red';

  // Select a random unit (prefer companies and platoons for most personnel)
  const availableUnits = UNIT_HIERARCHY.filter(u => ['Company', 'Platoon', 'Squad', 'Battalion'].includes(u.type));
  const assignedUnit = faker.helpers.arrayElement(availableUnits);

  const basicTrainingDate = faker.date.past({ years: Math.max(1, yearsOfService) });
  const aitDate = new Date(basicTrainingDate);
  aitDate.setMonth(aitDate.getMonth() + 4);

  // PT components
  const ptPushups = faker.number.int({ min: 40, max: 100 });
  const ptSitups = faker.number.int({ min: 50, max: 100 });
  const runMinutes = faker.number.int({ min: 12, max: 20 });
  const runSeconds = faker.number.int({ min: 0, max: 59 });

  const gender = faker.helpers.arrayElement(GENDERS);

  return {
    // Personal Information
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

    // Contact Information
    email: `${faker.person.firstName().toLowerCase()}.${faker.person.lastName().toLowerCase()}@mil.gov`,
    personalEmail: faker.internet.email(),
    phone: `${faker.string.numeric(3)}-${faker.string.numeric(3)}-${faker.string.numeric(4)}`,
    emergencyContact: faker.person.fullName(),
    emergencyPhone: `${faker.string.numeric(3)}-${faker.string.numeric(3)}-${faker.string.numeric(4)}`,
    streetAddress: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode(),

    // Military Service
    branch,
    rank: faker.helpers.arrayElement(RANKS_BY_BRANCH[branch]),
    payGrade: faker.helpers.arrayElement(PAY_GRADES),
    mos: faker.helpers.arrayElement(MOS_CODES),
    activeStatus: faker.helpers.weightedArrayElement([
      { value: 'Active' as ActiveStatus, weight: 60 },
      { value: 'Reserve' as ActiveStatus, weight: 25 },
      { value: 'Guard' as ActiveStatus, weight: 15 },
    ]),
    activeDutyBaseDate: faker.date.past({ years: 15 }).toISOString().split('T')[0],
    enlistmentDate: enlistmentDate.toISOString().split('T')[0],
    estimatedTerminationDate: faker.date.future({ years: 5 }).toISOString().split('T')[0],
    yearsOfService,
    dutyStation: assignedUnit.location,
    unit: assignedUnit.name,
    commandingOfficer: assignedUnit.commander,

    // Security & Clearance - Enhanced
    clearanceLevel,
    clearanceDate: faker.date.past({ years: 5 }).toISOString().split('T')[0],
    clearanceExpiry: faker.date.future({ years: 5 }).toISOString().split('T')[0],
    polygraphDate: clearanceLevel === 'TS-SCI' ? faker.date.past({ years: 3 }).toISOString().split('T')[0] : '',
    polygraphType: clearanceLevel === 'TS-SCI' ? faker.helpers.arrayElement(['CI', 'Full Scope', 'Lifestyle'] as PolygraphType[]) : 'None',
    specialAccess: clearanceLevel === 'TS-SCI' ? faker.helpers.arrayElements(SPECIAL_ACCESS_PROGRAMS, { min: 0, max: 3 }) : [],
    accessStatus: faker.helpers.weightedArrayElement([
      { value: 'Active' as AccessStatus, weight: 90 },
      { value: 'Pending' as AccessStatus, weight: 5 },
      { value: 'Suspended' as AccessStatus, weight: 3 },
      { value: 'Revoked' as AccessStatus, weight: 2 },
    ]),
    lastInvestigation: generateInvestigation(clearanceLevel),
    nda: clearanceLevel !== 'None',
    ndaDate: clearanceLevel !== 'None' ? faker.date.past({ years: 5 }).toISOString().split('T')[0] : '',
    foreignContacts: faker.number.int({ min: 0, max: 5 }),
    foreignTravel: faker.helpers.arrayElements(FOREIGN_COUNTRIES, { min: 0, max: 3 }),
    securityIncidents: faker.helpers.weightedArrayElement([
      { value: 0, weight: 85 },
      { value: 1, weight: 10 },
      { value: 2, weight: 4 },
      { value: 3, weight: 1 },
    ]),
    lastSecurityBriefing: faker.date.past({ years: 1 }).toISOString().split('T')[0],

    // Medical - Enhanced
    medicalReadiness,
    dentalReadiness,
    dentalClass: faker.helpers.arrayElement(DENTAL_CLASSES),
    lastPhysicalDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    nextPhysicalDue: faker.date.future({ years: 1 }).toISOString().split('T')[0],
    deploymentEligible,
    profileStatus,
    pulhes: {
      physical: faker.helpers.weightedArrayElement([{ value: 1 as PulhesCategory, weight: 80 }, { value: 2 as PulhesCategory, weight: 15 }, { value: 3 as PulhesCategory, weight: 4 }, { value: 4 as PulhesCategory, weight: 1 }]),
      upperExtremities: faker.helpers.weightedArrayElement([{ value: 1 as PulhesCategory, weight: 85 }, { value: 2 as PulhesCategory, weight: 12 }, { value: 3 as PulhesCategory, weight: 2 }, { value: 4 as PulhesCategory, weight: 1 }]),
      lowerExtremities: faker.helpers.weightedArrayElement([{ value: 1 as PulhesCategory, weight: 80 }, { value: 2 as PulhesCategory, weight: 14 }, { value: 3 as PulhesCategory, weight: 5 }, { value: 4 as PulhesCategory, weight: 1 }]),
      hearing: faker.helpers.weightedArrayElement([{ value: 1 as PulhesCategory, weight: 75 }, { value: 2 as PulhesCategory, weight: 18 }, { value: 3 as PulhesCategory, weight: 5 }, { value: 4 as PulhesCategory, weight: 2 }]),
      eyes: faker.helpers.weightedArrayElement([{ value: 1 as PulhesCategory, weight: 70 }, { value: 2 as PulhesCategory, weight: 22 }, { value: 3 as PulhesCategory, weight: 6 }, { value: 4 as PulhesCategory, weight: 2 }]),
      psychiatric: faker.helpers.weightedArrayElement([{ value: 1 as PulhesCategory, weight: 90 }, { value: 2 as PulhesCategory, weight: 8 }, { value: 3 as PulhesCategory, weight: 1 }, { value: 4 as PulhesCategory, weight: 1 }]),
    },
    visionCategory: faker.helpers.arrayElement(VISION_CATEGORIES),
    hearingCategory: faker.helpers.arrayElement(HEARING_CATEGORIES),
    hivStatus: 'Negative',
    lastHivTest: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    dnaOnFile: faker.datatype.boolean({ probability: 0.95 }),
    vaccinations: generateVaccinations(),
    allergies: faker.helpers.arrayElements(ALLERGIES, { min: 0, max: 2 }),
    currentMedications: generateMedications(),
    medicalLimitations: profileStatus !== 'Fit' ? faker.helpers.arrayElements(MEDICAL_LIMITATIONS, { min: 1, max: 2 }) : [],
    lastMentalHealthScreen: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    mentalHealthStatus: faker.helpers.weightedArrayElement([
      { value: 'Green' as ReadinessStatus, weight: 85 },
      { value: 'Yellow' as ReadinessStatus, weight: 12 },
      { value: 'Red' as ReadinessStatus, weight: 3 },
    ]),
    substanceAbuseClear: faker.datatype.boolean({ probability: 0.97 }),
    pregnancyStatus: gender === 'Female' ? faker.helpers.weightedArrayElement([
      { value: 'No' as const, weight: 95 },
      { value: 'Yes' as const, weight: 5 },
    ]) : 'N/A',
    upcomingAppointments: generateAppointments(),

    // Training & Qualifications - Enhanced
    basicTrainingComplete: true,
    basicTrainingDate: basicTrainingDate.toISOString().split('T')[0],
    aitComplete: yearsOfService > 0,
    aitDate: aitDate.toISOString().split('T')[0],
    aitMos: faker.helpers.arrayElement(MOS_CODES),
    lastPtTestDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    ptTestScore: Math.round((ptPushups * 1.0 + ptSitups * 1.0 + (20 - runMinutes) * 5)),
    ptPushups,
    ptSitups,
    ptRunTime: `${runMinutes}:${runSeconds.toString().padStart(2, '0')}`,
    weaponsQualification: faker.helpers.arrayElement(WEAPONS_QUALS),
    lastWeaponsQualDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    certifications: generateCertifications(yearsOfService),
    schoolsAttended: faker.helpers.arrayElements(SCHOOLS, { min: 2, max: Math.min(yearsOfService + 2, 8) }),
    totalTrainingHours: faker.number.int({ min: 100, max: 2000 }),
    annualTrainingComplete: faker.datatype.boolean({ probability: 0.9 }),
    annualTrainingDate: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    specialSkills: faker.helpers.arrayElements([
      'Airborne', 'Air Assault', 'Ranger', 'Special Forces',
      'Combat Diver', 'Pathfinder', 'Sniper', 'Sapper',
      'Jumpmaster', 'Combatives Level 3', 'Language: Arabic',
      'Language: Mandarin', 'Language: Russian', 'Language: Spanish',
      'Explosive Ordnance Disposal', 'Medical Advanced', 'Cyber Operations',
    ], { min: 0, max: 4 }),
  };
}

// Cache for generated personnel data
const CACHE_VERSION = 6; // Increment to bust cache - add staff positions
let cachedPersonnel: Personnel[] | null = null;
let cachedVersion = 0;

// Type alias for backwards compatibility
type Unit = UnitHierarchy;

// Generate a personnel record for a specific unit and role
function generatePersonnelForUnit(unit: Unit, gradeKey: string, role: string): Personnel {
  const rankInfo = getRankInfo(gradeKey);
  const branch: Branch = 'Marines';

  // Years of service based on rank
  const gradeYears: Record<string, [number, number]> = {
    'E-1': [0, 1], 'E-2': [1, 2], 'E-3': [1, 3], 'E-4': [2, 5], 'E-5': [4, 8],
    'E-6': [6, 12], 'E-7': [10, 18], 'E-8-MSG': [14, 22], 'E-8-1SG': [14, 22],
    'E-9-MGS': [18, 26], 'E-9-SGM': [18, 28],
    'W-1': [8, 12], 'W-2': [10, 15], 'W-3': [12, 18], 'W-4': [15, 22], 'W-5': [18, 26],
    'O-1': [0, 2], 'O-2': [2, 4], 'O-3': [4, 8], 'O-4': [8, 14], 'O-5': [14, 20],
    'O-6': [20, 26], 'O-7': [24, 30], 'O-8': [26, 32], 'O-9': [28, 34], 'O-10': [30, 38],
  };

  const [minYears, maxYears] = gradeYears[gradeKey] || [2, 10];
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
      'Airborne', 'Air Assault', 'Ranger', 'Special Forces',
      'Combat Diver', 'Pathfinder', 'Sniper', 'Sapper',
      'Jumpmaster', 'Combatives Level 3', 'Language: Arabic',
      'Language: Mandarin', 'Language: Russian', 'Language: Spanish',
      'Explosive Ordnance Disposal', 'Medical Advanced', 'Cyber Operations',
    ], { min: 0, max: 4 }),
  };
}

export function generatePersonnelData(): Personnel[] {
  if (cachedPersonnel && cachedVersion === CACHE_VERSION) {
    return cachedPersonnel;
  }

  faker.seed(12347); // Changed seed to bust cache

  const allPersonnel: Personnel[] = [];

  // Generate personnel for each unit based on echelon staffing
  UNIT_HIERARCHY.forEach(unit => {
    const staffing = ECHELON_STAFFING[unit.type];
    if (!staffing) return;

    staffing.roles.forEach(({ grade, count: roleCount, role }) => {
      for (let i = 0; i < roleCount; i++) {
        allPersonnel.push(generatePersonnelForUnit(unit, grade, role));
      }
    });
  });

  cachedPersonnel = allPersonnel;
  cachedVersion = CACHE_VERSION;
  return cachedPersonnel;
}

export function searchPersonnel(
  data: Personnel[],
  searchQuery: string,
  filters: Record<string, string | boolean | undefined>
): Personnel[] {
  let filtered = [...data];

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((person) => {
      return (
        person.firstName.toLowerCase().includes(query) ||
        person.lastName.toLowerCase().includes(query) ||
        person.email.toLowerCase().includes(query) ||
        person.rank.toLowerCase().includes(query) ||
        person.mos.toLowerCase().includes(query) ||
        person.dutyStation.toLowerCase().includes(query) ||
        person.unit.toLowerCase().includes(query)
      );
    });
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === '') return;

    filtered = filtered.filter((person) => {
      const personValue = person[key as keyof Personnel];

      if (typeof value === 'boolean') {
        return personValue === value;
      }

      if (typeof personValue === 'string') {
        return personValue.toLowerCase().includes(String(value).toLowerCase());
      }

      if (typeof personValue === 'number') {
        return personValue === Number(value);
      }

      return String(personValue) === String(value);
    });
  });

  return filtered;
}

export function getStatistics(data: Personnel[]) {
  const total = data.length;
  const deploymentReady = data.filter(p => p.deploymentEligible).length;
  const medicalGreen = data.filter(p => p.medicalReadiness === 'Green').length;
  const avgYearsOfService = data.reduce((sum, p) => sum + p.yearsOfService, 0) / total;

  const branchDistribution = BRANCHES.map(branch => ({
    name: branch,
    value: data.filter(p => p.branch === branch).length,
  }));

  const clearanceDistribution = CLEARANCE_LEVELS.map(level => ({
    name: level,
    value: data.filter(p => p.clearanceLevel === level).length,
  }));

  const readinessDistribution = [
    { name: 'Green', value: data.filter(p => p.medicalReadiness === 'Green').length, color: '#22c55e' },
    { name: 'Yellow', value: data.filter(p => p.medicalReadiness === 'Yellow').length, color: '#eab308' },
    { name: 'Red', value: data.filter(p => p.medicalReadiness === 'Red').length, color: '#ef4444' },
  ];

  return {
    total,
    deploymentReady,
    deploymentReadyPercent: Math.round((deploymentReady / total) * 100),
    medicalGreen,
    medicalGreenPercent: Math.round((medicalGreen / total) * 100),
    avgYearsOfService: avgYearsOfService.toFixed(1),
    branchDistribution,
    clearanceDistribution,
    readinessDistribution,
  };
}
