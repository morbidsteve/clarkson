'use client';

import { motion } from 'framer-motion';
import { BookOpen, Target, Award, Dumbbell, Calendar, CheckCircle, Clock, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Personnel, PersonnelStats } from '@/types/personnel';

interface TrainingSectionProps {
  data: Personnel[];
  stats: PersonnelStats | null;
  isLoading: boolean;
}

export function TrainingSection({ data, stats, isLoading }: TrainingSectionProps) {
  // Calculate training metrics
  const basicComplete = data.filter(p => p.basicTrainingComplete).length;
  const aitComplete = data.filter(p => p.aitComplete).length;

  const weaponsQuals = {
    'Expert': data.filter(p => p.weaponsQualification === 'Expert').length,
    'Sharpshooter': data.filter(p => p.weaponsQualification === 'Sharpshooter').length,
    'Marksman': data.filter(p => p.weaponsQualification === 'Marksman').length,
  };

  // PT Score distribution
  const ptScoreRanges = {
    '270+': data.filter(p => p.ptTestScore >= 270).length,
    '240-269': data.filter(p => p.ptTestScore >= 240 && p.ptTestScore < 270).length,
    '180-239': data.filter(p => p.ptTestScore >= 180 && p.ptTestScore < 240).length,
    '<180': data.filter(p => p.ptTestScore < 180).length,
  };

  const avgPtScore = data.length > 0
    ? Math.round(data.reduce((sum, p) => sum + p.ptTestScore, 0) / data.length)
    : 0;

  // Special skills count
  const skillsCount: Record<string, number> = {};
  data.forEach(p => {
    p.specialSkills.forEach(skill => {
      skillsCount[skill] = (skillsCount[skill] || 0) + 1;
    });
  });
  const topSkills = Object.entries(skillsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Top PT performers
  const topPerformers = [...data]
    .sort((a, b) => b.ptTestScore - a.ptTestScore)
    .slice(0, 8);

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold tracking-tight">Training & Qualifications</h1>
        <p className="text-muted-foreground">
          Track training completion, qualifications, and physical fitness across personnel.
        </p>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Basic Training Complete</p>
                  <p className="text-2xl font-bold">{isLoading ? '...' : basicComplete}</p>
                  <p className="text-xs text-green-500">
                    {data.length > 0 ? ((basicComplete / data.length) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">AIT Complete</p>
                  <p className="text-2xl font-bold">{isLoading ? '...' : aitComplete}</p>
                  <p className="text-xs text-blue-500">
                    {data.length > 0 ? ((aitComplete / data.length) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Target className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expert Marksmen</p>
                  <p className="text-2xl font-bold">{isLoading ? '...' : weaponsQuals['Expert']}</p>
                  <p className="text-xs text-amber-500">Highest qualification</p>
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
                  <Dumbbell className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. PT Score</p>
                  <p className="text-2xl font-bold">{isLoading ? '...' : avgPtScore}</p>
                  <p className="text-xs text-purple-500">Out of 300</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weapons Qualifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-500" />
                Weapons Qualifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(weaponsQuals).map(([qual, count]) => {
                const percentage = data.length > 0 ? (count / data.length) * 100 : 0;
                const colors: Record<string, { bg: string; bar: string }> = {
                  'Expert': { bg: 'bg-amber-500/10', bar: 'bg-amber-500' },
                  'Sharpshooter': { bg: 'bg-blue-500/10', bar: 'bg-blue-500' },
                  'Marksman': { bg: 'bg-gray-500/10', bar: 'bg-gray-500' },
                };
                return (
                  <div key={qual} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Award className={`h-4 w-4 ${qual === 'Expert' ? 'text-amber-500' : qual === 'Sharpshooter' ? 'text-blue-500' : 'text-gray-500'}`} />
                        <span className="text-sm">{qual}</span>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full ${colors[qual].bar} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* PT Score Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-purple-500" />
                PT Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(ptScoreRanges).map(([range, count]) => {
                const percentage = data.length > 0 ? (count / data.length) * 100 : 0;
                const colors: Record<string, string> = {
                  '270+': 'bg-green-500',
                  '240-269': 'bg-blue-500',
                  '180-239': 'bg-amber-500',
                  '<180': 'bg-red-500',
                };
                return (
                  <div key={range} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{range}</span>
                      <span className="text-muted-foreground">{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={`h-full ${colors[range]} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Top PT Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPerformers.map((person, index) => (
                  <div key={person.id} className="flex items-center gap-3">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-amber-500/20 text-amber-500' :
                      index === 1 ? 'bg-gray-400/20 text-gray-400' :
                      index === 2 ? 'bg-amber-700/20 text-amber-700' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {person.rank} {person.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{person.unit}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                      {person.ptTestScore}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Special Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Special Skills Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topSkills.map(([skill, count]) => (
                <Badge key={skill} variant="secondary" className="text-sm py-1.5 px-3">
                  {skill}
                  <span className="ml-2 px-1.5 py-0.5 rounded bg-primary/20 text-primary text-xs">
                    {count}
                  </span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
