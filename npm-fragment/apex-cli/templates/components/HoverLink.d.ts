import React from "react";
interface HoverLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    animateOnScroll?: boolean;
    delay?: number;
    duration?: number;
    variant?: "default" | "wave";
}
/**
 * HoverLink component that combines a Link with an animated Line.
 * The line reveals on scroll (matching the site aesthetic) and
 * provides a hover expansion effect.
 */
export default function HoverLink({ href, children, className, animateOnScroll, delay, duration, variant, }: HoverLinkProps): any;
export {};
//# sourceMappingURL=HoverLink.d.ts.map