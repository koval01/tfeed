import type { PropsWithChildren } from "react";
import type { ClassValue } from "clsx";

import { cn } from "@/lib/utils";

interface FixedCenterProps extends PropsWithChildren {
    className?: ClassValue;
}

export const FixedCenter = ({ children, className }: FixedCenterProps) => (
    <div className={cn("fixed left-1/2", className ? className : "top-1/2")} style={{
        transform: "translate(-50%, -50%)"
    }}>
        {children}
    </div>
)
