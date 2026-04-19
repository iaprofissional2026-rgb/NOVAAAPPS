'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  User as FirebaseUser, 
  GoogleAuthProvider, 
  signInWithPopup, 
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
  serverTimestamp
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface UserProfile {
  uid: string;
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
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  incrementXP: (amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

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
          } else {
            // Create initial profile if it doesn't exist yet
            setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Novato',
              xp: 0,
              level: 1,
              plan: 'free',
              createdAt: serverTimestamp()
            });
          }
        });
        setLoading(false);
        return () => unsubProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Using signInWithPopup because redirect might have domain allowlist issues in iframe
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
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
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, logout, incrementXP }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
