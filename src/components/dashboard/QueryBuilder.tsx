'use client';

import { useState } from 'react';
import { Plus, Trash2, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  type QueryCondition,
  type QueryGroup,
  type FieldMeta,
  QUERYABLE_FIELDS,
  getOperatorsForType,
  getFieldMeta,
  getFieldsByCategory,
  createEmptyCondition,
  createEmptyGroup,
} from '@/lib/query-builder';

interface QueryBuilderProps {
  query: QueryGroup;
  onChange: (query: QueryGroup) => void;
  compact?: boolean;
}

// Condition row component
function ConditionRow({
  condition,
  onChange,
  onRemove,
  showRemove,
}: {
  condition: QueryCondition;
  onChange: (condition: QueryCondition) => void;
  onRemove: () => void;
  showRemove: boolean;
}) {
  const fieldMeta = getFieldMeta(condition.field);
  const operators = fieldMeta ? getOperatorsForType(fieldMeta.type) : [];
  const fieldsByCategory = getFieldsByCategory();

  const needsValue = !['is_empty', 'is_not_empty', 'is_true', 'is_false'].includes(condition.operator);
  const needsSecondValue = ['between'].includes(condition.operator);
  const isMultiSelect = ['in', 'not_in'].includes(condition.operator);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Field selector */}
      <Select
        value={condition.field}
        onValueChange={(value) => {
          const newMeta = getFieldMeta(value);
          const newOperators = newMeta ? getOperatorsForType(newMeta.type) : [];
          onChange({
            ...condition,
            field: value,
            operator: newOperators[0]?.value || 'equals',
            value: '',
            secondValue: undefined,
          });
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select field" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {Object.entries(fieldsByCategory).map(([category, fields]) => (
            <SelectGroup key={category}>
              <SelectLabel className="text-xs text-muted-foreground">{category}</SelectLabel>
              {fields.map((field) => (
                <SelectItem key={field.key} value={field.key}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      {/* Operator selector */}
      <Select
        value={condition.operator}
        onValueChange={(value) =>
          onChange({ ...condition, operator: value as QueryCondition['operator'] })
        }
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {operators.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Value input */}
      {needsValue && fieldMeta && (
        <>
          {fieldMeta.type === 'select' && !isMultiSelect ? (
            <Select
              value={String(condition.value || '')}
              onValueChange={(value) => onChange({ ...condition, value })}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent>
                {fieldMeta.options?.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : fieldMeta.type === 'select' && isMultiSelect ? (
            <MultiSelectValue
              options={fieldMeta.options || []}
              value={Array.isArray(condition.value) ? condition.value : []}
              onChange={(values) => onChange({ ...condition, value: values })}
            />
          ) : fieldMeta.type === 'boolean' ? null : fieldMeta.type === 'date' && !['in_last_days', 'in_next_days'].includes(condition.operator) ? (
            <Input
              type="date"
              className="w-[160px]"
              value={String(condition.value || '')}
              onChange={(e) => onChange({ ...condition, value: e.target.value })}
            />
          ) : (
            <Input
              type={fieldMeta.type === 'number' || ['in_last_days', 'in_next_days'].includes(condition.operator) ? 'number' : 'text'}
              className="w-[160px]"
              placeholder={['in_last_days', 'in_next_days'].includes(condition.operator) ? 'Days' : 'Value'}
              value={String(condition.value || '')}
              onChange={(e) =>
                onChange({
                  ...condition,
                  value: fieldMeta.type === 'number' || ['in_last_days', 'in_next_days'].includes(condition.operator)
                    ? Number(e.target.value)
                    : e.target.value,
                })
              }
            />
          )}

          {/* Second value for between */}
          {needsSecondValue && (
            <>
              <span className="text-sm text-muted-foreground">and</span>
              {fieldMeta.type === 'date' ? (
                <Input
                  type="date"
                  className="w-[160px]"
                  value={String(condition.secondValue || '')}
                  onChange={(e) => onChange({ ...condition, secondValue: e.target.value })}
                />
              ) : (
                <Input
                  type="number"
                  className="w-[120px]"
                  placeholder="Max"
                  value={String(condition.secondValue || '')}
                  onChange={(e) => onChange({ ...condition, secondValue: Number(e.target.value) })}
                />
              )}
            </>
          )}
        </>
      )}

      {/* Remove button */}
      {showRemove && (
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// Multi-select value component for 'in' and 'not_in' operators
function MultiSelectValue({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggleValue = (opt: string) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          {value.length > 0 ? (
            <span className="truncate">{value.length} selected</span>
          ) : (
            <span className="text-muted-foreground">Select values</span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2" align="start">
        <div className="space-y-1 max-h-[200px] overflow-auto">
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
            >
              <Checkbox
                checked={value.includes(opt)}
                onCheckedChange={() => toggleValue(opt)}
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Query group component (recursive for nested groups)
function QueryGroupComponent({
  group,
  onChange,
  onRemove,
  depth = 0,
}: {
  group: QueryGroup;
  onChange: (group: QueryGroup) => void;
  onRemove?: () => void;
  depth?: number;
}) {
  const addCondition = () => {
    onChange({
      ...group,
      conditions: [...group.conditions, createEmptyCondition()],
    });
  };

  const addGroup = () => {
    onChange({
      ...group,
      groups: [...(group.groups || []), createEmptyGroup(group.logic === 'AND' ? 'OR' : 'AND')],
    });
  };

  const updateCondition = (index: number, condition: QueryCondition) => {
    const newConditions = [...group.conditions];
    newConditions[index] = condition;
    onChange({ ...group, conditions: newConditions });
  };

  const removeCondition = (index: number) => {
    onChange({
      ...group,
      conditions: group.conditions.filter((_, i) => i !== index),
    });
  };

  const updateNestedGroup = (index: number, nestedGroup: QueryGroup) => {
    const newGroups = [...(group.groups || [])];
    newGroups[index] = nestedGroup;
    onChange({ ...group, groups: newGroups });
  };

  const removeNestedGroup = (index: number) => {
    onChange({
      ...group,
      groups: (group.groups || []).filter((_, i) => i !== index),
    });
  };

  const toggleLogic = () => {
    onChange({ ...group, logic: group.logic === 'AND' ? 'OR' : 'AND' });
  };

  const hasContent = group.conditions.length > 0 || (group.groups && group.groups.length > 0);

  return (
    <div
      className={cn(
        'rounded-lg p-4',
        depth > 0 && 'bg-muted/50 border border-border',
        depth === 0 && hasContent && 'bg-muted/30'
      )}
    >
      {/* Group header */}
      {hasContent && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground">Match</span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2"
            onClick={toggleLogic}
          >
            {group.logic === 'AND' ? 'all' : 'any'}
          </Button>
          <span className="text-sm text-muted-foreground">of the following conditions</span>
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-auto"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Conditions */}
      <div className="space-y-2">
        {group.conditions.map((condition, index) => (
          <div key={condition.id} className="flex items-start gap-2">
            {index > 0 && (
              <Badge variant="secondary" className="mt-1.5 shrink-0">
                {group.logic}
              </Badge>
            )}
            <div className={cn(index > 0 && 'flex-1')}>
              <ConditionRow
                condition={condition}
                onChange={(c) => updateCondition(index, c)}
                onRemove={() => removeCondition(index)}
                showRemove={group.conditions.length > 1 || (group.groups?.length || 0) > 0}
              />
            </div>
          </div>
        ))}

        {/* Nested groups */}
        {group.groups?.map((nestedGroup, index) => (
          <div key={nestedGroup.id} className="mt-3">
            {(group.conditions.length > 0 || index > 0) && (
              <Badge variant="secondary" className="mb-2">
                {group.logic}
              </Badge>
            )}
            <QueryGroupComponent
              group={nestedGroup}
              onChange={(g) => updateNestedGroup(index, g)}
              onRemove={() => removeNestedGroup(index)}
              depth={depth + 1}
            />
          </div>
        ))}
      </div>

      {/* Add buttons */}
      <div className="flex items-center gap-2 mt-3">
        <Button variant="outline" size="sm" onClick={addCondition} className="gap-1">
          <Plus className="h-3 w-3" />
          Add Condition
        </Button>
        {depth < 2 && (
          <Button variant="ghost" size="sm" onClick={addGroup} className="gap-1">
            <Plus className="h-3 w-3" />
            Add Group
          </Button>
        )}
      </div>
    </div>
  );
}

export function QueryBuilder({ query, onChange, compact }: QueryBuilderProps) {
  if (compact && query.conditions.length === 0 && (!query.groups || query.groups.length === 0)) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange({ ...query, conditions: [createEmptyCondition()] })}
        className="gap-1"
      >
        <Plus className="h-3 w-3" />
        Add Filter
      </Button>
    );
  }

  return <QueryGroupComponent group={query} onChange={onChange} />;
}

// Compact query summary component
export function QuerySummary({ query }: { query: QueryGroup }) {
  const conditionCount = query.conditions.length + (query.groups?.reduce((sum, g) => sum + g.conditions.length, 0) || 0);

  if (conditionCount === 0) {
    return <span className="text-muted-foreground text-sm">No filters applied</span>;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {query.conditions.slice(0, 3).map((condition, i) => {
        const fieldMeta = getFieldMeta(condition.field);
        return (
          <Badge key={condition.id} variant="secondary" className="text-xs">
            {fieldMeta?.label} {condition.operator.replace(/_/g, ' ')} {String(condition.value).slice(0, 15)}
          </Badge>
        );
      })}
      {conditionCount > 3 && (
        <Badge variant="outline" className="text-xs">
          +{conditionCount - 3} more
        </Badge>
      )}
    </div>
  );
}
