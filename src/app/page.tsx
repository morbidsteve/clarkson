'use client';

import { useState } from 'react';
import { usePersonnel } from '@/hooks/usePersonnel';
import { useDashboardStore } from '@/lib/stores/dashboard-store';
import { useNavigationStore } from '@/lib/stores/navigation-store';

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

  // Fetch data for all sections that need it
  const { data, isLoading } = usePersonnel({
    page: 1,
    limit: 10000, // Get all data for section views (no limit)
    search: globalSearch,
    filters: filters as Record<string, string | boolean>,
  });

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection stats={data?.stats ?? null} isLoading={isLoading} />;
      case 'organization':
        return <OrganizationSection data={data?.data || []} stats={data?.stats ?? null} isLoading={isLoading} />;
      case 'personnel':
        return <PersonnelSection />;
      case 'security':
        return <SecuritySection data={data?.data || []} stats={data?.stats ?? null} isLoading={isLoading} />;
      case 'readiness':
        return <ReadinessSection data={data?.data || []} stats={data?.stats ?? null} isLoading={isLoading} />;
      case 'training':
        return <TrainingSection data={data?.data || []} stats={data?.stats ?? null} isLoading={isLoading} />;
      case 'medical':
        return <MedicalSection data={data?.data || []} stats={data?.stats ?? null} isLoading={isLoading} />;
      case 'custom-dashboards':
        return <CustomDashboardSection data={data?.data || []} stats={data?.stats ?? null} isLoading={isLoading} />;
      default:
        return <DashboardSection stats={data?.stats ?? null} isLoading={isLoading} />;
    }
  };

  return (
    <main className="flex-1 overflow-auto">
      {renderSection()}
    </main>
  );
}
