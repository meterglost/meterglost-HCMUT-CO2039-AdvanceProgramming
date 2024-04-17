import express from "express";
import validator from "validator";

import { auth, db } from "../firebase/server.js";
import { authorize } from "../middleware.js";
import User from "../model/user.js";

const userAPI = express.Router();

userAPI.post("/create", authorize(["admin"]), async (req, res) => {
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

userAPI.post("/update", authorize(["student"]), async (req, res) =>
{	
	const { name } = req.body;
	if (!name || typeof name !== "string") {
		return res.status(400).send("Invalid name");
	}

	const dataUpdate = 
	{
		infor : {
			name: name
		}
	};
	const uid = res.locals.uid;
	try
	{
		await db.collection("users").doc(uid).update(dataUpdate.infor);
	}
	catch (error)
	{
		return res.status(400).send('Update unsuccessfully');
	}
	return res.status(200).send("Update successfully");
});

userAPI.post("/delete", authorize(["admin"]), async (req, res) => {
	const { uid } = req.body;

	if (!uid || typeof uid !== "string") {
		return res.status(400).send("Invalid uid");
	}

	try {
		await auth.deleteUser(uid);
		await db.collection("users").doc(uid).delete();
	} catch (error) {
		console.error(error.code, error.message);
		return res.status(400).send(error.message);
	}

	return res.status(200).send("User deleted");
});

export { userAPI };
