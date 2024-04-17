import express from "express";
import validator from "validator";

import { db } from "../firebase/server.js";
import { authorize } from "../middleware.js";

const classAPI = express.Router();

classAPI.post("/create", authorize(["admin"]), async (req, res) => {
	const { class_id, course_id } = req.body;

	if (typeof class_id !== "string" || class_id === "" || !validator.isAlphanumeric(class_id)) {
		return res.status(400).send("Invalid class id");
	}

	if (typeof course_id !== "string" || course_id === "" || !validator.isAlphanumeric(course_id)) {
		return res.status(400).send("Invalid course id");
	}

	try {
		await db
			.collection("classes")
			.doc()
			.create({ class_id, course_id, students_id: [], teachers_id: [], data: "{}" });
	} catch (error) {
		return res.status(400).send(error.message);
	}

	return res.status(201).send("Class created");
});

classAPI.post("/update", authorize(["admin"]), async (req, res) => {
	const { id, class_id, course_id, data } = req.body;

	if (typeof id !== "string" || id === "" || !validator.isAlphanumeric(id)) {
		return res.status(400).send("Invalid id");
	}

	if (typeof class_id !== "string" || class_id === "" || !validator.isAlphanumeric(class_id)) {
		return res.status(400).send("Invalid class id");
	}

	if (typeof course_id !== "string" || course_id === "" || !validator.isAlphanumeric(course_id)) {
		return res.status(400).send("Invalid course id");
	}

	if (typeof data !== "string") {
		return res.status(400).send("Invalid data");
	}

	try {
		await db.collection("classes").doc(id).update({ class_id, course_id, data });
	} catch (error) {
		return res.status(400).send(error.message);
	}

	return res.status(200).send("Course updated");
});

classAPI.post("/delete", authorize(["admin"]), async (req, res) => {
	const { id } = req.body;

	if (typeof id !== "string" || id === "" || !validator.isAlphanumeric(id)) {
		return res.status(400).send("Invalid class id");
	}

	try {
		await db.collection("classes").doc(id).delete();
	} catch (error) {
		return res.status(400).send(error.message);
	}

	return res.status(200).send("Class deleted");
});

import { arrayUnion } from "firebase/firestore";
import { Filter } from "firebase-admin/firestore";

classAPI.post("/enroll", authorize(["student", "teacher"]), async (req, res) => {
	const { class_id } = req.body;

	if (typeof class_id !== "string" || class_id === "" || !validator.isAlphanumeric(class_id)) {
		return res.status(400).send("Invalid class id");
	}

	try {
		const { course_id } = (await db.collection("class").doc(class_id).get()).data();

		if (typeof course_id !== "string" || course_id === "" || !validator.isAlphanumeric(course_id)) {
			return res.status(400).send("Class not found");
		}

		const filter = Filter.and(
			Filter.where("course_id", "==", course_id),
			Filter.where("students_id", "array-contains", res.locals.userId),
		)

		if (!(await db.collection("class").where(filter).get()).empty) {
			return res.status(400).send("Already enrolled in this course");
		}
	} catch (error) {
		return res.status(400).send(error.message);
	}

	try {
		await db.collection("class").doc(class_id).update(`${res.locals.userRole}s`, arrayUnion(res.locals.userId));
		await db.collection("users").doc(res.locals.userId).update("data.classes", arrayUnion(class_id));
	} catch (error) {
		return res.status(400).send(error.message);
	}

	return res.status(201).send("Enrolled");
});

classAPI.post("/drop", authorize(["student", "teacher"]), async (req, res) => {
	const { class_id } = req.body;

	if (typeof class_id !== "string" || class_id === "" || !validator.isAlphanumeric(class_id)) {
		return res.status(400).send("Invalid class id");
	}

	try {
		await db.collection("class").doc(class_id).update(`${res.locals.userRole}s`, arrayRemove(res.locals.userId));
		await db.collection("users").doc(res.locals.userId).update("data.classes", arrayRemove(class_id));
	} catch (error) {
		return res.status(400).send(error.message);
	}

	return res.status(200).send("Dropped");
});

export { classAPI };
