import { Info } from 'lucide-react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
    return (
        <div className="relative inline-flex group">
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                {content}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
            </div>
        </div>
    );
}

interface InfoIconProps {
    tooltip: string;
}

export function InfoIcon({ tooltip }: InfoIconProps) {
    return (
        <Tooltip content={tooltip}>
            <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-help" />
        </Tooltip>
    );
}
