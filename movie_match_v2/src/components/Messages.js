import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "../global.css";
import { useTheme } from "../context/ThemeContext";
import { useIcon } from "../context/IconContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import { messageData } from "../messageData";
import { userData } from '../userData'
import { matchList } from "../matchesList";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { TERipple } from "tw-elements-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
export default function Messages() {
  const { theme, toggleTheme } = useTheme();
  const [data, setData] = useState([])
  const [matches, setMatches] = useState([])
  const [info, setInfo] = useState(false);
  const [collapseStates, setCollapseStates] = useState({});
  const [message, setMessage] = useState(null)
  const { currentUser } = useAuth()
  const nav = useNavigate()

  const toggleCollapse = (userId) => {
    setCollapseStates((prevCollapseStates) => ({
      ...prevCollapseStates,
      [userId]: !prevCollapseStates[userId],
    }));
  };
  const fetchData = async () => {
    const res = await userData()
    const filterData = res.filter(item => item.uid === currentUser.uid)
    setData(filterData)
  }
  const fetchMatchList = async () => {
    const messages = await messageData();
    setMessage(messages);
    const matches = await matchList(currentUser);
    let arrFilter = []
   
    messages.forEach(m => {
      if ((currentUser.uid === m.user1_Id) && m.textsExist)
        arrFilter.push(m.user2_Id)
      else if ((currentUser.uid === m.user2_Id) && m.textsExist)
        arrFilter.push(m.user1_Id);
    })
    const filterMatches = matches.filter(match => {
      const arrFilterMatch = arrFilter.some(f => {
        return f !== match[1].uid;
      })
      return !arrFilterMatch;
    });

    setMatches(filterMatches)
  }
  useEffect(() => {
    fetchData()
    fetchMatchList()
  }, [])
  const checkDup = (userId) => {
    console.log("userId: ", userId)
    const dup = message.find(m =>{
      return (m.user1_Id === userId)||
      (m.user2_Id === userId)
    })
    if(dup)
      return true;
    else
      return false
  }
  useEffect(() => {
    console.log("message", message);
  }, [message])

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleChat = async (e, user, userId) => {
    e.preventDefault();
    let curUsername = '';
    data.map(cur => {
      curUsername = cur.username
    })

    if (checkDup(userId)) {
      console.log("dup is true")
      nav(`/chat/${userId}-${currentUser.uid}`)
      return;
    }
    else{
      console.log("dup not true")
    }
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        user1: user,
        user1_Id: userId,
        user2: curUsername,
        user2_Id: currentUser.uid,
      });
      //  const subcollectionRef = collection(docRef, "texts");
      //  const subDoc = addDoc(subcollectionRef,{
      //    texts:'',
      //    time: Timestamp.now(),
      //    sender_uid: currentUser.uid,
      //  })
      nav(`/chat/${userId}-${currentUser.uid}`)
    } catch (e) {
      console.error("error adding document: ", e);
    }

  }

  return (
    <div className={`${theme === "dark" ? "bg-dark_back" : "bg-light_back"} h-screen flex justify-center items-center flex-col`}>
      <ThemeToggle />
      <div className={`${info ? "visible" : "hidden"} absolute z-40 top-2`}>
        <div class="w-96 rounded-md flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3" role="alert">
          <div className="absolute top-2 pr-2">
            <BsFillInfoCircleFill size={20} />
          </div>
          <div className="pt-6">
           Displayed below are users who you have already started a chat with. 
            <button onClick={() => setInfo(false)} className="pt-2 absolute right-3 ">close</button>
          </div>

        </div>
      </div>
      {data.map(user => (
        <h1 className="text-black dark:text-white absolute top-0 left-20 font-bold">
          Welcome {user.username}

        </h1>
      ))}
      <div className="absolute top-10 flex flex-cols">
        <h1 className="text-center text-5xl pb-14 font-movieMatch text-black dark:text-white">Messages</h1>
        <div className="pl-2">
          <button onClick={() => setInfo(true)}>
            <BsFillInfoCircleFill color={`${theme === "dark" ? "white" : "black"}`} size={15} />
          </button>
        </div>
      </div>
      <div className="absolute top-40">
        <div className="relative gap-y-4 flex items-center flex-col  ">
          {matches.map(userData => (
            <>
              <motion.div whileHover={{ scale: 1.2 }}>
                <TERipple>
                  <div className="w-96 ">
                    <div className="h-16 border border-neutral-500 dark:bg-dark_border bg-light_border rounded-md flex flex-row items-center">
                      <button id="users" onClick={() => toggleCollapse(userData[1].uid)} className="text-black pl-2 font-bold dark:text-white">{userData[0]}</button>
                      <button onClick={(e) => handleChat(e, userData[0], userData[1].uid)} id="chat" className="font-bold text-white absolute right-0 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Chat</button>
                    </div>
                  </div>
                </TERipple>
              </motion.div>
              <AnimatePresence>
                {collapseStates[userData[1].uid] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                    animate={{ height: "auto", opacity: 1, overflow: "visible" }}
                    exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="px-20 flex flex-cols gap-4">
                      <div className="flex overflow-x-auto gap-4">
                        {userData[1].movieList.map(movies => (
                          <div key={movies.id} className="flex-shrink-0">
                            <img
                              alt="images"
                              className="py-2 w-fit h-60 rounded-xl"
                              src={`https://image.tmdb.org/t/p/original${movies.poster_path}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ))}
        </div>
      </div>
      <Navbar />
    </div>
  )
}