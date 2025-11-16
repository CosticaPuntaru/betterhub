/**
 * Feature settings section component
 */

import type { FeatureSettingsSchema } from '../../shared/types/settings-ui';
import { renderFeatureSettings } from '../../shared/utils/settings-renderer';

export async function createFeatureSection(
  schema: FeatureSettingsSchema,
  container: HTMLElement
): Promise<void> {
  await renderFeatureSettings(schema, container);
}

