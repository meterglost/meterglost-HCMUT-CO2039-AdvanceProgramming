import express from "express";
import validator from "validator";

import { db } from "../firebase/server.js";
import { authorize } from "../middleware.js";

const courseAPI = express.Router();

courseAPI.post("/create", authorize(["admin"]), async (req, res) => {
	const { id, name, credit, description, resource } = req.body;

	if (typeof id !== "string" || id === "" || !validator.isAlphanumeric(id)) {
		return res.status(400).send("Invalid id");
	}

	if (typeof name !== "string" || name === "") {
		return res.status(400).send("Invalid name");
	}

	if (typeof credit !== "string" || credit === "") {
		return res.status(400).send("Invalid credit");
	}

	if (!validator.isNumeric(credit) || !validator.isInt(credit, { min: 0, max: 4 })) {
		return res.status(400).send("Invalid credit");
	}

	if (typeof description !== "string") {
		return res.status(400).send("Invalid description");
	}

	if (typeof resource !== "string") {
		return res.status(400).send("Invalid resource");
	}

	try {
		await db.collection("courses").doc(id).create({ name, credit, description, resource });
	} catch (error) {
		return res.status(400).send(error.message);
	}

	return res.status(201).send("Course created");
});

courseAPI.post("/update", authorize(["admin"]), async (req, res) => {
	const { id, name, credit, description, resource } = req.body;

	if (typeof id !== "string" || id === "" || !validator.isAlphanumeric(id)) {
		return res.status(400).send("Invalid id");
	}

	if (typeof name !== "string" || name === "") {
		return res.status(400).send("Invalid name");
	}

	if (typeof credit !== "string" || credit === "") {
		return res.status(400).send("Invalid credit");
	}

	if (!validator.isNumeric(credit) || !validator.isInt(credit, { min: 0, max: 4 })) {
		return res.status(400).send("Invalid credit");
	}

	if (typeof description !== "string") {
		return res.status(400).send("Invalid description");
	}

	if (typeof resource !== "string") {
		return res.status(400).send("Invalid resource");
	}

	try {
		await db.collection("courses").doc(id).update({ name, credit, description, resource });
	} catch (error) {
		return res.status(400).send(error.message);
	}

	return res.status(200).send("Course updated");
});

courseAPI.post("/delete", authorize(["admin"]), async (req, res) => {
	const { id } = req.body;

	if (typeof id !== "string" || id === "" || !validator.isAlphanumeric(id)) {
		return res.status(400).send("Invalid id");
	}

	try {
		await db.collection("courses").doc(id).delete();
	} catch (error) {
		return res.status(400).send(error.message);
	}

	return res.status(200).send("Course deleted");
});

export { courseAPI };
