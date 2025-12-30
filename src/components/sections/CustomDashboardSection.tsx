'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  X,
  Check,
  LayoutGrid,
  BarChart3,
  PieChart,
  Table,
  Activity,
  TrendingUp,
  Copy,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useCustomDashboardStore,
  WIDGET_TEMPLATES,
  type DashboardWidget,
  type WidgetType,
} from '@/lib/stores/custom-dashboard-store';
import { QueryBuilder, QuerySummary } from '@/components/dashboard/QueryBuilder';
import { executeQuery, createEmptyGroup, type QueryGroup } from '@/lib/query-builder';
import { cn } from '@/lib/utils';
import type { Personnel, PersonnelStats } from '@/types/personnel';

// Import chart components
import {
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

interface CustomDashboardSectionProps {
  data: Personnel[];
  stats: PersonnelStats | null;
  isLoading?: boolean;
}

const CHART_COLORS = [
  '#3b82f6', // blue
  '#22c55e', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
];

const WIDGET_ICONS: Record<WidgetType, typeof LayoutGrid> = {
  'stat-card': TrendingUp,
  'pie-chart': PieChart,
  'bar-chart': BarChart3,
  'line-chart': Activity,
  'data-table': Table,
  'recent-activity': Activity,
  'filter': Filter,
};

// Widget renderer component
function DashboardWidgetRenderer({
  widget,
  data,
  stats,
  isEditing,
  onRemove,
  onQueryChange,
  totalCount,
}: {
  widget: DashboardWidget;
  data: Personnel[];
  stats: PersonnelStats | null;
  isEditing: boolean;
  onRemove: () => void;
  onQueryChange?: (query: QueryGroup) => void;
  totalCount?: number;
}) {
  const sizeClasses: Record<string, string> = {
    small: 'col-span-1',
    medium: 'col-span-1 md:col-span-2',
    large: 'col-span-1 md:col-span-2 lg:col-span-3',
    full: 'col-span-full',
  };

  const renderContent = () => {
    switch (widget.type) {
      case 'stat-card': {
        const value = stats?.[widget.config.statField as keyof PersonnelStats];
        const displayValue = typeof value === 'number' ? value.toLocaleString() : '-';
        return (
          <div className="text-center py-4">
            <p className="text-4xl font-bold">{displayValue}</p>
          </div>
        );
      }

      case 'pie-chart': {
        const groupBy = widget.config.groupBy || 'branch';
        const groupedData = data.reduce((acc, person) => {
          const key = String(person[groupBy as keyof Personnel] || 'Unknown');
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const chartData = Object.entries(groupedData).map(([name, value]) => ({
          name,
          value,
        }));

        return (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        );
      }

      case 'bar-chart': {
        const groupBy = widget.config.groupBy || 'branch';
        const groupedData = data.reduce((acc, person) => {
          const key = String(person[groupBy as keyof Personnel] || 'Unknown');
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const chartData = Object.entries(groupedData)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8);

        return (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      }

      case 'data-table': {
        const columns = widget.config.columns || ['lastName', 'firstName', 'rank'];
        const limit = widget.config.limit || 5;
        const displayData = data.slice(0, limit);

        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {columns.map((col) => (
                    <th key={col} className="text-left py-2 px-2 font-medium">
                      {col.replace(/([A-Z])/g, ' $1').trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayData.map((person, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {columns.map((col) => (
                      <td key={col} className="py-2 px-2">
                        {String(person[col as keyof Personnel] || '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case 'recent-activity': {
        const activities = [
          { text: 'Personnel record updated', time: '2 min ago' },
          { text: 'New clearance approved', time: '15 min ago' },
          { text: 'Training completed', time: '1 hour ago' },
          { text: 'Medical exam scheduled', time: '3 hours ago' },
        ];
        return (
          <div className="space-y-3">
            {activities.map((activity, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span>{activity.text}</span>
                <span className="text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        );
      }

      case 'filter': {
        const query = widget.config.query || createEmptyGroup();
        const conditionCount = query.conditions.length +
          (query.groups?.reduce((sum, g) => sum + g.conditions.length, 0) || 0);

        return (
          <div className="space-y-4">
            {conditionCount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{data.length}</span> of{' '}
                  <span className="font-medium text-foreground">{totalCount || data.length}</span> personnel
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onQueryChange?.(createEmptyGroup())}
                >
                  Clear Filters
                </Button>
              </div>
            )}
            <QueryBuilder
              query={query}
              onChange={(newQuery) => onQueryChange?.(newQuery)}
            />
            {conditionCount > 0 && (
              <div className="pt-2 border-t">
                <QuerySummary query={query} />
              </div>
            )}
          </div>
        );
      }

      default:
        return <p className="text-muted-foreground">Unknown widget type</p>;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(sizeClasses[widget.size])}
    >
      <Card className={cn('h-full', isEditing && 'ring-2 ring-primary/20')}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            {isEditing && (
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            )}
            <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
          </div>
          {isEditing && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </motion.div>
  );
}

export function CustomDashboardSection({
  data,
  stats,
  isLoading,
}: CustomDashboardSectionProps) {
  const {
    dashboards,
    activeDashboardId,
    isEditing,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    duplicateDashboard,
    setActiveDashboard,
    setIsEditing,
    addWidget,
    removeWidget,
    updateWidget,
  } = useCustomDashboardStore();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [addWidgetDialogOpen, setAddWidgetDialogOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');
  const [newDashboardDescription, setNewDashboardDescription] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const activeDashboard = dashboards.find((d) => d.id === activeDashboardId);

  // Find filter widget and get its query
  const filterWidget = activeDashboard?.widgets.find(w => w.type === 'filter');
  const activeQuery = filterWidget?.config.query;

  // Apply query filters from filter widget to data
  const filteredData = useMemo(() => {
    if (!activeQuery) return data;
    return executeQuery(data, activeQuery);
  }, [data, activeQuery]);

  // Calculate filtered stats
  const filteredStats = useMemo((): PersonnelStats | null => {
    if (!filteredData.length) return null;

    const deploymentReady = filteredData.filter(p => p.deploymentEligible).length;
    const medicalGreen = filteredData.filter(p => p.medicalReadiness === 'Green').length;
    const totalYears = filteredData.reduce((sum, p) => sum + (p.yearsOfService || 0), 0);

    return {
      total: filteredData.length,
      deploymentReady,
      deploymentReadyPercent: Math.round((deploymentReady / filteredData.length) * 100),
      medicalGreen,
      medicalGreenPercent: Math.round((medicalGreen / filteredData.length) * 100),
      avgYearsOfService: (totalYears / filteredData.length).toFixed(1),
      branchDistribution: [],
      clearanceDistribution: [],
      readinessDistribution: [],
    };
  }, [filteredData]);

  // Handler for updating filter widget query
  const handleFilterQueryChange = (widgetId: string, query: QueryGroup) => {
    if (activeDashboardId) {
      updateWidget(activeDashboardId, widgetId, { config: { query } });
    }
  };

  const handleCreateDashboard = () => {
    if (newDashboardName.trim()) {
      createDashboard(newDashboardName.trim(), newDashboardDescription.trim() || undefined);
      setNewDashboardName('');
      setNewDashboardDescription('');
      setCreateDialogOpen(false);
    }
  };

  const handleAddWidget = (templateKey: string) => {
    if (!activeDashboardId) return;
    const template = WIDGET_TEMPLATES[templateKey];
    if (template) {
      addWidget(activeDashboardId, template);
    }
    setAddWidgetDialogOpen(false);
  };

  const handleSaveName = () => {
    if (activeDashboardId && tempName.trim()) {
      updateDashboard(activeDashboardId, { name: tempName.trim() });
    }
    setEditingName(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  // Show dashboard list if no active dashboard
  if (!activeDashboard) {
    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Custom Dashboards</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your personalized dashboards
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Dashboard
          </Button>
        </motion.div>

        {dashboards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <LayoutGrid className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No dashboards yet</h2>
            <p className="text-muted-foreground mb-4 max-w-md">
              Create your first custom dashboard to track the metrics that matter most to you.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Dashboard
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {dashboards.map((dashboard) => (
              <Card
                key={dashboard.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setActiveDashboard(dashboard.id)}
              >
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{dashboard.name}</CardTitle>
                    {dashboard.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {dashboard.description}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateDashboard(dashboard.id);
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDashboard(dashboard.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">
                      {dashboard.widgets.length} widget{dashboard.widgets.length !== 1 ? 's' : ''}
                    </Badge>
                    <span>
                      Updated {new Date(dashboard.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Create Dashboard Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Dashboard</DialogTitle>
              <DialogDescription>
                Give your dashboard a name and optional description.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Input
                  placeholder="Dashboard name"
                  value={newDashboardName}
                  onChange={(e) => setNewDashboardName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateDashboard()}
                />
              </div>
              <div>
                <Input
                  placeholder="Description (optional)"
                  value={newDashboardDescription}
                  onChange={(e) => setNewDashboardDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateDashboard} disabled={!newDashboardName.trim()}>
                Create Dashboard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Show active dashboard
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveDashboard(null)}
          >
            &larr; All Dashboards
          </Button>
          {editingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="h-8 w-48"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') setEditingName(false);
                }}
              />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSaveName}>
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setEditingName(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{activeDashboard.name}</h1>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setTempName(activeDashboard.name);
                  setEditingName(true);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddWidgetDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Widget
              </Button>
              <Button size="sm" onClick={() => setIsEditing(false)} className="gap-2">
                <Check className="h-4 w-4" />
                Done Editing
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit Dashboard
            </Button>
          )}
        </div>
      </motion.div>

      {/* Widgets Grid */}
      {activeDashboard.widgets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border rounded-lg"
        >
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">No widgets yet</h3>
          <p className="text-muted-foreground mb-4">
            Add widgets to start building your dashboard.
          </p>
          <Button onClick={() => setAddWidgetDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Widget
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {activeDashboard.widgets.map((widget) => (
              <DashboardWidgetRenderer
                key={widget.id}
                widget={widget}
                data={filteredData}
                stats={filteredStats}
                isEditing={isEditing}
                onRemove={() => removeWidget(activeDashboard.id, widget.id)}
                onQueryChange={widget.type === 'filter' ? (query) => handleFilterQueryChange(widget.id, query) : undefined}
                totalCount={data.length}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add Widget Dialog */}
      <Dialog open={addWidgetDialogOpen} onOpenChange={setAddWidgetDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Widget</DialogTitle>
            <DialogDescription>
              Choose a widget to add to your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-4 max-h-96 overflow-auto">
            {Object.entries(WIDGET_TEMPLATES).map(([key, template]) => {
              const Icon = WIDGET_ICONS[template.type];
              return (
                <Card
                  key={key}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => handleAddWidget(key)}
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{template.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {template.type.replace('-', ' ')} - {template.size}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
