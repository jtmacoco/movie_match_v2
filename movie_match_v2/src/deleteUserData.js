import React from 'react'
import { auth, db } from "./firebase";
import { deleteDoc,getDoc,doc,collection, getDocs } from "firebase/firestore";

export const deleteUserData= async(uid) =>{
    console.log("delete user data")
    const messagesQuerySnapshot = await getDocs(collection(db,"messages"));
    const userDataQuerySnapshot = await getDocs(collection(db,"userData"));
//    const messagesCollectionRef = collection(db, "messages");
    for (const messageDoc of messagesQuerySnapshot.docs) {
        const messageData = messageDoc.data();
        if(messageData.user1_Id === uid || messageData.user2_Id === uid)
        {
            const messageSubcollectionRef = collection(messageDoc.ref, "texts");
            const subCollectionSnapshot = await getDocs(messageSubcollectionRef);
            try{
                for (const textDoc of subCollectionSnapshot.docs) {
                    await deleteDoc(textDoc.ref);
                    console.log("delete sub collection")
                }
                await deleteDoc(doc(db,'messages',messageDoc.id))
                console.log("delted message data successfully")
            }catch(error){
                console.log("error: ", error)
            }
        }
    }
    for(const userDataDoc of userDataQuerySnapshot.docs)
    {
        const userData = userDataDoc.data();
        if(userData.uid === uid)
        {
            
            try{
                await deleteDoc(doc(db,'userData',userDataDoc.id))
                console.log("delted user data successfully")
            }catch(error){
                console.log("error: ", error)
            } 
        }
    }
}