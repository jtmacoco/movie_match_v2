import React from 'react'
import { auth, db } from "./firebase";
import { limit, query, orderBy, collection, getDocs, doc } from "firebase/firestore";

export const messagePageData = async (curUserId) => {
    const messagesQuerySnapshot = await getDocs(collection(db, "messages"));
    //    const messagesCollectionRef = collection(db, "messages");
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
    //console.log("fiterArr: ", filterArr)
    return filterArr;
}