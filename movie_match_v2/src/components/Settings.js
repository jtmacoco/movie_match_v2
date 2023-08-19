import React, { useEffect, useState } from "react";
import "../global.css";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import ThemeToggle from "./ThemeToggle";
export default function Settings() {
    const { theme } = useTheme();
    const { deleteCurUser, logout } = useAuth();
    const [deleteAccount, setDeleteAccount] = useState(false)
    useEffect (() =>{
        document.title = "Settings"
    },[])
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);
    return (
        <div className={`${theme === "dark" ? "bg-dark_back" : "bg-light_back"} h-screen flex justify-center items-center flex-col`}>
            <ThemeToggle />
            <Navbar />
            <div className="rounded-md bg-light_border border border-neutral-500 p-20 dark:bg-dark_border">
                <h1 className="font-movieMatch text-center text-5xl pb-14 text-black dark:text-white">Settings</h1>
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
                <button onClick={() => setDeleteAccount((prev) => !prev)} className="relative bottom-0 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                    Delete Account
                </button>
            </div>
            <div className={`w-80 h-32 px-2 absolute bottom-1/3 bg-rose-600 ${deleteAccount ? "visible" : "hidden"} rounded-md bg-light_border border border-neutral-500  `}>
                <h1 className="font-bold text-center text-white">Are you sure you want to delete your account</h1>
                <button onClick={() => deleteCurUser()} className="text-white absolute bottom-0 left-1/3"><p className="font-bold text-xl">Yes</p></button>
                <button onClick={() => setDeleteAccount((prev) => !prev)} className="text-white absolute bottom-0 right-1/3"><p className="font-bold text-xl">No</p></button>
            </div>
        </div>
    )
}