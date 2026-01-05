"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { Asterisk, Moon, Sun } from "lucide-react";
import Copy from "./Copy";
import Line from "./Line";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { translations } from "@/lib/translations";
const Menu = () => {
    const pathname = usePathname();
    const { language, toggleLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [isAnimating, setIsAnimating] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuVersion, setMenuVersion] = useState(0);
    // Dark Mode State
    // REFS (GSAP controls state, not React)
    const isOpenRef = useRef(false);
    const menuOverlayRef = useRef(null);
    const menuOverlayContentRef = useRef(null);
    const menuMediaWrapperRef = useRef(null);
    const toggleLabelRef = useRef(null);
    const languageLabelRef = useRef(null);
    const hamburgerIconRef = useRef(null);
    const mainContainerRef = useRef(null);
    // Initial setup
    useEffect(() => {
        mainContainerRef.current = document.getElementById("main-container");
        gsap.set(menuOverlayContentRef.current, { yPercent: -50 });
        gsap.set(menuMediaWrapperRef.current, { opacity: 0 });
    }, []);
    // Close menu instantly on route change (NO setState)
    useEffect(() => {
        if (!isOpenRef.current)
            return;
        gsap.set(mainContainerRef.current, { y: "0svh" });
        gsap.set(menuOverlayRef.current, {
            clipPath: "polygon(0% 0%,100% 0%,100% 0%,0% 0%)",
        });
        gsap.set(menuOverlayContentRef.current, { yPercent: -50 });
        gsap.set(toggleLabelRef.current, { y: "0%" });
        gsap.set(menuMediaWrapperRef.current, { opacity: 0 });
        hamburgerIconRef.current?.classList.remove("active");
        isOpenRef.current = false;
        // Reset menuOpen after render to avoid cascading renders
        setTimeout(() => setMenuOpen(false), 0);
    }, [pathname]);
    const closeMenu = (timeline) => {
        const tl = timeline ??
            gsap.timeline({
                onComplete: () => {
                    setIsAnimating(false);
                    setMenuOpen(false);
                },
            });
        const ease = "power4.inOut";
        tl.to(mainContainerRef.current, {
            y: "0svh",
            duration: 1,
            ease,
        })
            .to(menuOverlayRef.current, {
            clipPath: "polygon(0% 0%,100% 0%,100% 0%,0% 0%)",
            duration: 1,
            ease,
        }, "<")
            .to(menuOverlayContentRef.current, {
            yPercent: -50,
            duration: 1,
            ease,
        }, "<")
            .to(toggleLabelRef.current, {
            y: "0%",
            duration: 1,
            ease,
        }, "<")
            .to(menuMediaWrapperRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
        }, "<");
        hamburgerIconRef.current?.classList.remove("active");
        isOpenRef.current = false;
    };
    const toggleMenu = () => {
        if (isAnimating)
            return;
        setIsAnimating(true);
        const tl = gsap.timeline({
            onComplete: () => {
                setIsAnimating(false);
                if (!isOpenRef.current) {
                    setMenuOpen(false);
                }
            },
        });
        const ease = "power4.inOut";
        if (!isOpenRef.current) {
            // OPEN
            tl.to(toggleLabelRef.current, {
                y: "-110%",
                duration: 1,
                ease,
            })
                .to(mainContainerRef.current, {
                y: "100svh",
                duration: 1,
                ease,
            }, "<")
                .to(menuOverlayRef.current, {
                clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)",
                duration: 1,
                ease,
            }, "<")
                .to(menuOverlayContentRef.current, {
                yPercent: 0,
                duration: 1,
                ease,
            }, "<")
                .to(menuMediaWrapperRef.current, {
                opacity: 1,
                duration: 0.75,
                ease: "power2.out",
                delay: 0.5,
            }, "<");
            hamburgerIconRef.current?.classList.add("active");
            isOpenRef.current = true;
            setMenuOpen(true);
            setMenuVersion((v) => v + 1);
        }
        else {
            closeMenu(tl);
        }
    };
    return (_jsxs("nav", { className: "fixed inset-0 pointer-events-none z-100", children: [_jsx("div", { className: "fixed top-0 left-0 w-full z-50 pointer-events-auto ", children: _jsxs("div", { className: `mx-auto ${menuOpen ? "max-w-[2560px]" : "max-w-[1440px]"} px-6 lg:px-[60px] py-4 flex justify-between items-center transition-all duration-1000 ease-in-out`, children: [_jsx(Link, { href: "/", className: "w-8 h-8 backdrop-blur-sm rounded-[2px]", children: _jsx(Asterisk, { size: 32, className: "text-(--text-secondary)/50" }) }), _jsxs("div", { className: "flex items-center gap-3 ", children: [_jsx("div", { onClick: toggleTheme, className: "relative w-10 h-10 flex items-center justify-center border border-(--text-secondary)/50 cursor-pointer overflow-hidden backdrop-blur-sm transition-colors duration-700", "aria-label": theme === "dark"
                                        ? "Switch to light theme"
                                        : "Switch to dark theme", role: "button", children: _jsx("div", { className: "absolute inset-0 flex items-center justify-center text-(--text-secondary)/50", children: theme === "dark" ? _jsx(Moon, { size: 18 }) : _jsx(Sun, { size: 18 }) }) }), _jsx("div", { onClick: toggleLanguage, className: "relative w-10 h-10 flex items-center justify-center border border-(--text-secondary)/50 cursor-pointer overflow-hidden font-['Noto_Sans_JP'] backdrop-blur-sm transition-colors duration-700", "aria-label": language === "en"
                                        ? "言語を日本語に切り替える"
                                        : "Switch language to English", role: "button", children: _jsx("p", { ref: languageLabelRef, className: "absolute text-sm text-(--text-secondary)/50 font-medium transition-transform duration-700", children: _jsx("span", { className: "block", children: language === "en" ? "日" : "EN" }) }) }), _jsxs("div", { ref: hamburgerIconRef, onClick: toggleMenu, className: "group relative w-10 h-10 lg:w-10 lg:h-10 flex flex-col justify-center items-center gap-1 border border-(--text-secondary)/50 cursor-pointer backdrop-blur-sm transition-colors duration-700", "aria-label": menuOpen ? "Close menu" : "Open menu", "aria-expanded": menuOpen, role: "button", children: [_jsx("span", { className: "absolute w-[15px] h-[1.25px] bg-(--text-secondary)/50 transition-all duration-700 translate-y-[-3px] group-[.active]:translate-y-0 group-[.active]:rotate-45" }), _jsx("span", { className: "absolute w-[15px] h-[1.25px] bg-(--text-secondary)/50 transition-all duration-700 translate-y-[3px] group-[.active]:translate-y-0 group-[.active]:-rotate-45" })] })] })] }) }), _jsx("div", { ref: menuOverlayRef, className: "fixed inset-0 bg-(--bg-overlay) overflow-hidden z-40 [clip-path:polygon(0%_0%,100%_0%,100%_0%,0%_0%)]", children: _jsxs("div", { ref: menuOverlayContentRef, className: "flex w-full h-full pointer-events-auto", children: [_jsx("div", { ref: menuMediaWrapperRef, className: "hidden lg:block flex-2", children: _jsx(Image, { src: "/menu-sakura.jpg", alt: "Menu Media", width: 800, height: 1200, className: "w-full h-full object-cover opacity-25" }) }), _jsxs("div", { className: "flex-3 flex flex-col justify-center", children: [_jsx("div", { className: "w-[85%] lg:w-3/4 mx-auto flex flex-col gap-6 text-5xl lg:text-6xl font-medium", children: translations[language].menu.items.map((item, index) => (_jsxs("div", { children: [_jsx(Link, { href: item.href, onClick: toggleMenu, className: "hover:text-(--text-primary)/50 text-(--text-primary) transition-colors duration-700", children: _jsx(Copy, { forceReady: menuOpen, delay: 0.6 + index * 0.05, animateOnScroll: false, children: _jsx("span", { className: language === "jp"
                                                            ? "font-['Noto_Sans_JP'] text-4xl lg:text-5xl"
                                                            : "", children: item.label }) }, `${item.label}-${menuVersion}-${language}`) }), pathname === item.href && (_jsx(Line, { forceReady: menuOpen, delay: 0.8 + index * 0.05, animateOnScroll: false, duration: 0.8, className: "mt-2" }, `line-${item.label}-${menuVersion}`))] }, item.label))) }), _jsxs("div", { className: "w-[85%] lg:w-3/4 mx-auto mt-16 flex gap-8 text-sm text-[var(--text-primary)]", children: [_jsx("div", { className: "w-1/2", children: _jsxs(Copy, { forceReady: menuOpen, delay: 1, animateOnScroll: false, children: [_jsx("p", { className: "uppercase tracking-widest opacity-50 mb-1", children: translations[language].menu.location.title }), _jsx("p", { className: language === "jp" ? "font-['Noto_Sans_JP']" : "", children: translations[language].menu.location.value })] }, `loc-${menuVersion}-${language}`) }), _jsx("div", { className: "w-1/2", children: _jsxs(Copy, { forceReady: menuOpen, delay: 1.1, animateOnScroll: false, children: [_jsx("p", { className: "uppercase tracking-widest opacity-50 mb-1", children: translations[language].menu.contact.title }), _jsx(Link, { href: "mailto:farhumaid@gmail.com", className: "underline", children: translations[language].menu.contact.value })] }, `con-${menuVersion}-${language}`) })] })] })] }) })] }));
};
export default Menu;
//# sourceMappingURL=Menu.js.map