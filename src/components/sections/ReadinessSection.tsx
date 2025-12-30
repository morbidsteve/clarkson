'use client';

import { motion } from 'framer-motion';
import { Activity, Heart, Stethoscope, CheckCircle, XCircle, AlertCircle, Syringe, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Personnel, PersonnelStats } from '@/types/personnel';

interface ReadinessSectionProps {
  data: Personnel[];
  stats: PersonnelStats | null;
  isLoading: boolean;
}

export function ReadinessSection({ data, stats, isLoading }: ReadinessSectionProps) {
  // Calculate readiness metrics
  const medicalGreen = data.filter(p => p.medicalReadiness === 'Green').length;
  const medicalYellow = data.filter(p => p.medicalReadiness === 'Yellow').length;
  const medicalRed = data.filter(p => p.medicalReadiness === 'Red').length;

  const dentalGreen = data.filter(p => p.dentalReadiness === 'Green').length;
  const dentalYellow = data.filter(p => p.dentalReadiness === 'Yellow').length;
  const dentalRed = data.filter(p => p.dentalReadiness === 'Red').length;

  const deployable = data.filter(p => p.deploymentEligible).length;
  const nonDeployable = data.filter(p => !p.deploymentEligible).length;

  const profileFit = data.filter(p => p.profileStatus === 'Fit').length;
  const profileLimited = data.filter(p => p.profileStatus === 'Limited').length;
  const profileNonDep = data.filter(p => p.profileStatus === 'Non-deployable').length;

  // Personnel needing attention
  const needsAttention = data.filter(p =>
    p.medicalReadiness === 'Red' ||
    p.dentalReadiness === 'Red' ||
    !p.deploymentEligible
  );

  const ReadinessBar = ({ green, yellow, red, label }: { green: number; yellow: number; red: number; label: string }) => {
    const total = green + yellow + red;
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span className="text-muted-foreground">{total} personnel</span>
        </div>
        <div className="h-4 bg-muted rounded-full overflow-hidden flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(green / total) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-green-500"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(yellow / total) * 100}%` }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-full bg-yellow-500"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(red / total) * 100}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full bg-red-500"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500" /> {green} Green
          </span>
          <span className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-yellow-500" /> {yellow} Yellow
          </span>
          <span className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-red-500" /> {red} Red
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold tracking-tight">Health & Readiness</h1>
        <p className="text-muted-foreground">
          Monitor medical, dental, and deployment readiness across all personnel.
        </p>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass border-border/50 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deployment Ready</p>
                  <p className="text-2xl font-bold">{isLoading ? '...' : deployable}</p>
                  <p className="text-xs text-green-500">
                    {data.length > 0 ? ((deployable / data.length) * 100).toFixed(1) : 0}% of force
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass border-border/50 border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-500/10">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Non-Deployable</p>
                  <p className="text-2xl font-bold">{isLoading ? '...' : nonDeployable}</p>
                  <p className="text-xs text-red-500">Requires attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass border-border/50 border-l-4 border-l-emerald-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <Heart className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Medical Green</p>
                  <p className="text-2xl font-bold">{isLoading ? '...' : medicalGreen}</p>
                  <p className="text-xs text-emerald-500">Fully cleared</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass border-border/50 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Stethoscope className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dental Green</p>
                  <p className="text-2xl font-bold">{isLoading ? '...' : dentalGreen}</p>
                  <p className="text-xs text-blue-500">Fully cleared</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Readiness Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Readiness Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ReadinessBar
                green={medicalGreen}
                yellow={medicalYellow}
                red={medicalRed}
                label="Medical Readiness"
              />
              <ReadinessBar
                green={dentalGreen}
                yellow={dentalYellow}
                red={dentalRed}
                label="Dental Readiness"
              />
              <ReadinessBar
                green={profileFit}
                yellow={profileLimited}
                red={profileNonDep}
                label="Profile Status"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Personnel Needing Attention */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Personnel Requiring Attention ({needsAttention.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[320px] overflow-auto">
                {needsAttention.slice(0, 10).map((person) => (
                  <div key={person.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                    <div>
                      <p className="font-medium">{person.rank} {person.lastName}, {person.firstName}</p>
                      <p className="text-sm text-muted-foreground">{person.unit}</p>
                    </div>
                    <div className="flex gap-2">
                      {person.medicalReadiness === 'Red' && (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          Medical
                        </Badge>
                      )}
                      {person.dentalReadiness === 'Red' && (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          Dental
                        </Badge>
                      )}
                      {!person.deploymentEligible && person.medicalReadiness !== 'Red' && (
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          Non-Dep
                        </Badge>
                      )}
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
