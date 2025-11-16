/**
 * Reusable setting field component
 * This is a utility module for creating setting fields programmatically
 */

import type { SettingField } from '../../shared/types/settings-ui';
import { getSettingValue, updateSettingValue } from '../../shared/utils/settings-renderer';

export async function createSettingField(field: SettingField): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.className = 'setting-field';
  container.dataset.settingKey = field.key;

  const label = document.createElement('label');
  label.className = 'setting-label';
  label.textContent = field.label;

  if (field.description) {
    const description = document.createElement('p');
    description.className = 'setting-description';
    description.textContent = field.description;
    container.appendChild(description);
  }

  const value = await getSettingValue(field);
  let input: HTMLElement;

  switch (field.type) {
    case 'checkbox': {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = Boolean(value);
      checkbox.addEventListener('change', async () => {
        await updateSettingValue(field, checkbox.checked);
      });
      input = checkbox;
      break;
    }
    case 'select': {
      const select = document.createElement('select');
      if (field.options) {
        field.options.forEach((option) => {
          const optionEl = document.createElement('option');
          optionEl.value = String(option.value);
          optionEl.textContent = option.label;
          optionEl.selected = value === option.value;
          select.appendChild(optionEl);
        });
      }
      select.addEventListener('change', async () => {
        await updateSettingValue(field, select.value);
      });
      input = select;
      break;
    }
    case 'number': {
      const numberInput = document.createElement('input');
      numberInput.type = 'number';
      numberInput.value = String(value ?? field.default);
      if (field.min !== undefined) numberInput.min = String(field.min);
      if (field.max !== undefined) numberInput.max = String(field.max);
      if (field.step !== undefined) numberInput.step = String(field.step);
      numberInput.addEventListener('change', async () => {
        await updateSettingValue(field, Number(numberInput.value));
      });
      input = numberInput;
      break;
    }
    case 'text':
    case 'textarea': {
      const textInput =
        field.type === 'textarea'
          ? document.createElement('textarea')
          : document.createElement('input');
      if (field.type === 'text') {
        (textInput as HTMLInputElement).type = 'text';
      }
      textInput.value = String(value ?? field.default);
      if (field.placeholder) {
        (textInput as HTMLInputElement | HTMLTextAreaElement).placeholder =
          field.placeholder;
      }
      textInput.addEventListener('change', async () => {
        await updateSettingValue(field, textInput.value);
      });
      input = textInput;
      break;
    }
    default:
      throw new Error(`Unsupported field type: ${field.type}`);
  }

  input.className = 'setting-input';
  label.appendChild(input);
  container.appendChild(label);
  return container;
}

