import { initializeApp } from "firebase/app";

import {
  Analytics,
  getAnalytics,
  isSupported,
  setConsent,
  ConsentSettings,
} from "firebase/analytics";

import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_TRANSACTIONS_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_TRANSACTIONS_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_TRANSACTIONS_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_TRANSACTIONS_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_TRANSACTIONS_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_TRANSACTIONS_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_TRANSACTIONS_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
      const consentSettings: ConsentSettings = {
        analytics_storage: "denied",
        ad_storage: "denied",
      };
      setConsent(consentSettings);
    }
  });
}

const db = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, analytics, db, auth, database };
