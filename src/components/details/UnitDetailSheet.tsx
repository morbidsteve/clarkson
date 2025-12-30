'use client';

import { useSelectionStore } from '@/lib/stores/selection-store';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { RankInsignia } from '@/components/org/RankInsignia';
import { getChildUnits, getUnitById, UNIT_HIERARCHY } from '@/lib/mock-data';
import type { Personnel } from '@/types/personnel';
import { Building2, Users, MapPin, Target, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface UnitDetailSheetProps {
  personnel: Personnel[];
}

function getUnitTypeColor(type: string) {
  switch (type) {
    case 'MEF': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Division': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Regiment': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    case 'Battalion': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Company': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Platoon': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Squad': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'Team': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

export function UnitDetailSheet({ personnel }: UnitDetailSheetProps) {
  const { selectedUnit, isUnitDetailOpen, closeDetail, openUnitDetail, openPersonnelDetail } = useSelectionStore();

  if (!selectedUnit) return null;

  const unit = selectedUnit;
  const childUnits = getChildUnits(unit.id);
  const unitPersonnel = personnel.filter(p => p.unit === unit.name);
  const parentUnit = unit.parentId ? getUnitById(unit.parentId) : null;

  // Sort personnel by pay grade (highest first)
  const sortedPersonnel = [...unitPersonnel].sort((a, b) => {
    const gradeOrder: Record<string, number> = {
      'O-10': 1, 'O-9': 2, 'O-8': 3, 'O-7': 4, 'O-6': 5, 'O-5': 6, 'O-4': 7, 'O-3': 8, 'O-2': 9, 'O-1': 10,
      'W-5': 11, 'W-4': 12, 'W-3': 13, 'W-2': 14, 'W-1': 15,
      'E-9': 16, 'E-8': 17, 'E-7': 18, 'E-6': 19, 'E-5': 20, 'E-4': 21, 'E-3': 22, 'E-2': 23, 'E-1': 24
    };
    return (gradeOrder[a.payGrade] || 99) - (gradeOrder[b.payGrade] || 99);
  });

  return (
    <Sheet open={isUnitDetailOpen} onOpenChange={(open) => !open && closeDetail()}>
      <SheetContent className="w-full sm:max-w-xl overflow-hidden">
        <SheetHeader className="pb-4">
          <div className="space-y-2">
            <Badge className={getUnitTypeColor(unit.type)}>
              {unit.type}
            </Badge>
            <SheetTitle className="text-xl">{unit.name}</SheetTitle>
            {parentUnit && (
              <button
                onClick={() => openUnitDetail(parentUnit)}
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                <Building2 className="h-3 w-3" />
                Part of {parentUnit.name}
              </button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-160px)] pr-4">
          <div className="space-y-6">
            {/* Commander */}
            <div className="p-4 rounded-lg border border-border/50 bg-card/50">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Commander</div>
              <div className="flex items-center gap-3">
                <RankInsignia rank={unit.commanderRank} size="md" />
                <div>
                  <div className="font-medium">{unit.commander}</div>
                  <div className="text-sm text-muted-foreground">{unit.commanderRank}</div>
                </div>
              </div>
            </div>

            {/* Unit Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border border-border/50 bg-card/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wider">Location</span>
                </div>
                <div className="text-sm font-medium">{unit.location}</div>
              </div>
              <div className="p-3 rounded-lg border border-border/50 bg-card/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wider">Strength</span>
                </div>
                <div className="text-sm font-medium">{unitPersonnel.length} assigned</div>
              </div>
            </div>

            {/* Mission */}
            <div className="p-3 rounded-lg border border-border/50 bg-card/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Target className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Mission</span>
              </div>
              <div className="text-sm">{unit.mission}</div>
            </div>

            <Separator />

            {/* Sub-units */}
            {childUnits.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Sub-Units ({childUnits.length})
                </div>
                <div className="space-y-2">
                  {childUnits.map((child, index) => (
                    <motion.button
                      key={child.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => openUnitDetail(child)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Badge className={`${getUnitTypeColor(child.type)} text-xs`}>
                          {child.type}
                        </Badge>
                        <span className="text-sm font-medium">{child.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {childUnits.length > 0 && <Separator />}

            {/* Personnel */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Assigned Personnel ({sortedPersonnel.length})
              </div>
              <div className="space-y-2">
                {sortedPersonnel.map((person, index) => (
                  <motion.button
                    key={person.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => openPersonnelDetail(person)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card transition-colors text-left"
                  >
                    <RankInsignia rank={person.rank} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {person.rank} {person.lastName}, {person.firstName}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{person.mos}</div>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {person.payGrade}
                    </Badge>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
