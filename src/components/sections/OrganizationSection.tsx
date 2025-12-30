'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  MapPin,
  Target,
  ChevronRight,
  Home,
  ZoomIn,
  ZoomOut,
  Network,
  List,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RankInsignia } from '@/components/org/RankInsignia';
import { OrgTreeView } from '@/components/org/OrgTreeView';
import { UNIT_HIERARCHY, getChildUnits, type UnitHierarchy } from '@/lib/mock-data';
import type { Personnel, PersonnelStats } from '@/types/personnel';
import { useSelectionStore } from '@/lib/stores/selection-store';

interface OrganizationSectionProps {
  data: Personnel[];
  stats: PersonnelStats | null;
  isLoading: boolean;
}

// Unit type colors and styling
const UNIT_STYLES: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  'MEF': { bg: 'bg-red-500/10', border: 'border-red-500/50', text: 'text-red-400', glow: 'shadow-red-500/20' },
  'Division': { bg: 'bg-orange-500/10', border: 'border-orange-500/50', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
  'Regiment': { bg: 'bg-amber-500/10', border: 'border-amber-500/50', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
  'Battalion': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
  'Company': { bg: 'bg-green-500/10', border: 'border-green-500/50', text: 'text-green-400', glow: 'shadow-green-500/20' },
  'Platoon': { bg: 'bg-blue-500/10', border: 'border-blue-500/50', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
  'Squad': { bg: 'bg-purple-500/10', border: 'border-purple-500/50', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  'Team': { bg: 'bg-pink-500/10', border: 'border-pink-500/50', text: 'text-pink-400', glow: 'shadow-pink-500/20' },
};

export function OrganizationSection({ data, stats, isLoading }: OrganizationSectionProps) {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [viewHistory, setViewHistory] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'drill-down' | 'tree'>('drill-down');
  const { openPersonnelDetail } = useSelectionStore();

  // Get unit personnel map
  const unitPersonnelMap = useMemo(() => {
    const map: Record<string, Personnel[]> = {};
    data.forEach(person => {
      if (!map[person.unit]) {
        map[person.unit] = [];
      }
      map[person.unit].push(person);
    });
    return map;
  }, [data]);

  // Calculate total personnel in unit and sub-units
  const getUnitTotalPersonnel = (unitId: string): number => {
    const unit = UNIT_HIERARCHY.find(u => u.id === unitId);
    if (!unit) return 0;
    let total = (unitPersonnelMap[unit.name] || []).length;
    const children = getChildUnits(unitId);
    children.forEach(child => {
      total += getUnitTotalPersonnel(child.id);
    });
    return total;
  };

  // Get current view units
  const currentUnits = useMemo(() => {
    if (!selectedUnitId) {
      return UNIT_HIERARCHY.filter(u => u.parentId === null);
    }
    return getChildUnits(selectedUnitId);
  }, [selectedUnitId]);

  // Get selected unit
  const selectedUnit = useMemo(() => {
    if (!selectedUnitId) return null;
    return UNIT_HIERARCHY.find(u => u.id === selectedUnitId) || null;
  }, [selectedUnitId]);

  // Get personnel for selected unit
  const selectedUnitPersonnel = useMemo(() => {
    if (!selectedUnit) return [];
    return unitPersonnelMap[selectedUnit.name] || [];
  }, [selectedUnit, unitPersonnelMap]);

  // Navigate into a unit
  const drillDown = (unit: UnitHierarchy) => {
    if (selectedUnitId) {
      setViewHistory(prev => [...prev, selectedUnitId]);
    }
    setSelectedUnitId(unit.id);
  };

  // Navigate back
  const drillUp = () => {
    if (viewHistory.length > 0) {
      const newHistory = [...viewHistory];
      const prevId = newHistory.pop();
      setViewHistory(newHistory);
      setSelectedUnitId(prevId || null);
    } else {
      setSelectedUnitId(null);
    }
  };

  // Go to top level
  const goToTop = () => {
    setViewHistory([]);
    setSelectedUnitId(null);
  };

  // Sort personnel by rank
  const sortedPersonnel = useMemo(() => {
    return [...selectedUnitPersonnel].sort((a, b) => {
      const gradeOrder = ['O-10', 'O-9', 'O-8', 'O-7', 'O-6', 'O-5', 'O-4', 'O-3', 'O-2', 'O-1',
        'W-5', 'W-4', 'W-3', 'W-2', 'W-1',
        'E-9', 'E-8', 'E-7', 'E-6', 'E-5', 'E-4', 'E-3', 'E-2', 'E-1'];
      return gradeOrder.indexOf(a.payGrade) - gradeOrder.indexOf(b.payGrade);
    });
  }, [selectedUnitPersonnel]);

  // Unit node component
  const UnitNode = ({ unit, index, isCenter = false }: { unit: UnitHierarchy; index: number; isCenter?: boolean }) => {
    const style = UNIT_STYLES[unit.type] || UNIT_STYLES['Team'];
    const children = getChildUnits(unit.id);
    const hasChildren = children.length > 0;
    const totalPersonnel = getUnitTotalPersonnel(unit.id);
    const directPersonnel = (unitPersonnelMap[unit.name] || []).length;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
        className={`relative ${isCenter ? 'z-10' : ''}`}
      >
        <div
          onClick={() => drillDown(unit)}
          className={`
            relative p-4 rounded-xl border-2 transition-all duration-300
            ${style.bg} ${style.border}
            cursor-pointer hover:scale-105 hover:shadow-lg
            ${isCenter ? `shadow-xl ${style.glow}` : 'shadow-md'}
            ${isCenter ? 'min-w-[280px]' : 'min-w-[220px]'}
          `}
        >
          {/* Unit type badge */}
          <div className="absolute -top-3 left-4">
            <Badge className={`${style.bg} ${style.text} ${style.border} border text-xs font-bold`}>
              {unit.type}
            </Badge>
          </div>

          {/* Commander section */}
          <div className="flex items-center gap-3 mt-2 mb-3">
            <div className="relative">
              <RankInsignia rank={unit.commanderRank} size={isCenter ? 'lg' : 'md'} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold truncate ${isCenter ? 'text-lg' : 'text-sm'} ${style.text}`}>
                {unit.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{unit.commander}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{totalPersonnel}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Building2 className="h-3 w-3" />
              <span>{hasChildren ? `${children.length} units` : 'View roster'}</span>
            </div>
          </div>

          {/* Drill down indicator */}
          <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${style.text}`}>
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {hasChildren ? (
                <ChevronRight className="h-4 w-4 rotate-90" />
              ) : (
                <Users className="h-4 w-4" />
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Connecting lines between units
  const ConnectionLines = ({ parentCount, childCount }: { parentCount: number; childCount: number }) => {
    if (childCount === 0) return null;

    return (
      <div className="relative h-12 w-full">
        {/* Vertical line from parent */}
        <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-gradient-to-b from-border to-border/50" />

        {/* Horizontal line */}
        {childCount > 1 && (
          <div
            className="absolute top-4 h-0.5 bg-border/50"
            style={{
              left: `${50 / childCount}%`,
              right: `${50 / childCount}%`,
            }}
          />
        )}

        {/* Vertical lines to children */}
        <div className="absolute top-4 left-0 right-0 flex justify-around">
          {Array.from({ length: childCount }).map((_, i) => (
            <div key={i} className="w-0.5 h-8 bg-gradient-to-b from-border/50 to-transparent" />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organization Chart</h1>
            <p className="text-muted-foreground">
              {selectedUnit ? `Viewing: ${selectedUnit.name}` : 'Marine Corps Force Structure'}
            </p>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center gap-3">
            {/* View mode toggle */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'drill-down' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('drill-down')}
                className="h-7 gap-1.5 text-xs"
              >
                <Network className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Drill-down</span>
              </Button>
              <Button
                variant={viewMode === 'tree' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('tree')}
                className="h-7 gap-1.5 text-xs"
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tree</span>
              </Button>
            </div>

            {/* Drill-down navigation controls */}
            {viewMode === 'drill-down' && (selectedUnitId || viewHistory.length > 0) && (
              <>
                <Button variant="outline" size="sm" onClick={goToTop}>
                  <Home className="h-4 w-4 mr-2" />
                  Top Level
                </Button>
                <Button variant="outline" size="sm" onClick={drillUp}>
                  <ZoomOut className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Breadcrumb path - only in drill-down mode */}
        {viewMode === 'drill-down' && viewHistory.length > 0 && (
          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
            <button onClick={goToTop} className="hover:text-primary transition-colors">
              USMC
            </button>
            {viewHistory.map((id, idx) => {
              const unit = UNIT_HIERARCHY.find(u => u.id === id);
              return (
                <span key={id} className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3" />
                  <button
                    onClick={() => {
                      setViewHistory(viewHistory.slice(0, idx));
                      setSelectedUnitId(id);
                    }}
                    className="hover:text-primary transition-colors"
                  >
                    {unit?.name}
                  </button>
                </span>
              );
            })}
            {selectedUnit && (
              <span className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">{selectedUnit.name}</span>
              </span>
            )}
          </div>
        )}
      </motion.div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'tree' ? (
          <OrgTreeView
            data={data}
            unitPersonnelMap={unitPersonnelMap}
            onPersonnelClick={openPersonnelDetail}
          />
        ) : (
        <div className="min-h-full">
          {/* Selected unit detail card (when drilling down) */}
          {selectedUnit && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex justify-center">
                <UnitNode unit={selectedUnit} index={0} isCenter />
              </div>

              {/* Connection lines to children */}
              {currentUnits.length > 0 && (
                <ConnectionLines parentCount={1} childCount={currentUnits.length} />
              )}
            </motion.div>
          )}

          {/* Child units or top-level units */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedUnitId || 'top'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {currentUnits.length > 0 ? (
                <div className={`
                  grid gap-6 justify-items-center
                  ${currentUnits.length === 1 ? 'grid-cols-1' : ''}
                  ${currentUnits.length === 2 ? 'grid-cols-2 max-w-2xl mx-auto' : ''}
                  ${currentUnits.length === 3 ? 'grid-cols-3 max-w-4xl mx-auto' : ''}
                  ${currentUnits.length >= 4 && currentUnits.length <= 5 ? 'grid-cols-5 max-w-6xl mx-auto' : ''}
                  ${currentUnits.length >= 6 ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6' : ''}
                `}>
                  {currentUnits.map((unit, index) => (
                    <UnitNode key={unit.id} unit={unit} index={index} />
                  ))}
                </div>
              ) : selectedUnit ? (
                /* No child units - show personnel */
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    Assigned Personnel ({sortedPersonnel.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-w-6xl mx-auto">
                    {sortedPersonnel.map((person, index) => (
                      <motion.button
                        key={person.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => openPersonnelDetail(person)}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all bg-card/50 text-left"
                      >
                        <RankInsignia rank={person.rank} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {person.rank} {person.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{person.mos}</p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {person.payGrade}
                        </Badge>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {/* Personnel section when unit is selected */}
          {selectedUnit && sortedPersonnel.length > 0 && currentUnits.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 pt-8 border-t border-border/30"
            >
              <h3 className="text-lg font-semibold mb-4">
                Direct Personnel at {selectedUnit.name} ({sortedPersonnel.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {sortedPersonnel.map((person, index) => (
                  <motion.button
                    key={person.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => openPersonnelDetail(person)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all bg-card/50 text-left"
                  >
                    <RankInsignia rank={person.rank} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {person.rank} {person.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{person.mos}</p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {person.payGrade}
                    </Badge>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
