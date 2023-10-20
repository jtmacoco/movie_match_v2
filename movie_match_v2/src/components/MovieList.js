import React, { useEffect, useState } from 'react'
import { db } from "../firebase"
//import { userData } from '../userData'
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { useAuth } from '../context/AuthContext';
import { IoIosAddCircle } from "react-icons/io";
import Navbar from './Navbar';
import { BsFillCheckCircleFill } from "react-icons/bs";
import { AiFillMinusCircle } from "react-icons/ai";
import { getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import ThemeToggle from './ThemeToggle';
import { useData } from '../context/DataContext';
export default function MovieList() {
    const {userData} = useData()
    const [data, setData] = useState([])
    const { theme } = useTheme();
    const { currentUser } = useAuth()
    const [movie, setMovie] = useState('');
    const [loading, setLoading] = useState(false);
    const [movieData, setMovieData] = useState([]);
    const [hover, setHover] = useState(false);
    const [hoverState, setHoverState] = useState({});
    const [documentId, setDocumentId] = useState('');
    const [addMovie, setAddMovie] = useState({});
    const [removeMovie, setRemoveMovie] = useState({});
    const [startX, setStartX] = useState(0);
    const [scrollX, setScrollX] = useState(0);
    const [isMouseDown, setIsMouseDown] = useState(false);
    useEffect (() =>{
        document.title = "Movie-List"
    },[])
    const toggleHover = (listId, movieId) => {
        setHoverState((prev) => ({
            ...prev,
            [listId]: {
                ...prev[listId],
                [movieId]: !prev[listId]?.[movieId] || false,
            },
        }));
    };

    const fetchData = async () => {
        const res = await userData()
        const filterData = res.filter(item => item.uid === currentUser.uid)
        setDocumentId(filterData.map(item => item.id));

        setData(filterData)
    }
    const updateMovieList = async () => {
        try {
            const docRef = doc(db, 'userData', documentId[0]);
            await updateDoc(docRef, {
                movieList: arrayUnion(addMovie),
            });
            setData((prevData) =>
                prevData.map((item) => {
                    if (item.id === documentId[0]) {
                        return {
                            ...item,
                            movieList: [...item.movieList, addMovie],
                        };
                    }
                    return item;
                })
            );
        } catch (error) {
            console.error('error adding movie: ', error);
        }

    }

    const handleRemove = async () => {
        try {
            const docRef = doc(db, 'userData', documentId[0]);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const docData = docSnap.data();

                const updatedMovieList = docData.movieList.filter(movie => movie.id !== removeMovie[0].id);
                const updatedHoverState = { ...hoverState };
                delete updatedHoverState[documentId[0]][removeMovie[0].id];
                setHoverState(updatedHoverState);
                setHover(false);
                await updateDoc(docRef, { movieList: updatedMovieList });
                setData(prevData => {
                    return prevData.map(item => {
                        if (item.id === documentId[0]) {
                            return {
                                ...item,
                                movieList: updatedMovieList,
                            };
                        }
                        return item;
                    });
                });
            } else {
            }
        } catch (error) {
            console.error('Error removing movie: ', error);
        }
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
    const getAddMovie = (movieId) => {
        const movie = movieData.find((value) => value.id === movieId);
        if (movie) {
            setAddMovie(movie);
        }
    };
    const getRemoveMovie = (movieId) => {
        const movie = data.map((info) => info.movieList.find((value) => value.id === movieId));
        if (movie) {
            setRemoveMovie(movie);

        }
    }
    useEffect(() => {
        if (addMovie) {
            updateMovieList();
        }
    }, [addMovie]);

    useEffect(() => {
        if (removeMovie) {
            handleRemove()
        }
    }, [removeMovie])
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

    const checkMovie = () => {
        if (movieData.length === 0) {
            return [];
        }
        let seenMovies = [];
        data.forEach((movieInfo) => {
            const seenMoviesInList = movieInfo.movieList.filter((obj1) => {
                return movieData.some((obj2) => {
                    return obj1.id === obj2.id;
                });
            });
            seenMovies = seenMovies.concat(seenMoviesInList);
        });

        return seenMovies;
    };
    const seenMovies = checkMovie();

    const displayAdd = (movieId) => {
        if (seenMovies.length === 0) {
            return (<>
                <button onClick={() => { getAddMovie(movieId); }}>
                    <p>add</p>
                    <div className='absolute top-1 right-1/3 '>
                        <IoIosAddCircle color="white">add</IoIosAddCircle>
                    </div>
                </button>
            </>)
        }
        const movieFound = seenMovies.find(seen => seen.id === movieId);

        if (movieFound) {
            return (
                <>
                    <p>added</p>
                    <div className='absolute top-1 right-1/3 '>
                        <BsFillCheckCircleFill color="green" />
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <button onClick={() => { getAddMovie(movieId); }}>
                        <p>Add</p>
                        <div className='absolute top-1 right-1/3 '>

                            <IoIosAddCircle color="white">add</IoIosAddCircle>
                        </div>
                    </button>
                </>
            );
        }

    }
    const handleKeyUp = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            get_movie();
        }
    };
    const handleMouseDown = (e) => {
        setScrollX(0);
        setStartX(e.clientX);
        setIsMouseDown(true);
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    const handleMouseMove = (e, id) => {
        if (!isMouseDown) return;

        const deltaX = e.clientX - startX;
        setScrollX(scrollX - deltaX);

        var right = document.getElementById(id)
        right.scrollLeft = right.scrollLeft + (scrollX * 3);
        setStartX(e.clientX);
    };
    return (
        <div style={{height:"110vh"}}className={` h-screen  ${theme === "dark" ? "bg-dark_back" : "bg-light_back"}  `}>
            <ThemeToggle />

            <div className='flex justify-center items-center'>
                <h1 className="absolute top-5 text-center text-5xl pb-14 font-movieMatch text-black dark:text-white">Your Movie List</h1>
            </div>

            <div className='relative top-24'>
                <ul onMouseLeave={handleMouseUp} id="list-container" className='    px-8 flex pt-10 pb-10 flex-cols gap-5 overflow-x-auto scroll-smooth'>
                    {data.map(info => (
                        info.movieList.map(movieInfo => (
                            <li className='div-flex flex-none '>
                                <motion.div whileHover={{ scale: 1.2 }}
                                    onMouseEnter={() => { setHover(true); toggleHover(info.id, movieInfo.id) }}
                                    onMouseLeave={() => {
                                        if (hover) {
                                            toggleHover(info.id, movieInfo.id)
                                            setHover(false)
                                        }
                                    }}

                                >
                                    <img
                                        onMouseDown={handleMouseDown}
                                        onMouseUp={handleMouseUp}
                                        onMouseMove={(e) => handleMouseMove(e, "list-container")}
                                        key={movieInfo.title}
                                        className="w-fit h-96 lg:h-80 xl:h-80 2xl:h-96 border border-neutral-500 rounded-xl"
                                        src={`https://image.tmdb.org/t/p/original${movieInfo.poster_path}`}
                                        draggable="false"
                                    />
                                    <div
                                        className={`${hoverState[info.id]?.[movieInfo.id] ? "block" : "hidden"
                                            } opacity-80 text-white text-center absolute  bg-black bottom-0  w-[214px] 2xl:w-[258px] h-20 rounded-lg`} >
                                        <button onClick={() => { getRemoveMovie(movieInfo.id) }}>
                                            <p>Remove</p>
                                            <div className='absolute top-1 right-1/4 '>
                                                <AiFillMinusCircle color="white" />
                                            </div>
                                        </button>
                                    </div>
                                </motion.div>
                            </li>
                        ))
                    ))}
                </ul>
            </div>

            <div className='flex items-center justify-center'>
                <div className='absolute bottom-1/4 2xl:bottom-1/4 flex '>
                    <div>
                        <input
                            id="Movie"
                            placeholder="Add Movies"
                            value={movie}
                            onChange={(e) => setMovie(e.target.value)}
                            onKeyUp={handleKeyUp}
                            className="text-black bg-light_border rounded-md p-2 w-80"
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
</div>
                <div className='absolute top-[80vh] overflow-hidden   '>
                    <ul onMouseLeave={handleMouseUp} id="image-container" className={`  ${theme === "dark" ? "bg-dark_back" : "bg-light_back"}  px-10 py-10 flex flex-row overflow-x-auto scroll-smooth`}>
                        {movieData.map((movieInfo, index) => (
                            <li
                                key={index} 
                                className=" py-5 d-flex flex-none flex flex-cols">
                                <motion.div whileHover={{ scale: 1.2 }}
                                    onMouseEnter={() => toggleHover(movieData.id, movieInfo.id)}
                                    onMouseLeave={() => toggleHover(movieData.id, movieInfo.id)}
                                >

                                    <img
                                        onMouseDown={handleMouseDown}
                                        onMouseUp={handleMouseUp}
                                        onMouseMove={(e) => handleMouseMove(e, "image-container")}

                                        className="w-fit h-96 rounded-2xl "
                                        src={`https://image.tmdb.org/t/p/original${movieInfo.poster_path}`}
                                        alt={`Movie Poster ${index}`}
                                        draggable="false"
                                    />
                                        <div
                                            className={`${hoverState[movieData.id]?.[movieInfo.id] ? "block" : "hidden"
                                                } opacity-80 text-white text-center absolute  bg-black bottom-0  w-[256px] h-20 rounded-lg`} >


                                            {displayAdd(movieInfo.id)}

                                        </div>

                                </motion.div>
                            </li>

                        ))}
                    </ul>
                </div>
            <Navbar />
        </div>
    )
}
