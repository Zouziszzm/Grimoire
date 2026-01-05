"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import Link from "next/link";
import Line from "@/components/Line";
import Copy from "@/components/Copy";
import { Recommendation } from "@/data/source";
const RecommendedProfiles = ({ recommendations, }) => {
    return (_jsx("div", { className: "w-full flex flex-col gap-8 mt-12", children: _jsx("div", { className: "flex flex-col gap-0 w-full mt-4", children: recommendations.map((rec, index) => (_jsx(Link, { href: rec.url, target: "_blank", className: "block w-full group cursor-pointer", children: _jsxs("div", { className: "w-full py-2", children: [_jsxs("div", { className: "w-full mx-auto flex flex-row justify-between items-center", children: [_jsx("div", { className: "flex items-center gap-6", children: _jsx(Copy, { children: _jsx("p", { className: "text-[var(--text-primary)] text-[18px] group-hover:translate-x-2 transition-transform duration-300", children: rec.name }) }) }), _jsx("div", { className: "flex items-center gap-4", children: _jsx(Copy, { delay: 0.1, children: _jsx("p", { className: "text-[#5C5C5C]/50 text-[14px] uppercase tracking-wider", children: rec.role }) }) })] }), _jsx(Line, { className: "line-divider mt-2", delay: 0.1 * index, animateOnScroll: false })] }) }, index))) }) }));
};
export default RecommendedProfiles;
//# sourceMappingURL=RecommendedProfiles.js.map