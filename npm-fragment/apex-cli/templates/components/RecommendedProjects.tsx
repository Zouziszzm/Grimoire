"use client";

import React from "react";
import Link from "next/link";
import Line from "@/components/Line";
import Copy from "@/components/Copy";
import { ProjectRecommendation } from "@/data/source";

interface RecommendedProjectsProps {
  projects: ProjectRecommendation[];
}

const RecommendedProjects: React.FC<RecommendedProjectsProps> = ({
  projects,
}) => {
  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-0 w-full mt-4">
        {projects.map((proj, index) => (
          <Link
            key={index}
            href={proj.url}
            target="_blank"
            className="block w-full group cursor-pointer"
          >
            <div className="w-full py-2">
              <div className="w-full mx-auto flex flex-row justify-between items-center">
                {/* Left Side: Name */}
                <div className="flex items-center gap-6">
                  <Copy>
                    <p className="text-[var(--text-primary)] text-[18px] group-hover:translate-x-2 transition-transform duration-300">
                      {proj.name}
                    </p>
                  </Copy>
                </div>

                {/* Right Side: Tech Stack / Description */}
                <div className="flex items-center gap-4">
                  <Copy delay={0.1}>
                    <p className="text-[var(--text-secondary)]/50 text-[14px] uppercase tracking-wider">
                      {proj.license}
                    </p>
                  </Copy>
                </div>
              </div>

              <Line
                className="line-divider mt-2"
                delay={0.1 * index}
                animateOnScroll={false}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProjects;
