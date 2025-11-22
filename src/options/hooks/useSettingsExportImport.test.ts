import { renderHook, act } from '@testing-library/react';
import { useSettingsExportImport } from './useSettingsExportImport';
import { useSettingsStore } from '../store/settings-store';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock the store
vi.mock('../store/settings-store', () => ({
    useSettingsStore: vi.fn(),
}));

describe('useSettingsExportImport', () => {
    const mockUpdateSettings = vi.fn();
    const mockResetSettings = vi.fn();
    const mockSettings = { theme: 'dark', language: 'en' };

    beforeEach(() => {
        vi.clearAllMocks();
        (useSettingsStore as any).mockReturnValue({
            settings: mockSettings,
            updateSettings: mockUpdateSettings,
            resetSettings: mockResetSettings,
        });

        // Mock window.confirm and alert
        global.confirm = vi.fn();
        global.alert = vi.fn();

        // Mock URL.createObjectURL and URL.revokeObjectURL
        global.URL.createObjectURL = vi.fn();
        global.URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should export settings', async () => {
        const { result } = renderHook(() => useSettingsExportImport());

        // Mock document.createElement and appendChild
        const mockAnchor = {
            href: '',
            download: '',
            click: vi.fn(),
        };
        const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
        const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor as any);
        const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockAnchor as any);

        await act(async () => {
            await result.current.handleExport();
        });

        expect(global.URL.createObjectURL).toHaveBeenCalled();
        expect(mockAnchor.click).toHaveBeenCalled();
        expect(global.alert).toHaveBeenCalledWith('Settings exported successfully!');

        createElementSpy.mockRestore();
        appendChildSpy.mockRestore();
        removeChildSpy.mockRestore();
    });

    it('should reset settings after confirmation', async () => {
        (global.confirm as any).mockReturnValue(true);
        const { result } = renderHook(() => useSettingsExportImport());

        await act(async () => {
            await result.current.handleReset();
        });

        expect(mockResetSettings).toHaveBeenCalled();
        expect(global.alert).toHaveBeenCalledWith('All settings have been reset to defaults!');
    });

    it('should not reset settings if not confirmed', async () => {
        (global.confirm as any).mockReturnValue(false);
        const { result } = renderHook(() => useSettingsExportImport());

        await act(async () => {
            await result.current.handleReset();
        });

        expect(mockResetSettings).not.toHaveBeenCalled();
    });
});
