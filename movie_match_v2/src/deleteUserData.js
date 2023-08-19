import { db } from "./firebase";
import { deleteDoc,doc,collection, getDocs } from "firebase/firestore";

export const deleteUserData= async(uid) =>{
    console.log("delete user data")
    const messagesQuerySnapshot = await getDocs(collection(db,"messages"));
    const userDataQuerySnapshot = await getDocs(collection(db,"userData"));
    for (const messageDoc of messagesQuerySnapshot.docs) {
        const messageData = messageDoc.data();
        if(messageData.user1_Id === uid || messageData.user2_Id === uid)
        {
            const messageSubcollectionRef = collection(messageDoc.ref, "texts");
            const subCollectionSnapshot = await getDocs(messageSubcollectionRef);
            try{
                for (const textDoc of subCollectionSnapshot.docs) {
                    await deleteDoc(textDoc.ref);
                }
                await deleteDoc(doc(db,'messages',messageDoc.id))
            }catch(error){
                console.error("error: ", error)
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
            }catch(error){
                console.error("error: ", error)
            } 
        }
    }
}