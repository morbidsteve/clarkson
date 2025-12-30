'use client';

import { useState, useMemo } from 'react';
import { usePersonnel, type FieldPreset } from '@/hooks/usePersonnel';
import { useDashboardStore } from '@/lib/stores/dashboard-store';
import { useNavigationStore } from '@/lib/stores/navigation-store';
import { usePersonnelStore } from '@/lib/stores/personnel-store';

// Map sections to optimal field presets for faster loading
const SECTION_FIELD_PRESETS: Record<string, FieldPreset> = {
  dashboard: 'core',
  organization: 'core',
  personnel: 'full', // Full data for personnel table
  security: 'security',
  readiness: 'readiness',
  training: 'training',
  medical: 'medical',
  'custom-dashboards': 'full', // Full data for custom queries
};

// Section Components
import { DashboardSection } from '@/components/sections/DashboardSection';
import { OrganizationSection } from '@/components/sections/OrganizationSection';
import { SecuritySection } from '@/components/sections/SecuritySection';
import { ReadinessSection } from '@/components/sections/ReadinessSection';
import { TrainingSection } from '@/components/sections/TrainingSection';
import { MedicalSection } from '@/components/sections/MedicalSection';
import { CustomDashboardSection } from '@/components/sections/CustomDashboardSection';

// Personnel Section Components
import { StatsCards } from '@/components/dashboard/StatsCards';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { DataTable } from '@/components/dashboard/DataTable';
import { motion } from 'framer-motion';

function PersonnelSection() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const { globalSearch, filters } = useDashboardStore();

  const { data, isLoading } = usePersonnel({
    page,
    limit: pageSize,
    search: globalSearch,
    filters: filters as Record<string, string | boolean>,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold tracking-tight">Personnel Database</h1>
        <p className="text-muted-foreground">
          Browse, search, and manage all military personnel records.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <StatsCards stats={data?.stats ?? null} isLoading={isLoading} />

      {/* Filter Bar */}
      <FilterBar
        totalResults={data?.stats?.total || 0}
        filteredResults={data?.total || 0}
      />

      {/* Data Table */}
      <DataTable
        data={data?.data || []}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        totalPages={data?.totalPages || 1}
        total={data?.total || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}

export default function Home() {
  const { activeSection } = useNavigationStore();
  const { globalSearch, filters } = useDashboardStore();
  const { addedPersonnel } = usePersonnelStore();

  // Get the appropriate field preset for the current section
  const fieldPreset = SECTION_FIELD_PRESETS[activeSection] || 'core';

  // Fetch data for all sections that need it
  const { data, isLoading } = usePersonnel({
    page: 1,
    limit: 10000, // Get all data for section views (no limit)
    search: globalSearch,
    filters: filters as Record<string, string | boolean>,
    fields: fieldPreset, // Use field preset to reduce payload size
  });

  // Merge locally added personnel with API data
  const mergedData = useMemo(() => {
    const apiData = data?.data || [];
    return [...addedPersonnel, ...apiData];
  }, [data?.data, addedPersonnel]);

  const mergedStats = useMemo(() => {
    if (!data?.stats) return null;
    // Update total count to include added personnel
    return {
      ...data.stats,
      total: data.stats.total + addedPersonnel.length,
    };
  }, [data?.stats, addedPersonnel.length]);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection stats={mergedStats} isLoading={isLoading} />;
      case 'organization':
        return <OrganizationSection data={mergedData} stats={mergedStats} isLoading={isLoading} />;
      case 'personnel':
        return <PersonnelSection />;
      case 'security':
        return <SecuritySection data={mergedData} stats={mergedStats} isLoading={isLoading} />;
      case 'readiness':
        return <ReadinessSection data={mergedData} stats={mergedStats} isLoading={isLoading} />;
      case 'training':
        return <TrainingSection data={mergedData} stats={mergedStats} isLoading={isLoading} />;
      case 'medical':
        return <MedicalSection data={mergedData} stats={mergedStats} isLoading={isLoading} />;
      case 'custom-dashboards':
        return <CustomDashboardSection data={mergedData} stats={mergedStats} isLoading={isLoading} />;
      default:
        return <DashboardSection stats={mergedStats} isLoading={isLoading} />;
    }
  };

  return (
    <main className="flex-1 overflow-auto">
      {renderSection()}
    </main>
  );
}
