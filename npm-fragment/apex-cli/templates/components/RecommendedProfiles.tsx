"use client";

import React from "react";
import Link from "next/link";
import Line from "@/components/Line";
import Copy from "@/components/Copy";
import { Recommendation } from "@/data/source";

interface RecommendedProfilesProps {
  recommendations: Recommendation[];
}

const RecommendedProfiles: React.FC<RecommendedProfilesProps> = ({
  recommendations,
}) => {
  return (
    <div className="w-full flex flex-col gap-8 mt-12">
      <div className="flex flex-col gap-0 w-full mt-4">
        {recommendations.map((rec, index) => (
          <Link
            key={index}
            href={rec.url}
            target="_blank"
            className="block w-full group cursor-pointer"
          >
            <div className="w-full py-2">
              <div className="w-full mx-auto flex flex-row justify-between items-center">
                {/* Left Side: Name */}
                <div className="flex items-center gap-6">
                  <Copy>
                    <p className="text-[var(--text-primary)] text-[18px] group-hover:translate-x-2 transition-transform duration-300">
                      {rec.name}
                    </p>
                  </Copy>
                </div>

                {/* Right Side: Role */}
                <div className="flex items-center gap-4">
                  <Copy delay={0.1}>
                    <p className="text-[#5C5C5C]/50 text-[14px] uppercase tracking-wider">
                      {rec.role}
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

export default RecommendedProfiles;
