import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useIcon } from "../context/IconContext";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from './ThemeToggle';
import Navbar from './Navbar';
const ChatPage = () => {
    const { usernames } = useParams();
    const [user1, curUser] = usernames.split('-');
    const { theme, toggleTheme } = useTheme();
    const { Icon, toggleIcon } = useIcon();
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
            <Navbar />
            <h1 className="absolute top-10 text-center text-5xl pb-14 font-movieMatch text-black dark:text-white">Chat with {user1}</h1>
            <div className='absolute bottom-0'>
                <form id="textForm" >
                    <textarea
                    placeholder='Say Something Nice'
                    className=' pt-5 text-2xl resize-none pl-4 pr-20 text-black dark:text-white bg-light_border dark:bg-dark_border h-20 w-screen'
                    />
                    <button className='h-20  text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 absolute right-0'>send</button>
                </form>
            </div>
        </div>
    )

};

export default ChatPage;
