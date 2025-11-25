import React from 'react';
import { Languages } from 'lucide-react';
import { Select } from './ui/select';
import { useSettingsStore } from '../store/settings-store';
import { setLanguage } from '../../shared/utils/i18n';

export function LanguageSelector() {

    const { settings, updateSettings } = useSettingsStore();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        updateSettings({ language: newLang });
        setLanguage(newLang);
    };

    return (
        <div className="flex items-center gap-1">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <Select
                value={settings.language || 'en'}
                onChange={handleChange}
                className="h-8 w-20 text-sm p-0"
            >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
                <option value="de">DE</option>
                <option value="ro">RO</option>
            </Select>
        </div>
    );
}
