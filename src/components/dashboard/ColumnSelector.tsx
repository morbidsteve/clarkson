'use client';

import { useState } from 'react';
import { Columns3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardStore, COLUMN_METADATA } from '@/lib/stores/dashboard-store';

const CATEGORIES = ['Personal', 'Contact', 'Service', 'Security', 'Training', 'Health'] as const;

export function ColumnSelector() {
  const { visibleColumns, toggleColumn, setVisibleColumns } = useDashboardStore();
  const [isOpen, setIsOpen] = useState(false);

  const columnsByCategory = Object.entries(COLUMN_METADATA).reduce<Record<string, { id: string; label: string }[]>>(
    (acc, [id, meta]) => {
      if (!acc[meta.category]) acc[meta.category] = [];
      acc[meta.category].push({ id, label: meta.label });
      return acc;
    },
    {}
  );

  const handleSelectAll = (category: string) => {
    const categoryColumns = columnsByCategory[category]?.map((c) => c.id) || [];
    const allSelected = categoryColumns.every((col) => visibleColumns.includes(col));

    if (allSelected) {
      setVisibleColumns(visibleColumns.filter((col) => !categoryColumns.includes(col)));
    } else {
      const newColumns = [...new Set([...visibleColumns, ...categoryColumns])];
      setVisibleColumns(newColumns);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Columns3 className="h-4 w-4" />
          Columns
          <Badge variant="secondary" className="ml-1">
            {visibleColumns.length}
          </Badge>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Customize Columns</SheetTitle>
          <SheetDescription>
            Select which columns to display in the table. Changes are saved automatically.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Tabs defaultValue="Personal" className="w-full">
            <TabsList className="grid grid-cols-6 w-full">
              {CATEGORIES.map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {CATEGORIES.map((category) => (
              <TabsContent key={category} value={category} className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">
                    {columnsByCategory[category]?.filter((c) => visibleColumns.includes(c.id)).length || 0} of{' '}
                    {columnsByCategory[category]?.length || 0} selected
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectAll(category)}
                  >
                    {columnsByCategory[category]?.every((c) => visibleColumns.includes(c.id))
                      ? 'Deselect All'
                      : 'Select All'}
                  </Button>
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {columnsByCategory[category]?.map((column) => (
                      <div
                        key={column.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-muted/30 transition-all cursor-pointer"
                        onClick={() => toggleColumn(column.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={visibleColumns.includes(column.id)}
                            onCheckedChange={() => toggleColumn(column.id)}
                          />
                          <span className="text-sm">{column.label}</span>
                        </div>
                        {visibleColumns.includes(column.id) ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="mt-6 flex gap-2">
          <Button variant="outline" onClick={() => setVisibleColumns([])} className="flex-1">
            Clear All
          </Button>
          <Button onClick={() => setIsOpen(false)} className="flex-1">
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
