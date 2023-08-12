import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../global.css";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useIcon } from "../context/IconContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import ThemeToggle from "./ThemeToggle";
export default function UpdateEmail() {
    const { theme, toggleTheme } = useTheme();
    const { Icon, toggleIcon } = useIcon();
    const { currentUser, updateEmail1, updatePassword1 } = useAuth();
    const [email, setEmail] = useState();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const nav = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const info = []
        setLoading(true)
        setError("")
        if (email !== currentUser.email) {
            try {
                await updateEmail1(email); // Wait for the promise to resolve
            } catch (error) {
                setError(error.message || "Failed to update");
            }
        }
        Promise.all(info).then(() => {
            alert('email updated ')
            nav('/')
        }).catch((error) => {
            setError(error.message || "Failed to update");
        }).finally(() => {
            setLoading(false)
        })
    }


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
            {error}
            <Navbar/>
            <div className="rounded-md bg-light_border border border-neutral-500 p-20 dark:bg-dark_border">
                <h1 className="text-center text-5xl pb-14 text-black dark:text-white">Change Email</h1>
                <form onSubmit={handleSubmit}>
                    <div className="pb-10">
                        <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="New Email" className="rounded-md p-2 pr-10 bg-slate-100" />
                    </div>
                    <div className="pb-4">
                        <button disabled={loading} type="submit" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Update</button>
                    </div>
                    <Link to="/settings">
                        <button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Back</button>
                    </Link>
                </form>
            </div>
        </div>
    )
}
