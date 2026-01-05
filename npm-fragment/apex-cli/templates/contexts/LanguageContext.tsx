"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type Language = "en" | "jp";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  isTransitioning: boolean;
  // Refs to be set by PageTransition component
  triggerCover: (() => void) | null;
  setTriggerCover: (fn: () => void) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [triggerCover, setTriggerCover] = useState<(() => void) | null>(null);

  const handleSetTriggerCover = useCallback((fn: () => void) => {
    setTriggerCover(() => fn);
  }, []);

  const toggleLanguage = useCallback(() => {
    if (isTransitioning) return;

    const newLanguage: Language = language === "en" ? "jp" : "en";
    setIsTransitioning(true);

    // Trigger the cover animation
    if (triggerCover) {
      triggerCover();
    }

    // Listen for when cover completes (page is hidden)
    const handleCoverComplete = () => {
      // Change language while page is covered
      setLanguage(newLanguage);
      window.removeEventListener("languageCoverComplete", handleCoverComplete);
    };

    // Listen for when reveal completes
    const handleRevealComplete = () => {
      setIsTransitioning(false);
      window.removeEventListener(
        "languageTransitionComplete",
        handleRevealComplete
      );
    };

    window.addEventListener("languageCoverComplete", handleCoverComplete);
    window.addEventListener("languageTransitionComplete", handleRevealComplete);
  }, [language, isTransitioning, triggerCover]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        isTransitioning,
        triggerCover,
        setTriggerCover: handleSetTriggerCover,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
