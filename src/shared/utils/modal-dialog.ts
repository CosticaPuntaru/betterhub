/**
 * Utility for creating modal dialogs with forms
 */

/**
 * Show a modal dialog with a text input
 * Returns a promise that resolves with the entered value or null if cancelled
 */
export function showTextInputDialog(
  title: string,
  label: string,
  placeholder?: string,
  defaultValue?: string
): Promise<string | null> {
  return new Promise((resolve) => {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-dialog';
    modal.style.cssText = `
      background-color: #ffffff;
      border-radius: 6px;
      padding: 24px;
      min-width: 400px;
      max-width: 500px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    `;

    // Create title
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    titleEl.style.cssText = `
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
      color: #24292e;
    `;
    modal.appendChild(titleEl);

    // Create form
    const form = document.createElement('form');
    form.style.cssText = 'display: flex; flex-direction: column; gap: 16px;';

    // Create label
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    labelEl.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: #24292e;
    `;

    // Create input
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder || '';
    input.value = defaultValue || '';
    input.style.cssText = `
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid #d1d5da;
      border-radius: 4px;
      width: 100%;
      box-sizing: border-box;
    `;
    input.addEventListener('focus', () => {
      input.style.borderColor = '#0366d6';
      input.style.boxShadow = '0 0 0 3px rgba(3, 102, 214, 0.1)';
    });
    input.addEventListener('blur', () => {
      input.style.borderColor = '#d1d5da';
      input.style.boxShadow = 'none';
    });

    labelEl.appendChild(input);
    form.appendChild(labelEl);

    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    `;

    // Create cancel button
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid #d1d5da;
      border-radius: 4px;
      background-color: #ffffff;
      color: #24292e;
      cursor: pointer;
    `;
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(overlay);
      resolve(null);
    });
    cancelButton.addEventListener('mouseenter', () => {
      cancelButton.style.backgroundColor = '#f6f8fa';
    });
    cancelButton.addEventListener('mouseleave', () => {
      cancelButton.style.backgroundColor = '#ffffff';
    });

    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Add';
    submitButton.style.cssText = `
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid #28a745;
      border-radius: 4px;
      background-color: #28a745;
      color: #ffffff;
      cursor: pointer;
    `;
    submitButton.addEventListener('mouseenter', () => {
      submitButton.style.backgroundColor = '#22863a';
      submitButton.style.borderColor = '#22863a';
    });
    submitButton.addEventListener('mouseleave', () => {
      submitButton.style.backgroundColor = '#28a745';
      submitButton.style.borderColor = '#28a745';
    });

    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(submitButton);
    form.appendChild(buttonsContainer);

    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = input.value.trim();
      if (value) {
        document.body.removeChild(overlay);
        resolve(value);
      }
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
        resolve(null);
      }
    });

    // Close on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', escapeHandler);
        resolve(null);
      }
    };
    document.addEventListener('keydown', escapeHandler);

    modal.appendChild(form);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Focus input
    setTimeout(() => input.focus(), 0);
  });
}

/**
 * Show a modal dialog with two text inputs
 * Returns a promise that resolves with [value1, value2] or null if cancelled
 */
export function showTwoInputDialog(
  title: string,
  label1: string,
  placeholder1?: string,
  defaultValue1?: string,
  label2: string = '',
  placeholder2?: string,
  defaultValue2?: string
): Promise<[string, string] | null> {
  return new Promise((resolve) => {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-dialog';
    modal.style.cssText = `
      background-color: #ffffff;
      border-radius: 6px;
      padding: 24px;
      min-width: 400px;
      max-width: 500px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    `;

    // Create title
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    titleEl.style.cssText = `
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
      color: #24292e;
    `;
    modal.appendChild(titleEl);

    // Create form
    const form = document.createElement('form');
    form.style.cssText = 'display: flex; flex-direction: column; gap: 16px;';

    // Create first input
    const label1El = document.createElement('label');
    label1El.textContent = label1;
    label1El.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: #24292e;
      display: flex;
      flex-direction: column;
      gap: 4px;
    `;

    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.placeholder = placeholder1 || '';
    input1.value = defaultValue1 || '';
    input1.style.cssText = `
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid #d1d5da;
      border-radius: 4px;
      width: 100%;
      box-sizing: border-box;
    `;
    input1.addEventListener('focus', () => {
      input1.style.borderColor = '#0366d6';
      input1.style.boxShadow = '0 0 0 3px rgba(3, 102, 214, 0.1)';
    });
    input1.addEventListener('blur', () => {
      input1.style.borderColor = '#d1d5da';
      input1.style.boxShadow = 'none';
    });

    label1El.appendChild(input1);
    form.appendChild(label1El);

    // Create second input if label2 is provided
    let input2: HTMLInputElement | null = null;
    if (label2) {
      const label2El = document.createElement('label');
      label2El.textContent = label2;
      label2El.style.cssText = `
        font-size: 14px;
        font-weight: 500;
        color: #24292e;
        display: flex;
        flex-direction: column;
        gap: 4px;
      `;

      input2 = document.createElement('input');
      input2.type = 'text';
      input2.placeholder = placeholder2 || '';
      input2.value = defaultValue2 || '';
      input2.style.cssText = `
        padding: 8px 12px;
        font-size: 14px;
        border: 1px solid #d1d5da;
        border-radius: 4px;
        width: 100%;
        box-sizing: border-box;
      `;
      input2.addEventListener('focus', () => {
        if (input2) {
          input2.style.borderColor = '#0366d6';
          input2.style.boxShadow = '0 0 0 3px rgba(3, 102, 214, 0.1)';
        }
      });
      input2.addEventListener('blur', () => {
        if (input2) {
          input2.style.borderColor = '#d1d5da';
          input2.style.boxShadow = 'none';
        }
      });

      label2El.appendChild(input2);
      form.appendChild(label2El);
    }

    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    `;

    // Create cancel button
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid #d1d5da;
      border-radius: 4px;
      background-color: #ffffff;
      color: #24292e;
      cursor: pointer;
    `;
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(overlay);
      resolve(null);
    });
    cancelButton.addEventListener('mouseenter', () => {
      cancelButton.style.backgroundColor = '#f6f8fa';
    });
    cancelButton.addEventListener('mouseleave', () => {
      cancelButton.style.backgroundColor = '#ffffff';
    });

    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Add';
    submitButton.style.cssText = `
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid #28a745;
      border-radius: 4px;
      background-color: #28a745;
      color: #ffffff;
      cursor: pointer;
    `;
    submitButton.addEventListener('mouseenter', () => {
      submitButton.style.backgroundColor = '#22863a';
      submitButton.style.borderColor = '#22863a';
    });
    submitButton.addEventListener('mouseleave', () => {
      submitButton.style.backgroundColor = '#28a745';
      submitButton.style.borderColor = '#28a745';
    });

    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(submitButton);
    form.appendChild(buttonsContainer);

    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value1 = input1.value.trim();
      const value2 = input2 ? input2.value.trim() : '';
      if (value1 && (!label2 || value2)) {
        document.body.removeChild(overlay);
        resolve([value1, value2]);
      }
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
        resolve(null);
      }
    });

    // Close on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', escapeHandler);
        resolve(null);
      }
    };
    document.addEventListener('keydown', escapeHandler);

    modal.appendChild(form);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Focus first input
    setTimeout(() => input1.focus(), 0);
  });
}

