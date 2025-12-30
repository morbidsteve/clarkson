'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, Shield, Activity, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardCharts } from '@/components/charts/DashboardCharts';
import type { PersonnelStats } from '@/types/personnel';

interface DashboardSectionProps {
  stats: PersonnelStats | null;
  isLoading: boolean;
}

export function DashboardSection({ stats, isLoading }: DashboardSectionProps) {
  const metrics = [
    {
      title: 'Total Force Strength',
      value: stats?.total ?? 0,
      change: '+2.5%',
      trend: 'up',
      icon: Users,
      color: 'text-primary',
    },
    {
      title: 'Combat Ready',
      value: `${stats?.deploymentReadyPercent ?? 0}%`,
      change: '+1.2%',
      trend: 'up',
      icon: Shield,
      color: 'text-green-500',
    },
    {
      title: 'Medical Ready',
      value: `${stats?.medicalGreenPercent ?? 0}%`,
      change: '-0.8%',
      trend: 'down',
      icon: Activity,
      color: 'text-amber-500',
    },
    {
      title: 'Avg. Years of Service',
      value: stats?.avgYearsOfService ?? '0',
      change: '+0.3',
      trend: 'up',
      icon: MapPin,
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold tracking-tight">Command Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of force strength, readiness, and key metrics across all units.
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-muted ${metric.color}`}>
                    <metric.icon className="h-5 w-5" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {metric.change}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {isLoading ? '...' : metric.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts stats={stats} isLoading={isLoading} />

      {/* Activity Feed & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { action: 'Transfer approved', person: 'SGT Johnson', time: '2 hours ago', color: 'bg-green-500' },
                { action: 'Medical update', person: 'CPL Williams', time: '4 hours ago', color: 'bg-amber-500' },
                { action: 'Clearance renewed', person: 'MAJ Roberts', time: '6 hours ago', color: 'bg-blue-500' },
                { action: 'PT test completed', person: 'SPC Davis', time: '8 hours ago', color: 'bg-purple-500' },
                { action: 'New assignment', person: 'PFC Miller', time: '1 day ago', color: 'bg-primary' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${item.color}`} />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{item.action}</span>
                      {' - '}
                      <span className="text-muted-foreground">{item.person}</span>
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { event: 'Battalion PT Test', date: 'Jan 5, 2025', type: 'Training' },
                { event: 'Deployment Briefing', date: 'Jan 8, 2025', type: 'Operations' },
                { event: 'Medical Readiness Review', date: 'Jan 12, 2025', type: 'Health' },
                { event: 'Clearance Renewals Due', date: 'Jan 15, 2025', type: 'Security' },
                { event: 'Annual Training Start', date: 'Jan 20, 2025', type: 'Training' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.event}</p>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
