import { useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { messageData } from '../messageData';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import Navbar from './Navbar';
import { Timestamp, limit, orderBy } from '@firebase/firestore';
import { getDocs, query, addDoc, doc, collection } from '@firebase/firestore';
const ChatPage = (userId) => {
    const { usernames } = useParams();
    const [user1_Id, curUser_Id] = usernames.split('-');
    const { theme } = useTheme();
    const [message, setMessage] = useState([])
    const [docId, setDocId] = useState('')
    const { currentUser } = useAuth()
    const [curUsername, setCurUsername] = useState('')
    const [recUsername, setRecUsername] = useState('')
    const [displayMessage, setDisplayMessage] = useState([])
    const messegeRef = useRef();
    useEffect (() =>{
        document.title = "Chat-Page"
    },[])
    const fetchMessages = async (docId) => {
        try {
            const messagesRef = collection(db, "messages", docId, "texts")
            const q = query(messagesRef, orderBy('time', 'desc'), limit(50));
            const querySnapshot = await getDocs(q);
            const messages = []
            querySnapshot.forEach((doc) => {
                messages.push(doc.data())
            });
            const reverseMessages = [...messages].reverse();
            setDisplayMessage(reverseMessages)
        } catch (error) {
            console.error("error: ", error);
        }
    }
    const setMessages = async () => {
        const messagesData = await messageData();
        if (messagesData.find(m => (
            m.user1_Id === user1_Id && m.user2_Id === curUser_Id
        ))) {
        }
        else if (messagesData.find(m => (
            m.user1_Id === user1_Id && m.user2_Id === curUser_Id
        ))) {
        }


        const curMessage = messagesData.find(m => {
            return (m.user1_Id === user1_Id && m.user2_Id === curUser_Id) ||
                (m.user2_Id === user1_Id && m.user1_Id === curUser_Id)
        })
        if (curMessage) {
            if (curMessage.user1_Id === curUser_Id) {
                setCurUsername(curMessage.user1);
                setRecUsername(curMessage.user2);
            }
            else {
                setCurUsername(curMessage.user2);
                setRecUsername(curMessage.user1);
            }
            setDocId(curMessage.id)
            fetchMessages(curMessage.id);
        }
    }
    useEffect(() => {
        setMessages();
    })
    useEffect(() => {
        messegeRef.current.scrollIntoView({ behavior: "smooth" })
    }, [displayMessage])
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);
    const handleSubmit = (e) => {
        e.preventDefault()

        try {
            const docRef = doc(db, 'messages', docId);
            const subcollectionRef = collection(docRef, "texts");
            addDoc(subcollectionRef, {
                text: message,
                sender_Id: currentUser.uid,
                time: Timestamp.now(),
            })
            setMessage("");
            messegeRef.current.scrollIntoView({ behavior: "smooth" })
        } catch (error) {
            console.error("error adding texts: ", error)
        }
    }

    function ChatMessage(props) {
        const { text, sender_Id } = props.message;
        const curSender = sender_Id === currentUser.uid;

        const alignmentClass = curSender ? "self-end" : "self-start";
        const curS = curSender ? "relative right-0 " : "relative left-0";
        const start_end = curSender ? "chat-end" : "chat-start"
        return (
            <div className={`flex pb-2 ${alignmentClass}`}>
                <div className={` chat ${start_end} ${curS}   `}>
                    <div className="chat-header">
                        {curSender ? curUsername : recUsername}
                    </div>
                    <div className={` chat-bubble  ${curSender ? "bg-blue-500" : "bg-gray-600"}`}>
                        <p className='text-white text-md'> {text}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${theme === "dark" ? "bg-dark_back" : "bg-light_back"} h-screen flex justify-center items-center flex-col`}>
            <ThemeToggle />
            <h1 className="absolute top-10 text-center text-5xl pb-14 font-movieMatch text-black dark:text-white">Chat with {recUsername}</h1>
            <section className='absolute top-24 w-screen bottom-24 overflow-y-auto'>
                <div ref={messegeRef} className='flex flex-col  rounded-lg' >
                    {displayMessage.map((m, index) => (
                        <ChatMessage key={index} message={m} />
                    ))}
                </div>
                <span ref={messegeRef}></span>
            </section>


            <div className='absolute bottom-0'>
                <form onSubmit={handleSubmit} id="textForm" >
                    <textarea
                        value={message}
                        onChange={(m) => setMessage(m.target.value)}
                        placeholder='Say Something Nice'
                        className=' pt-5 text-2xl resize-none pl-4 pr-20 text-black dark:text-white bg-light_border dark:bg-dark_border h-20 w-screen'
                    />
                    <button type="submit" className='h-20  text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 absolute bottom-0 right-0'>send</button>
                </form>
            </div>

            <Navbar />
        </div>

    )

};

export default ChatPage;
