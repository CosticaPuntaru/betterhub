/**
 * Feature registry and lifecycle management
 */

import type { FeatureSettingsSchema } from '../types/settings-ui';

export interface Feature {
  id: string;
  displayName: string;
  description?: string;
  enabled: boolean;
  settingsSchema?: FeatureSettingsSchema;
  initialize?: () => Promise<void> | void;
  cleanup?: () => Promise<void> | void;
}

class FeatureRegistry {
  private features: Map<string, Feature> = new Map();

  /**
   * Register a feature
   */
  register(feature: Feature): void {
    this.features.set(feature.id, feature);
  }

  /**
   * Get all registered features
   */
  getAll(): Feature[] {
    return Array.from(this.features.values());
  }

  /**
   * Get a feature by ID
   */
  get(id: string): Feature | undefined {
    return this.features.get(id);
  }

  /**
   * Get all enabled features
   */
  getEnabled(): Feature[] {
    return this.getAll().filter((f) => f.enabled);
  }

  /**
   * Get all features with settings schemas
   */
  getWithSettings(): Feature[] {
    return this.getAll().filter((f) => f.settingsSchema);
  }

  /**
   * Enable a feature
   */
  async enable(id: string): Promise<void> {
    const feature = this.features.get(id);
    if (feature) {
      feature.enabled = true;
      if (feature.initialize) {
        await feature.initialize();
      }
    }
  }

  /**
   * Disable a feature
   */
  async disable(id: string): Promise<void> {
    const feature = this.features.get(id);
    if (feature) {
      feature.enabled = false;
      if (feature.cleanup) {
        await feature.cleanup();
      }
    }
  }
}

// Export singleton instance
export const featureRegistry = new FeatureRegistry();

