'use client';

import { useState } from 'react';
import { Search, Bell, User, Plus, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDashboardStore } from '@/lib/stores/dashboard-store';

export function Header() {
  const { globalSearch, setGlobalSearch, saveView, clearFilters } = useDashboardStore();
  const [viewName, setViewName] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const handleSaveView = () => {
    if (viewName.trim()) {
      saveView(viewName.trim());
      setViewName('');
      setSaveDialogOpen(false);
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search personnel by name, rank, unit..."
            className="pl-9 bg-muted/50 border-transparent focus:border-primary"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>
        {globalSearch && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Save View Dialog */}
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Save View
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Current View</DialogTitle>
              <DialogDescription>
                Save your current column selection and filters as a custom view.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="View name (e.g., 'Deployable Personnel')"
                value={viewName}
                onChange={(e) => setViewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveView()}
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveView} disabled={!viewName.trim()}>
                Save View
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="default" size="sm" className="gap-2 gradient-primary border-0">
          <Plus className="h-4 w-4" />
          Add Personnel
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* User */}
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
