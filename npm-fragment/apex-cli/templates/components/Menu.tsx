"use client";

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

  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuOverlayContentRef = useRef<HTMLDivElement>(null);
  const menuMediaWrapperRef = useRef<HTMLDivElement>(null);
  const toggleLabelRef = useRef<HTMLParagraphElement>(null);
  const languageLabelRef = useRef<HTMLParagraphElement>(null);
  const hamburgerIconRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLElement | null>(null);

  // Initial setup
  useEffect(() => {
    mainContainerRef.current = document.getElementById("main-container");

    gsap.set(menuOverlayContentRef.current, { yPercent: -50 });
    gsap.set(menuMediaWrapperRef.current, { opacity: 0 });
  }, []);

  // Close menu instantly on route change (NO setState)
  useEffect(() => {
    if (!isOpenRef.current) return;

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

  const closeMenu = (timeline?: gsap.core.Timeline) => {
    const tl =
      timeline ??
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
      .to(
        menuOverlayRef.current,
        {
          clipPath: "polygon(0% 0%,100% 0%,100% 0%,0% 0%)",
          duration: 1,
          ease,
        },
        "<"
      )
      .to(
        menuOverlayContentRef.current,
        {
          yPercent: -50,
          duration: 1,
          ease,
        },
        "<"
      )
      .to(
        toggleLabelRef.current,
        {
          y: "0%",
          duration: 1,
          ease,
        },
        "<"
      )
      .to(
        menuMediaWrapperRef.current,
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "<"
      );

    hamburgerIconRef.current?.classList.remove("active");
    isOpenRef.current = false;
  };

  const toggleMenu = () => {
    if (isAnimating) return;
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
        .to(
          mainContainerRef.current,
          {
            y: "100svh",
            duration: 1,
            ease,
          },
          "<"
        )
        .to(
          menuOverlayRef.current,
          {
            clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)",
            duration: 1,
            ease,
          },
          "<"
        )
        .to(
          menuOverlayContentRef.current,
          {
            yPercent: 0,
            duration: 1,
            ease,
          },
          "<"
        )
        .to(
          menuMediaWrapperRef.current,
          {
            opacity: 1,
            duration: 0.75,
            ease: "power2.out",
            delay: 0.5,
          },
          "<"
        );

      hamburgerIconRef.current?.classList.add("active");
      isOpenRef.current = true;
      setMenuOpen(true);
      setMenuVersion((v) => v + 1);
    } else {
      closeMenu(tl);
    }
  };

  return (
    <nav className="fixed inset-0 pointer-events-none z-100">
      {/* MENU BAR */}
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-auto ">
        <div
          className={`mx-auto ${
            menuOpen ? "max-w-[2560px]" : "max-w-[1440px]"
          } px-6 lg:px-[60px] py-4 flex justify-between items-center transition-all duration-1000 ease-in-out`}
        >
          <Link href="/" className="w-8 h-8 backdrop-blur-sm rounded-[2px]">
            <Asterisk size={32} className="text-(--text-secondary)/50" />
          </Link>

          <div className="flex items-center gap-3 ">
            {/* Theme Toggle */}
            <div
              onClick={toggleTheme}
              className="relative w-10 h-10 flex items-center justify-center border border-(--text-secondary)/50 cursor-pointer overflow-hidden backdrop-blur-sm transition-colors duration-700"
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              role="button"
            >
              <div className="absolute inset-0 flex items-center justify-center text-(--text-secondary)/50">
                {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
              </div>
            </div>

            {/* Language Toggle */}
            <div
              onClick={toggleLanguage}
              className="relative w-10 h-10 flex items-center justify-center border border-(--text-secondary)/50 cursor-pointer overflow-hidden font-['Noto_Sans_JP'] backdrop-blur-sm transition-colors duration-700"
              aria-label={
                language === "en"
                  ? "言語を日本語に切り替える"
                  : "Switch language to English"
              }
              role="button"
            >
              <p
                ref={languageLabelRef}
                className="absolute text-sm text-(--text-secondary)/50 font-medium transition-transform duration-700"
              >
                <span className="block">{language === "en" ? "日" : "EN"}</span>
              </p>
            </div>

            {/* Menu Toggle */}
            <div
              ref={hamburgerIconRef}
              onClick={toggleMenu}
              className="group relative w-10 h-10 lg:w-10 lg:h-10 flex flex-col justify-center items-center gap-1 border border-(--text-secondary)/50 cursor-pointer backdrop-blur-sm transition-colors duration-700"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              role="button"
            >
              <span className="absolute w-[15px] h-[1.25px] bg-(--text-secondary)/50 transition-all duration-700 translate-y-[-3px] group-[.active]:translate-y-0 group-[.active]:rotate-45" />
              <span className="absolute w-[15px] h-[1.25px] bg-(--text-secondary)/50 transition-all duration-700 translate-y-[3px] group-[.active]:translate-y-0 group-[.active]:-rotate-45" />
            </div>
          </div>
        </div>
      </div>
      <div
        ref={menuOverlayRef}
        className="fixed inset-0 bg-(--bg-overlay) overflow-hidden z-40 [clip-path:polygon(0%_0%,100%_0%,100%_0%,0%_0%)]"
      >
        <div
          ref={menuOverlayContentRef}
          className="flex w-full h-full pointer-events-auto"
        >
          {/* MEDIA */}
          <div ref={menuMediaWrapperRef} className="hidden lg:block flex-2">
            <Image
              src="/menu-sakura.jpg"
              alt="Menu Media"
              width={800}
              height={1200}
              className="w-full h-full object-cover opacity-25"
            />
          </div>

          {/* CONTENT */}
          <div className="flex-3 flex flex-col justify-center">
            <div className="w-[85%] lg:w-3/4 mx-auto flex flex-col gap-6 text-5xl lg:text-6xl font-medium">
              {translations[language].menu.items.map((item, index) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    onClick={toggleMenu}
                    className="hover:text-(--text-primary)/50 text-(--text-primary) transition-colors duration-700"
                  >
                    <Copy
                      key={`${item.label}-${menuVersion}-${language}`}
                      forceReady={menuOpen}
                      delay={0.6 + index * 0.05}
                      animateOnScroll={false}
                    >
                      <span
                        className={
                          language === "jp"
                            ? "font-['Noto_Sans_JP'] text-4xl lg:text-5xl"
                            : ""
                        }
                      >
                        {item.label}
                      </span>
                    </Copy>
                  </Link>
                  {pathname === item.href && (
                    <Line
                      key={`line-${item.label}-${menuVersion}`}
                      forceReady={menuOpen}
                      delay={0.8 + index * 0.05}
                      animateOnScroll={false}
                      duration={0.8}
                      className="mt-2"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="w-[85%] lg:w-3/4 mx-auto mt-16 flex gap-8 text-sm text-[var(--text-primary)]">
              <div className="w-1/2">
                <Copy
                  key={`loc-${menuVersion}-${language}`}
                  forceReady={menuOpen}
                  delay={1}
                  animateOnScroll={false}
                >
                  <p className="uppercase tracking-widest opacity-50 mb-1">
                    {translations[language].menu.location.title}
                  </p>
                  <p
                    className={language === "jp" ? "font-['Noto_Sans_JP']" : ""}
                  >
                    {translations[language].menu.location.value}
                  </p>
                </Copy>
              </div>

              <div className="w-1/2">
                <Copy
                  key={`con-${menuVersion}-${language}`}
                  forceReady={menuOpen}
                  delay={1.1}
                  animateOnScroll={false}
                >
                  <p className="uppercase tracking-widest opacity-50 mb-1">
                    {translations[language].menu.contact.title}
                  </p>
                  <Link href="mailto:farhumaid@gmail.com" className="underline">
                    {translations[language].menu.contact.value}
                  </Link>
                </Copy>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
