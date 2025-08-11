import { createContext, useContext, useState, useEffect } from "react";

// Create context
const LangContext = createContext();

// Provider component
export const Provider = ({ children }) => {
  const [isArabic, setIsArabic] = useState(false);

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("isArabic");
    if (savedLang !== null) {
      setIsArabic(savedLang === "true");
    }
  }, []);

  // Toggle Lang mode and persist in localStorage
  const toggleLang = () => {
    setIsArabic((prev) => {
      const newLang = !prev;
      localStorage.setItem("isArabic", newLang);
      return newLang;
    });
  };

  return (
    <LangContext.Provider value={{ isArabic, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
};

// Custom hook for easier access
export const useLang = () => {
  return useContext(LangContext);
};
