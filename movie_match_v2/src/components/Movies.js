import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../global.css";
import { useTheme } from "../context/ThemeContext";
import { useIcon } from "../context/IconContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { TECollapse, TERipple } from "tw-elements-react";

export default function Movies() {
    const { theme, toggleTheme } = useTheme();
    const { Icon, toggleIcon } = useIcon();
    const [loading, setLoading] = useState(false);
    const [movie, setMovie] = useState('');
    const [movieData, setMovieData] = useState([]);
    const [error, setError] = useState(null);
    const nav = useNavigate()
    const [collapseStates, setCollapseStates] = useState({});

    const toggleCollapse = (movieId) => {
        setCollapseStates((prevCollapseStates) => ({
            ...prevCollapseStates,
            [movieId]: !prevCollapseStates[movieId],
        }));
    };

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMTQ1ZTE0MmRhMDk5NjAzNGQxNWY0ZjMwMjI2MDE0OSIsInN1YiI6IjY0YzhkMDM4Yjk3NDQyMDBjYWJkYmJmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nl89fI7NB0Drk2Le2guzy_jiQ0Dp0SbjryG7mG3KQQc'
        }
    };


    const get_movie = async () => {
        setLoading(true)
        fetch(`https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&language=en-US&page=1`, options)
            .then(response => response.json())
            .then(response => { setLoading(false); setMovieData(response.results) })
            .catch(err => console.error(err))
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
            <div className="flex flex-cols absolute top-20 left-20">
                <div>
                    <input
                        id="Movie"
                        placeholder="Movie"
                        value={movie}
                        onChange={(e) => setMovie(e.target.value)}
                        className="bg-light_border rounded-md p-2 w-80"
                    />
                </div>
                <div>
                    <button
                        onClick={() => get_movie(movie)}
                        type="button"
                        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    >
                        Search Movie
                    </button>
                </div>
            </div>
            <div className=" absolute right-20 top-20 bg-light_border border border-neutral-500 p-20 dark:bg-dark_border rounded-md">
                <form >
                    <div className="pb-10">
                        <input id="username" placeholder="Enter Username" className="rounded-md p-2 pr-10 bg-slate-100" />
                    </div>
                    <div className="pb-2">
                        <h1 className="font-bold text-xl">Current Movie List</h1>
                    </div>
                    <div className="pb-4">
                        <button disabled={loading} type="submit" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Next</button>
                    </div>

                </form>
            </div>
            <div className="absolute left-20 top-40  overflow-hidden">
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {movieData.map((movieItem) => (
                    <div key={movieItem.id} >

                        <TERipple key={movieItem.id} rippleColor="light">
                            <button onClick={() => toggleCollapse(movieItem.id)} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 shadow- shadow-blue-500/50 dark:shadow-md dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                {movieItem.title}
                            </button>
                        </TERipple>
                        <TECollapse scroll show={collapseStates[movieItem.id]}>
                            <div className="block pb-4 w-1/2 rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-700 dark:text-neutral-50 max-h-80 overflow-y-auto">

                                <div className="flex items-center justify-center">
                                    <img className="w-fit h-80" src={`https://image.tmdb.org/t/p/original${movieItem.poster_path}`} />
                                </div>
                                <h1 className="font-bold">Description</h1>
                                {movieItem.overview}
                            </div>
                        </TECollapse>
                    </div>
                ))}
            </div>
        </div>
    )
}
