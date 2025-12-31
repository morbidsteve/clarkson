'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Users, ChevronDown, ChevronUp, Minus } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RankInsignia } from '@/components/org/RankInsignia';
import { CLR1_UNIT_HIERARCHY, getCLR1ChildUnits } from '@/lib/clr1-data';
import type { UnitHierarchy, StaffPosition } from '@/lib/mock-data';
import type { Personnel } from '@/types/personnel';

interface OrgTreeViewProps {
  data: Personnel[];
  unitPersonnelMap: Record<string, Personnel[]>;
  onPersonnelClick: (person: Personnel) => void;
}

// Unit type colors (consistent with OrganizationSection)
const UNIT_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  'MEF': { bg: 'bg-red-500/10', border: 'border-red-500/40', text: 'text-red-400' },
  'Division': { bg: 'bg-orange-500/10', border: 'border-orange-500/40', text: 'text-orange-400' },
  'Regiment': { bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-400' },
  'Battalion': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/40', text: 'text-yellow-400' },
  'Company': { bg: 'bg-green-500/10', border: 'border-green-500/40', text: 'text-green-400' },
  'Platoon': { bg: 'bg-blue-500/10', border: 'border-blue-500/40', text: 'text-blue-400' },
  'Squad': { bg: 'bg-purple-500/10', border: 'border-purple-500/40', text: 'text-purple-400' },
  'Team': { bg: 'bg-pink-500/10', border: 'border-pink-500/40', text: 'text-pink-400' },
};

// Pay grade sort order for personnel
const PAY_GRADE_ORDER: Record<string, number> = {
  'O-10': 1, 'O-9': 2, 'O-8': 3, 'O-7': 4, 'O-6': 5, 'O-5': 6, 'O-4': 7, 'O-3': 8, 'O-2': 9, 'O-1': 10,
  'W-5': 11, 'W-4': 12, 'W-3': 13, 'W-2': 14, 'W-1': 15,
  'E-9': 16, 'E-8': 17, 'E-7': 18, 'E-6': 19, 'E-5': 20, 'E-4': 21, 'E-3': 22, 'E-2': 23, 'E-1': 24,
};

// Staff Position Card
function StaffCard({ staff }: { staff: StaffPosition }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-card/50 border border-border/30 hover:border-border/50 transition-colors">
      <RankInsignia rank={staff.rank} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{staff.name}</p>
        <p className="text-[10px] text-muted-foreground truncate">
          {staff.abbreviation} &middot; {staff.rank}
        </p>
      </div>
    </div>
  );
}

// Personnel Card
function PersonnelCard({
  person,
  onClick
}: {
  person: Personnel;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 p-2 rounded-md bg-card/50 border border-border/30 hover:border-primary/40 hover:bg-accent/30 transition-colors text-left w-full"
    >
      <RankInsignia rank={person.rank} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">
          {person.lastName}, {person.firstName}
        </p>
        <p className="text-[10px] text-muted-foreground truncate">{person.mos}</p>
      </div>
      <Badge variant="outline" className="text-[10px] shrink-0">
        {person.payGrade}
      </Badge>
    </button>
  );
}

