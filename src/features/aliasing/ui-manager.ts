/**
 * UI Manager for alias list management
 * Renders custom UI for managing aliases in the options page
 */

import type { AliasItem, AliasType } from './types';
import { settingsManager } from '../../shared/utils/settings-manager';
import { generateDeterministicColor } from './utils';
import { showTwoInputDialog } from '../../shared/utils/modal-dialog';

/**
 * Render alias list management UI
 */
export async function renderAliasList(
  container: HTMLElement,
  aliasType: AliasType,
  settingKey: string
): Promise<void> {
  const settings = await settingsManager.getSettings();
  const aliasing = settings.aliasing;
  if (!aliasing) return;
  
  const section = document.createElement('div');
  section.className = 'alias-list-section';
  section.dataset.aliasType = aliasType;
  section.dataset.settingKey = settingKey;

  const header = document.createElement('h3');
  header.className = 'alias-list-header';
  header.textContent = `${aliasType.charAt(0).toUpperCase() + aliasType.slice(1)} Aliases`;
  section.appendChild(header);

  const listContainer = document.createElement('div');
  listContainer.className = 'alias-list-container';
  listContainer.dataset.aliasType = aliasType;
  listContainer.dataset.settingKey = settingKey;

  // Function to refresh the list
  const refreshList = async () => {
    console.log(`[Aliasing UI] Refreshing ${aliasType} list...`);
    const currentSettings = await settingsManager.getSettings();
    const currentAliasing = currentSettings.aliasing;
    if (!currentAliasing) {
      console.log(`[Aliasing UI] No aliasing settings found`);
      return;
    }
    
    const currentList = currentAliasing[`${aliasType}s` as 'users' | 'projects' | 'orgs'] || [];
    console.log(`[Aliasing UI] Found ${currentList.length} ${aliasType} aliases in settings`);
    
    // Clear existing items
    listContainer.innerHTML = '';
    
    // Render all aliases
    for (const alias of currentList) {
      const aliasElement = await createAliasItemElement(alias, aliasType, settingKey);
      listContainer.appendChild(aliasElement);
    }
    
    console.log(`[Aliasing UI] Rendered ${currentList.length} ${aliasType} aliases`);
  };

  // Render existing aliases
  await refreshList();

  // Listen for settings changes to refresh the list
  settingsManager.subscribe(async (updatedSettings) => {
    console.log(`[Aliasing UI] Settings changed, refreshing ${aliasType} list...`);
    const updatedAliasing = updatedSettings.aliasing;
    if (updatedAliasing) {
      const updatedList = updatedAliasing[`${aliasType}s` as 'users' | 'projects' | 'orgs'] || [];
      console.log(`[Aliasing UI] Updated ${aliasType} list has ${updatedList.length} items`);
    }
    await refreshList();
  });

  // Add button
  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'alias-add-button';
  addButton.textContent = `Add ${aliasType}`;
  addButton.addEventListener('click', () => {
    handleAddAlias(aliasType, settingKey, listContainer);
  });

  section.appendChild(listContainer);
  section.appendChild(addButton);
  container.appendChild(section);
}

/**
 * Create an alias item element
 */
