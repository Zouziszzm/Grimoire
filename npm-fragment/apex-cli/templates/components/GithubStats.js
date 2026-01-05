"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const GithubStats = ({ stats }) => {
    const containerRef = useRef(null);
    const { language } = useLanguage();
    useGSAP(() => {
        const rows = containerRef.current?.querySelectorAll(".stat-row");
        const animate = () => {
            if (rows && rows.length > 0) {
                gsap.fromTo(rows, { y: 20, opacity: 0 }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                    },
                });
            }
        };
        animate();
        const handleTransitionComplete = () => {
            ScrollTrigger.refresh();
        };
        window.addEventListener("pageTransitionComplete", handleTransitionComplete);
        window.addEventListener("languageTransitionComplete", handleTransitionComplete);
        return () => {
            window.removeEventListener("pageTransitionComplete", handleTransitionComplete);
            window.removeEventListener("languageTransitionComplete", handleTransitionComplete);
        };
    }, { scope: containerRef });
    return (_jsxs("div", { ref: containerRef, className: "w-full flex flex-col gap-8", children: [_jsx("h2", { className: `text-[18px] font-medium opacity-60 ${language === "jp" ? "font-['Noto_Sans_JP']" : ""}`, children: language === "jp" ? "活動記録" : "Contribution History" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12", children: stats
                    .filter((s) => s.year >= 2022)
                    .map((stat) => (_jsxs("div", { className: "stat-row flex items-baseline justify-between border-b border-[var(--text-primary)]/10 pb-2", children: [_jsx("span", { className: "text-[16px] font-medium opacity-80", children: stat.year }), _jsxs("div", { className: "flex items-baseline gap-1", children: [_jsx("span", { className: "text-[24px] font-bold", children: stat.count.toLocaleString() }), _jsx("span", { className: "text-[12px] opacity-40 uppercase tracking-wider", children: language === "jp" ? "コミット" : "Commits" })] })] }, stat.year))) })] }));
};
export default GithubStats;
//# sourceMappingURL=GithubStats.js.map