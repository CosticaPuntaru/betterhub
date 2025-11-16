/**
 * UI Manager for harvest whitelist (orgs and repos)
 */

import { settingsManager } from '../../shared/utils/settings-manager';
import type { AliasingSettings } from './types';

/**
 * Render harvest whitelist UI
 */
export async function renderHarvestWhitelist(
  container: HTMLElement,
  whitelistType: 'org' | 'repo',
  _settingKey: string
): Promise<void> {
  const section = document.createElement('div');
  section.className = 'harvest-whitelist-section';
  section.dataset.whitelistType = whitelistType;

  const header = document.createElement('h4');
  header.className = 'harvest-whitelist-header';
  header.textContent = whitelistType === 'org' ? 'Organization Whitelist' : 'Repository Whitelist';
  section.appendChild(header);

  const description = document.createElement('p');
  description.className = 'harvest-whitelist-description';
  description.textContent = whitelistType === 'org'
    ? 'Only harvest items when browsing pages in these organizations (or select "Allow All")'
    : 'Only harvest items when browsing pages in these repositories (or select "Allow All")';
  section.appendChild(description);

  // Allow All checkbox
  const allowAllContainer = document.createElement('div');
  allowAllContainer.className = 'harvest-allow-all-container';
  const allowAllLabel = document.createElement('label');
  allowAllLabel.className = 'harvest-allow-all-label';
  const allowAllCheckbox = document.createElement('input');
  allowAllCheckbox.type = 'checkbox';
  allowAllCheckbox.className = 'harvest-allow-all-checkbox';
  
  const settings = await settingsManager.getSettings();
  const aliasing = settings.aliasing;
  const whitelistKey = whitelistType === 'org' ? 'harvestOrgWhitelist' : 'harvestRepoWhitelist';
  const currentWhitelist = aliasing?.[whitelistKey];
  allowAllCheckbox.checked = currentWhitelist === 'all';
  
  allowAllCheckbox.addEventListener('change', async () => {
    const updatedSettings = await settingsManager.getSettings();
    const updatedAliasing = updatedSettings.aliasing || {} as AliasingSettings;
    
    if (allowAllCheckbox.checked) {
      await settingsManager.updateSettings({
        aliasing: {
          ...updatedAliasing,
          [whitelistKey]: 'all',
        },
      });
      // Clear the list container
      listContainer.innerHTML = '';
    } else {
      // Switch to empty array
      await settingsManager.updateSettings({
        aliasing: {
          ...updatedAliasing,
          [whitelistKey]: [],
        },
      });
      // Refresh the list
      await refreshList();
    }
  });
  
  allowAllLabel.appendChild(allowAllCheckbox);
  allowAllLabel.appendChild(document.createTextNode(' Allow All'));
  allowAllContainer.appendChild(allowAllLabel);
  section.appendChild(allowAllContainer);

  // List container
  const listContainer = document.createElement('div');
  listContainer.className = 'harvest-whitelist-container';
  section.appendChild(listContainer);

  // Add form (only show if not "Allow All")
  const addForm = document.createElement('form');
  addForm.className = 'harvest-whitelist-add-form';
  addForm.style.display = allowAllCheckbox.checked ? 'none' : 'flex';
  addForm.style.gap = '8px';
  addForm.style.alignItems = 'flex-end';
  addForm.style.marginTop = '12px';

  const inputContainer = document.createElement('div');
  inputContainer.style.flex = '1';
  inputContainer.style.display = 'flex';
  inputContainer.style.flexDirection = 'column';
  inputContainer.style.gap = '4px';

  const inputLabel = document.createElement('label');
  inputLabel.textContent = whitelistType === 'org' ? 'Organization name:' : 'Repository name (format: owner/repo):';
  inputLabel.style.cssText = `
    font-size: 13px;
    font-weight: 500;
    color: #24292e;
  `;

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'harvest-whitelist-input';
  nameInput.placeholder = whitelistType === 'repo' ? 'owner/repo' : 'organization-name';
  nameInput.style.cssText = `
    padding: 6px 8px;
    font-size: 14px;
    border: 1px solid #d1d5da;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
  `;
  nameInput.addEventListener('focus', () => {
    nameInput.style.borderColor = '#0366d6';
    nameInput.style.boxShadow = '0 0 0 3px rgba(3, 102, 214, 0.1)';
  });
  nameInput.addEventListener('blur', () => {
    nameInput.style.borderColor = '#d1d5da';
    nameInput.style.boxShadow = 'none';
  });

  inputLabel.appendChild(nameInput);
  inputContainer.appendChild(inputLabel);
  addForm.appendChild(inputContainer);

  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.className = 'harvest-whitelist-add-btn';
  addButton.textContent = 'Add';
  addButton.style.cssText = `
    padding: 6px 16px;
    font-size: 14px;
    font-weight: 500;
    border: 1px solid #28a745;
    border-radius: 4px;
    background-color: #28a745;
    color: #ffffff;
    cursor: pointer;
    white-space: nowrap;
  `;
  addButton.addEventListener('mouseenter', () => {
    addButton.style.backgroundColor = '#22863a';
    addButton.style.borderColor = '#22863a';
  });
  addButton.addEventListener('mouseleave', () => {
    addButton.style.backgroundColor = '#28a745';
    addButton.style.borderColor = '#28a745';
  });

  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    
    if (!name) return;

    const currentSettings = await settingsManager.getSettings();
    const currentAliasing = currentSettings.aliasing || {} as AliasingSettings;
    const currentList = Array.isArray(currentAliasing[whitelistKey]) 
      ? (currentAliasing[whitelistKey] as string[])
      : [];

    // Check for duplicates
    if (currentList.some(item => item.toLowerCase() === name.toLowerCase())) {
      alert(`This ${whitelistType} is already in the whitelist.`);
      nameInput.focus();
      return;
    }

    // Add to list
    const updatedList = [...currentList, name];
    await settingsManager.updateSettings({
      aliasing: {
        ...currentAliasing,
        [whitelistKey]: updatedList,
      },
    });

    // Clear input and refresh the list
    nameInput.value = '';
    await refreshList();
    nameInput.focus();
  });

  addForm.appendChild(addButton);
  section.appendChild(addForm);

  // Function to refresh the list
  const refreshList = async () => {
    const currentSettings = await settingsManager.getSettings();
    const currentAliasing = currentSettings.aliasing || {} as AliasingSettings;
    const currentList = Array.isArray(currentAliasing[whitelistKey])
      ? (currentAliasing[whitelistKey] as string[])
      : [];

    // Update allow all checkbox
    allowAllCheckbox.checked = currentAliasing[whitelistKey] === 'all';
    addForm.style.display = allowAllCheckbox.checked ? 'none' : 'flex';

    // Clear existing items
    listContainer.innerHTML = '';

    // Render all items
    for (const item of currentList) {
      const itemElement = document.createElement('div');
      itemElement.className = 'harvest-whitelist-item';
      itemElement.dataset.item = item;

      const itemText = document.createElement('span');
      itemText.className = 'harvest-whitelist-item-text';
      itemText.textContent = item;
      itemElement.appendChild(itemText);

      const deleteButton = document.createElement('button');
      deleteButton.className = 'harvest-whitelist-delete-btn';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', async () => {
        const currentSettings = await settingsManager.getSettings();
        const currentAliasing = currentSettings.aliasing || {} as AliasingSettings;
        const currentList = Array.isArray(currentAliasing[whitelistKey])
          ? (currentAliasing[whitelistKey] as string[])
          : [];

        const updatedList = currentList.filter(i => i.toLowerCase() !== item.toLowerCase());
        await settingsManager.updateSettings({
          aliasing: {
            ...currentAliasing,
            [whitelistKey]: updatedList,
          },
        });

        // Refresh the list
        await refreshList();
      });
      itemElement.appendChild(deleteButton);

      listContainer.appendChild(itemElement);
    }
  };

  // Initial render
  await refreshList();

  // Listen for settings changes
  settingsManager.subscribe(async () => {
    await refreshList();
  });

  container.appendChild(section);
}

