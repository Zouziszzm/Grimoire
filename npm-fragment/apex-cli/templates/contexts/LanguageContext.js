"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useCallback } from "react";
const LanguageContext = createContext(undefined);
export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState("en");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [triggerCover, setTriggerCover] = useState(null);
    const handleSetTriggerCover = useCallback((fn) => {
        setTriggerCover(() => fn);
    }, []);
    const toggleLanguage = useCallback(() => {
        if (isTransitioning)
            return;
        const newLanguage = language === "en" ? "jp" : "en";
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
            window.removeEventListener("languageTransitionComplete", handleRevealComplete);
        };
        window.addEventListener("languageCoverComplete", handleCoverComplete);
        window.addEventListener("languageTransitionComplete", handleRevealComplete);
    }, [language, isTransitioning, triggerCover]);
    return (_jsx(LanguageContext.Provider, { value: {
            language,
            toggleLanguage,
            isTransitioning,
            triggerCover,
            setTriggerCover: handleSetTriggerCover,
        }, children: children }));
}
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
//# sourceMappingURL=LanguageContext.js.map