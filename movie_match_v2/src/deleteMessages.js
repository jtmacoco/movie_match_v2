import React from 'react'
import { useAuth } from './context/AuthContext';
import { db } from './firebase';
import { doc, collection, deleteDoc, getDocs } from "firebase/firestore";

export const deleteMessages = async (curUid, userUid) => {
    console.log("hi")
    const messagesQuerySnapshot = await getDocs(collection(db, "messages"));
    for (const messageDoc of messagesQuerySnapshot.docs) {
        const messageData = messageDoc.data();
        if ((messageData.user1_Id === userUid && messageData.user2_Id === curUid) ||
            messageData.user2_Id === userUid && messageData.user1_Id === curUid
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