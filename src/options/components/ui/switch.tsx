import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> { }

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, disabled, ...props }, ref) => {
    return (
      <label className={cn("inline-flex items-center cursor-pointer", disabled && "opacity-50 cursor-not-allowed")}>
        <input
          type="checkbox"
          className="sr-only peer"
          ref={ref}
          checked={checked}
          disabled={disabled}
          {...props}
        />
        <div
          className={cn(
            "relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600",
            className
          )}
        />
      </label>
    );
  }
);
Switch.displayName = 'Switch';

export { Switch };

