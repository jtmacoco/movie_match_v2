import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { EmailAuthProvider, createUserWithEmailAndPassword, deleteUser, reauthenticateWithCredential } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { updateEmail } from "firebase/auth";
import { updatePassword } from "firebase/auth";
import { paste } from "@testing-library/user-event/dist/paste";
import { deleteUserData } from "../deleteUserData";
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [usernameCred, setUsername] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  }
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }
  function logout() {
    return auth.signOut()
  }
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }
  function updateEmail1(email) {
    return updateEmail(auth.currentUser, email)
  }

  function updatePassword1(password){
    return updatePassword(auth.currentUser, password)
  }
  function deleteCurUser (){
    const user = auth.currentUser;
    deleteUserData(user.uid);
    return deleteUser(user)
    .then(()=>{
      console.log("user delete successfully")
    })
    .catch((error)=>{
      console.error("error: ",error)
    })

  }
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false)
    });

    return unsub;
  }, []);

  const value = {
    signup,
    login,
    logout,
    deleteCurUser,
    resetPassword,
    updateEmail1,
    updatePassword1,
    currentUser,
    usernameCred,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
