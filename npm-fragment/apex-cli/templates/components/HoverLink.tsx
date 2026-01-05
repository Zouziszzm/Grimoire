"use client";

import React from "react";
import Link from "next/link";
import Line from "./Line";

interface HoverLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  animateOnScroll?: boolean;
  delay?: number;
  duration?: number;
  variant?: "default" | "wave";
}

import WaveLine from "./WaveLine";

/**
 * HoverLink component that combines a Link with an animated Line.
 * The line reveals on scroll (matching the site aesthetic) and
 * provides a hover expansion effect.
 */
export default function HoverLink({
  href,
  children,
  className = "",
  animateOnScroll = true,
  delay = 0,
  duration = 1.2,
  variant = "default",
}: HoverLinkProps) {
  return (
    <div className={`w-fit group ${className}`}>
      <Link href={href}>
        <div className="relative pb-1">
          {children}
          {variant === "wave" ? (
            <div className="absolute bottom-[-1px] lg:bottom-[-4px] left-0 w-full overflow-hidden text-[var(--text-primary)] transition-colors duration-700">
              <WaveLine />
            </div>
          ) : (
            <div className="absolute bottom-0 left-0 w-full overflow-hidden">
              <Line
                animateOnScroll={animateOnScroll}
                delay={delay}
                duration={duration}
                className="transition-all duration-700 ease-in-out group-hover:bg-[var(--text-primary)]"
              />
              {/* 
                Optional: If we want a dynamic expansion effect where a 
                second line slides over the first one:
              */}
              <div className="absolute top-0 left-0 h-px bg-[var(--text-primary)] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] -translate-x-full group-hover:translate-x-0 w-full" />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
