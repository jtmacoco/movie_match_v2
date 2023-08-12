import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../global.css";
import { useTheme } from "../context/ThemeContext";
import { useIcon } from "../context/IconContext";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import ThemeToggle from "./ThemeToggle";
export default function Settings() {
    const { theme, toggleTheme } = useTheme();
    const { Icon, toggleIcon } = useIcon();
    const {logout} = useAuth();
    
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);
    return (
        <div className={`${theme === "dark" ? "bg-dark_back" : "bg-light_back"} h-screen flex justify-center items-center flex-col`}>
           <ThemeToggle/> 
            <Navbar />
            <div className="rounded-md bg-light_border border border-neutral-500 p-20 dark:bg-dark_border">
            <h1 className="text-center text-5xl pb-14 text-black dark:text-white">Settings</h1>
                <Link className="block" to="/UpdateEmail">
                    <button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Change email</button>
                </Link>
                <Link className="block" to="/UpdatePassword">
                    <button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Change password</button>
                </Link>
                <form>
                    <div className="pb-4">
                        <button type="button" onClick={logout} class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Logout</button>
                    </div>

                </form>
            </div>
        </div>
    )
}