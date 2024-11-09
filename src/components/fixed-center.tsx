import { PropsWithChildren } from "react";

export const FixedCenter = ({ children }: PropsWithChildren) => (
    <div className="fixed top-1/2 left-1/2" style={{
        transform: "translate(-50%, -50%)"
    }}>
        {children}
    </div>
)
