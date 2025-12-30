'use client';

import { motion } from 'framer-motion';
import {
  Heart,
  Syringe,
  Stethoscope,
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Pill,
  Eye,
  Ear,
  Brain
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import type { Personnel, PersonnelStats } from '@/types/personnel';

interface MedicalSectionProps {
  data: Personnel[];
  stats: PersonnelStats | null;
  isLoading: boolean;
}

export function MedicalSection({ data, stats, isLoading }: MedicalSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter personnel based on search
  const filteredData = data.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate medical metrics
  const medicalGreen = data.filter(p => p.medicalReadiness === 'Green').length;
  const medicalYellow = data.filter(p => p.medicalReadiness === 'Yellow').length;
  const medicalRed = data.filter(p => p.medicalReadiness === 'Red').length;

  const dentalGreen = data.filter(p => p.dentalReadiness === 'Green').length;
  const dentalYellow = data.filter(p => p.dentalReadiness === 'Yellow').length;
  const dentalRed = data.filter(p => p.dentalReadiness === 'Red').length;

  const mentalGreen = data.filter(p => p.mentalHealthStatus === 'Green').length;
  const mentalYellow = data.filter(p => p.mentalHealthStatus === 'Yellow').length;
  const mentalRed = data.filter(p => p.mentalHealthStatus === 'Red').length;

  const deployable = data.filter(p => p.deploymentEligible).length;
  const hivNegative = data.filter(p => p.hivStatus === 'Negative').length;
  const dnaOnFile = data.filter(p => p.dnaOnFile).length;

  // Vaccination stats
  const vaccinationStats: Record<string, { current: number; due: number; overdue: number }> = {};
  data.forEach(p => {
    p.vaccinations.forEach(v => {
      if (!vaccinationStats[v.name]) {
        vaccinationStats[v.name] = { current: 0, due: 0, overdue: 0 };
      }
      vaccinationStats[v.name][v.status.toLowerCase() as 'current' | 'due' | 'overdue']++;
    });
  });

  // Get personnel with overdue vaccinations
  const overdueVaccinations = data.filter(p =>
    p.vaccinations.some(v => v.status === 'Overdue')
  );

  // Get upcoming appointments
  const allAppointments = data.flatMap(p =>
    p.upcomingAppointments.map(apt => ({ ...apt, person: p }))
  ).filter(apt => apt.status === 'Scheduled')
   .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
   .slice(0, 10);

  // Personnel with medical limitations
  const limitedPersonnel = data.filter(p => p.profileStatus !== 'Fit');

  const ReadinessIndicator = ({ value, label }: { value: 'Green' | 'Yellow' | 'Red'; label: string }) => {
    const colors = {
      Green: 'bg-green-500/20 text-green-400 border-green-500/30',
      Yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      Red: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return (
      <Badge className={colors[value]}>
        {label}: {value}
      </Badge>
    );
  };

  const PulhesBar = ({ label, value }: { label: string; value: number }) => {
    const colors = ['', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'];
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs w-20 text-muted-foreground">{label}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`h-3 w-3 rounded-sm ${i <= value ? colors[value] : 'bg-muted'}`}
            />
          ))}
        </div>
        <span className="text-xs font-mono">{value}</span>
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
        <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
        <p className="text-muted-foreground">
          Comprehensive health information, vaccinations, appointments, and readiness status.
        </p>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass border-border/50 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Heart className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Medical Green</p>
                  <p className="text-2xl font-bold">{isLoading ? '...' : medicalGreen}</p>
                  <p className="text-xs text-green-500">
                    {data.length > 0 ? ((medicalGreen / data.length) * 100).toFixed(1) : 0}% ready
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass border-border/50 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Stethoscope className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dental Green</p>
                  <p className="text-2xl font-bold">{isLoading ? '...' : dentalGreen}</p>
                  <p className="text-xs text-blue-500">
                    {data.length > 0 ? ((dentalGreen / data.length) * 100).toFixed(1) : 0}% ready
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass border-border/50 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <Brain className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mental Health Green</p>
                  <p className="text-2xl font-bold">{isLoading ? '...' : mentalGreen}</p>
                  <p className="text-xs text-purple-500">
                    {data.length > 0 ? ((mentalGreen / data.length) * 100).toFixed(1) : 0}% cleared
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass border-border/50 border-l-4 border-l-amber-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Syringe className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vaccinations Overdue</p>
                  <p className="text-2xl font-bold">{isLoading ? '...' : overdueVaccinations.length}</p>
                  <p className="text-xs text-amber-500">Requires attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vaccination Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="glass border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Syringe className="h-5 w-5 text-amber-500" />
                Vaccination Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {Object.entries(vaccinationStats).slice(0, 12).map(([name, stats]) => {
                    const total = stats.current + stats.due + stats.overdue;
                    return (
                      <div key={name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="truncate">{name}</span>
                          <span className="text-muted-foreground">
                            {stats.current}/{total} current
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${(stats.current / total) * 100}%` }}
                          />
                          <div
                            className="h-full bg-yellow-500"
                            style={{ width: `${(stats.due / total) * 100}%` }}
                          />
                          <div
                            className="h-full bg-red-500"
                            style={{ width: `${(stats.overdue / total) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              <div className="flex gap-4 mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" /> Current
                </span>
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" /> Due
                </span>
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-500" /> Overdue
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {allAppointments.map((apt, i) => (
                    <div key={i} className="p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{apt.type}</span>
                        <Badge variant="outline" className="text-xs">
                          {new Date(apt.date).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {apt.person.rank} {apt.person.lastName}, {apt.person.firstName}
                      </p>
                      <p className="text-xs text-muted-foreground">{apt.location}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Personnel Lookup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Personnel Medical Lookup
            </CardTitle>
            <div className="mt-2">
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {filteredData.slice(0, 20).map((person) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-all"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {person.rank} {person.lastName}, {person.firstName} {person.middleName?.charAt(0)}.
                        </h3>
                        <p className="text-sm text-muted-foreground">{person.unit} | ID: {person.id}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <ReadinessIndicator value={person.medicalReadiness} label="Medical" />
                        <ReadinessIndicator value={person.dentalReadiness} label="Dental" />
                        <ReadinessIndicator value={person.mentalHealthStatus} label="Mental" />
                        <Badge
                          className={person.deploymentEligible
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }
                        >
                          {person.deploymentEligible ? 'Deployable' : 'Non-Deployable'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Basic Medical Info */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Basic Info</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="text-muted-foreground">Blood Type:</span> {person.bloodType}</p>
                          <p><span className="text-muted-foreground">HIV Status:</span> {person.hivStatus}</p>
                          <p><span className="text-muted-foreground">DNA on File:</span> {person.dnaOnFile ? 'Yes' : 'No'}</p>
                          <p><span className="text-muted-foreground">Profile:</span> {person.profileStatus}</p>
                        </div>
                      </div>

                      {/* PULHES */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">PULHES Profile</h4>
                        <div className="space-y-1">
                          <PulhesBar label="Physical" value={person.pulhes.physical} />
                          <PulhesBar label="Upper Ext" value={person.pulhes.upperExtremities} />
                          <PulhesBar label="Lower Ext" value={person.pulhes.lowerExtremities} />
                          <PulhesBar label="Hearing" value={person.pulhes.hearing} />
                          <PulhesBar label="Eyes" value={person.pulhes.eyes} />
                          <PulhesBar label="Psych" value={person.pulhes.psychiatric} />
                        </div>
                      </div>

                      {/* Vision/Hearing */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Senses</h4>
                        <div className="text-sm space-y-1">
                          <p className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            Vision Category: {person.visionCategory}
                          </p>
                          <p className="flex items-center gap-2">
                            <Ear className="h-4 w-4 text-muted-foreground" />
                            Hearing: {person.hearingCategory}
                          </p>
                          <p><span className="text-muted-foreground">Dental Class:</span> {person.dentalClass}</p>
                        </div>
                        <h4 className="text-sm font-medium text-muted-foreground mt-3">Allergies</h4>
                        <div className="flex flex-wrap gap-1">
                          {person.allergies.length > 0 ? person.allergies.map((allergy, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {allergy}
                            </Badge>
                          )) : (
                            <span className="text-xs text-muted-foreground">None reported</span>
                          )}
                        </div>
                      </div>

                      {/* Medications & Dates */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Key Dates</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="text-muted-foreground">Last Physical:</span> {new Date(person.lastPhysicalDate).toLocaleDateString()}</p>
                          <p><span className="text-muted-foreground">Next Physical:</span> {new Date(person.nextPhysicalDue).toLocaleDateString()}</p>
                          <p><span className="text-muted-foreground">Last HIV Test:</span> {new Date(person.lastHivTest).toLocaleDateString()}</p>
                          <p><span className="text-muted-foreground">Mental Screen:</span> {new Date(person.lastMentalHealthScreen).toLocaleDateString()}</p>
                        </div>
                        {person.currentMedications.length > 0 && (
                          <>
                            <h4 className="text-sm font-medium text-muted-foreground mt-3">Medications</h4>
                            <div className="space-y-1">
                              {person.currentMedications.slice(0, 2).map((med, i) => (
                                <p key={i} className="text-xs flex items-center gap-1">
                                  <Pill className="h-3 w-3 text-muted-foreground" />
                                  {med.name} ({med.dosage})
                                </p>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Vaccinations */}
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Vaccination Status</h4>
                      <div className="flex flex-wrap gap-2">
                        {person.vaccinations.slice(0, 8).map((vac, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className={
                              vac.status === 'Current'
                                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                : vac.status === 'Due'
                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                : 'bg-red-500/10 text-red-400 border-red-500/30'
                            }
                          >
                            {vac.status === 'Current' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {vac.status === 'Due' && <Clock className="h-3 w-3 mr-1" />}
                            {vac.status === 'Overdue' && <XCircle className="h-3 w-3 mr-1" />}
                            {vac.name}
                          </Badge>
                        ))}
                        {person.vaccinations.length > 8 && (
                          <Badge variant="outline">+{person.vaccinations.length - 8} more</Badge>
                        )}
                      </div>
                    </div>

                    {/* Medical Limitations */}
                    {person.medicalLimitations.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <h4 className="text-sm font-medium text-amber-500 flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4" />
                          Medical Limitations
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {person.medicalLimitations.map((limitation, i) => (
                            <Badge key={i} className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                              {limitation}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
