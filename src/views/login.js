import express from "express";

const loginUI = express.Router();

loginUI.use(async (req, res, next) => {
	if (req.cookies.session) return res.redirect("/");
	next();
});

loginUI.get("/", (req, res) => {
	return res.render("login");
});

import { auth } from "../firebase/client.js";
import { signInWithEmailAndPassword } from "firebase/auth";

loginUI.post("/", async (req, res) => {
	const { email, password } = req.body;

	try {
		const { user } = await signInWithEmailAndPassword(auth, email, password);

		const api_res = await fetch("http://localhost:3000/api/auth", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${await user.getIdToken()}`,
			},
		});

		if (!api_res.ok) {
			console.log(await api_res.text());
			return res.status(400).send("Invalid token");
		}

		for (const cookie of api_res.headers.getSetCookie()) res.append("Set-Cookie", cookie);

		return res.status(200).redirect("/").send("Signed in");
	} catch (error) {
		return res.status(400).send("Invalid email or password");
	}
});

export { loginUI };
