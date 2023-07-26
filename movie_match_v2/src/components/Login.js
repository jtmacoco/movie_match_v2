import React from "react";
import { motion } from 'framer-motion';
import "../global.css"
function Login() {
    return (
        <div className="h-screen flex justify-center items-center flex-col">
            <h1 className="text-center text-5xl pb-14 font-movieMatch text-white">Movie Match</h1>
            <div className="border border-sky-500">
                <form>
                <div className="pb-10">
                    <input id="username" placeholder="Username" className="rounded-md p-2 pr-10 bg-slate-100" />
                </div>
                <div className="pb-6">
                    <input id="password" placeholder="Password" className="rounded-md p-2 pr-10 bg-slate-100" />
                </div>
                <div className="pb-4">
                    <button type="button" class="font-movieMatch text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Login</button>
                </div>
                <button type="button" class="font-movieMatch text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Create Account</button>
            </form>
</div>
        </div>
    );
}

export default Login;
