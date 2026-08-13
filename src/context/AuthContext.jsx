import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase.config';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Exchange the Firebase session for the API JWT used by protected requests.
  const fetchAndStoreToken = async (firebaseUser, forceRefresh = false) => {
    const { data } = await axiosInstance.post('/auth/jwt', {
      idToken: await firebaseUser.getIdToken(forceRefresh),
    });
    localStorage.setItem('ideavault_token', data.token);
    return data.token;
  };

  const ensureServerToken = async () => {
    if (!auth.currentUser) throw new Error('Please sign in again to continue');
    return fetchAndStoreToken(auth.currentUser, true);
  };

  const register = async (name, email, password, photoURL) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name, photoURL });
    await fetchAndStoreToken(userCredential.user, true);
    return userCredential;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await fetchAndStoreToken(userCredential.user, true);
    return userCredential;
  };

  const googleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      await fetchAndStoreToken(userCredential.user, true);
      return userCredential;
    } catch (error) {
      if (error.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
        return null;
      }
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('ideavault_token');
    toast.success('Logged out successfully');
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const updateUserProfile = async (name, photoURL) => {
    await updateProfile(auth.currentUser, { displayName: name, photoURL });
    await ensureServerToken();
    await axiosInstance.patch('/auth/profile', { name, photo: photoURL || '' });
    await fetchAndStoreToken(auth.currentUser, true);
    setUser({ ...auth.currentUser, displayName: name, photoURL });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && !localStorage.getItem('ideavault_token')) {
        try {
          await fetchAndStoreToken(firebaseUser);
        } catch (error) {
          console.warn('Could not initialize API session:', error.response?.data?.message || error.message);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, googleLogin, logout, resetPassword, updateUserProfile, ensureServerToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
