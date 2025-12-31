'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  BarChart3,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { useDutyStore } from '@/lib/stores/duty-store';
import { CLR1_UNITS, DUTY_SCHEDULES, type DutyScheduleConfig } from '@/lib/clr1-data';
import type { DutyAssignment, DutyPosition, DutyUnit } from '@/types/duty';

// Unit colors for visual identification
const UNIT_COLORS: Record<DutyUnit, string> = {
  'CLR-1': '#3b82f6',  // Blue
  'CLB-1': '#22c55e',  // Green
  'CLB-5': '#f59e0b',  // Amber
  'DSB': '#8b5cf6',    // Purple
};

const UNIT_BG_COLORS: Record<DutyUnit, string> = {
  'CLR-1': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'CLB-1': 'bg-green-500/20 text-green-400 border-green-500/30',
  'CLB-5': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'DSB': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const POSITION_LABELS: Record<DutyPosition, string> = {
  'R-CDO': 'R-CDO',
  'R-ACDO': 'R-ACDO',
  'DUTY-DRIVER': 'Driver',
  'OOD': 'OOD',
  'AOOD': 'AOOD',
};

// Helper to get days in month
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// Helper to get day of week for first day of month (0 = Sunday)
function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

// Month names
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Calendar component for a single duty schedule
function DutyCalendar({
  scheduleConfig,
  assignments,
  year,
  month,
}: {
  scheduleConfig: DutyScheduleConfig;
  assignments: DutyAssignment[];
  year: number;
  month: number;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfWeek(year, month);

  // Group assignments by date
  const assignmentsByDate = useMemo(() => {
    const grouped: Record<string, DutyAssignment[]> = {};
    assignments.forEach(a => {
      if (!grouped[a.date]) {
        grouped[a.date] = [];
      }
      grouped[a.date].push(a);
    });
    return grouped;
  }, [assignments]);

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [daysInMonth, firstDayOfWeek]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {scheduleConfig.name}
        </CardTitle>
        <CardDescription>{scheduleConfig.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="min-h-[80px]" />;
            }

            const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dayAssignments = assignmentsByDate[dateStr] || [];
            const isToday =
              new Date().getFullYear() === year &&
              new Date().getMonth() + 1 === month &&
              new Date().getDate() === day;

            return (
              <div
                key={day}
                className={`min-h-[80px] p-1 rounded-md border ${
                  isToday
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:bg-muted/50'
                }`}
              >
                <div className="text-xs font-medium mb-1">{day}</div>
                <div className="space-y-0.5">
                  {dayAssignments.map(assignment => (
                    <div
                      key={assignment.id}
                      className={`text-[10px] px-1 py-0.5 rounded border ${
                        UNIT_BG_COLORS[assignment.unitId]
                      }`}
                    >
                      <div className="font-medium truncate">
                        {POSITION_LABELS[assignment.position]}
                      </div>
                      <div className="truncate flex items-center gap-1">
                        <span>{assignment.personnelName}</span>
                        <span className="opacity-70">({assignment.unitId})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Per capita analysis component
function DutyAnalysis() {
  const { selectedYear, selectedMonth, analysisScenario, setAnalysisScenario, getFairnessAnalysis } =
    useDutyStore();

  // Get analysis for current month
  const analysis = useMemo(
    () => getFairnessAnalysis(selectedYear, 1, analysisScenario),
    [selectedYear, selectedMonth, analysisScenario, getFairnessAnalysis]
  );

  // Prepare chart data
  const chartData = useMemo(() => {
    return analysis.statistics.map(stat => ({
      unit: CLR1_UNITS.find(u => u.id === stat.unitId)?.shortName || stat.unitId,
      dutyPerCapita: parseFloat(stat.dutyPerCapita.toFixed(2)),
      totalDutyDays: stat.totalDutyDays,
      cdoEligible: stat.cdoEligible,
      driverEligible: stat.driverEligible,
      fill: UNIT_COLORS[stat.unitId],
    }));
  }, [analysis]);

  // Personnel breakdown data
  const breakdownData = useMemo(() => {
    return CLR1_UNITS.map(unit => ({
      unit: unit.shortName,
      'Staff NCO': unit.staffNCO,
      'CGO': unit.companyGradeOfficer,
      'NCO': unit.nco,
      'Junior Marine': unit.juniorMarine,
      fill: UNIT_COLORS[unit.id],
    }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {analysis.statistics.map(stat => {
          const unit = CLR1_UNITS.find(u => u.id === stat.unitId);
          const isFair = Math.abs(stat.dutyPerCapita - analysis.averageDutyPerCapita) < 0.5;

          return (
            <Card key={stat.unitId}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {unit?.shortName}
                  </span>
                  <Badge
                    variant={isFair ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {isFair ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                    {isFair ? 'Fair' : 'Imbalanced'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duty Per Capita:</span>
                    <span className="font-medium">{stat.dutyPerCapita.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Duty Days:</span>
                    <span>{stat.totalDutyDays}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CDO Eligible:</span>
                    <span>{stat.cdoEligible}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Driver Eligible:</span>
                    <span>{stat.driverEligible}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Per Capita Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Duty Per Capita by Unit
            </CardTitle>
            <CardDescription>
              Average duty days per eligible member (current month)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="unit" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c1c1c',
                      border: '1px solid #333',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [(value as number).toFixed(2), 'Duty Per Capita']}
                  />
                  <Bar dataKey="dutyPerCapita" name="Duty Per Capita">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Average line indicator */}
            <div className="mt-4 flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-muted-foreground" />
                <span className="text-muted-foreground">
                  Average: {analysis.averageDutyPerCapita.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  Variance: {analysis.variance.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personnel Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Personnel Breakdown by Unit
            </CardTitle>
            <CardDescription>
              Eligible personnel for CDO/ACDO and Driver positions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="unit" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c1c1c',
                      border: '1px solid #333',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Staff NCO" stackId="a" fill="#3b82f6" name="Staff NCO (E6-E7)" />
                  <Bar dataKey="CGO" stackId="a" fill="#22c55e" name="CGO (O1-O3)" />
                  <Bar dataKey="Junior Marine" stackId="b" fill="#f59e0b" name="Junior Marine (E1-E3)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Findings */}
      <Card>
        <CardHeader>
          <CardTitle>Key Findings</CardTitle>
          <CardDescription>Analysis of duty distribution fairness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-500" />
                CLR-1/CLB-1 Combined Duty (Regimental Duty)
              </h4>
              <p className="text-sm text-muted-foreground">
                With CLR-1 (24 Staff NCO + 11 CGO = 35 eligible) and CLB-1 (48 Staff NCO + 19 CGO = 67 eligible),
                the combined pool of 102 eligible personnel shares regimental duty evenly each month.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-500" />
                CLB-5 Battalion Duty
              </h4>
              <p className="text-sm text-muted-foreground">
                CLB-5 maintains its own battalion duty (OOD/AOOD) with 67 eligible personnel (48 Staff NCO + 19 CGO),
                resulting in a per capita duty load comparable to the combined regimental duty.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-purple-500" />
                DSB Battalion Duty
              </h4>
              <p className="text-sm text-muted-foreground">
                DSB has the largest eligible pool (60 Staff NCO + 27 CGO = 87 eligible), making their per capita
                duty load the lightest among all units with their own battalion duty.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                Impact of Regimental Pull
              </h4>
              <p className="text-sm text-muted-foreground">
                If CLB-5 and DSB personnel were required to fill regimental duty positions in addition to their
                own battalion duties, their per capita duty load would increase significantly, creating an unfair
                distribution where CLR-1/CLB-1 Marines stand less duty than their counterparts in CLB-5 and DSB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main DutySection component
export function DutySection() {
  const {
    viewMode,
    setViewMode,
    selectedYear,
    selectedMonth,
    selectedScheduleId,
    setSelectedSchedule,
    navigateMonth,
    getMonthlyAssignments,
    getAllScheduleAssignments,
  } = useDutyStore();

  // Get all assignments for current month
  const allAssignments = useMemo(
    () => getAllScheduleAssignments(selectedYear, selectedMonth),
    [selectedYear, selectedMonth, getAllScheduleAssignments]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Duty Scheduling</h1>
          <p className="text-muted-foreground">
            CLR-1 Combat Logistics Regiment duty schedule and analysis
          </p>
        </div>

        {/* View Toggle */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'calendar' | 'analysis')}>
          <TabsList>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analysis
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Month Navigation (for calendar view) */}
      {viewMode === 'calendar' && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold min-w-[200px] text-center">
              {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </h2>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Select value={selectedScheduleId} onValueChange={setSelectedSchedule}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select duty schedule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Duty Schedules</SelectItem>
              {DUTY_SCHEDULES.map(schedule => (
                <SelectItem key={schedule.id} value={schedule.id}>
                  {schedule.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Content */}
      {viewMode === 'calendar' ? (
        <div className="space-y-6">
          {selectedScheduleId === 'all' ? (
            // Show all calendars
            DUTY_SCHEDULES.map(schedule => (
              <DutyCalendar
                key={schedule.id}
                scheduleConfig={schedule}
                assignments={allAssignments[schedule.id] || []}
                year={selectedYear}
                month={selectedMonth}
              />
            ))
          ) : (
            // Show selected calendar
            <DutyCalendar
              scheduleConfig={DUTY_SCHEDULES.find(s => s.id === selectedScheduleId)!}
              assignments={allAssignments[selectedScheduleId] || []}
              year={selectedYear}
              month={selectedMonth}
            />
          )}
        </div>
      ) : (
        <DutyAnalysis />
      )}
    </motion.div>
  );
}
