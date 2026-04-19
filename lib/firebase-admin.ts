import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Define configuration explicitly from stringified Env Vars in actual prod
// Using a fallback strategy if we don't have explicit service account credential. 
// Standard Serverless functions often have Application Default Credentials configured.
// But we also inject projectId to ensure it explicitly targets our project

const firebaseAdminConfig = {
  projectId: "gen-lang-client-0217972204",
};

// Initialize Admin App
export const adminApp = 
  getApps().length > 0 
    ? getApps()[0] 
    : initializeApp(firebaseAdminConfig);

// Specify the literal databaseId in Admin SDK
export const adminDb = getFirestore(adminApp, "ai-studio-cc8ba4f4-1644-443c-ab38-9f9364bd9a9e");
export const adminAuth = getAuth(adminApp);
