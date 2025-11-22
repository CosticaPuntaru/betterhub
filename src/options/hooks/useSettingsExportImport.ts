import { useSettingsStore } from '../store/settings-store';

export function useSettingsExportImport() {
    const { settings, updateSettings, resetSettings } = useSettingsStore();

    function showNotification(message: string, _type: 'success' | 'error') {
        // Simple notification - can be enhanced with a toast component later
        alert(message);
    }

    async function handleExport() {
        try {
            const exportData = {
                version: '1.0.0',
                exportDate: new Date().toISOString(),
                settings,
            };

            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `betterhub-settings-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showNotification('Settings exported successfully!', 'success');
        } catch (error) {
            console.error('Export failed:', error);
            showNotification('Failed to export settings. Please try again.', 'error');
        }
    }

    async function handleImport(file: File) {
        try {
            const text = await file.text();
            const importData = JSON.parse(text);

            if (!importData.settings || typeof importData.settings !== 'object') {
                throw new Error('Invalid settings file format');
            }

            const confirmed = window.confirm(
                'This will replace all your current settings. Are you sure you want to continue?'
            );

            if (!confirmed) {
                return;
            }

            // Update Zustand store (will sync to extension if in extension mode)
            updateSettings(importData.settings);

            sessionStorage.setItem('importSuccess', 'true');
            window.location.reload();
        } catch (error) {
            console.error('Import failed:', error);
            showNotification(
                `Failed to import settings: ${error instanceof Error ? error.message : 'Invalid file format'}`,
                'error'
            );
        }
    }

    async function handleReset() {
        try {
            const confirmed = window.confirm(
                'This will reset ALL settings to their default values. This action cannot be undone. Are you sure you want to continue?'
            );

            if (!confirmed) {
                return;
            }

            resetSettings();

            showNotification('All settings have been reset to defaults!', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Reset failed:', error);
            showNotification('Failed to reset settings. Please try again.', 'error');
        }
    }

    return {
        handleExport,
        handleImport,
        handleReset,
    };
}
