"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLanguage } from "@/contexts/LanguageContext";

import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GithubStatsProps {
  stats: { year: number; count: number }[];
}

const GithubStats: React.FC<GithubStatsProps> = ({ stats }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useGSAP(
    () => {
      const rows = containerRef.current?.querySelectorAll(".stat-row");

      const animate = () => {
        if (rows && rows.length > 0) {
          gsap.fromTo(
            rows,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
              },
            }
          );
        }
      };

      animate();

      const handleTransitionComplete = () => {
        ScrollTrigger.refresh();
      };

      window.addEventListener(
        "pageTransitionComplete",
        handleTransitionComplete
      );
      window.addEventListener(
        "languageTransitionComplete",
        handleTransitionComplete
      );

      return () => {
        window.removeEventListener(
          "pageTransitionComplete",
          handleTransitionComplete
        );
        window.removeEventListener(
          "languageTransitionComplete",
          handleTransitionComplete
        );
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-8">
      <h2
        className={`text-[18px] font-medium opacity-60 ${
          language === "jp" ? "font-['Noto_Sans_JP']" : ""
        }`}
      >
        {language === "jp" ? "活動記録" : "Contribution History"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
        {stats
          .filter((s) => s.year >= 2022)
          .map((stat) => (
            <div
              key={stat.year}
              className="stat-row flex items-baseline justify-between border-b border-[var(--text-primary)]/10 pb-2"
            >
              <span className="text-[16px] font-medium opacity-80">
                {stat.year}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-[24px] font-bold">
                  {stat.count.toLocaleString()}
                </span>
                <span className="text-[12px] opacity-40 uppercase tracking-wider">
                  {language === "jp" ? "コミット" : "Commits"}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default GithubStats;
