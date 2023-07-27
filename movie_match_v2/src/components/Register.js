import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import "../global.css"
import { BsFillMoonFill } from "react-icons/bs";
import { FaSun } from "react-icons/fa";
function Register()
{
    const [toggleMode, setToggleMode] = useState('light')
    useEffect(() => {
        if (toggleMode === "dark") {
            document.documentElement.classList.add("dark")
        }
        else {

            document.documentElement.classList.remove("dark")
        }
    }, [toggleMode]);
    const switchTheme = () => {
        setToggleMode(toggleMode === "dark" ? "light" : "dark")
    };
    const switchIcon = () => {
        if (toggleMode === "dark") {
            return (
                <motion.div
                    animate={{ x: 5 }}
                >
                    <FaSun color="orange" key="sun-icon" />
                </motion.div>
            );

        }
        else {
            return (
                <motion.div
                initial={{ x: 0 }}
                    animate={{ x: 40 }}
                >
                    <BsFillMoonFill color="white" key="moon-icon" />
                </motion.div>
            );
        }
    }

    return (
        <div className=" bg-light_back dark:bg-dark_back h-screen flex justify-center items-center flex-col">
            <button className="overflow-hidden shadow-md shadow-slate-500 absolute top-2 right-12 bg-black dark:bg-gray-100 rounded-full py-2 w-16 " onClick={switchTheme}>
                {switchIcon()}
            </button>
            <div className="bg-light_border border border-neutral-500 p-20 dark:bg-dark_border">
                <h1 className="text-center text-5xl pb-14 text-black dark:text-white">Create Account</h1>
                <form>
                <div className="pb-10">
                        <input id="email" placeholder="Email" className="rounded-md p-2 pr-10 bg-slate-100" />
                    </div>
                    <div className="pb-10">
                        <input id="username" placeholder="Username" className="rounded-md p-2 pr-10 bg-slate-100" />
                    </div>
                    <div className="pb-10">
                        <input id="password" placeholder="Password" className="rounded-md p-2 pr-10 bg-slate-100" />
                    </div>
                    <div className="pb-6">
                        <input id="password_confirm" placeholder="Password Confirm" className="rounded-md p-2 pr-10 bg-slate-100" />
                    </div>

                    <div className="pb-4">
                        <button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Next</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Register;