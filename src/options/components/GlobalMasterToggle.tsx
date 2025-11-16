import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface GlobalMasterToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function GlobalMasterToggle({ enabled, onToggle }: GlobalMasterToggleProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Enable BetterHub</CardTitle>
            <CardDescription>Turn on/off all BetterHub features</CardDescription>
          </div>
          <Switch checked={enabled} onChange={(e) => onToggle(e.target.checked)} />
        </div>
      </CardHeader>
    </Card>
  );
}


