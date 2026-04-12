import React, { createContext, useContext, useState } from "react";
import { lightTheme, darkTheme, Theme } from "./theme";

type ThemeContextType = {
  theme: Theme;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
