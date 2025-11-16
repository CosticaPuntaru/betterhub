/**
 * Types for settings UI schema
 * Defines the structure for declarative settings UI
 */

export type SettingFieldType =
  | 'checkbox'
  | 'select'
  | 'number'
  | 'text'
  | 'textarea'
  | 'radio'
  | 'alias-list'
  | 'harvest-whitelist';

export interface SettingOption {
  value: string | number;
  label: string;
}

export interface SettingField {
  key: string; // Path in settings object, e.g., 'prList.hideLabels'
  type: SettingFieldType;
  label: string; // Translation key for label
  description?: string; // Translation key for description
  default: unknown;
  options?: SettingOption[]; // For select/radio types
  min?: number; // For number type
  max?: number; // For number type
  step?: number; // For number type
  placeholder?: string; // For text/textarea types
  validation?: (value: unknown) => string | null; // Returns error message or null
}

export interface PageToggle {
  pageId: string; // e.g., 'pulls', 'issues'
  label: string; // Translation key
  description?: string; // Translation key
}

export interface FeatureSettingsSchema {
  featureId: string;
  displayName: string; // Translation key
  description?: string; // Translation key
  pages?: PageToggle[]; // Pages this feature can be enabled on
  fields: SettingField[];
}

