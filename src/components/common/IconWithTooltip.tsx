import type { ReactNode } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const IconWithTooltip = ({
    icon,
    tooltip,
}: {
    icon: ReactNode;
    tooltip: string;
}) => (

    <Tooltip>
        <TooltipTrigger>
            {icon}
        </TooltipTrigger>
        <TooltipContent side="right">
            <p>{tooltip}</p>
        </TooltipContent>
    </Tooltip>
);

export default IconWithTooltip;
