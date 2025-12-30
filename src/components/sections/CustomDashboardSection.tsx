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

// Saved filter card - compact view showing just results
function SavedFilterCard({
  widget,
  filteredData,
  totalCount,
  onEdit,
  onRemove,
  isEditing,
}: {
  widget: DashboardWidget;
  filteredData: Personnel[];
  totalCount: number;
  onEdit: () => void;
  onRemove: () => void;
  isEditing: boolean;
}) {
  const query = widget.config.query as QueryGroup;
  const conditionCount = query?.conditions?.length +
    (query?.groups?.reduce((sum, g) => sum + g.conditions.length, 0) || 0) || 0;
  const filteredCount = filteredData.length;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          {isEditing && (
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          )}
          <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {filteredCount} result{filteredCount !== 1 ? 's' : ''}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onEdit}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          {isEditing && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter summary */}
        {conditionCount > 0 && (
          <div className="mb-3 pb-3 border-b">
            <QuerySummary query={query} />
          </div>
        )}

        {/* Results Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-[350px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 sticky top-0">
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium">Name</th>
                  <th className="text-left py-2 px-3 font-medium">Rank</th>
                  <th className="text-left py-2 px-3 font-medium">Branch</th>
                  <th className="text-left py-2 px-3 font-medium">Unit</th>
                  <th className="text-left py-2 px-3 font-medium">Clearance</th>
                  <th className="text-left py-2 px-3 font-medium">Medical</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No results match your filter criteria
                    </td>
                  </tr>
                ) : (
                  filteredData.slice(0, 50).map((person, i) => (
                    <tr key={person.id || i} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2 px-3">{person.lastName}, {person.firstName}</td>
                      <td className="py-2 px-3">{person.rank}</td>
                      <td className="py-2 px-3">{person.branch}</td>
                      <td className="py-2 px-3 max-w-[200px] truncate">{person.unit}</td>
                      <td className="py-2 px-3">{person.clearanceLevel}</td>
                      <td className="py-2 px-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs",
                          person.medicalReadiness === 'Green' && "bg-green-500/20 text-green-600",
                          person.medicalReadiness === 'Yellow' && "bg-yellow-500/20 text-yellow-600",
                          person.medicalReadiness === 'Red' && "bg-red-500/20 text-red-600",
                        )}>
                          {person.medicalReadiness}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredCount > 50 && (
            <div className="px-3 py-2 bg-muted/30 text-sm text-muted-foreground text-center">
              Showing first 50 of {filteredCount} results
            </div>
          )}
        </div>

        <div className="mt-3 text-sm text-muted-foreground text-center">
          {conditionCount > 0 ? (
            <span>
              Showing <span className="font-medium text-foreground">{filteredCount}</span> of{' '}
              <span className="font-medium text-foreground">{totalCount}</span> personnel
            </span>
          ) : (
            <span>No filters applied - showing all {totalCount} personnel</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Widget renderer component
function DashboardWidgetRenderer({
  widget,
  data,
  stats,
  isEditing,
  onRemove,
}: {
  widget: DashboardWidget;
  data: Personnel[];
  stats: PersonnelStats | null;
  isEditing: boolean;
  onRemove: () => void;
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

  // Filter widget configuration state
  const [configuringFilter, setConfiguringFilter] = useState(false);
  const [pendingFilterQuery, setPendingFilterQuery] = useState<QueryGroup>(createEmptyGroup());

  // Edit filter dialog state
  const [editingFilterWidget, setEditingFilterWidget] = useState<DashboardWidget | null>(null);
  const [editFilterQuery, setEditFilterQuery] = useState<QueryGroup>(createEmptyGroup());
  const [editFilterTitle, setEditFilterTitle] = useState('');

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
    if (!template) return;

    // For filter widget, show configuration first
    if (template.type === 'filter') {
      setPendingFilterQuery(createEmptyGroup());
      setConfiguringFilter(true);
      return;
    }

    addWidget(activeDashboardId, template);
    setAddWidgetDialogOpen(false);
  };

  const handleAddFilterWidget = () => {
    if (!activeDashboardId) return;
    addWidget(activeDashboardId, {
      type: 'filter',
      title: 'Data Filter',
      size: 'full',
      config: { query: pendingFilterQuery },
    });
    setConfiguringFilter(false);
    setPendingFilterQuery(createEmptyGroup());
    setAddWidgetDialogOpen(false);
  };

  const handleCancelFilterConfig = () => {
    setConfiguringFilter(false);
    setPendingFilterQuery(createEmptyGroup());
  };

  // Edit filter handlers
  const handleOpenEditFilter = (widget: DashboardWidget) => {
    setEditingFilterWidget(widget);
    setEditFilterQuery(widget.config.query || createEmptyGroup());
    setEditFilterTitle(widget.title);
  };

  const handleSaveEditFilter = () => {
    if (activeDashboardId && editingFilterWidget) {
      updateWidget(activeDashboardId, editingFilterWidget.id, {
        title: editFilterTitle,
        config: { query: editFilterQuery },
      });
    }
    setEditingFilterWidget(null);
    setEditFilterQuery(createEmptyGroup());
    setEditFilterTitle('');
  };

  const handleCancelEditFilter = () => {
    setEditingFilterWidget(null);
    setEditFilterQuery(createEmptyGroup());
    setEditFilterTitle('');
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
            {activeDashboard.widgets.map((widget) => {
              // Render filter widgets with SavedFilterCard
              if (widget.type === 'filter') {
                const widgetQuery = widget.config.query || createEmptyGroup();
                const widgetFilteredData = executeQuery(data, widgetQuery);
                return (
                  <motion.div
                    key={widget.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="col-span-full"
                  >
                    <SavedFilterCard
                      widget={widget}
                      filteredData={widgetFilteredData}
                      totalCount={data.length}
                      onEdit={() => handleOpenEditFilter(widget)}
                      onRemove={() => removeWidget(activeDashboard.id, widget.id)}
                      isEditing={isEditing}
                    />
                  </motion.div>
                );
              }

              // Render other widgets normally
              return (
                <DashboardWidgetRenderer
                  key={widget.id}
                  widget={widget}
                  data={filteredData}
                  stats={filteredStats}
                  isEditing={isEditing}
                  onRemove={() => removeWidget(activeDashboard.id, widget.id)}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add Widget Dialog */}
      <Dialog open={addWidgetDialogOpen} onOpenChange={(open) => {
        setAddWidgetDialogOpen(open);
        if (!open) {
          setConfiguringFilter(false);
          setPendingFilterQuery(createEmptyGroup());
        }
      }}>
        <DialogContent className={cn(
          configuringFilter ? "max-w-4xl w-[90vw] h-[85vh] max-h-[850px]" : "max-w-2xl"
        )}>
          {configuringFilter ? (
            <div className="flex flex-col h-full">
              <DialogHeader>
                <DialogTitle>Configure Data Filter</DialogTitle>
                <DialogDescription>
                  Build your filter query, then add it to your dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 flex-1 overflow-auto min-h-0">
                <QueryBuilder
                  query={pendingFilterQuery}
                  onChange={setPendingFilterQuery}
                />
                {pendingFilterQuery.conditions.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Filter Summary:</p>
                    <QuerySummary query={pendingFilterQuery} />
                  </div>
                )}
              </div>
              <DialogFooter className="mt-4 pt-4 border-t flex-shrink-0">
                <Button variant="ghost" onClick={handleCancelFilterConfig}>
                  Back
                </Button>
                <Button onClick={handleAddFilterWidget} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add to Dashboard
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <>
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
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Filter Dialog */}
      <Dialog open={!!editingFilterWidget} onOpenChange={(open) => {
        if (!open) handleCancelEditFilter();
      }}>
        <DialogContent className="max-w-4xl w-[90vw] h-[85vh] max-h-[850px]">
          <div className="flex flex-col h-full">
            <DialogHeader>
              <DialogTitle>Edit Filter</DialogTitle>
              <DialogDescription>
                Modify your filter settings and query.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 flex-1 overflow-auto min-h-0 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Filter Title</label>
                <Input
                  value={editFilterTitle}
                  onChange={(e) => setEditFilterTitle(e.target.value)}
                  placeholder="Filter title"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Filter Conditions</label>
                <QueryBuilder
                  query={editFilterQuery}
                  onChange={setEditFilterQuery}
                />
              </div>
              {editFilterQuery.conditions.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Filter Summary:</p>
                  <QuerySummary query={editFilterQuery} />
                </div>
              )}
            </div>
            <DialogFooter className="mt-4 pt-4 border-t flex-shrink-0">
              <Button variant="ghost" onClick={handleCancelEditFilter}>
                Cancel
              </Button>
              <Button onClick={handleSaveEditFilter} className="gap-2">
                <Check className="h-4 w-4" />
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
