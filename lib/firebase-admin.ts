import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Define configuration explicitly from stringified Env Vars in actual prod
// Using a fallback strategy if we don't have explicit service account credential. 
// Standard Serverless functions often have Application Default Credentials configured.
// But we also inject projectId to ensure it explicitly targets our project

const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gen-lang-client-0217972204",
};

// Initialize Admin App
export const adminApp = 
  getApps().length > 0 
    ? getApps()[0] 
    : initializeApp(firebaseAdminConfig);

// Specify the databaseId
const databaseId = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID || "ai-studio-cc8ba4f4-1644-443c-ab38-9f9364bd9a9e";
export const adminDb = getFirestore(adminApp, databaseId);
export const adminAuth = getAuth(adminApp);