// Recursive Tree Node
function TreeNode({
  unit,
  level = 0,
  unitPersonnelMap,
  onPersonnelClick,
  expandedNodes,
  toggleNode,
}: {
  unit: UnitHierarchy;
  level?: number;
  unitPersonnelMap: Record<string, Personnel[]>;
  onPersonnelClick: (person: Personnel) => void;
  expandedNodes: Set<string>;
  toggleNode: (id: string) => void;
}) {
  const isOpen = expandedNodes.has(unit.id);
  const children = useMemo(() => getCLR1ChildUnits(unit.id), [unit.id]);
  const hasChildren = children.length > 0;
  const style = UNIT_STYLES[unit.type] || UNIT_STYLES['Team'];
  const unitPersonnel = unitPersonnelMap[unit.name] || [];
  const isLeafLevel = unit.type === 'Team';
  const hasExpandableContent = hasChildren || (unit.staffPositions && unit.staffPositions.length > 0) || (isLeafLevel && unitPersonnel.length > 0);

  // Sort personnel by pay grade
  const sortedPersonnel = useMemo(() => {
    return [...unitPersonnel].sort((a, b) => {
      const orderA = PAY_GRADE_ORDER[a.payGrade] || 99;
      const orderB = PAY_GRADE_ORDER[b.payGrade] || 99;
      return orderA - orderB;
    });
  }, [unitPersonnel]);

  return (
    <div className="relative">
      {/* Tree connector lines */}
      {level > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border/30" style={{ left: -12 }} />
      )}
      {level > 0 && (
        <div className="absolute top-4 w-3 h-px bg-border/30" style={{ left: -12 }} />
      )}

      <Collapsible open={isOpen} onOpenChange={() => toggleNode(unit.id)}>
        <CollapsibleTrigger asChild>
          <div
            className={`
              flex items-center gap-2 p-2 rounded-lg cursor-pointer
              hover:bg-accent/30 transition-all duration-200
              ${style.bg} ${style.border} border
              ${isOpen ? 'shadow-sm' : ''}
            `}
          >
            {/* Expand/collapse icon */}
            {hasExpandableContent ? (
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.15 }}
                className="shrink-0"
              >
                <ChevronRight className={`h-4 w-4 ${style.text}`} />
              </motion.div>
            ) : (
              <Minus className="h-4 w-4 text-muted-foreground/50 shrink-0" />
            )}

            {/* Unit info */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Badge variant="outline" className={`${style.text} ${style.border} text-[10px] shrink-0`}>
                {unit.type}
              </Badge>
              <span className="font-medium text-sm truncate">{unit.name}</span>
            </div>

            {/* Personnel count */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Users className="h-3 w-3" />
              <span>{unit.personnelCount.toLocaleString()}</span>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-2 pl-6 space-y-2">
                  {/* Staff positions */}
                  {unit.staffPositions && unit.staffPositions.length > 0 && (
                    <div className="p-3 rounded-lg bg-background/60 border border-border/20">
                      <h4 className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${style.text} bg-current`} />
                        Key Staff ({unit.staffPositions.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5">
                        {unit.staffPositions.map((staff, idx) => (
                          <StaffCard key={idx} staff={staff} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Leaf level: show all personnel */}
                  {isLeafLevel && sortedPersonnel.length > 0 && (
                    <div className="p-3 rounded-lg bg-background/60 border border-border/20">
                      <h4 className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                        Assigned Personnel ({sortedPersonnel.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {sortedPersonnel.map((person) => (
                          <PersonnelCard
                            key={person.id}
                            person={person}
                            onClick={() => onPersonnelClick(person)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Child units */}
                  {children.length > 0 && (
                    <div className="space-y-1 relative">
                      {children.map((child) => (
                        <TreeNode
                          key={child.id}
                          unit={child}
                          level={level + 1}
                          unitPersonnelMap={unitPersonnelMap}
                          onPersonnelClick={onPersonnelClick}
                          expandedNodes={expandedNodes}
                          toggleNode={toggleNode}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export function OrgTreeView({ data, unitPersonnelMap, onPersonnelClick }: OrgTreeViewProps) {
  // Track expanded nodes
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Get top-level units (CLR-1)
  const topLevelUnits = useMemo(() => {
    return CLR1_UNIT_HIERARCHY.filter(u => u.parentId === null);
  }, []);

  // Toggle a single node
  const toggleNode = useCallback((id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Expand all nodes
  const expandAll = useCallback(() => {
    const allIds = new Set(CLR1_UNIT_HIERARCHY.map(u => u.id));
    setExpandedNodes(allIds);
  }, []);

  // Collapse all nodes
  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set());
  }, []);

  // Expand to a specific level
  const expandToLevel = useCallback((targetType: string) => {
    const levelOrder = ['Regiment', 'Battalion', 'Company', 'Platoon', 'Squad', 'Team'];
    const targetIndex = levelOrder.indexOf(targetType);
    if (targetIndex === -1) return;

    const nodesToExpand = new Set<string>();
    CLR1_UNIT_HIERARCHY.forEach(unit => {
      const unitIndex = levelOrder.indexOf(unit.type);
      if (unitIndex < targetIndex) {
        nodesToExpand.add(unit.id);
      }
    });
    setExpandedNodes(nodesToExpand);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <span className="text-xs text-muted-foreground mr-2">Expand to:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => expandToLevel('Battalion')}
          className="text-xs h-7"
        >
          Battalion
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => expandToLevel('Company')}
          className="text-xs h-7"
        >
          Company
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={expandAll}
          className="text-xs h-7 gap-1"
        >
          <ChevronDown className="h-3 w-3" />
          Expand All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={collapseAll}
          className="text-xs h-7 gap-1"
        >
          <ChevronUp className="h-3 w-3" />
          Collapse All
        </Button>
      </div>

      {/* Tree content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {topLevelUnits.map((unit) => (
            <TreeNode
              key={unit.id}
              unit={unit}
              unitPersonnelMap={unitPersonnelMap}
              onPersonnelClick={onPersonnelClick}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
