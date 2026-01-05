"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);
/**
 * Reveal component for non-text block animations.
 * Provides a slide-up reveal effect for its children.
 * Synchronized with 'pageTransitionComplete' global event.
 */
export default function Reveal({ children, animateOnScroll = true, delay = 0, className = "", stagger = 0.1, forceReady, }) {
    const containerRef = useRef(null);
    const [eventReady, setEventReady] = useState(() => {
        if (typeof window !== "undefined") {
            return window.__isPageTransitionComplete || false;
        }
        return false;
    });
    const isReady = forceReady !== undefined ? forceReady : eventReady;
    useEffect(() => {
        if (forceReady !== undefined)
            return;
        if (eventReady)
            return;
        const handleReady = () => setEventReady(true);
        window.addEventListener("pageTransitionComplete", handleReady);
        const timer = setTimeout(() => setEventReady(true), 10000);
        return () => {
            window.removeEventListener("pageTransitionComplete", handleReady);
            clearTimeout(timer);
        };
    }, [forceReady, eventReady]);
    const [isInitialized, setIsInitialized] = useState(false);
    useGSAP(() => {
        if (!containerRef.current || !isReady)
            return;
        const elements = Array.from(containerRef.current.children);
        // Initial state: hide
        gsap.set(elements, {
            opacity: 0,
            y: 0,
            clipPath: "none",
        });
        setIsInitialized(true);
        const animationProps = {
            opacity: 1,
            duration: 1.5,
            stagger: stagger,
            ease: "sine.out",
            delay: delay,
        };
        if (animateOnScroll) {
            gsap.to(elements, {
                ...animationProps,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                    once: true,
                },
            });
        }
        else {
            gsap.to(elements, animationProps);
        }
    }, {
        scope: containerRef,
        dependencies: [isReady, animateOnScroll, delay],
    });
    return (_jsx("div", { ref: containerRef, className: className, style: {
            // Hide entire container until GSAP has initialized the state of children
            visibility: isInitialized ? "visible" : "hidden",
            opacity: isInitialized ? 1 : 0,
        }, children: children }));
}
//# sourceMappingURL=Reveal.js.map