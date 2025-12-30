import { NextRequest, NextResponse } from 'next/server';
import { generatePersonnelData, searchPersonnel, getStatistics } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Pagination params
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '25', 10);
  const search = searchParams.get('search') || '';

  // Sorting params
  const sortField = searchParams.get('sort') || 'lastName';
  const sortOrder = searchParams.get('order') || 'asc';

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
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Get statistics
  const stats = getStatistics(allData);

  return NextResponse.json({
    data: paginatedData,
    total,
    page,
    pageSize: limit,
    totalPages,
    stats,
  });
}