async function createAliasItemElement(
  alias: AliasItem,
  aliasType: AliasType,
  settingKey: string
): Promise<HTMLElement> {
  const item = document.createElement('div');
  item.className = 'alias-item';
  item.dataset.original = alias.original;

  // Enable/disable toggle
  const enabledLabel = document.createElement('label');
  enabledLabel.className = 'alias-enabled-label';
  const enabledCheckbox = document.createElement('input');
  enabledCheckbox.type = 'checkbox';
  enabledCheckbox.className = 'alias-enabled-checkbox';
  enabledCheckbox.checked = alias.enabled;
  enabledCheckbox.addEventListener('change', async () => {
    await updateAliasItem(alias.original, aliasType, { enabled: enabledCheckbox.checked });
  });
  enabledLabel.appendChild(enabledCheckbox);
  enabledLabel.appendChild(document.createTextNode(' Enabled'));
  item.appendChild(enabledLabel);

  // Original name (read-only)
  const originalDiv = document.createElement('div');
  originalDiv.className = 'alias-original';
  originalDiv.textContent = `Original: ${alias.original}`;
  item.appendChild(originalDiv);

  // Alias input (this is the text that will replace the original on the page)
  const aliasLabel = document.createElement('label');
  aliasLabel.className = 'alias-input-label';
  aliasLabel.textContent = alias.color ? 'Display Text:' : 'Alias Name:';
  const aliasInput = document.createElement('input');
  aliasInput.type = 'text';
  aliasInput.className = 'alias-input';
  aliasInput.value = alias.alias;
  aliasInput.placeholder = 'Text to display on page';
  aliasInput.addEventListener('change', async () => {
    await updateAliasItem(alias.original, aliasType, { alias: aliasInput.value });
    // Update preview if it exists
    const preview = item.querySelector('.alias-preview');
    if (preview) {
      preview.textContent = aliasInput.value || 'Preview';
    }
  });
  aliasLabel.appendChild(aliasInput);
  item.appendChild(aliasLabel);

  // Display type selector (color+text OR icon)
  const displayTypeLabel = document.createElement('label');
  displayTypeLabel.className = 'alias-display-type-label';
  displayTypeLabel.textContent = 'Display:';
  const displayTypeSelect = document.createElement('select');
  displayTypeSelect.className = 'alias-display-type-select';
  const colorOption = document.createElement('option');
  colorOption.value = 'color';
  colorOption.textContent = 'Color + Text';
  const iconOption = document.createElement('option');
  iconOption.value = 'icon';
  iconOption.textContent = 'Icon';
  displayTypeSelect.appendChild(colorOption);
  displayTypeSelect.appendChild(iconOption);
  displayTypeSelect.value = alias.color ? 'color' : 'icon';
  displayTypeSelect.addEventListener('change', async () => {
    if (displayTypeSelect.value === 'color') {
      // Switch to color, remove icon
      const color = alias.color || generateDeterministicColor(alias.original);
      await updateAliasItem(alias.original, aliasType, { color, icon: undefined });
      await refreshAliasItem(item, alias.original, aliasType, settingKey);
    } else {
      // Switch to icon, remove color
      await updateAliasItem(alias.original, aliasType, { icon: alias.icon || '', color: undefined });
      await refreshAliasItem(item, alias.original, aliasType, settingKey);
    }
  });
  displayTypeLabel.appendChild(displayTypeSelect);
  item.appendChild(displayTypeLabel);

  // Color picker and text (if using color+text)
  if (alias.color) {
    const colorLabel = document.createElement('label');
    colorLabel.className = 'alias-color-label';
    colorLabel.textContent = 'Color:';
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.className = 'alias-color-input';
    colorInput.value = alias.color;
    colorInput.addEventListener('change', async () => {
      await updateAliasItem(alias.original, aliasType, { color: colorInput.value });
      // Update preview color
      const preview = item.querySelector('.alias-preview') as HTMLElement;
      if (preview) {
        preview.style.backgroundColor = colorInput.value;
      }
    });
    colorLabel.appendChild(colorInput);
    item.appendChild(colorLabel);
    
    // Preview of colored text
    const preview = document.createElement('div');
    preview.className = 'alias-preview';
    preview.style.backgroundColor = alias.color;
    preview.style.color = '#fff';
    preview.style.padding = '4px 8px';
    preview.style.borderRadius = '3px';
    preview.style.display = 'inline-block';
    preview.style.marginTop = '8px';
    preview.textContent = alias.alias || 'Preview';
    item.appendChild(preview);
    
    // Update preview when alias text changes
    aliasInput.addEventListener('input', () => {
      preview.textContent = aliasInput.value || 'Preview';
    });
  }

  // Icon options (if using icon)
  if (!alias.color) {
    const iconContainer = document.createElement('div');
    iconContainer.className = 'alias-icon-container';
    
    // For users: option to use actual user photo
    if (aliasType === 'user') {
      const useActualPhotoLabel = document.createElement('label');
      useActualPhotoLabel.className = 'alias-use-actual-photo-label';
      const useActualPhotoCheckbox = document.createElement('input');
      useActualPhotoCheckbox.type = 'checkbox';
      useActualPhotoCheckbox.className = 'alias-use-actual-photo-checkbox';
      // Check if icon is empty or undefined (meaning use actual photo)
      useActualPhotoCheckbox.checked = !alias.icon || alias.icon === '';
      useActualPhotoCheckbox.addEventListener('change', async () => {
        if (useActualPhotoCheckbox.checked) {
          // Use actual photo (empty icon means use actual)
          await updateAliasItem(alias.original, aliasType, { icon: '' });
          // Hide custom icon inputs
          const urlInput = iconContainer.querySelector('.alias-icon-url-input') as HTMLInputElement;
          const fileInput = iconContainer.querySelector('.alias-icon-file-input') as HTMLInputElement;
          if (urlInput) urlInput.style.display = 'none';
          if (fileInput) fileInput.style.display = 'none';
        } else {
          // Show custom icon inputs
          const urlInput = iconContainer.querySelector('.alias-icon-url-input') as HTMLInputElement;
          const fileInput = iconContainer.querySelector('.alias-icon-file-input') as HTMLInputElement;
          if (urlInput) urlInput.style.display = 'block';
          if (fileInput) fileInput.style.display = 'block';
        }
      });
      useActualPhotoLabel.appendChild(useActualPhotoCheckbox);
      useActualPhotoLabel.appendChild(document.createTextNode(' Use actual user photo'));
      iconContainer.appendChild(useActualPhotoLabel);
    }
    
    // Icon URL input
    const iconUrlLabel = document.createElement('label');
    iconUrlLabel.className = 'alias-icon-url-label';
    iconUrlLabel.textContent = 'Icon URL:';
    const iconUrlInput = document.createElement('input');
    iconUrlInput.type = 'text';
    iconUrlInput.className = 'alias-icon-url-input';
    iconUrlInput.placeholder = 'https://example.com/icon.png';
    iconUrlInput.value = alias.icon && alias.icon !== '' ? alias.icon : '';
    iconUrlInput.style.display = (aliasType === 'user' && (!alias.icon || alias.icon === '')) ? 'none' : 'block';
    iconUrlInput.addEventListener('change', async () => {
      await updateAliasItem(alias.original, aliasType, { icon: iconUrlInput.value });
      // Update preview
      const preview = iconContainer.querySelector('.alias-icon-preview') as HTMLImageElement;
      if (preview && iconUrlInput.value) {
        preview.src = iconUrlInput.value;
        preview.style.display = 'block';
      } else if (preview && !iconUrlInput.value) {
        preview.style.display = 'none';
      } else if (iconUrlInput.value) {
        // Create preview if it doesn't exist
        const newPreview = document.createElement('img');
        newPreview.className = 'alias-icon-preview';
        newPreview.src = iconUrlInput.value;
        newPreview.style.width = '32px';
        newPreview.style.height = '32px';
        newPreview.style.borderRadius = '4px';
        newPreview.style.marginTop = '8px';
        newPreview.style.display = 'block';
        iconContainer.appendChild(newPreview);
      }
    });
    iconUrlLabel.appendChild(iconUrlInput);
    iconContainer.appendChild(iconUrlLabel);
    
    // File upload for icon
    const iconFileLabel = document.createElement('label');
    iconFileLabel.className = 'alias-icon-file-label';
    iconFileLabel.textContent = 'Upload Icon:';
    const iconFileInput = document.createElement('input');
    iconFileInput.type = 'file';
    iconFileInput.className = 'alias-icon-file-input';
    iconFileInput.accept = 'image/*';
    iconFileInput.style.display = (aliasType === 'user' && (!alias.icon || alias.icon === '')) ? 'none' : 'block';
    iconFileInput.addEventListener('change', async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Convert to data URL
        const reader = new FileReader();
        reader.onloadend = async () => {
          const dataUrl = reader.result as string;
          await updateAliasItem(alias.original, aliasType, { icon: dataUrl });
          iconUrlInput.value = dataUrl;
          // Update preview
          const preview = iconContainer.querySelector('.alias-icon-preview') as HTMLImageElement;
          if (preview) {
            preview.src = dataUrl;
            preview.style.display = 'block';
          } else {
            // Create preview
            const newPreview = document.createElement('img');
            newPreview.className = 'alias-icon-preview';
            newPreview.src = dataUrl;
            newPreview.style.width = '32px';
            newPreview.style.height = '32px';
            newPreview.style.borderRadius = '4px';
            newPreview.style.marginTop = '8px';
            newPreview.style.display = 'block';
            iconContainer.appendChild(newPreview);
          }
        };
        reader.readAsDataURL(file);
      }
    });
    iconFileLabel.appendChild(iconFileInput);
    iconContainer.appendChild(iconFileLabel);
    
    // Icon preview
    if (alias.icon && alias.icon !== '') {
      const iconPreview = document.createElement('img');
      iconPreview.className = 'alias-icon-preview';
      iconPreview.src = alias.icon;
      iconPreview.style.width = '32px';
      iconPreview.style.height = '32px';
      iconPreview.style.borderRadius = '4px';
      iconPreview.style.marginTop = '8px';
      iconPreview.style.display = 'block';
      iconContainer.appendChild(iconPreview);
    }
    
    item.appendChild(iconContainer);
  }

  // Delete button
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'alias-delete-button';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', async () => {
    await deleteAliasItem(alias.original, aliasType);
    item.remove();
  });
  item.appendChild(deleteButton);

  return item;
}

