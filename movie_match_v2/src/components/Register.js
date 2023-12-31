import React, { useEffect, useState } from "react";
import "../global.css";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
function Register() {
    const { theme } = useTheme();
    const { signup } = useAuth();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    useEffect (() =>{
        document.title = "Register"
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (confirmPassword !== password) {
            return setError('passwords do not match');
        }
        try {
            setError("")
            setLoading(true)
            await signup(email, password);
            nav("/Movies")
        }
        catch (error) {
            setError(error.message || "Failed to create account");
        }
        setLoading(false)
        setEmail("");
        setPassword("");
        setConfirmPassword("");
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
            <ThemeToggle />
            {error &&
                <div class="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong class="font-bold">{error}</strong>
                    <span class="absolute top-0 bottom-0 right-0 px-4 py-3" />
                </div>
            }
            <div className="rounded-md bg-light_border border border-neutral-500 p-20 dark:bg-dark_border">
                <h1 className="text-center text-5xl pb-14 text-black dark:text-white">Create Account</h1>
                <form onSubmit={handleSubmit}>
                    <div className="pb-10">
                        <input id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-black rounded-md p-2 pr-10 bg-slate-100" />
                    </div>
                    <div className="pb-10">
                        <input type="password" id="password" placeholder="Password" onChange={(p) => setPassword(p.target.value)} value={password} className="text-black rounded-md p-2 pr-10 bg-slate-100" />
                    </div>
                    <div className="pb-6">
                        <input type="password" id="confirm_password" placeholder="Confirm Password" onChange={(p) => setConfirmPassword(p.target.value)} value={confirmPassword} className="text-black rounded-md p-2 pr-10 bg-slate-100" />
                    </div>
                    <div className="pb-4">
                        <button disabled={loading} type="submit" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Next</button>
                    </div>
                </form>
                <Link to="/">
                    <button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Login</button>
                </Link>
            </div>
        </div>
    );
}

export default Register;