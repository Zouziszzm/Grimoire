"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext(undefined);
export function ThemeProvider({ children }) {
    // Default to light, but we will check hydration/storage
    const [theme, setTheme] = useState("light");
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        // Determine initial theme from localStorage or system preference if needed
        // The previous implementation used "theme" key in localStorage
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setTheme("dark");
            document.documentElement.classList.add("dark");
        }
        else {
            setTheme("light");
            document.documentElement.classList.remove("dark");
        }
        setMounted(true);
    }, []);
    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
            localStorage.setItem("theme", "dark");
            document.documentElement.classList.add("dark");
        }
        else {
            setTheme("light");
            localStorage.setItem("theme", "light");
            document.documentElement.classList.remove("dark");
        }
    };
    // Prevent hydration mismatch by rendering children only after mount (optional but safer for themes)
    // or just render children with potential flash managed by CSS variables (preferred)
    // Here we return children directly but `theme` state updates will trigger re-render
    return (_jsx(ThemeContext.Provider, { value: { theme, toggleTheme }, children: children }));
}
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
//# sourceMappingURL=ThemeContext.js.map