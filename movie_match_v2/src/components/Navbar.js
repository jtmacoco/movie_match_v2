import React, { useState } from 'react'
import { CgMenu } from "react-icons/cg";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Link } from 'react-router-dom';
export default function Navbar() {
    const { theme } = useTheme();
    const [menu, setMenu] = useState(false)
    return (
        <div>
            <div className='absolute top-0 left-1'>
                <button onClick={() => setMenu((prev) => !prev)}>
                    <CgMenu size={30} color={`${theme === "dark" ? "white" : "black"}`} />
                </button>
            </div>
            <AnimatePresence>
                {menu && (
                    <motion.nav
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: .5 }}
                        className={`absolute flex bg-light_border dark:bg-dark_border h-screen left-0 top-0 w-40  rounded-md`}>
                        <button onClick={() => setMenu((prev) => !prev)} className='absolute top-0 pt-2 pl-1'>
                            <AiOutlineClose size={18} color={`${theme === "dark" ? "white" : "black"}`} />
                        </button>
                        <ul className='text-black dark:text-white mx-auto'>
                            <li className='py-8'>
                                <Link to="/home">
                                    Home
                                </Link>
                            </li>
                            <li className='pb-8'>
                                <Link to="/movieList">
                                Movie List
</Link>
                            </li>
                            <li className='pb-8'>
                                <Link to="/messages">
                                Messages
</Link>
                            </li>
                            <li className='pb-8'>
                                <Link to="/settings">
                                    Settings
                                </Link>
                            </li>

                        </ul>
                    </motion.nav>
                )}
            </AnimatePresence>
        </div>
    )
}
