"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { Svg } from "./Logo";
import { paths } from "../../public/svg/paths";
import { useLanguage } from "@/contexts/LanguageContext";

declare global {
  interface Window {
    __isPageTransitionComplete?: boolean;
  }
}

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setTriggerCover } = useLanguage();
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoOverlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // We'll store our block elements here
  const blocksRef = useRef<HTMLDivElement[]>([]);
  const isTransitioning = useRef(false);
  const isLanguageTransition = useRef(false);
  const revealTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animation to COVER the page (Transition Overlay comes in)
  const coverPage = useCallback(
    (url: string) => {
      if (overlayRef.current) {
        overlayRef.current.style.pointerEvents = "auto";
      }
      // Logo does NOT show here per request ("dont want to see the logo")

      gsap.set(blocksRef.current, { scaleY: 0, transformOrigin: "bottom" });

      gsap.to(blocksRef.current, {
        scaleY: 1,
        duration: 0.5,
        stagger: {
          each: 0.02,
          from: "end",
        },
        ease: "power2.inOut",
        transformOrigin: "bottom", // Grow from bottom
        onComplete: () => {
          // Navigate AFTER animation completes
          router.push(url);
        },
      });
    },
    [router]
  );

  // Identify internal links and trigger transition
  const handleRouteChange = useCallback(
    (url: string) => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;
      coverPage(url);
    },
    [coverPage]
  );

  // Animation to REVEAL the new page (Overlay goes away)
  const revealPage = useCallback(() => {
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
    }

    // Ensure blocks are full height initially, ready to shrink
    gsap.set(blocksRef.current, { scaleY: 1, transformOrigin: "top" });

    // Animate blocks scaling down to 0 (revealing content underneath)
    gsap.to(blocksRef.current, {
      scaleY: 0,
      duration: 0.5,
      stagger: {
        each: 0.02,
        from: "end",
      },
      ease: "power2.out",
      transformOrigin: "top", // Shrink upwards
      onComplete: () => {
        const wasLanguageTransition = isLanguageTransition.current;
        isTransitioning.current = false;
        isLanguageTransition.current = false;
        if (overlayRef.current) overlayRef.current.style.pointerEvents = "none";
        if (logoOverlayRef.current)
          logoOverlayRef.current.style.pointerEvents = "none";

        // Dispatch appropriate event
        if (wasLanguageTransition) {
          window.dispatchEvent(new CustomEvent("languageTransitionComplete"));
          window.__isPageTransitionComplete = true;
        } else {
          window.dispatchEvent(new CustomEvent("pageTransitionComplete"));
          window.__isPageTransitionComplete = true;
        }
      },
    });

    // Fallback/Cleanup to ensure interactions are restored
    revealTimeoutRef.current = setTimeout(() => {
      // Double check
      if (blocksRef.current.length > 0) {
        isTransitioning.current = false;
        isLanguageTransition.current = false;
      }
    }, 1200);
  }, []);

  // Cover page for language change (no navigation)
  const coverForLanguageChange = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    isLanguageTransition.current = true;

    if (overlayRef.current) {
      overlayRef.current.style.pointerEvents = "auto";
    }

    gsap.set(blocksRef.current, { scaleY: 0, transformOrigin: "bottom" });

    gsap.to(blocksRef.current, {
      scaleY: 1,
      duration: 0.5,
      stagger: {
        each: 0.02,
        from: "end",
      },
      ease: "power2.inOut",
      transformOrigin: "bottom",
      onComplete: () => {
        // Reset transition complete flag so components wait for the new transition
        // This happens AFTER the page is covered, so components stay visible until covered
        window.__isPageTransitionComplete = false;

        // Dispatch event that cover is complete (page is hidden)
        window.dispatchEvent(new CustomEvent("languageCoverComplete"));
        // Reveal immediately after cover completes
        revealPage();
      },
    });
  }, [revealPage]);

  // Register language transition function with context
  useEffect(() => {
    setTriggerCover(coverForLanguageChange);
  }, [setTriggerCover, coverForLanguageChange]);

  // Creation of blocks (ON MOUNT ONLY)
  useEffect(() => {
    const createBlocks = () => {
      if (!overlayRef.current) return;
      overlayRef.current.innerHTML = "";
      blocksRef.current = [];

      // Create 25 rows as requested
      const numberOfBlocks = 25;

      for (let i = 0; i < numberOfBlocks; i++) {
        const block = document.createElement("div");
        block.className = "block bg-[var(--transition-block-bg)]";
        block.style.width = "100%";
        block.style.height = `calc(${100 / numberOfBlocks}% + 1px)`;
        overlayRef.current.appendChild(block);
        blocksRef.current.push(block);
      }
    };

    createBlocks();

    // Initial State: Fully covering (ready to reveal)
    gsap.set(blocksRef.current, { scaleY: 1, transformOrigin: "top" }); // Start fully covering

    // (Moved logo setup into intro sequence)

    const isFirstLoad = !sessionStorage.getItem("hasVisited");

    if (isFirstLoad) {
      sessionStorage.setItem("hasVisited", "true");
      if (logoOverlayRef.current) {
        gsap.set(logoOverlayRef.current, { opacity: 1, pointerEvents: "auto" });

        const tl = gsap.timeline({
          onComplete: () => {
            gsap.delayedCall(0.5, exitSequence);
          },
        });

        // 1. Initial State for intro
        gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left" });

        // 2. Logo Setup (reuse existing logic)
        if (logoRef.current) {
          const logoPaths = logoRef.current.querySelectorAll("path");
          logoPaths.forEach((path) => {
            const p = path as SVGPathElement;
            const length = p.getTotalLength();
            gsap.set(p, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
            tl.to(
              p,
              {
                strokeDashoffset: 0,
                duration: 0.5,
                ease: "power3.out",
              },
              0
            );
          });
        }

        // 3. (REMOVED) Counter & Progress Fill
        // proxy/counter logic removed per request

        function exitSequence() {
          const exitTl = gsap.timeline({
            onComplete: () => {
              revealPage();
            },
          });

          // Horizontal Slide Exit for digits (Laser Style with Individual Clipping)
          const digits = document.querySelectorAll(
            ".slot .digit, .slot .percent-symbol"
          );

          exitTl.to(digits, {
            x: "-105%",
            duration: 0.8,
            stagger: 0.05,
            ease: "power3.out",
          });

          // Fade out everything else
          exitTl.to(
            [logoOverlayRef.current],
            {
              opacity: 0,
              duration: 0.8,
              ease: "power2.inOut",
            },
            "<"
          );
        }
      }
    } else {
      // Just reveal immediately
      if (logoOverlayRef.current)
        gsap.set(logoOverlayRef.current, { opacity: 0 });
      revealPage();
    }

    const handleBodyClick = (e: MouseEvent) => {
      // recursive check for anchor
      let target = e.target as HTMLElement | null;
      while (target && target.tagName !== "A") {
        target = target.parentElement;
      }

      if (target && target.tagName === "A") {
        const anchor = target as HTMLAnchorElement;

        // Logic extracted from onAnchorClick:
        if (
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0 ||
          anchor.target === "_blank"
        ) {
          return;
        }

        const href = anchor.href;
        const currentUrl = window.location.href;

        const targetUrlObj = new URL(href);
        const currentUrlObj = new URL(currentUrl);

        if (targetUrlObj.origin !== currentUrlObj.origin) return;

        e.preventDefault(); // Correctly prevent default on the ACTUAL event
        e.stopPropagation(); // Stop Next.js Link from handling it

        const url = targetUrlObj.pathname + targetUrlObj.search;

        if (url !== pathname) {
          handleRouteChange(url);
        }
      }
    };

    document.addEventListener("click", handleBodyClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleBodyClick, { capture: true });
      if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    };
  }, [pathname, handleRouteChange, revealPage]);

  // Effect to trigger Reveal on Pathname Change (Transition completion)
  useEffect(() => {
    if (isTransitioning.current) {
      window.scrollTo(0, 0);
      revealPage();
    }
  }, [pathname, revealPage]);

  return (
    <>
      <div ref={overlayRef} className="transition-overlay" />
      <div ref={logoOverlayRef} className="logo-overlay bg-[#D4CFCB]">
        <div className="logo-container mb-20">
          <Svg
            paths={paths}
            ref={logoRef}
            className="text-[var(--text-primary)]"
          />
        </div>

        {/* Loader elements (Counter/Progress) removed per request */}
      </div>
      {children}
    </>
  );
};

export default PageTransition;
