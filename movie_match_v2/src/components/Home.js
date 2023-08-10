import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../global.css";
import { useTheme } from "../context/ThemeContext";
import { useIcon } from "../context/IconContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import { userData } from '../userData'
import { matchList } from "../matchesList";
export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { Icon, toggleIcon } = useIcon();
  const { currentUser } = useAuth()
  const [data, setData] = useState([])
  const [matches,setMatches] = useState([])
  const fetchData = async () => {
    const res = await userData()
    const filterData = res.filter(item => item.uid===currentUser.uid)
    setData(filterData)
  }
  const fetchMovieList = async() =>{
    const matches = await matchList(currentUser);
    setMatches(matches)
  }
  useEffect(() => {
    fetchData()
    fetchMovieList()
  }, [])

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
       {data.map(user=>(
        <h1 className="dark:text-white absolute top-0 left-20 font-bold">
       Welcome {user.username} 
       </h1>
      ))}
      <div>
        {matches.map(userData=>(
          <h1>{userData[1].priority}</h1>
        ))}
      </div>
      <Navbar />
    </div>
  )
}