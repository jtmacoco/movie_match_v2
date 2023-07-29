import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../global.css";
import { useTheme } from "../context/ThemeContext";
import { useIcon } from "../context/IconContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { Icon, toggleIcon } = useIcon();
  const { logout } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError("")
      setLoading(true)
      await logout();
      alert("success")
      nav("/");
    }
    catch (error) {
      setError(error.message || "Failed to login");
    }
    setLoading(false)
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
      {error && <alert>{error}</alert>}
      <div className="bg-light_border border border-neutral-500 p-20 dark:bg-dark_border">
        <h1 className="text-center text-5xl pb-14 font-movieMatch text-black dark:text-white">Movie Match</h1>
        <form onSubmit={handleSubmit}>
         <div className="pb-4">
            <button disabled={loading} type="submit" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Logout</button>
          </div>
          <Link to="/UpdateProfile">
            <button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Edit Account</button>
          </Link>
        </form>
      </div>
    </div>
  )
}