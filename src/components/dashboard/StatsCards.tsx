'use client';

import { motion } from 'framer-motion';
import { Users, Shield, Activity, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { PersonnelStats } from '@/types/personnel';
import { useNavigationStore } from '@/lib/stores/navigation-store';
import { useDashboardStore } from '@/lib/stores/dashboard-store';

interface StatsCardsProps {
  stats: PersonnelStats | null;
  isLoading?: boolean;
}

function getStatValue(stats: PersonnelStats | null, key: string): string | number {
  if (!stats) return 0;
  switch (key) {
    case 'total':
      return stats.total;
    case 'deploymentReadyPercent':
      return stats.deploymentReadyPercent;
    case 'medicalGreenPercent':
      return stats.medicalGreenPercent;
    case 'avgYearsOfService':
      return stats.avgYearsOfService;
    default:
      return 0;
  }
}

const cards = [
  {
    key: 'total',
    label: 'Total Personnel',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    format: (value: number | string) => Number(value).toLocaleString(),
    filterKey: null as string | null,
    filterValue: null as string | boolean | null,
  },
  {
    key: 'deploymentReadyPercent',
    label: 'Deployment Ready',
    icon: Shield,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    format: (value: number | string) => `${value}%`,
    filterKey: 'deploymentEligible',
    filterValue: true,
  },
  {
    key: 'medicalGreenPercent',
    label: 'Medical Green',
    icon: Activity,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    format: (value: number | string) => `${value}%`,
    filterKey: 'medicalReadiness',
    filterValue: 'Green',
  },
  {
    key: 'avgYearsOfService',
    label: 'Avg. Years of Service',
    icon: Clock,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    format: (value: number | string) => `${value} yrs`,
    filterKey: null,
    filterValue: null,
  },
];

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const { setActiveSection } = useNavigationStore();
  const { setFilter, clearFilters } = useDashboardStore();

  const handleCardClick = (card: typeof cards[0]) => {
    // Clear existing filters first
    clearFilters();

    // Set filter if the card has one
    if (card.filterKey && card.filterValue !== null) {
      setFilter(card.filterKey, card.filterValue);
    }

    // Navigate to personnel section
    setActiveSection('personnel');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className="glass border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
            onClick={() => handleCardClick(card)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      card.format(getStatValue(stats, card.key))
                    )}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
