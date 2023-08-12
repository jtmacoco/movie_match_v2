import React from 'react'
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export const messageData = async() =>{
    const doc = await getDocs(collection(db,"messages"));
    const data = []
    doc.forEach(message=>{
        data.push({
            id: message.id,
            ...message.data()
        })
    })
    return data;
}