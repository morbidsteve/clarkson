'use client';

import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDashboardStore } from '@/lib/stores/dashboard-store';
import { ColumnSelector } from './ColumnSelector';

const BRANCH_OPTIONS = ['Army', 'Navy', 'Air Force', 'Marines', 'Space Force', 'Coast Guard'];
const STATUS_OPTIONS = ['Active', 'Reserve', 'Guard'];
const CLEARANCE_OPTIONS = ['None', 'Confidential', 'Secret', 'Top Secret', 'TS-SCI'];
const READINESS_OPTIONS = ['Green', 'Yellow', 'Red'];

interface FilterBarProps {
  totalResults: number;
  filteredResults: number;
}

export function FilterBar({ totalResults, filteredResults }: FilterBarProps) {
  const { filters, setFilter, clearFilters } = useDashboardStore();

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ''
  ).length;

  const handleFilterChange = (key: string, value: string) => {
    setFilter(key, value === 'all' ? undefined : value);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 py-4">
      {/* Filter Controls */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              )}
            </div>

            {/* Branch Filter */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Branch</label>
              <Select
                value={(filters.branch as string) || 'all'}
                onValueChange={(value) => handleFilterChange('branch', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All branches</SelectItem>
                  {BRANCH_OPTIONS.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Status Filter */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Active Status</label>
              <Select
                value={(filters.activeStatus as string) || 'all'}
                onValueChange={(value) => handleFilterChange('activeStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clearance Filter */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Clearance Level</label>
              <Select
                value={(filters.clearanceLevel as string) || 'all'}
                onValueChange={(value) => handleFilterChange('clearanceLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All clearances" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All clearances</SelectItem>
                  {CLEARANCE_OPTIONS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Medical Readiness Filter */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Medical Readiness</label>
              <Select
                value={(filters.medicalReadiness as string) || 'all'}
                onValueChange={(value) => handleFilterChange('medicalReadiness', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All readiness levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All readiness levels</SelectItem>
                  {READINESS_OPTIONS.map((level) => (
                    <SelectItem key={level} value={level}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            level === 'Green'
                              ? 'bg-green-500'
                              : level === 'Yellow'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                        />
                        {level}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Deployment Eligible Filter */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Deployment Status</label>
              <Select
                value={
                  filters.deploymentEligible === true
                    ? 'true'
                    : filters.deploymentEligible === false
                      ? 'false'
                      : 'all'
                }
                onValueChange={(value) =>
                  handleFilterChange('deploymentEligible', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All personnel</SelectItem>
                  <SelectItem value="true">Deployment eligible</SelectItem>
                  <SelectItem value="false">Not eligible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Column Selector */}
      <ColumnSelector />

      {/* Active Filter Chips */}
      {Object.entries(filters).map(([key, value]) => {
        if (!value) return null;
        return (
          <Badge
            key={key}
            variant="secondary"
            className="gap-1 pl-2 pr-1 py-1"
          >
            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>:{' '}
            {String(value)}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:bg-transparent"
              onClick={() => setFilter(key, undefined)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        );
      })}

      {/* Results count */}
      <div className="ml-auto text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{filteredResults.toLocaleString()}</span> of{' '}
        <span className="font-medium text-foreground">{totalResults.toLocaleString()}</span> personnel
      </div>
    </div>
  );
}
