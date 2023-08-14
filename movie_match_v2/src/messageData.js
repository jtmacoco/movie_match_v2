import React from 'react'
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export const messageData = async() =>{
    const messagesQuerySnapshot = await getDocs(collection(db,"messages"));
//    const messagesCollectionRef = collection(db, "messages");
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