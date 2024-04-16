import validator from "validator";

import { auth, db } from "./firebase/server.js";

if (!process.env.FIREBASE_ADMIN_USERNAME || !validator.isEmail(process.env.FIREBASE_ADMIN_USERNAME))
	throw new Error("Invalid environment variable: FIREBASE_ADMIN_USERNAME");

if (!process.env.FIREBASE_ADMIN_PASSWORD || !validator.isStrongPassword(process.env.FIREBASE_ADMIN_PASSWORD))
	throw new Error("Invalid environment variable: FIREBASE_ADMIN_PASSWORD");

const admin_username = process.env.FIREBASE_ADMIN_USERNAME;
const admin_password = process.env.FIREBASE_ADMIN_PASSWORD;

try {
	const { uid } = await auth.createUser({ email: admin_username, password: admin_password });
	await db.collection("users").doc(uid).create({ email: admin_username, name: "Admin", role: "admin" });
} catch (error) {
	console.error("Failed to create admin account:", error.code, error.message);
}
