import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
export const Svg = forwardRef(({ paths, width = "100%", height = "100%", className = "", ...props }, ref) => {
    return (_jsx("svg", { ref: ref, viewBox: "0 0 575 250", stroke: "currentColor", width: width, height: height, fill: "currentColor", className: `scale-120 ${className}`, xmlns: "http://www.w3.org/2000/svg", ...props, children: paths.map((d, idx) => (_jsx("path", { d: d, strokeWidth: 0, stroke: "currentColor" }, idx))) }));
});
Svg.displayName = "Svg";
//# sourceMappingURL=Logo.js.map