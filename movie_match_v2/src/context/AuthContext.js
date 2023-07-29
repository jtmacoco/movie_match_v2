import React, { useContext, useEffect, useState } from "react";
import { auth } from "../Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
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
    currentUser,
    usernameCred,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading&&children}
    </AuthContext.Provider>
  );
}
