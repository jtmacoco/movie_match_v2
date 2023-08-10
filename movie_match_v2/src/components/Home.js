import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../global.css";
import { useTheme } from "../context/ThemeContext";
import { useIcon } from "../context/IconContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import { userData } from '../userData'
import { matchList } from "../matchesList";
import { BsFillInfoCircleFill } from "react-icons/bs";
export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { Icon, toggleIcon } = useIcon();
  const { currentUser } = useAuth()
  const [data, setData] = useState([])
  const [matches, setMatches] = useState([])
  const [info, setInfo] = useState(false);
  const fetchData = async () => {
    const res = await userData()
    const filterData = res.filter(item => item.uid === currentUser.uid)
    setData(filterData)
  }
  const fetchMovieList = async () => {
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
      <div className={`${info ? "visible": "hidden"} absolute z-40 top-2`}>
        <div class="w-96 rounded-md flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3" role="alert">
          <div className="absolute top-2 pr-2">
            <BsFillInfoCircleFill size={20} />
          </div>
          <div className="pt-6">
            Users who are displayed at the top of the list have a similar movie taste to your own. Those who are further down the list will have less of a similar movie interest.
            <button onClick={()=>setInfo(false)} className="absolute right-3">close</button>
          </div>

        </div>
      </div>
      {data.map(user => (
        <h1 className="dark:text-white absolute top-0 left-20 font-bold">
          Welcome {user.username}
        </h1>
      ))}
      <div className="absolute top-10 flex flex-cols">
        <h1 className="text-center text-5xl pb-14 font-movieMatch text-black dark:text-white">New Users to Chat With</h1>
        <div className="pl-2">
          <button onClick={()=>setInfo(true)}>
            <BsFillInfoCircleFill size={20} />
          </button>
        </div>
      </div>
      <div className="absolute gap-y-4 flex items-center flex-col top-40  ">
        {matches.map(userData => (
          <motion.div whileHover={{ scale: 1.2 }}>
            <div className="w-96 ">
              <div className="h-16 border border-neutral-500 dark:bg-dark_border bg-light_border rounded-md flex flex-row items-center">
                <h1 className="pl-2 font-bold dark:text-white">{userData[0]}</h1>
                <button className="font-bold text-white absolute right-2 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Chat</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <Navbar />
    </div>
  )
}