import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useIcon } from "../context/IconContext";
import { motion } from "framer-motion";
export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const { Icon, toggleIcon } = useIcon();
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);
    return (
        <button
            className={`overflow-hidden shadow-md shadow-slate-500 absolute top-2 right-12  ${theme === "dark" ? "bg-light_border" : "bg-dark_border"
                } rounded-full py-2 w-16`}
            onClick={() => {
                toggleTheme();
                toggleIcon();
            }}
        >
            <motion.div animate={{ x: theme === "dark" ? 5 : 40 }}>{Icon}</motion.div>
        </button>
    )
}
