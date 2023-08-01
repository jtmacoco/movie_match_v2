import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../global.css";
import { useTheme } from "../context/ThemeContext";
import { useIcon } from "../context/IconContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
export default function Movies() {
    const { theme, toggleTheme } = useTheme();
    const { Icon, toggleIcon } = useIcon();
    const [loading, setLoading] = useState(false);
    const [movie,setMovie] = useState('');
    const nav = useNavigate()

    const options = {
        method: 'GET',
        url: 'https://moviesdatabase.p.rapidapi.com/titles/series/dark',
        headers: {
            'X-RapidAPI-Key': 'c2b819d4c3msh9aa6c638d98fbb8p121743jsn7569731d6338',
            'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
    };
    const get_movie = async (input) => {
        try {
            const response = await axios.request(input);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
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
            <div className="pb-10">
                <input id="Movie" placeholder="Movie" value={movie} onChange={(e) => setMovie(e.target.value)} className="rounded-md p-2 pr-10 bg-slate-100" />
            </div>
            <div className="bg-white">
                {response?.data}
            </div>

        </div>
    )
}
