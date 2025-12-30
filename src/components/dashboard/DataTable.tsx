'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSelectionStore } from '@/lib/stores/selection-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Personnel } from '@/types/personnel';
import { useDashboardStore, COLUMN_METADATA } from '@/lib/stores/dashboard-store';
import { cn } from '@/lib/utils';

interface DataTableProps {
  data: Personnel[];
  isLoading?: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

// Readiness badge component
function ReadinessBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Green: 'bg-green-500/20 text-green-400 border-green-500/30',
    Yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Red: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <Badge variant="outline" className={cn('font-medium', colors[status] || '')}>
      <span
        className={cn(
          'h-2 w-2 rounded-full mr-1.5',
          status === 'Green' && 'bg-green-500',
          status === 'Yellow' && 'bg-yellow-500',
          status === 'Red' && 'bg-red-500'
        )}
      />
      {status}
    </Badge>
  );
}

// Boolean badge component
function BooleanBadge({ value }: { value: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium',
        value
          ? 'bg-green-500/20 text-green-400 border-green-500/30'
          : 'bg-red-500/20 text-red-400 border-red-500/30'
      )}
    >
      {value ? 'Yes' : 'No'}
    </Badge>
  );
}

// Clearance badge component
function ClearanceBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    None: 'bg-muted text-muted-foreground',
    Confidential: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Secret: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Top Secret': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'TS-SCI': 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <Badge variant="outline" className={cn('font-medium', colors[level] || '')}>
      {level}
    </Badge>
  );
}

export function DataTable({
  data,
  isLoading,
  page,
  pageSize,
  totalPages,
  total,
  onPageChange,
  onPageSizeChange,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const { visibleColumns, columnOrder } = useDashboardStore();
  const { openPersonnelDetail } = useSelectionStore();

  // Build columns dynamically based on visibility
  const columns = useMemo<ColumnDef<Personnel>[]>(() => {
    const allColumns: ColumnDef<Personnel>[] = [
      // Selection column
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
      },
    ];

    // Add visible columns in order
    const orderedColumns = columnOrder.filter((col) => visibleColumns.includes(col));

    orderedColumns.forEach((columnId) => {
      const meta = COLUMN_METADATA[columnId];
      if (!meta) return;

      const column: ColumnDef<Personnel> = {
        accessorKey: columnId,
        header: ({ column: col }) => (
          <Button
            variant="ghost"
            onClick={() => col.toggleSorting(col.getIsSorted() === 'asc')}
            className="h-8 px-2 -ml-2 hover:bg-transparent"
          >
            {meta.label}
            {col.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : col.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
            )}
          </Button>
        ),
        cell: ({ getValue }) => {
          const value = getValue();

          // Handle special column types
          if (columnId === 'medicalReadiness' || columnId === 'dentalReadiness') {
            return <ReadinessBadge status={value as string} />;
          }

          if (columnId === 'deploymentEligible' || columnId === 'basicTrainingComplete' || columnId === 'aitComplete') {
            return <BooleanBadge value={value as boolean} />;
          }

          if (columnId === 'clearanceLevel') {
            return <ClearanceBadge level={value as string} />;
          }

          if (Array.isArray(value)) {
            if (value.length === 0) return <span className="text-muted-foreground">-</span>;
            return (
              <div className="flex flex-wrap gap-1">
                {value.slice(0, 2).map((item, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
                {value.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{value.length - 2}
                  </Badge>
                )}
              </div>
            );
          }

          if (typeof value === 'boolean') {
            return <BooleanBadge value={value} />;
          }

          if (value === '' || value === null || value === undefined) {
            return <span className="text-muted-foreground">-</span>;
          }

          return <span className="truncate max-w-[200px] block">{String(value)}</span>;
        },
      };

      allColumns.push(column);
    });

    // Actions column
    allColumns.push({
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openPersonnelDetail(row.original)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
    });

    return allColumns;
  }, [visibleColumns, columnOrder, openPersonnelDetail]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.slice(0, 8).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                {columns.slice(0, 8).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-muted/50">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      'border-b border-border/50 transition-colors hover:bg-muted/50',
                      row.getIsSelected() && 'bg-muted'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {Object.keys(rowSelection).length > 0 && (
            <span>{Object.keys(rowSelection).length} row(s) selected</span>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(1)}
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(totalPages)}
              disabled={page === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
