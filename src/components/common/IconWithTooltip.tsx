import type { ReactNode } from "react";

const IconWithTooltip = ({
    icon,
    tooltip,
}: {
    icon: ReactNode;
    tooltip: string;
}) => (
    <div className="relative inline-flex items-center group">
        {icon}
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 hidden group-hover:flex whitespace-nowrap rounded bg-gray-800 text-white text-xs px-2 py-1 shadow-lg pointer-events-none">
            {tooltip}
        </div>
    </div>
);

export default IconWithTooltip;
