'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  updateDoc,
  increment,
  query,
  collection,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface UserProfile {
  uid: string;
  username: string;
  email: string;
  displayName: string;
  xp: number;
  level: number;
  plan: 'free' | 'iron' | 'gold' | 'diamante';
  createdAt: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (username: string, pass: string) => Promise<void>;
  register: (username: string, pass: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  incrementXP: (amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Helper to sanitize and format username as dummy email
const formatEmail = (username: string) => `${username.toLowerCase().trim()}@app.evomind`;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Set up snapshot listener for user profile
        const userRef = doc(db, 'users', currentUser.uid);
        const unsubProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile({
              ...data,
              plan: data.plan || 'free'
            } as UserProfile);
            setLoading(false);
          } else {
            // Profile will be created by register()
            setLoading(false);
          }
        }, (error) => {
          console.error("Firestore Profile Error:", error);
          setLoading(false);
        });
        
        return () => unsubProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const login = async (username: string, pass: string) => {
    setLoading(true);
    try {
      const email = formatEmail(username);
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error("Login Error:", error);
      let msg = "Erro ao entrar. Verifique usuário e senha.";
      if (error.code === 'auth/user-not-found') msg = "Usuário não encontrado.";
      if (error.code === 'auth/wrong-password') msg = "Senha incorreta.";
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, pass: string, displayName: string) => {
    setLoading(true);
    try {
      // 1. Check if username is already taken in our DB
      const q = query(collection(db, 'users'), where('username', '==', username.toLowerCase().trim()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error("Este nome de usuário já está em uso.");
      }

      const email = formatEmail(username);
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const newUser = userCredential.user;

      await updateProfile(newUser, { displayName });

      // 2. Create the profile document
      const userRef = doc(db, 'users', newUser.uid);
      await setDoc(userRef, {
        uid: newUser.uid,
        username: username.toLowerCase().trim(),
        email: email,
        displayName: displayName,
        xp: 0,
        level: 1,
        plan: 'free',
        createdAt: serverTimestamp()
      });

    } catch (error: any) {
      console.error("Registration Error:", error);
      let msg = error.message || "Erro ao criar conta.";
      if (error.code === 'auth/email-already-in-use') msg = "Usuário já existe.";
      if (error.code === 'auth/weak-password') msg = "Senha muito fraca.";
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const incrementXP = async (amount: number) => {
    if (!user || !profile) return;
    
    const userRef = doc(db, 'users', user.uid);
    try {
      // Calculate new level (1 level every 500 XP)
      const newXp = profile.xp + amount;
      const newLevel = Math.floor(newXp / 500) + 1;
      
      await updateDoc(userRef, {
        xp: increment(amount),
        level: newLevel
      });
    } catch (error) {
      console.error("Error updating XP", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, incrementXP }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
