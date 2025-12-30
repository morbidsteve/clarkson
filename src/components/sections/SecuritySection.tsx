'use client';

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Clock, Lock, Key, FileWarning, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Personnel, PersonnelStats } from '@/types/personnel';

interface SecuritySectionProps {
  data: Personnel[];
  stats: PersonnelStats | null;
  isLoading: boolean;
}

export function SecuritySection({ data, stats, isLoading }: SecuritySectionProps) {
  // Calculate security metrics
  const clearanceCounts = {
    'TS-SCI': data.filter(p => p.clearanceLevel === 'TS-SCI').length,
    'Top Secret': data.filter(p => p.clearanceLevel === 'Top Secret').length,
    'Secret': data.filter(p => p.clearanceLevel === 'Secret').length,
    'Confidential': data.filter(p => p.clearanceLevel === 'Confidential').length,
    'None': data.filter(p => p.clearanceLevel === 'None').length,
  };

  const expiringIn30Days = data.filter(p => {
    const expiry = new Date(p.clearanceExpiry);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return expiry > now && expiry <= thirtyDaysFromNow;
  });

  const specialAccessPersonnel = data.filter(p => p.specialAccess.length > 0);

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold tracking-tight">Security & Clearances</h1>
        <p className="text-muted-foreground">
          Monitor clearance status, access levels, and security compliance across personnel.
        </p>
      </motion.div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-500/10">
                  <Shield className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">TS-SCI Cleared</p>
                  <p className="text-2xl font-bold">{isLoading ? '...' : clearanceCounts['TS-SCI']}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Lock className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Top Secret</p>
                  <p className="text-2xl font-bold">{isLoading ? '...' : clearanceCounts['Top Secret']}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-yellow-500/10">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="text-2xl font-bold">{isLoading ? '...' : expiringIn30Days.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <Key className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Special Access</p>
                  <p className="text-2xl font-bold">{isLoading ? '...' : specialAccessPersonnel.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clearance Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Clearance Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(clearanceCounts).map(([level, count]) => {
                const percentage = data.length > 0 ? (count / data.length) * 100 : 0;
                const colors: Record<string, string> = {
                  'TS-SCI': 'bg-red-500',
                  'Top Secret': 'bg-amber-500',
                  'Secret': 'bg-purple-500',
                  'Confidential': 'bg-blue-500',
                  'None': 'bg-gray-500',
                };
                return (
                  <div key={level} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{level}</span>
                      <span className="text-muted-foreground">{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={`h-full ${colors[level]} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Expiring Clearances */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                Clearances Expiring in 30 Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expiringIn30Days.length === 0 ? (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="h-5 w-5" />
                  <span>No clearances expiring soon</span>
                </div>
              ) : (
                <div className="space-y-3 max-h-[280px] overflow-auto">
                  {expiringIn30Days.slice(0, 8).map((person) => (
                    <div key={person.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                      <div>
                        <p className="font-medium">{person.rank} {person.lastName}, {person.firstName}</p>
                        <p className="text-sm text-muted-foreground">{person.unit}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                          {person.clearanceLevel}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Expires: {new Date(person.clearanceExpiry).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Special Access Programs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileWarning className="h-5 w-5 text-purple-500" />
                Special Access Program Personnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specialAccessPersonnel.slice(0, 9).map((person) => (
                  <div key={person.id} className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{person.rank} {person.lastName}</p>
                        <p className="text-sm text-muted-foreground">{person.firstName}</p>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        {person.clearanceLevel}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {person.specialAccess.map((sap, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {sap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
