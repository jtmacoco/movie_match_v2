import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../global.css";
import { useTheme } from "../context/ThemeContext";
import { useIcon } from "../context/IconContext";
import { Link, useNavigate } from "react-router-dom";
import { TECollapse, TERipple } from "tw-elements-react";
import { IoIosAddCircle } from "react-icons/io";
import { AiFillMinusCircle } from "react-icons/ai";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
export default function Movies() {
    const { theme, toggleTheme } = useTheme();
    const { Icon, toggleIcon } = useIcon();
    const [loading, setLoading] = useState(false);
    const [movie, setMovie] = useState('');
    const [movieData, setMovieData] = useState([]);
    const [error, setError] = useState(null);
    const nav = useNavigate()
    const [collapseStates, setCollapseStates] = useState({});
    const [movieList, setMovieList] = useState([]);
    const [username, setUsername] = useState('');
    const {currentUser} = useAuth();


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

    const handleKeyUp = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            get_movie();
        }
    };
    const handleRemove = (remove_movie) => {
        const remove = movieList.filter(function (el) {
            console.log("el.title: ", el.title);
            console.log("remove_movie.title: ", remove_movie.title);
            return el.release_date !== remove_movie.release_date || el.title !== remove_movie.title;
        });
        setMovieList(remove);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "userData"), {
                username: username,
                movieList: movieList,
                uid:currentUser.uid,
            });
            nav("/home")
        //    console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("error adding document: ", e);
        }
    }


    return (
        <>
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
                            onKeyUp={handleKeyUp}
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
                <form onSubmit={handleSubmit}>
                    <div className=" absolute right-20 top-20 bg-light_border border border-neutral-500 p-20 dark:bg-dark_border rounded-md">
                        <div className="pb-10">
                            <input id="username" placeholder="Enter Username" value={username} onChange={(u) => setUsername(u.target.value)} className="rounded-md p-2 pr-10 bg-slate-100" />
                        </div>
                        <div className="pb-2">
                            <h1 className="font-bold text-xl dark:text-white">Current Movie List</h1>
                            {movieList.length === 0 ? <p className="dark:text-white">please add some movies to your list</p> : movieList.map((movieListItem) => (
                                <div className="flex flex-cols items-center">
                                    <div className=" w-fit text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                        {movieListItem.title}
                                    </div >
                                    <button onClick={() => handleRemove(movieListItem)} >
                                        <AiFillMinusCircle color={`${theme === "dark" ? "white" : "black"}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="pb-4">
                            <button disabled={loading} type="submit" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Next</button>
                        </div>
                    </div>
                </form>
                <div scroll className="absolute w-1/2 left-20 top-40 overflow-y-auto max-h-[calc(100vh-16rem)]  ">
                    {loading && <p className="dark:text-white text-black">Loading...</p>}
                    {error && <p>{error}</p>}
                    {movieData.map((movieItem) => (
                        <div key={movieItem.id}>
                            <div key={movieItem.id} className="flex flex-cols items-center ">
                                <TERipple rippleColor="light">
                                    <button
                                        onClick={() => toggleCollapse(movieItem.id)}
                                        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 shadow- shadow-blue-500/50 dark:shadow-md dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                    >
                                        {movieItem.title}
                                    </button>
                                </TERipple>
                                <button>
                                    <IoIosAddCircle
                                        onClick={() => setMovieList((prev) => [...prev, movieItem])}
                                        color={`${theme === "dark" ? "white" : "black"}`}
                                    />
                                </button>
                            </div>
                            <div className="pb-1">
                                <AnimatePresence>
                                    {collapseStates[movieItem.id] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                                            animate={{ height: "auto", opacity: 1, overflow: "visible" }}
                                            exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <div className="px-2 dark:text-white bg-light_border border border-neutral-500 dark:bg-dark_border rounded-md">
                                                <div className="flex items-center justify-center">
                                                    <img
                                                        className="w-fit h-80"
                                                        src={`https://image.tmdb.org/t/p/original${movieItem.poster_path}`}
                                                    />
                                                </div>
                                                <h1 className="font-bold">Release Date: {movieItem.release_date}</h1>
                                                <h1 className="font-bold">Description</h1>
                                                <div className="pb-2">{movieItem.overview}</div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
