import { useState } from 'react';
import { Trans } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Select } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { X, Plus } from 'lucide-react';
import type { Settings } from '../../shared/types/settings';

interface GlobalMasterToggleProps {
  enableMode: 'on' | 'off' | 'allowlist';
  allowlist: string[];
  onUpdate: (settings: Partial<Settings>) => void;
}

export function GlobalMasterToggle({ enableMode, allowlist, onUpdate }: GlobalMasterToggleProps) {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim()) {
      onUpdate({ allowlist: [...allowlist, newItem.trim()] });
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    const newList = [...allowlist];
    newList.splice(index, 1);
    onUpdate({ allowlist: newList });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="mb-0">Enable BetterHub</CardTitle>
            <span className="text-sm text-muted-foreground">
              <Trans i18nKey="options.enableBetterHubDesc">
                , Control where BetterHub is active
              </Trans>
            </span>
          </div>
          <Select
            value={enableMode}
            onChange={(e) => onUpdate({ enableMode: e.target.value as 'on' | 'off' | 'allowlist' })}
            className="w-40"
          >
            <option value="on">On (Everywhere)</option>
            <option value="off">Off</option>
            <option value="allowlist">Allowlist Only</option>
          </Select>
        </div>
      </CardHeader>

      {enableMode === 'allowlist' && (
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Add repositories (owner/repo) or organizations (owner) where BetterHub should be active.
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="e.g. microsoft/vscode or google"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button onClick={handleAddItem} disabled={!newItem.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="space-y-2 mt-4">
              {allowlist.length === 0 ? (
                <div className="text-sm text-muted-foreground italic text-center py-4 border border-dashed rounded-md">
                  No items in allowlist. Extension will not run anywhere.
                </div>
              ) : (
                <div className="grid gap-2">
                  {allowlist.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-secondary/50 rounded-md border">
                      <span className="font-mono text-sm">{item}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}


