"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import Link from "next/link";
import Line from "@/components/Line";
import Copy from "@/components/Copy";
import { ProjectRecommendation } from "@/data/source";
const RecommendedProjects = ({ projects, }) => {
    return (_jsx("div", { className: "w-full flex flex-col gap-8", children: _jsx("div", { className: "flex flex-col gap-0 w-full mt-4", children: projects.map((proj, index) => (_jsx(Link, { href: proj.url, target: "_blank", className: "block w-full group cursor-pointer", children: _jsxs("div", { className: "w-full py-2", children: [_jsxs("div", { className: "w-full mx-auto flex flex-row justify-between items-center", children: [_jsx("div", { className: "flex items-center gap-6", children: _jsx(Copy, { children: _jsx("p", { className: "text-[var(--text-primary)] text-[18px] group-hover:translate-x-2 transition-transform duration-300", children: proj.name }) }) }), _jsx("div", { className: "flex items-center gap-4", children: _jsx(Copy, { delay: 0.1, children: _jsx("p", { className: "text-[var(--text-secondary)]/50 text-[14px] uppercase tracking-wider", children: proj.license }) }) })] }), _jsx(Line, { className: "line-divider mt-2", delay: 0.1 * index, animateOnScroll: false })] }) }, index))) }) }));
};
export default RecommendedProjects;
//# sourceMappingURL=RecommendedProjects.js.map