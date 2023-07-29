import React, { createContext, useContext, useState } from "react";
import { BsFillMoonFill } from "react-icons/bs";
import { FaSun } from "react-icons/fa";

const IconContext = createContext();

export function useIcon() {
  return useContext(IconContext);
}

export function IconProvider({ children }) {
  const storedTheme = localStorage.getItem("theme");
  const isDark = storedTheme === "dark" ? true : false
  const [isDarkIcon, setIsDarkIcon] = useState(isDark);

  const toggleIcon = () => {
    setIsDarkIcon((prevIconState) => !prevIconState);
  };

  const Icon = isDarkIcon ?<FaSun color="orange" key="sun-icon" /> : <BsFillMoonFill color="white" key="moon-icon" /> ;

  return (
    <IconContext.Provider value={{ Icon, toggleIcon }}>
      {children}
    </IconContext.Provider>
  );
}
