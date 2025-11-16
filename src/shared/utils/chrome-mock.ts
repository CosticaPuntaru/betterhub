/**
 * Mock Chrome APIs for development
 * This allows the options page to run in a regular browser
 * Only activates if chrome.storage.sync is not available
 */

// Only mock if we're not in a Chrome extension context
if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.sync) {
  // Mock chrome.storage API using localStorage
  // Create a mock storage change event system
  const storageListeners: Array<(changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => void> = [];
  
  // Helper to trigger storage change events
  const triggerStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
    storageListeners.forEach(listener => {
      listener(changes, 'sync');
    });
  };

  (window as any).chrome = {
    storage: {
      sync: {
        get: (keys: string | string[] | { [key: string]: any } | null, callback?: (items: { [key: string]: any }) => void) => {
          const result: { [key: string]: any } = {};
          let keysArray: string[] = [];

          if (keys === null) {
            // Get all keys
            keysArray = Object.keys(localStorage).filter(key => key.startsWith('settings') || key === 'settings');
          } else if (Array.isArray(keys)) {
            keysArray = keys;
          } else if (typeof keys === 'object') {
            keysArray = Object.keys(keys);
          } else if (typeof keys === 'string') {
            keysArray = [keys];
          }

          keysArray.forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
              try {
                result[key] = JSON.parse(value);
              } catch (e) {
                result[key] = value;
              }
            }
          });

          if (callback) {
            callback(result);
          }
          return Promise.resolve(result);
        },
        set: (items: { [key: string]: any }, callback?: () => void) => {
          const changes: { [key: string]: chrome.storage.StorageChange } = {};
          
          Object.keys(items).forEach(key => {
            const oldValue = localStorage.getItem(key);
            const newValue = items[key];
            localStorage.setItem(key, JSON.stringify(newValue));
            
            changes[key] = {
              oldValue: oldValue ? JSON.parse(oldValue) : undefined,
              newValue: newValue,
            };
          });
          
          // Trigger storage change event
          if (Object.keys(changes).length > 0) {
            triggerStorageChange(changes);
          }
          
          if (callback) {
            callback();
          }
          return Promise.resolve();
        },
        remove: (keys: string | string[], callback?: () => void) => {
          const keysArray = Array.isArray(keys) ? keys : [keys];
          const changes: { [key: string]: chrome.storage.StorageChange } = {};
          
          keysArray.forEach(key => {
            const oldValue = localStorage.getItem(key);
            if (oldValue) {
              changes[key] = {
                oldValue: JSON.parse(oldValue),
                newValue: undefined,
              };
            }
            localStorage.removeItem(key);
          });
          
          // Trigger storage change event
          if (Object.keys(changes).length > 0) {
            triggerStorageChange(changes);
          }
          
          if (callback) {
            callback();
          }
          return Promise.resolve();
        },
        clear: (callback?: () => void) => {
          const changes: { [key: string]: chrome.storage.StorageChange } = {};
          
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('settings') || key === 'settings') {
              const oldValue = localStorage.getItem(key);
              if (oldValue) {
                changes[key] = {
                  oldValue: JSON.parse(oldValue),
                  newValue: undefined,
                };
              }
              localStorage.removeItem(key);
            }
          });
          
          // Trigger storage change event
          if (Object.keys(changes).length > 0) {
            triggerStorageChange(changes);
          }
          
          if (callback) {
            callback();
          }
          return Promise.resolve();
        },
      },
      onChanged: {
        addListener: (callback: (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => void) => {
          storageListeners.push(callback);
        },
        removeListener: (callback: (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => void) => {
          const index = storageListeners.indexOf(callback);
          if (index > -1) {
            storageListeners.splice(index, 1);
          }
        },
        hasListener: (callback: (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => void) => {
          return storageListeners.includes(callback);
        },
      },
    },
    runtime: {
      id: 'dev-mode-extension-id',
      onInstalled: {
        addListener: () => {},
      },
    },
  };
}

