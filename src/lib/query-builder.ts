import type { Personnel } from '@/types/personnel';

// Operator types for different field types
export type StringOperator = 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'is_empty' | 'is_not_empty';
export type NumberOperator = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'greater_or_equal' | 'less_or_equal' | 'between';
export type BooleanOperator = 'is_true' | 'is_false';
export type DateOperator = 'equals' | 'before' | 'after' | 'between' | 'in_last_days' | 'in_next_days';
export type ArrayOperator = 'contains' | 'not_contains' | 'is_empty' | 'is_not_empty' | 'has_count';
export type SelectOperator = 'equals' | 'not_equals' | 'in' | 'not_in';

export type QueryOperator = StringOperator | NumberOperator | BooleanOperator | DateOperator | ArrayOperator | SelectOperator;

export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'array' | 'select';

export interface QueryCondition {
  id: string;
  field: string;
  operator: QueryOperator;
  value: string | number | boolean | string[];
  secondValue?: string | number; // For 'between' operator
}

export interface QueryGroup {
  id: string;
  logic: 'AND' | 'OR';
  conditions: QueryCondition[];
  groups?: QueryGroup[]; // Nested groups for complex queries
}

export interface DashboardQuery {
  id: string;
  name: string;
  rootGroup: QueryGroup;
}

// Field metadata for the query builder
export interface FieldMeta {
  key: string;
  label: string;
  type: FieldType;
  category: string;
  options?: string[]; // For select fields
}

