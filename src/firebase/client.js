import { initializeApp } from "firebase/app";

import firebaseConfig from "./config/firebaseConfig.json" with { type: "json" };

const app = initializeApp(firebaseConfig);

import { getAuth } from "firebase/auth";

const auth = getAuth(app);

export { app, auth };
