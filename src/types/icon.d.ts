import type { SVGSVGElement } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
    fill?: string;
    width?: number;
    height?: number;
}