/**
 * Refresh an alias item element
 */
async function refreshAliasItem(
  item: HTMLElement,
  original: string,
  aliasType: AliasType,
  settingKey: string
): Promise<void> {
  const settings = await settingsManager.getSettings();
  const aliasing = settings.aliasing;
  if (!aliasing) return;

  const aliasList = aliasing[`${aliasType}s` as 'users' | 'projects' | 'orgs'] || [];
  const alias = aliasList.find(a => a.original === original);
  if (!alias) return;

  // Remove and recreate the item
  const parent = item.parentElement;
  if (parent) {
    item.remove();
    const newItem = await createAliasItemElement(alias, aliasType, settingKey);
    parent.appendChild(newItem);
  }
}

/**
 * Handle adding a new alias
 */
async function handleAddAlias(
  aliasType: AliasType,
  settingKey: string,
  container: HTMLElement
): Promise<void> {
  const result = await showTwoInputDialog(
    `Add ${aliasType.charAt(0).toUpperCase() + aliasType.slice(1)} Alias`,
    `Original ${aliasType} name:`,
    `Enter the original ${aliasType} name`,
    '',
    'Alias name:',
    'Enter the alias to display'
  );
  
  if (!result) return;
  
  const [original, alias] = result;
  if (!original || !alias) return;

  // Check if item already exists
  const settings = await settingsManager.getSettings();
  const aliasing = settings.aliasing;
  if (aliasing) {
    const aliasList = aliasing[`${aliasType}s` as 'users' | 'projects' | 'orgs'] || [];
    const existing = aliasList.find(
      a => a.original.toLowerCase() === original.toLowerCase()
    );
    if (existing) {
      alert(`This ${aliasType} already exists in your aliases. Please edit the existing entry instead.`);
      return;
    }
  }

  // Determine default display type
  let color: string | undefined;
  let icon: string | undefined;

  if (aliasType === 'user') {
    // For users, default to icon (will be set when avatar is found)
    icon = '';
  } else {
    // For projects/orgs, default to color+acronym
    color = generateDeterministicColor(original);
  }

  const newAlias: AliasItem = {
    original: original.trim(),
    alias: alias.trim(),
    enabled: true,
    color,
    icon,
  };

  await addAliasItem(newAlias, aliasType);
  
  // Add to UI
  const aliasElement = await createAliasItemElement(newAlias, aliasType, settingKey);
  container.appendChild(aliasElement);
}

