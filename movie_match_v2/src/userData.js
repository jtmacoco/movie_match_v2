import React from 'react'
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export const userData = async() =>{
    const doc = await getDocs(collection(db,"userData"));
    const data = []
    doc.forEach(user=>{
        data.push({
            id: user.id,
            ...user.data()
        })
    })
    return data
}