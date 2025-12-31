'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  BookOpen,
  Heart,
  Building2,
  Bookmark,
  Trash2,
  LayoutGrid,
  Plus,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useDashboardStore, QUICK_VIEWS } from '@/lib/stores/dashboard-store';
import { useNavigationStore, type NavSection } from '@/lib/stores/navigation-store';
import { useCustomDashboardStore } from '@/lib/stores/custom-dashboard-store';

const navItems: { icon: typeof LayoutDashboard; label: string; section: NavSection }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', section: 'dashboard' },
  { icon: Building2, label: 'Organization', section: 'organization' },
  { icon: Users, label: 'Personnel', section: 'personnel' },
  { icon: Calendar, label: 'Duty', section: 'duty' },
  { icon: Shield, label: 'Security', section: 'security' },
  { icon: Activity, label: 'Readiness', section: 'readiness' },
  { icon: BookOpen, label: 'Training', section: 'training' },
  { icon: Heart, label: 'Medical', section: 'medical' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { savedViews, activeViewId, loadView, deleteView, setVisibleColumns, resetToDefault } = useDashboardStore();
  const { activeSection, setActiveSection } = useNavigationStore();
  const { dashboards, setActiveDashboard } = useCustomDashboardStore();

  const handleQuickView = (key: string, columns: string[]) => {
    setVisibleColumns(columns);
    setActiveSection('personnel'); // Navigate to Personnel section to see the view
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 280 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative flex flex-col border-r border-border bg-sidebar h-screen"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 h-16">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-lg">Clarkson</span>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={activeSection === item.section ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3',
                collapsed && 'justify-center px-2'
              )}
              onClick={() => setActiveSection(item.section)}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6"
            >
              <Separator className="mb-4" />

              {/* Quick Views */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                  Quick Views
                </h3>
                <div className="space-y-1">
                  {Object.entries(QUICK_VIEWS).map(([key, view]) => (
                    <Button
                      key={key}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => handleQuickView(key, view.columns)}
                    >
                      {view.name}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm text-muted-foreground"
                    onClick={resetToDefault}
                  >
                    Reset to Default
                  </Button>
                </div>
              </div>

              {/* Saved Views */}
              {savedViews.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                    Saved Views
                  </h3>
                  <div className="space-y-1">
                    {savedViews.map((view) => (
                      <div
                        key={view.id}
                        className={cn(
                          'flex items-center justify-between group rounded-md px-2 py-1.5 hover:bg-muted/50',
                          activeViewId === view.id && 'bg-muted'
                        )}
                      >
                        <button
                          className="flex items-center gap-2 flex-1 text-left text-sm"
                          onClick={() => {
                            loadView(view.id);
                            setActiveSection('personnel');
                          }}
                        >
                          <Bookmark className="h-4 w-4 text-primary" />
                          <span className="truncate">{view.name}</span>
                        </button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={() => deleteView(view.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              {/* Custom Dashboards */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                  My Dashboards
                </h3>
                <div className="space-y-1">
                  {dashboards.map((dashboard) => (
                    <Button
                      key={dashboard.id}
                      variant={activeSection === 'custom-dashboards' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => {
                        setActiveDashboard(dashboard.id);
                        setActiveSection('custom-dashboards');
                      }}
                    >
                      <LayoutGrid className="h-4 w-4 mr-2" />
                      <span className="truncate">{dashboard.name}</span>
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm text-muted-foreground"
                    onClick={() => {
                      setActiveDashboard(null);
                      setActiveSection('custom-dashboards');
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Dashboard
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          className={cn('w-full justify-start gap-3', collapsed && 'justify-center px-2')}
        >
          <Settings className="h-5 w-5 shrink-0" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </motion.aside>
  );
}
