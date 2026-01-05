import React from "react";
interface RevealProps {
    children: React.ReactNode;
    animateOnScroll?: boolean;
    delay?: number;
    className?: string;
    stagger?: number;
    forceReady?: boolean;
}
/**
 * Reveal component for non-text block animations.
 * Provides a slide-up reveal effect for its children.
 * Synchronized with 'pageTransitionComplete' global event.
 */
export default function Reveal({ children, animateOnScroll, delay, className, stagger, forceReady, }: RevealProps): any;
export {};
//# sourceMappingURL=Reveal.d.ts.map