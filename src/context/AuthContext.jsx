import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase.config';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch JWT from server and store it
  const fetchAndStoreToken = async (firebaseUser) => {
    try {
      const { data } = await axiosInstance.post('/auth/jwt', {
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photo: firebaseUser.photoURL,
      });
      localStorage.setItem('ideavault_token', data.token);
    } catch {
      // Silent fail — user still logged in via Firebase
    }
  };

  const register = async (name, email, password, photoURL) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name, photoURL });
    await fetchAndStoreToken(userCredential.user);
    return userCredential;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await fetchAndStoreToken(userCredential.user);
    return userCredential;
  };

  const googleLogin = async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    await fetchAndStoreToken(userCredential.user);
    return userCredential;
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('ideavault_token');
    toast.success('Logged out successfully');
  };

  const updateUserProfile = async (name, photoURL) => {
    await updateProfile(auth.currentUser, { displayName: name, photoURL });
    setUser({ ...auth.currentUser, displayName: name, photoURL });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && !localStorage.getItem('ideavault_token')) {
        await fetchAndStoreToken(firebaseUser);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, googleLogin, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
