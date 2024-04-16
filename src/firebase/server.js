import { getApps, initializeApp, cert } from "firebase-admin/app";

import serviceAccount from "./config/serviceAccountKey.json" with { type: "json" };

const apps = getApps();
const app = apps.length === 0 ? initializeApp({ credential: cert(serviceAccount) }) : apps[0];

import { getAuth } from "firebase-admin/auth";

const auth = getAuth();

import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export { app, auth, db };
