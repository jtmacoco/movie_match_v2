import React, { useContext, useEffect, useState } from "react";
import { auth } from "../Firebase";
import { createUserWithEmailAndPassword} from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { updateEmail } from "firebase/auth";
import { updatePassword } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [usernameCred, setUsername] = useState();
  const [loading,setLoading] = useState(true);

  function signup(email, password, username) {
    return createUserWithEmailAndPassword(auth,email, password)
      .then((userCredential) => {
        setUsername(username);
      })
      .catch((error) => {
        console.log("Signup Error:", error);
      });
  }
  function login(email,password){
    return signInWithEmailAndPassword(auth,email,password)
  }
  function logout(){
    return auth.signOut()
  }
  function resetPassword(email){
    return sendPasswordResetEmail(auth,email)
  }
  function updateEmail1(email) {
    return updateEmail(auth.currentUser,email)
  }

  function updatePassword1(password){
    return updatePassword(auth.currentUser, password)
    .then(() => {
      console.log(auth.currentUser.password)
      console.log("Password updated successfully!");
    })
    .catch((error) => {
      console.log("Error updating password:", error);
    });
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
    resetPassword,
    updateEmail1,
    updatePassword1,
    currentUser,
    usernameCred,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading&&children}
    </AuthContext.Provider>
  );
}
