import React, { useEffect, useState } from 'react'
import { auth, db } from "../firebase"
import { userData } from '../userData'
import { useTheme } from "../context/ThemeContext";
import { useIcon } from "../context/IconContext";
import { motion } from "framer-motion";
import { useAuth } from '../context/AuthContext';
import { IoIosAddCircle } from "react-icons/io";
import Navbar from './Navbar';
import { BsFillCheckCircleFill } from "react-icons/bs";
import { AiFillMinusCircle } from "react-icons/ai";
import { collection, getDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
export default function MovieList() {
    const [data, setData] = useState([])
    const { theme, toggleTheme } = useTheme();
    const { Icon, toggleIcon } = useIcon();
    const { currentUser } = useAuth()
    const [movie, setMovie] = useState('');
    const [loading, setLoading] = useState(false);
    const [movieData, setMovieData] = useState([]);
    const [hover, setHover] = useState(false);
    const [hoverState, setHoverState] = useState({});
    const [documentId, setDocumentId] = useState('');
    const [addMovie, setAddMovie] = useState({});
    const [removeMovie, setRemoveMovie] = useState({});
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
        const id = res.id;
        setDocumentId(filterData.map(item => item.id));

        setData(filterData)
    }
    const updateMovieList = async () => {
        try {
            console.log(addMovie);
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
            console.log('movie added');
        } catch (error) {
            console.log(documentId)
            console.log(addMovie);
            console.error('error adding movie: ', error);
        }

    }
    const handleRemove = async () => {
        try {
            const docRef = doc(db, 'userData', documentId[0]);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                const docData = docSnap.data();
                
                // Assuming 'movieList' is a nested array field
                console.log("remove id, ", removeMovie[0].id);
                const updatedMovieList = docData.movieList.filter(movie => movie.id !== removeMovie[0].id);

                console.log("trying to print ", updatedMovieList.map((info) => info.title));
                
                // Update the document with the modified data
                await updateDoc(docRef, { movieList: updatedMovieList });
    
                console.log('movie has been removed');
            } else {
                console.log('Document not found');
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
            console.log(movie.title)
        } else {
            console.log("Movie not found.");
        }
    };
    const getRemoveMovie = (movieId) =>{
        //const movie = data.movieList.find((value) => value.id === movieId);
//        const movie = data.find((value) => value.id === movieId);
        const movie = data.map((info)=>info.movieList.find((value) => value.id === movieId)); 
        console.log("movie: ", movie);
        if (movie) {
            setRemoveMovie(movie);
            console.log("found movie : ",movie)
        } else {
            console.log("Movie not found.");
        }
    }
    useEffect(() => {
        if (addMovie) {
            updateMovieList()
            console.log("Found movie:", addMovie.title); 
        }
    }, [addMovie]);
    useEffect(()=>{
        if(removeMovie){
            handleRemove()
            console.log("Found movie:", removeMovie.title); 
        }
    },[removeMovie])
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

    //console.log(data.map(info => (
    //    info.movieList.map(movieInfo => (movieInfo.id)
    //))))

    return (
        <div className={`flex flex-col min-h-screen ${theme === "dark" ? "bg-dark_back" : "bg-light_back"} bg-cover overflow-y-auto`}>
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
                <h1 className="absolute top-5 text-center text-5xl pb-14 font-movieMatch text-black dark:text-white">Your Movie List</h1>
            </div>
            <div className='relative top-24  flex justify-center '>
                <div className='pl-10 flex  pt-4 pb-10 flex-cols gap-4 overflow-x-auto scroll-smooth'>
                    {data.map(info => (
                        info.movieList.map(movieInfo => (
                            <div className='pt-4 div-flex flex-none '>
                                <motion.div whileHover={{ scale: 1.2 }}>
                                    <img
                                        onMouseEnter={() => toggleHover(info.id, movieInfo.id)}
                                        onMouseLeave={() => toggleHover(info.id, movieInfo.id)}
                                        key={movieInfo.title}
                                        className="w-fit h-96 lg:h-80 xl:h-80 2xl:h-96 border border-neutral-500 rounded-xl"
                                        src={`https://image.tmdb.org/t/p/original${movieInfo.poster_path}`}
                                    />
                                    <div
                                        onMouseEnter={() => toggleHover(info.id, movieInfo.id)}
                                        onMouseLeave={() => toggleHover(info.id, movieInfo.id)}
                                        className={`${hoverState[info.id]?.[movieInfo.id] ? "block" : "hidden"
                                            } opacity-80 text-white text-center absolute  bg-black bottom-0  w-[214px] h-20 rounded-lg`} >
                                        <button onClick={()=>{ getRemoveMovie(movieInfo.id)}}>
                                            <p>Remove</p>
                                            <div className='absolute top-1 right-1/4 '>
                                                <AiFillMinusCircle color="white" />
                                            </div>
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        ))
                    ))}
                </div>
            </div>
            <div className='absolute bottom-1/4 items-center justify-center w-full'>
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
                <div className=' bg-full h-min-screen'>
                    <div className={`pl-10 ${theme === "dark" ? "bg-dark_back" : "bg-light_back"} overflow-y-hidden flex flex-row absolute overflow-x-auto scroll-smooth`}>
                        {movieData.map((movieInfo, index) => (
                            <div key={index} className="py-12 d-flex flex-none flex flex-cols">
                                <motion.div whileHover={{ scale: 1.2 }}>
                                    <img
                                        onMouseEnter={() => toggleHover(movieData.id, movieInfo.id)}
                                        onMouseLeave={() => toggleHover(movieData.id, movieInfo.id)}
                                        className="w-fit h-96 px-1 rounded-2xl "
                                        src={`https://image.tmdb.org/t/p/original${movieInfo.poster_path}`}
                                        alt={`Movie Poster ${index}`}
                                    />
                                    <div className='pl-1'>
                                        <div
                                            onMouseEnter={() => toggleHover(movieData.id, movieInfo.id)}
                                            onMouseLeave={() => toggleHover(movieData.id, movieInfo.id)}
                                            className={`${hoverState[movieData.id]?.[movieInfo.id] ? "block" : "hidden"
                                                } opacity-80 text-white text-center absolute  bg-black bottom-0  w-[256px] h-20 rounded-lg`} >


                                            {displayAdd(movieInfo.id)}

                                        </div>
                                    </div>

                                </motion.div>
                            </div>

                        ))}
                    </div>
                </div>
            </div>
            <Navbar />
        </div>
    )
}
