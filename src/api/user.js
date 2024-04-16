import express from "express";
import validator from "validator";

import { auth, db } from "../firebase/server.js";
import { authorize } from "../middleware.js";
import User from "../model/user.js";

const userAPI = express.Router();

userAPI.post("/signup", authorize(["admin"]), async (req, res) => {
	const { email, password, name, role } = req.body;

	if (!email || typeof email !== "string" || !validator.isEmail(email)) {
		return res.status(400).send("Invalid email");
	}

	if (!password || typeof password !== "string" || !validator.isStrongPassword(password)) {
		return res.status(400).send("Invalid password");
	}

	if (!role || typeof role !== "string" || !User.Roles.includes(role)) {
		return res.status(400).send("Invalid role");
	}

	if (!name || typeof name !== "string") {
		return res.status(400).send("Invalid name");
	}

	try {
		const { uid } = await auth.createUser({
			email: email,
			password: password,
		});

		await db.collection("users").doc(uid).create({ email, name, role });
	} catch (error) {
		console.error(error);
		return res.status(500).send("Internal server error");
	}

	return res.status(201).send("User created");
});

userAPI.post("/signin", async (req, res) => {
	if (!req.header("Authorization")?.startsWith("Bearer ")) {
		return res.status(400).send("Token not provided");
	}

	const token = req.header("Authorization").split("Bearer ")[1];

	try {
		await auth.verifyIdToken(token);
	} catch {
		return res.status(400).send("Invalid token");
	}

	const sessionCookie = await auth.createSessionCookie(token, {
		expiresIn: 1000 * 60 * 60 * 24 * 5,
	});

	return res.cookie("session", sessionCookie, { httpOnly: true, sameSite: "strict" }).status(200).send("Signed in");
});

export { userAPI };
