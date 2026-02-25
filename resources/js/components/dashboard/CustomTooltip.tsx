import { TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

export const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-background p-3 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                <p className="mb-2 text-sm font-semibold text-foreground">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span
                            className="h-2 w-2 rounded-full shadow-sm"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="font-medium">{entry.name}:</span>
                        <span className="text-foreground font-bold font-mono">
                            {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};
