import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../global.css";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useIcon } from "../context/IconContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import { ThemeConsumer } from "styled-components";
import ThemeToggle from "./ThemeToggle";
export default function UpdatePassword() {
    const { theme, toggleTheme } = useTheme();
    const { Icon, toggleIcon } = useIcon();
    const { currentUser, updateEmail1, updatePassword1 } = useAuth();
    const [email, setEmail] = useState();
    const [oldPassword, setOldPassword] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const nav = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        const info = []
        setLoading(true)
        setError("")
        if (password !== currentUser.password && password === confirmPassword) {
            info.push(updatePassword1(password))
            alert('password update works')
        }
        Promise.all(info).then(() => {
            alert('password update ')
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
            <Navbar/>
            {error}
            <div className="rounded-md bg-light_border border border-neutral-500 p-20 dark:bg-dark_border ">
                <h1 className="text-center text-5xl pb-14 text-black dark:text-white">Change Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="pb-10">
                        <input type="password" id="Password" placeholder="New Password" onChange={(p) => setPassword(p.target.value)} value={password} className="rounded-md p-2  bg-slate-100 w-52" />
                    </div>
                    <div className="pb-6">
                        <input type="password" id="confirm_password" placeholder="Confirm Password" onChange={(p) => setConfirmPassword(p.target.value)} value={confirmPassword} className="rounded-md p-2  bg-slate-100 w-52" />
                    </div>
                    <div className="pb-4">
                        <button disabled={loading} type="submit" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Update</button>
                    </div>
                    <Link to="/Settings">
                        <button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Back</button>
                    </Link>
                </form>
            </div>
        </div>
    )
}
