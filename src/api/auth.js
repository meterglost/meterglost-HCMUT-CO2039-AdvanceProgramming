import express from "express";

import { auth } from "../firebase/server.js";

const authAPI = express.Router();

authAPI.post("/", async (req, res) => {
	if (res.locals.userId != null || res.locals.role != null) {
		return res.status(200).send("Already signed in");
	}

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

export { authAPI };
