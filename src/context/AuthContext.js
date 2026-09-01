import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../data/firebase';

const AuthContext = createContext(null);

/**
 * Provides authentication context to its children.
 * @param {*} param0 - The children components to render.
 * @returns - The rendered component with authentication context.
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser]   = useState(null);
  const [userProfile, setUserProfile]   = useState(null);
  const [loading, setLoading]           = useState(true);
  const isDemoMode = !auth || !db;

  const resolveDemoUser = (email = 'demo@thunder.local') => ({
     uid: 'demo-user',
     email,
     displayName: 'Demo User',
     emailVerified: true,
     isAnonymous: false,
  });

  /**
   * Signs in with email + password.
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
   if (isDemoMode) {
     const demoUser = resolveDemoUser(email);
     setCurrentUser(demoUser);
     setUserProfile({
       name: demoUser.displayName,
       email: demoUser.email,
       role: 'Corporate Partnerships',
       permissions: 'View',
       partnerID: null,
     });
     return { user: demoUser };
   }

   return signInWithEmailAndPassword(auth, email, password);
  };

  /**
   * Creates a new Firebase Auth user and writes a default Thunder-level
   * profile document to Firestore. New accounts receive:
   *   role: 'Corporate Partnerships', permissions: 'View', partnerID: null
   * (partnerID: null = Thunder staff access — sees all data)
   *
   * @param {string} email
   * @param {string} password
   * @param {string} displayName
   */
  const signup = async (email, password, displayName) => {
   if (isDemoMode) {
     const demoUser = resolveDemoUser(email);
     setCurrentUser(demoUser);
     setUserProfile({
       name: displayName,
       email,
       role: 'Corporate Partnerships',
       permissions: 'View',
       partnerID: null,
     });
     return { user: demoUser };
   }

   const credential = await createUserWithEmailAndPassword(auth, email, password);
   const profile = {
     name:        displayName,
     email:       email,
     role:        'Corporate Partnerships',
     permissions: 'View',
     partnerID:   null,         // null = Thunder-level: no data scoping
   };
   await setDoc(doc(db, 'users', credential.user.uid), profile);
   return credential;
  };

  /**
   * Signs the current user out.
   */
  const logout = () => {
   if (isDemoMode) {
     setCurrentUser(null);
     setUserProfile(null);
     return Promise.resolve();
   }
   return signOut(auth);
  };

  /**
   * Listens for changes in the authentication state.
   */
  useEffect(() => {
    if (isDemoMode) {
      const demoUser = resolveDemoUser();
      setCurrentUser(demoUser);
      setUserProfile({
        name: demoUser.displayName,
        email: demoUser.email,
        role: 'Corporate Partnerships',
        permissions: 'View',
        partnerID: null,
      });
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Fetch user's Firestore profile
        try {
          const profileSnap = await getDoc(doc(db, 'users', user.uid));
          setUserProfile(profileSnap.exists() ? profileSnap.data() : null);
        } catch {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [isDemoMode]);

  const value = { currentUser, userProfile, login, signup, logout, loading };

  // Blocks render until the initial auth check is done to prevent a flash of the login page on refresh when the user is actually logged in.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