/**
 * Update an alias item
 */
async function updateAliasItem(
  original: string,
  aliasType: AliasType,
  updates: Partial<AliasItem>
): Promise<void> {
  const settings = await settingsManager.getSettings();
  const aliasing = settings.aliasing;
  if (!aliasing) return;

  const aliasList = aliasing[`${aliasType}s` as 'users' | 'projects' | 'orgs'] || [];
  const index = aliasList.findIndex(a => a.original === original);
  
  if (index === -1) return;

  aliasList[index] = { ...aliasList[index], ...updates };
  
  await settingsManager.updateSettings({
    aliasing: {
      ...aliasing,
      [`${aliasType}s`]: aliasList,
    },
  });
}

/**
 * Add an alias item
 */
async function addAliasItem(alias: AliasItem, aliasType: AliasType): Promise<void> {
  const settings = await settingsManager.getSettings();
  const aliasing = settings.aliasing || {
    users: [],
    projects: [],
    orgs: [],
    autoHarvestUsers: false,
    autoHarvestProjects: false,
    autoHarvestOrgs: false,
    harvestOrgWhitelist: 'all' as const,
    harvestRepoWhitelist: 'all' as const,
    autoAliasUsers: false,
    autoAliasProjects: false,
    autoAliasOrgs: false,
  };

  const aliasList = aliasing[`${aliasType}s` as 'users' | 'projects' | 'orgs'] || [];
  
  // Check if already exists (case-insensitive)
  const existing = aliasList.find(
    a => a.original.toLowerCase() === alias.original.toLowerCase()
  );
  
  if (existing) {
    // Item already exists - don't add duplicate
    console.log(`[Aliasing] Item "${alias.original}" already exists, skipping duplicate`);
    return;
  }

  aliasList.push(alias);
  
  await settingsManager.updateSettings({
    aliasing: {
      ...aliasing,
      [`${aliasType}s`]: aliasList,
    },
  });
}

/**
 * Delete an alias item
 */
async function deleteAliasItem(original: string, aliasType: AliasType): Promise<void> {
  const settings = await settingsManager.getSettings();
  const aliasing = settings.aliasing;
  if (!aliasing) return;

  const aliasList = aliasing[`${aliasType}s` as 'users' | 'projects' | 'orgs'] || [];
  const filtered = aliasList.filter(a => a.original !== original);
  
  await settingsManager.updateSettings({
    aliasing: {
      ...aliasing,
      [`${aliasType}s`]: filtered,
    },
  });
}

