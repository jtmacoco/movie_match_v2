import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../global.css";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useIcon } from "../context/IconContext";
import { useAuth } from "../context/AuthContext";
export default function UpdateProfile() {
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
        if (email !== currentUser.email) {
            info.push(updateEmail1(email))
            alert('email update works')
        }
        if (password !== currentUser.password && password === confirmPassword) {
            info.push(updatePassword1(password))
            alert('password update works')
        }
        Promise.all(info).then(() => {
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
            <h1>hi</h1>
            {currentUser?.email}
            {email}
            {password}
            <div className="bg-light_border border border-neutral-500 p-20 dark:bg-dark_border">
                <h1 className="text-center text-5xl pb-14 font-movieMatch text-black dark:text-white">Movie Match</h1>
                <form onSubmit={handleSubmit}>
                    <div className="pb-10">
                        <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-md p-2 pr-10 bg-slate-100" />
                    </div>
                    <div className="pb-10">
                        <input id="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Old Password" className="rounded-md p-2 pr-10 bg-slate-100" />
                    </div>
                    <div className="pb-10">
                        <input type="newPassword" id="Password" placeholder="Leave Blank to Keep Same" onChange={(p) => setPassword(p.target.value)} value={password} className="rounded-md p-2  bg-slate-100 w-52" />
                    </div>
                    <div className="pb-6">
                        <input type="password" id="confirm_password" placeholder="Leave Blank to Keep Same" onChange={(p) => setConfirmPassword(p.target.value)} value={confirmPassword} className="rounded-md p-2  bg-slate-100 w-52" />
                    </div>
                    <div className="pb-4">
                        <button disabled={loading} type="submit" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Update</button>
                    </div>
                    <Link to="/">
                        <button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Login</button>
                    </Link>
                </form>
            </div>
        </div>
    )
}
