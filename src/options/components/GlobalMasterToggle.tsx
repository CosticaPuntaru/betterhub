import { Trans } from 'react-i18next';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';

interface GlobalMasterToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function GlobalMasterToggle({ enabled, onToggle }: GlobalMasterToggleProps) {
  return (
    <Card>
      <CardHeader>
        <label className="flex items-center gap-3 cursor-pointer">
          <Switch checked={enabled} onChange={(e) => onToggle(e.target.checked)} />
          <div className="flex items-center gap-2">
            <Trans i18nKey="options.enableBetterHubWithDesc">
              <CardTitle className="mb-0">Enable BetterHub</CardTitle>
              <span className="text-sm text-muted-foreground">, Turn on/off all BetterHub features</span>
            </Trans>
          </div>
        </label>
      </CardHeader>
    </Card>
  );
}


