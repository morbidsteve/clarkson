import { NextRequest, NextResponse } from 'next/server';
import { generatePersonnelData, searchPersonnel, getStatistics } from '@/lib/mock-data';
import type { Personnel } from '@/types/personnel';

// Field presets for different use cases - reduces payload size significantly
const FIELD_PRESETS: Record<string, (keyof Personnel)[]> = {
  // Minimal fields for dashboard stats only
  minimal: ['id', 'firstName', 'lastName', 'branch', 'rank', 'unit'],
  // Core fields for most views
  core: [
    'id', 'firstName', 'lastName', 'middleName', 'rank', 'payGrade', 'branch',
    'activeStatus', 'unit', 'dutyStation', 'mos', 'yearsOfService',
    'clearanceLevel', 'medicalReadiness', 'deploymentEligible', 'profileStatus'
  ],
  // Security-focused fields
  security: [
    'id', 'firstName', 'lastName', 'rank', 'unit', 'branch',
    'clearanceLevel', 'clearanceDate', 'clearanceExpiry', 'polygraphType',
    'polygraphDate', 'specialAccess', 'accessStatus', 'lastInvestigation',
    'nda', 'ndaDate', 'foreignContacts', 'foreignTravel', 'securityIncidents',
    'lastSecurityBriefing'
  ],
  // Medical-focused fields
  medical: [
    'id', 'firstName', 'lastName', 'rank', 'unit', 'branch',
    'medicalReadiness', 'dentalReadiness', 'dentalClass', 'lastPhysicalDate',
    'nextPhysicalDue', 'deploymentEligible', 'profileStatus', 'pulhes',
    'visionCategory', 'hearingCategory', 'vaccinations', 'allergies',
    'currentMedications', 'medicalLimitations', 'mentalHealthStatus',
    'upcomingAppointments', 'bloodType'
  ],
  // Training-focused fields
  training: [
    'id', 'firstName', 'lastName', 'rank', 'unit', 'branch',
    'basicTrainingComplete', 'basicTrainingDate', 'aitComplete', 'aitDate',
    'aitMos', 'lastPtTestDate', 'ptTestScore', 'ptPushups', 'ptSitups',
    'ptRunTime', 'weaponsQualification', 'lastWeaponsQualDate', 'certifications',
    'schoolsAttended', 'totalTrainingHours', 'annualTrainingComplete',
    'annualTrainingDate', 'specialSkills'
  ],
  // Readiness overview
  readiness: [
    'id', 'firstName', 'lastName', 'rank', 'unit', 'branch',
    'medicalReadiness', 'dentalReadiness', 'deploymentEligible', 'profileStatus',
    'ptTestScore', 'weaponsQualification', 'annualTrainingComplete',
    'clearanceLevel', 'accessStatus'
  ],
};

// Pick specific fields from a personnel record
function pickFields(obj: Personnel, fields: (keyof Personnel)[]): Partial<Personnel> {
  const result: Partial<Personnel> = {};
  for (const field of fields) {
    if (field in obj) {
      result[field] = obj[field];
    }
  }
  return result;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Pagination params
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '25', 10);
  const search = searchParams.get('search') || '';

  // Sorting params
  const sortField = searchParams.get('sort') || 'lastName';
  const sortOrder = searchParams.get('order') || 'asc';

  // Field selection - use preset or 'full' for all fields
  const fieldsParam = searchParams.get('fields') || 'full';
  const selectedFields = FIELD_PRESETS[fieldsParam] || null;

  // Filter params
  const filters: Record<string, string | boolean | undefined> = {};
  const filterKeys = ['branch', 'activeStatus', 'clearanceLevel', 'medicalReadiness', 'deploymentEligible'];

  filterKeys.forEach((key) => {
    const value = searchParams.get(key);
    if (value !== null) {
      if (value === 'true' || value === 'false') {
        filters[key] = value === 'true';
      } else {
        filters[key] = value;
      }
    }
  });

  // Generate or get cached data (all personnel based on unit staffing)
  const allData = generatePersonnelData();

  // Apply search and filters
  let filteredData = searchPersonnel(allData, search, filters);

  // Apply sorting
  filteredData.sort((a, b) => {
    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  // Calculate pagination
  const total = filteredData.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Get paginated data
  let paginatedData = filteredData.slice(startIndex, endIndex);

  // Apply field filtering if not 'full'
  const outputData = selectedFields
    ? paginatedData.map(p => pickFields(p, selectedFields))
    : paginatedData;

  // Get statistics
  const stats = getStatistics(allData);

  // Create response with caching headers
  const response = NextResponse.json({
    data: outputData,
    total,
    page,
    pageSize: limit,
    totalPages,
    stats,
  });

  // Add cache headers - cache for 5 minutes on CDN, 1 minute in browser
  response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');

  return response;
}
