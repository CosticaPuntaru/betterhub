/**
 * Feature registry and metadata
 * This file is auto-populated as features are registered
 */

import { featureRegistry } from '../utils/feature-registry';

/**
 * Get all registered features
 */
export function getAllFeatures() {
  return featureRegistry.getAll();
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures() {
  return featureRegistry.getEnabled();
}

/**
 * Get all features with settings
 */
export function getFeaturesWithSettings() {
  return featureRegistry.getWithSettings();
}

