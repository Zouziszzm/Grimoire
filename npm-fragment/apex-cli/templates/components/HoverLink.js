"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import Link from "next/link";
import Line from "./Line";
import WaveLine from "./WaveLine";
/**
 * HoverLink component that combines a Link with an animated Line.
 * The line reveals on scroll (matching the site aesthetic) and
 * provides a hover expansion effect.
 */
export default function HoverLink({ href, children, className = "", animateOnScroll = true, delay = 0, duration = 1.2, variant = "default", }) {
    return (_jsx("div", { className: `w-fit group ${className}`, children: _jsx(Link, { href: href, children: _jsxs("div", { className: "relative pb-1", children: [children, variant === "wave" ? (_jsx("div", { className: "absolute bottom-[-1px] lg:bottom-[-4px] left-0 w-full overflow-hidden text-[var(--text-primary)] transition-colors duration-700", children: _jsx(WaveLine, {}) })) : (_jsxs("div", { className: "absolute bottom-0 left-0 w-full overflow-hidden", children: [_jsx(Line, { animateOnScroll: animateOnScroll, delay: delay, duration: duration, className: "transition-all duration-700 ease-in-out group-hover:bg-[var(--text-primary)]" }), _jsx("div", { className: "absolute top-0 left-0 h-px bg-[var(--text-primary)] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] -translate-x-full group-hover:translate-x-0 w-full" })] }))] }) }) }));
}
//# sourceMappingURL=HoverLink.js.map