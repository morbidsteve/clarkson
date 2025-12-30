'use client';

import { useQuery } from '@tanstack/react-query';
import type { PersonnelResponse } from '@/types/personnel';

interface UsePersonnelOptions {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, string | boolean>;
}

async function fetchPersonnel(options: UsePersonnelOptions): Promise<PersonnelResponse> {
  const params = new URLSearchParams();

  if (options.page) params.set('page', String(options.page));
  if (options.limit) params.set('limit', String(options.limit));
  if (options.search) params.set('search', options.search);
  if (options.sort) params.set('sort', options.sort);
  if (options.order) params.set('order', options.order);

  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value));
      }
    });
  }

  const response = await fetch(`/api/personnel?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch personnel data');
  }

  return response.json();
}

export function usePersonnel(options: UsePersonnelOptions = {}) {
  return useQuery({
    queryKey: ['personnel', options],
    queryFn: () => fetchPersonnel(options),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
