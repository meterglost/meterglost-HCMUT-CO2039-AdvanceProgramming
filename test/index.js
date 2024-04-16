import express from "express";

const app = express();
const port = process.env.APP_PORT ?? 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import cookieParser from "cookie-parser";

app.use(cookieParser());

import { auth } from "../src/firebase/client.js";
import { signInWithEmailAndPassword } from "firebase/auth";

app.get("/signin", (req, res) => {
	res.status(200).send(`
		<form action="/signin" method="post">
			<input type="email" name="email" placeholder="Email" required />
			<input type="password" name="password" placeholder="Password" required />
			<button type="submit">Sign In</button>
		</form>
	`);
});

app.post("/signin", async (req, res) => {
	const { email, password } = req.body;

	try {
		const { user } = await signInWithEmailAndPassword(auth, email, password);

		const api_res = await fetch("http://localhost:3000/api/user/signin", {
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

		return res.status(200).send("Signed in");
	} catch (error) {
		return res.status(400).send("Invalid email or password");
	}
});

app.get("/signup", (req, res) => {
	res.status(200).send(`
		<form action="/api/user/signup" method="post">
			<input type="email" name="email" placeholder="Email" required />
			<input type="password" name="password" placeholder="Password" required />
			<input type="text" name="name" placeholder="Name" required />
			<input type="text" name="role" placeholder="Role" required />
			<button type="submit">Sign Up</button>
		</form>
	`);
});

app.listen(port, () => {
	console.log(`App running at http://localhost:${port}`);
});
