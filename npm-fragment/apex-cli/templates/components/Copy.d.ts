import React from "react";
interface CopyProps {
    children: React.ReactNode;
    animateOnScroll?: boolean;
    delay?: number;
    className?: string;
    stagger?: number;
    forceReady?: boolean;
}
/**
 * Copy component (high-fidelity text reveal)
 * Mimics GSAP SplitText behavior using split-type.
 * Syncs with PageTransition via 'pageTransitionComplete' event
 * or can be manually triggered via 'forceReady'.
 */
export default function Copy({ children, animateOnScroll, delay, className, stagger, forceReady, }: CopyProps): any;
export {};
//# sourceMappingURL=Copy.d.ts.map