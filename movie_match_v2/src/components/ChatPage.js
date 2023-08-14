import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useIcon } from "../context/IconContext";
import { AnimatePresence, motion } from "framer-motion";
import { messageData } from '../messageData';
import { userData } from '../userData';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import Navbar from './Navbar';
import { Timestamp } from '@firebase/firestore';
import {addDoc, doc, collection } from '@firebase/firestore';
//vfgu3kCmbeTqoQ3wq0XhilKFIfd2-AkA50WnKa0SCRSuATE3I52gsZxE3
const ChatPage = (userId) => {
    const { usernames } = useParams();
    const [user1_Id, curUser_Id] = usernames.split('-');
    const { theme, toggleTheme } = useTheme();
    const { Icon, toggleIcon } = useIcon();
    const [message, setMessage] = useState([])
    const [docId,setDocId] = useState('')
    const [userInfo, setUserInfo] = useState([])
    const { currentUser } = useAuth()
    const [curMess, setCurMess] = useState({})
    const fetchMessages = async() =>{
        const messagesData = await messageData();
        const curMessage = messagesData.find(m => {
            return (m.user1_Id === user1_Id && m.user2_Id === curUser_Id)||
            (m.user2_Id === user1_Id && m.user1_Id === curUser_Id)
        })
        setCurMess(curMessage);
        setDocId(curMessage.id)
    }
    useEffect(()=>{
        fetchMessages()
    },[])
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);
    const handleSubmit = (e)=>{
        e.preventDefault()
        try{
        const docRef = doc(db, 'messages', docId);
        const subcollectionRef = collection(docRef,"texts");
        const subDoc = addDoc(subcollectionRef,{
            text:message,
            sender_Id:currentUser.uid,
            time: Timestamp.now(),
        })
        setMessage("");
        console.log("sucess")
    }catch(error){
        console.log("error adding texts: ",error)
        }
    }
    return (
        <div className={`${theme === "dark" ? "bg-dark_back" : "bg-light_back"} h-screen flex justify-center items-center flex-col`}>
            <ThemeToggle />
            <Navbar />
            <h1 className="absolute top-10 text-center text-5xl pb-14 font-movieMatch text-black dark:text-white">Chat with</h1>
            <div className='absolute bottom-0'>
                <form onSubmit={handleSubmit} id="textForm" >
                    <textarea
                    value={message}
                    onChange={(m)=>setMessage(m.target.value)}
                    placeholder='Say Something Nice'
                    className=' pt-5 text-2xl resize-none pl-4 pr-20 text-black dark:text-white bg-light_border dark:bg-dark_border h-20 w-screen'
                    />
                    <button type="submit" className='h-20  text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 absolute right-0'>send</button>
                </form>
            </div>
        </div>
    )

};

export default ChatPage;
