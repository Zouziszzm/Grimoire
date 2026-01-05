"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

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
export default function Copy({
  children,
  animateOnScroll = false,
  delay = 0,
  className = "",
  stagger = 0.1,
  forceReady,
}: CopyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eventReady, setEventReady] = useState(() => {
    if (typeof window !== "undefined") {
      // Check if page transition already completed or if this is a re-mount after language change
      return window.__isPageTransitionComplete || false;
    }
    return false;
  });

  // Explicit check for undefined to distinguish between "not passed" and "passed as false"
  const isReady = forceReady !== undefined ? forceReady : eventReady;

  // Sync with PageTransition and Language changes
  useEffect(() => {
    // Only bother with event listener if we don't have a manual override
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
      if (!containerRef.current || !isReady) return;

      let elements: HTMLElement[] = [];
      if (containerRef.current.hasAttribute("data-copy-wrapper")) {
        elements = Array.from(containerRef.current.children) as HTMLElement[];
      } else {
        elements = [containerRef.current];
      }

      const allLines: HTMLElement[] = [];
      const splits: SplitType[] = [];

      elements.forEach((element) => {
        const split = new SplitType(element, {
          types: "lines",
          lineClass: "line",
        });
        splits.push(split);

        if (split.lines) {
          split.lines.forEach((line) => {
            const wrapper = document.createElement("div");
            wrapper.className = "line-mask";
            wrapper.style.overflow = "hidden";
            wrapper.style.display = "block";

            line.parentNode?.insertBefore(wrapper, line);
            wrapper.appendChild(line);
            allLines.push(line);
          });
        }

        const computedStyle = window.getComputedStyle(element);
        const textIndent = computedStyle.textIndent;
        if (textIndent && textIndent !== "0px" && split.lines?.[0]) {
          split.lines[0].style.paddingLeft = textIndent;
          element.style.textIndent = "0";
        }
      });

      gsap.set(allLines, { y: "100%" });

      const animationProps = {
        y: "0%",
        duration: 1,
        stagger: stagger,
        ease: "power4.out",
        delay: delay,
      };

      if (animateOnScroll) {
        let hasAnimated = false;

        const animate = () => {
          if (hasAnimated) return;
          hasAnimated = true;
          gsap.to(allLines, animationProps);
        };

        // Check if already in viewport
        const rect = containerRef.current.getBoundingClientRect();
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

          observer.observe(containerRef.current);

          // Cleanup
          return () => observer.disconnect();
        }
      } else {
        gsap.to(allLines, animationProps);
      }

      return () => {
        // Kill all ScrollTriggers associated with this component
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === containerRef.current) {
            trigger.kill();
          }
        });

        splits.forEach((s) => s.revert());

        // CRITICAL CLEANUP: Remove custom "line-mask" wrappers.
        // We must restore the DOM to its original state so the next
        // mount/trigger can split fresh text.
        if (containerRef.current) {
          const masks = containerRef.current.querySelectorAll(".line-mask");
          masks.forEach((mask) => {
            while (mask.firstChild) {
              mask.parentNode?.insertBefore(mask.firstChild, mask);
            }
            mask.remove();
          });
        }
      };
    },
    {
      scope: containerRef,
      dependencies: [isReady, animateOnScroll, delay],
    }
  );

  return (
    <div
      ref={containerRef}
      data-copy-wrapper={React.Children.count(children) > 1 ? "true" : "false"}
      className={className}
      style={{ opacity: isReady ? 1 : 0 }}
    >
      {children}
    </div>
  );
}
