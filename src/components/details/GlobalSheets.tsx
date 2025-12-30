'use client';

import { PersonnelDetailSheet } from './PersonnelDetailSheet';
import { UnitDetailSheet } from './UnitDetailSheet';
import { usePersonnel } from '@/hooks/usePersonnel';

export function GlobalSheets() {
  // Fetch all personnel data for the unit detail sheet
  const { data } = usePersonnel({
    page: 1,
    limit: 10000,
  });

  return (
    <>
      <PersonnelDetailSheet />
      <UnitDetailSheet personnel={data?.data || []} />
    </>
  );
}
