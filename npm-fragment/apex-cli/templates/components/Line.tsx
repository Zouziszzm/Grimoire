"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface LineProps {
  animateOnScroll?: boolean;
  delay?: number;
  className?: string;
  forceReady?: boolean;
  duration?: number;
}

/**
 * Line component for animated horizontal line reveals.
 * Animates width from 0 to 100% with a smooth expansion effect.
 * Synchronized with 'pageTransitionComplete' and 'languageTransitionComplete' global events.
 */
export default function Line({
  animateOnScroll = false,
  delay = 0,
  className = "",
  forceReady,
  duration = 1.2,
}: LineProps) {
  const lineRef = useRef<HTMLDivElement>(null);
  const [eventReady, setEventReady] = useState(() => {
    if (typeof window !== "undefined") {
      return window.__isPageTransitionComplete || false;
    }
    return false;
  });

  const isReady = forceReady !== undefined ? forceReady : eventReady;

  useEffect(() => {
    if (forceReady !== undefined) return;
    if (eventReady) return;

    const handleReady = () => setEventReady(true);
    const handleLanguageReady = () => setEventReady(true);

    window.addEventListener("pageTransitionComplete", handleReady);
    window.addEventListener("languageTransitionComplete", handleLanguageReady);

    const timer = setTimeout(() => setEventReady(true), 10000);

    return () => {
      window.removeEventListener("pageTransitionComplete", handleReady);
      window.removeEventListener(
        "languageTransitionComplete",
        handleLanguageReady
      );
      clearTimeout(timer);
    };
  }, [forceReady, eventReady]);

  useGSAP(
    () => {
      if (!lineRef.current || !isReady) return;

      // Initial state: width 0
      gsap.set(lineRef.current, {
        width: "0%",
      });

      const animationProps = {
        width: "100%",
        duration: duration,
        ease: "power3.out",
        delay: delay,
      };

      if (animateOnScroll) {
        let hasAnimated = false;

        const animate = () => {
          if (hasAnimated) return;
          hasAnimated = true;
          gsap.to(lineRef.current, animationProps);
        };

        // Check if already in viewport
        const rect = lineRef.current.getBoundingClientRect();
        const isInView =
          rect.top < window.innerHeight * 0.8 && rect.top > -rect.height;

        if (isInView) {
          // Animate immediately if in view
          animate();
        } else {
          // Use Intersection Observer to detect when element comes into view
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  animate();
                  observer.disconnect();
                }
              });
            },
            {
              threshold: 0.1,
              rootMargin: "0px 0px -20% 0px",
            }
          );

          observer.observe(lineRef.current);

          // Cleanup
          return () => observer.disconnect();
        }
      } else {
        gsap.to(lineRef.current, animationProps);
      }
    },
    {
      scope: lineRef,
      dependencies: [isReady, animateOnScroll, delay, duration],
    }
  );

  return (
    <div
      ref={lineRef}
      className={`h-px bg-[var(--text-secondary)]/50 ${className}`}
      style={{ opacity: isReady ? 1 : 0 }}
    />
  );
}
