import React, { useEffect, useState } from 'react'
import { userData } from '../userData'
import { useTheme } from "../context/ThemeContext";
import { useIcon } from "../context/IconContext";
import { motion } from "framer-motion";
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
export default function MovieList() {
    const [data, setData] = useState([])
    const { theme, toggleTheme } = useTheme();
    const { Icon, toggleIcon } = useIcon();
    const { currentUser } = useAuth()
    const [movie, setMovie] = useState('');
    const [loading, setLoading] = useState(false);
    const [movieData, setMovieData] = useState([]);
    const [hover,setHover] = useState(false);
    const [hoverState,setHoverState] = useState({});
    const toggleHover= (movieId) =>{
        setHoverState((prev)=>({
            ...prev,
            [movieId]: !prev[movieId],

        }))
    }
    const fetchData = async () => {
        const res = await userData()
        const filterData = res.filter(item => item.uid === currentUser.uid)
        setData(filterData)
    }
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
        fetchData()
    }, [])
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
    return (
        <div className={`${theme === "dark" ? "bg-dark_back" : "bg-light_back"} h-screen  `}>
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
            <div className='flex justify-center items-center'>
                <h1 className="absolute top-10 text-center text-5xl pb-14 font-movieMatch text-black dark:text-white">Your Movie List</h1>
            </div>
            <div className='relative top-28  flex justify-center'>
                <div className='flex flex-cols gap-4'>
                    {data.map(info => (
                        info.movieList.map(movieInfo => (
                            <motion.div whileHover={{ scale: 1.2 }}>
                                <img
                                    key={movieInfo.title}
                                    className="w-fit h-96 lg:h-80 xl:h-80 2xl:h-96 border border-neutral-500 rounded-xl"
                                    src={`https://image.tmdb.org/t/p/original${movieInfo.poster_path}`}
                                />
                            </motion.div>
                        ))
                    ))}
                </div>
            </div>
            <div className='absolute bottom-1/3 items-center justify-center w-full'>
            <div className=' flex items-center justify-center w-full'>
                <div>
                    <input
                        id="Movie"
                        placeholder="Add Movies"
                        value={movie}
                        onChange={(e) => setMovie(e.target.value)}
                        onKeyUp={handleKeyUp}
                        className="bg-light_border rounded-md p-2 w-80"
                    />
                    <button
                        onClick={() => get_movie(movie)}
                        type="button"
                        disabled={loading}
                        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    >
                        Search Movie
                    </button>
                </div>
            </div>
            <div className=' flex flex-row absolute overflow-x-auto scroll-smooth'>
                {movieData.map((movieInfo, index) => (
                    <div key={index} className=" d-flex flex-none">
                        <img
                        onMouseEnter={()=>toggleHover(movieInfo.id)}
                        onMouseLeave={()=>toggleHover(movieInfo.id)}
                            className="w-fit h-96 px-1 py-2 rounded-xl "
                            src={`https://image.tmdb.org/t/p/original${movieInfo.poster_path}`}
                            alt={`Movie Poster ${index}`}
                        />
                        <div 
                         onMouseEnter={()=>toggleHover(movieInfo.id)}
                         onMouseLeave={()=>toggleHover(movieInfo.id)}
                        className={`${
                                hoverState[movieInfo.id] ? "block" : "hidden"
                            } pl-2 opacity-80 text-white text-center absolute bg-black bottom-2 blend-overlay  w-[249px] h-20 rounded-md`} >
                            add
                        </div>
                    </div>

                ))}
            </div>
</div>
            <Navbar />
        </div>
    )
}
