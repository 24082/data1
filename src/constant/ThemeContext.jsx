import React, { createContext, useEffect, useState } from "react";
import api from "../services/httpService";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState("#000");

  // useEffect(() => {
  //   const fetchColor = async () => {
  //     try {
  //       const res = await api.get("/v1/temple_setting/one");
  //       setThemeColor(res.data.color || "#000");
  //     } catch (e) {
  //       setThemeColor("#000");
  //     }
  //   };
  //   fetchColor();
  // }, []);

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
