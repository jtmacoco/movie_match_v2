import React, { createContext, useContext } from "react";
import { db } from "../firebase";
import { collection, getDocs, limit, query, orderBy, doc, deleteDoc } from "firebase/firestore";

const DataContext = createContext("");

export function useData() {
    return useContext(DataContext);
}

export function DataProvider({ children }) {
    async function userData() {
        try {
            const doc = await getDocs(collection(db, "userData"));
            const data = [];
            doc.forEach(user => {
                data.push({
                    id: user.id,
                    ...user.data()
                });
            });
            return data;
        } catch (error) {
            console.error("error", error);
            return null;
        }
    }
    async function messageData() {
        const messagesQuerySnapshot = await getDocs(collection(db, "messages"));
        const data = []
        for (const messageDoc of messagesQuerySnapshot.docs) {
            const messageData = messageDoc.data();
            const messageSubcollectionRef = collection(messageDoc.ref, "texts");

            const textsQuerySnapshot = await getDocs(messageSubcollectionRef);

            if (!textsQuerySnapshot.empty) {
                data.push({
                    id: messageDoc.id,
                    textsExist: true,
                    ...messageData
                });
            } else {
                data.push({
                    id: messageDoc.id,
                    textsExist: false,
                    ...messageData
                });
            }
        }

        return data;
    }
    async function messagePageData(curUserId) {
        const messagesQuerySnapshot = await getDocs(collection(db, "messages"));
        const newestMessage = []
        for (const messageDoc of messagesQuerySnapshot.docs) {
            const messageData = messageDoc.data();

            if (messageData.user1_Id === curUserId ||
                messageData.user2_Id === curUserId) {
                const messageSubcollectionRef = collection(messageDoc.ref, "texts");
                const q = query(messageSubcollectionRef, orderBy('time', 'desc'), limit(50));
                const textsQuerySnapshot = await getDocs(q);
                if (!textsQuerySnapshot.empty) {
                    const firstTextData = textsQuerySnapshot.docs[0].data();
                    newestMessage.push(
                        {
                            user1Id: messageData.user1_Id,
                            user2Id: messageData.user2_Id,
                            newMessage: firstTextData,
                        }
                    )
                }
            }
        }
        const sortedArr = newestMessage.sort((a, b) => b.newMessage.time - a.newMessage.time)
        const filterArr = []
        sortedArr.forEach(item => {
            if (item.user1Id === curUserId)
                filterArr.push(item.user2Id)
            else
                filterArr.push(item.user1Id)
        })
        return filterArr;
    }
    async function deleteMessages(curUid, userUid) {
        const messagesQuerySnapshot = await getDocs(collection(db, "messages"));
        for (const messageDoc of messagesQuerySnapshot.docs) {
            const messageData = messageDoc.data();
            if ((messageData.user1_Id === userUid && messageData.user2_Id === curUid) ||
                (messageData.user2_Id === userUid && messageData.user1_Id === curUid)
            ) {
                const messageSubcollectionRef = collection(messageDoc.ref, "texts");
                const subCollectionSnapshot = await getDocs(messageSubcollectionRef);
                try {
                    for (const textDoc of subCollectionSnapshot.docs) {
                        await deleteDoc(textDoc.ref);
                    }
                    await deleteDoc(doc(db, 'messages', messageDoc.id))
                } catch (error) {
                    console.error("error: ", error)
                }
            }

        }
    }
    function checkGenres(arr1, arr2, priority) {
        for (let i = 0; i < arr1.length; i++) {
            if (arr2.includes(arr1[i])) {
                priority++;
            }
        }
        return priority;
    }
    async function matchList(currentUser) {
        const getUsersData = async () => {
            const res = await userData();
            const filterData = res.filter(item => item.uid !== currentUser.uid);
            return filterData;
        };
        const getCurUserData = async () => {
            const res = await userData();
            const filterData = res.filter(item => item.uid === currentUser.uid);
            return filterData;
        };

        const usersData = await getUsersData();
        const curUserData = await getCurUserData()
        const curUserMovieList = curUserData.map((curData) => {
            return curData.movieList;
        })
        const usersMovieList = new Map()
        usersData.forEach(user => {
            usersMovieList.set(user.username, { movieList: user.movieList })
        })
        const priorityList = new Map();
        usersData.forEach((user) => {
            priorityList.set(user.username, { priority: 0, movieList: user.movieList, uid: user.uid })
        })
        for (const [key, value] of usersMovieList.entries()) {
            value.movieList.forEach(usersMovie => {
                curUserMovieList[0].forEach(curMovie => {
                    let userPriority = priorityList.get(key);
                    if (curMovie.id === usersMovie.id) {
                        userPriority.priority += 50;
                    }
                    userPriority.priority = checkGenres(curMovie.genre_ids, usersMovie.genre_ids, userPriority.priority)
                })
            })
        }

        const sortedArray = [...priorityList.entries()]
        sortedArray.sort((a, b) => b[1].priority - a[1].priority);

        return sortedArray;
    }
    const value = {
        userData,
        messageData,
        messagePageData,
        deleteMessages,
        matchList,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}