// All queryable fields with their metadata
export const QUERYABLE_FIELDS: FieldMeta[] = [
  // Personal
  { key: 'firstName', label: 'First Name', type: 'string', category: 'Personal' },
  { key: 'lastName', label: 'Last Name', type: 'string', category: 'Personal' },
  { key: 'middleName', label: 'Middle Name', type: 'string', category: 'Personal' },
  { key: 'dateOfBirth', label: 'Date of Birth', type: 'date', category: 'Personal' },
  { key: 'gender', label: 'Gender', type: 'select', category: 'Personal', options: ['Male', 'Female', 'Other'] },
  { key: 'maritalStatus', label: 'Marital Status', type: 'select', category: 'Personal', options: ['Single', 'Married', 'Divorced', 'Widowed'] },
  { key: 'dependents', label: 'Dependents', type: 'number', category: 'Personal' },
  { key: 'bloodType', label: 'Blood Type', type: 'select', category: 'Personal', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  { key: 'religion', label: 'Religion', type: 'string', category: 'Personal' },
  { key: 'ethnicity', label: 'Ethnicity', type: 'string', category: 'Personal' },

  // Contact
  { key: 'email', label: 'Military Email', type: 'string', category: 'Contact' },
  { key: 'personalEmail', label: 'Personal Email', type: 'string', category: 'Contact' },
  { key: 'phone', label: 'Phone', type: 'string', category: 'Contact' },
  { key: 'city', label: 'City', type: 'string', category: 'Contact' },
  { key: 'state', label: 'State', type: 'string', category: 'Contact' },
  { key: 'zipCode', label: 'ZIP Code', type: 'string', category: 'Contact' },

  // Military Service
  { key: 'branch', label: 'Branch', type: 'select', category: 'Service', options: ['Army', 'Navy', 'Air Force', 'Marines', 'Space Force', 'Coast Guard'] },
  { key: 'rank', label: 'Rank', type: 'string', category: 'Service' },
  { key: 'payGrade', label: 'Pay Grade', type: 'string', category: 'Service' },
  { key: 'mos', label: 'MOS', type: 'string', category: 'Service' },
  { key: 'activeStatus', label: 'Active Status', type: 'select', category: 'Service', options: ['Active', 'Reserve', 'Guard'] },
  { key: 'activeDutyBaseDate', label: 'Active Duty Base Date', type: 'date', category: 'Service' },
  { key: 'enlistmentDate', label: 'Enlistment Date', type: 'date', category: 'Service' },
  { key: 'estimatedTerminationDate', label: 'ETS Date', type: 'date', category: 'Service' },
  { key: 'yearsOfService', label: 'Years of Service', type: 'number', category: 'Service' },
  { key: 'dutyStation', label: 'Duty Station', type: 'string', category: 'Service' },
  { key: 'unit', label: 'Unit', type: 'string', category: 'Service' },
  { key: 'commandingOfficer', label: 'Commanding Officer', type: 'string', category: 'Service' },

  // Security
  { key: 'clearanceLevel', label: 'Clearance Level', type: 'select', category: 'Security', options: ['None', 'Confidential', 'Secret', 'Top Secret', 'TS-SCI'] },
  { key: 'clearanceDate', label: 'Clearance Date', type: 'date', category: 'Security' },
  { key: 'clearanceExpiry', label: 'Clearance Expiry', type: 'date', category: 'Security' },
  { key: 'polygraphDate', label: 'Polygraph Date', type: 'date', category: 'Security' },
  { key: 'polygraphType', label: 'Polygraph Type', type: 'select', category: 'Security', options: ['CI', 'Full Scope', 'Lifestyle', 'None'] },
  { key: 'specialAccess', label: 'Special Access Programs', type: 'array', category: 'Security' },
  { key: 'accessStatus', label: 'Access Status', type: 'select', category: 'Security', options: ['Active', 'Suspended', 'Revoked', 'Pending'] },
  { key: 'nda', label: 'NDA Signed', type: 'boolean', category: 'Security' },
  { key: 'foreignContacts', label: 'Foreign Contacts', type: 'number', category: 'Security' },
  { key: 'foreignTravel', label: 'Foreign Travel', type: 'array', category: 'Security' },
  { key: 'securityIncidents', label: 'Security Incidents', type: 'number', category: 'Security' },

  // Medical
  { key: 'medicalReadiness', label: 'Medical Readiness', type: 'select', category: 'Medical', options: ['Green', 'Yellow', 'Red'] },
  { key: 'dentalReadiness', label: 'Dental Readiness', type: 'select', category: 'Medical', options: ['Green', 'Yellow', 'Red'] },
  { key: 'dentalClass', label: 'Dental Class', type: 'select', category: 'Medical', options: ['1', '2', '3', '4'] },
  { key: 'lastPhysicalDate', label: 'Last Physical Date', type: 'date', category: 'Medical' },
  { key: 'nextPhysicalDue', label: 'Next Physical Due', type: 'date', category: 'Medical' },
  { key: 'deploymentEligible', label: 'Deployment Eligible', type: 'boolean', category: 'Medical' },
  { key: 'profileStatus', label: 'Profile Status', type: 'select', category: 'Medical', options: ['Fit', 'Limited', 'Non-deployable'] },
  { key: 'visionCategory', label: 'Vision Category', type: 'select', category: 'Medical', options: ['1', '2', '3', '4'] },
  { key: 'hearingCategory', label: 'Hearing Category', type: 'select', category: 'Medical', options: ['H1', 'H2', 'H3', 'H4'] },
  { key: 'hivStatus', label: 'HIV Status', type: 'select', category: 'Medical', options: ['Negative', 'Pending'] },
  { key: 'dnaOnFile', label: 'DNA On File', type: 'boolean', category: 'Medical' },
  { key: 'allergies', label: 'Allergies', type: 'array', category: 'Medical' },
  { key: 'medicalLimitations', label: 'Medical Limitations', type: 'array', category: 'Medical' },
  { key: 'mentalHealthStatus', label: 'Mental Health Status', type: 'select', category: 'Medical', options: ['Green', 'Yellow', 'Red'] },
  { key: 'substanceAbuseClear', label: 'Substance Abuse Clear', type: 'boolean', category: 'Medical' },

  // Training
  { key: 'basicTrainingComplete', label: 'Basic Training Complete', type: 'boolean', category: 'Training' },
  { key: 'basicTrainingDate', label: 'Basic Training Date', type: 'date', category: 'Training' },
  { key: 'aitComplete', label: 'AIT Complete', type: 'boolean', category: 'Training' },
  { key: 'aitDate', label: 'AIT Date', type: 'date', category: 'Training' },
  { key: 'aitMos', label: 'AIT MOS', type: 'string', category: 'Training' },
  { key: 'lastPtTestDate', label: 'Last PT Test Date', type: 'date', category: 'Training' },
  { key: 'ptTestScore', label: 'PT Test Score', type: 'number', category: 'Training' },
  { key: 'ptPushups', label: 'PT Pushups', type: 'number', category: 'Training' },
  { key: 'ptSitups', label: 'PT Situps', type: 'number', category: 'Training' },
  { key: 'ptRunTime', label: 'PT Run Time', type: 'string', category: 'Training' },
  { key: 'weaponsQualification', label: 'Weapons Qualification', type: 'select', category: 'Training', options: ['Marksman', 'Sharpshooter', 'Expert'] },
  { key: 'lastWeaponsQualDate', label: 'Last Weapons Qual Date', type: 'date', category: 'Training' },
  { key: 'schoolsAttended', label: 'Schools Attended', type: 'array', category: 'Training' },
  { key: 'totalTrainingHours', label: 'Total Training Hours', type: 'number', category: 'Training' },
  { key: 'annualTrainingComplete', label: 'Annual Training Complete', type: 'boolean', category: 'Training' },
  { key: 'annualTrainingDate', label: 'Annual Training Date', type: 'date', category: 'Training' },
  { key: 'specialSkills', label: 'Special Skills', type: 'array', category: 'Training' },
];

// Get operators available for a field type
export function getOperatorsForType(type: FieldType): { value: QueryOperator; label: string }[] {
  switch (type) {
    case 'string':
      return [
        { value: 'equals', label: 'equals' },
        { value: 'not_equals', label: 'does not equal' },
        { value: 'contains', label: 'contains' },
        { value: 'not_contains', label: 'does not contain' },
        { value: 'starts_with', label: 'starts with' },
        { value: 'ends_with', label: 'ends with' },
        { value: 'is_empty', label: 'is empty' },
        { value: 'is_not_empty', label: 'is not empty' },
      ];
    case 'number':
      return [
        { value: 'equals', label: 'equals' },
        { value: 'not_equals', label: 'does not equal' },
        { value: 'greater_than', label: 'greater than' },
        { value: 'less_than', label: 'less than' },
        { value: 'greater_or_equal', label: 'greater or equal' },
        { value: 'less_or_equal', label: 'less or equal' },
        { value: 'between', label: 'between' },
      ];
    case 'boolean':
      return [
        { value: 'is_true', label: 'is true' },
        { value: 'is_false', label: 'is false' },
      ];
    case 'date':
      return [
        { value: 'equals', label: 'equals' },
        { value: 'before', label: 'before' },
        { value: 'after', label: 'after' },
        { value: 'between', label: 'between' },
        { value: 'in_last_days', label: 'in last N days' },
        { value: 'in_next_days', label: 'in next N days' },
      ];
    case 'array':
      return [
        { value: 'contains', label: 'contains' },
        { value: 'not_contains', label: 'does not contain' },
        { value: 'is_empty', label: 'is empty' },
        { value: 'is_not_empty', label: 'is not empty' },
      ];
    case 'select':
      return [
        { value: 'equals', label: 'equals' },
        { value: 'not_equals', label: 'does not equal' },
        { value: 'in', label: 'is one of' },
        { value: 'not_in', label: 'is not one of' },
      ];
    default:
      return [];
  }
}

// Evaluate a single condition against a personnel record
function evaluateCondition(person: Personnel, condition: QueryCondition): boolean {
  const fieldMeta = QUERYABLE_FIELDS.find(f => f.key === condition.field);
  if (!fieldMeta) return true;

  const fieldValue = person[condition.field as keyof Personnel];
  const conditionValue = condition.value;

  switch (fieldMeta.type) {
    case 'string': {
      const strValue = String(fieldValue || '').toLowerCase();
      const compareValue = String(conditionValue || '').toLowerCase();

      switch (condition.operator as StringOperator) {
        case 'equals': return strValue === compareValue;
        case 'not_equals': return strValue !== compareValue;
        case 'contains': return strValue.includes(compareValue);
        case 'not_contains': return !strValue.includes(compareValue);
        case 'starts_with': return strValue.startsWith(compareValue);
        case 'ends_with': return strValue.endsWith(compareValue);
        case 'is_empty': return !fieldValue || strValue === '';
        case 'is_not_empty': return !!fieldValue && strValue !== '';
        default: return true;
      }
    }

    case 'number': {
      const numValue = Number(fieldValue) || 0;
      const compareValue = Number(conditionValue) || 0;
      const secondValue = Number(condition.secondValue) || 0;

      switch (condition.operator as NumberOperator) {
        case 'equals': return numValue === compareValue;
        case 'not_equals': return numValue !== compareValue;
        case 'greater_than': return numValue > compareValue;
        case 'less_than': return numValue < compareValue;
        case 'greater_or_equal': return numValue >= compareValue;
        case 'less_or_equal': return numValue <= compareValue;
        case 'between': return numValue >= compareValue && numValue <= secondValue;
        default: return true;
      }
    }

    case 'boolean': {
      const boolValue = Boolean(fieldValue);
      switch (condition.operator as BooleanOperator) {
        case 'is_true': return boolValue === true;
        case 'is_false': return boolValue === false;
        default: return true;
      }
    }

    case 'date': {
      const dateValue = fieldValue ? new Date(String(fieldValue)) : null;
      const compareDate = conditionValue ? new Date(String(conditionValue)) : null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (condition.operator as DateOperator) {
        case 'equals':
          return !!(dateValue && compareDate &&
            dateValue.toDateString() === compareDate.toDateString());
        case 'before':
          return !!(dateValue && compareDate && dateValue < compareDate);
        case 'after':
          return !!(dateValue && compareDate && dateValue > compareDate);
        case 'between': {
          const secondDate = condition.secondValue ? new Date(String(condition.secondValue)) : null;
          return !!(dateValue && compareDate && secondDate &&
            dateValue >= compareDate && dateValue <= secondDate);
        }
        case 'in_last_days': {
          if (!dateValue) return false;
          const daysAgo = new Date(today);
          daysAgo.setDate(daysAgo.getDate() - Number(conditionValue));
          return dateValue >= daysAgo && dateValue <= today;
        }
        case 'in_next_days': {
          if (!dateValue) return false;
          const daysAhead = new Date(today);
          daysAhead.setDate(daysAhead.getDate() + Number(conditionValue));
          return dateValue >= today && dateValue <= daysAhead;
        }
        default: return true;
      }
    }

    case 'array': {
      const arrValue = Array.isArray(fieldValue) ? fieldValue : [];
      const searchValue = String(conditionValue || '').toLowerCase();

      switch (condition.operator as ArrayOperator) {
        case 'contains':
          return arrValue.some(item =>
            String(item).toLowerCase().includes(searchValue)
          );
        case 'not_contains':
          return !arrValue.some(item =>
            String(item).toLowerCase().includes(searchValue)
          );
        case 'is_empty': return arrValue.length === 0;
        case 'is_not_empty': return arrValue.length > 0;
        default: return true;
      }
    }

    case 'select': {
      const selectValue = String(fieldValue || '');

      switch (condition.operator as SelectOperator) {
        case 'equals': return selectValue === conditionValue;
        case 'not_equals': return selectValue !== conditionValue;
        case 'in':
          return Array.isArray(conditionValue) && conditionValue.includes(selectValue);
        case 'not_in':
          return Array.isArray(conditionValue) && !conditionValue.includes(selectValue);
        default: return true;
      }
    }

    default:
      return true;
  }
}

// Evaluate a query group (with AND/OR logic)
function evaluateGroup(person: Personnel, group: QueryGroup): boolean {
  if (group.conditions.length === 0 && (!group.groups || group.groups.length === 0)) {
    return true; // Empty group matches all
  }

  const conditionResults = group.conditions.map(c => evaluateCondition(person, c));
  const groupResults = (group.groups || []).map(g => evaluateGroup(person, g));
  const allResults = [...conditionResults, ...groupResults];

  if (group.logic === 'AND') {
    return allResults.every(r => r);
  } else {
    return allResults.some(r => r);
  }
}

// Main function to execute a query against personnel data
export function executeQuery(data: Personnel[], query: QueryGroup): Personnel[] {
  if (!query || (query.conditions.length === 0 && (!query.groups || query.groups.length === 0))) {
    return data;
  }
  return data.filter(person => evaluateGroup(person, query));
}

// Helper to create empty condition
export function createEmptyCondition(): QueryCondition {
  return {
    id: crypto.randomUUID(),
    field: 'lastName',
    operator: 'contains',
    value: '',
  };
}

// Helper to create empty group
export function createEmptyGroup(logic: 'AND' | 'OR' = 'AND'): QueryGroup {
  return {
    id: crypto.randomUUID(),
    logic,
    conditions: [],
    groups: [],
  };
}

// Get field metadata by key
export function getFieldMeta(key: string): FieldMeta | undefined {
  return QUERYABLE_FIELDS.find(f => f.key === key);
}

// Group fields by category
export function getFieldsByCategory(): Record<string, FieldMeta[]> {
  return QUERYABLE_FIELDS.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, FieldMeta[]>);
}
