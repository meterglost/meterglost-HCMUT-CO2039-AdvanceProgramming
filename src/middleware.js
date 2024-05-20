import { auth, db } from "./firebase/server.js";

/** @returns {import("express").RequestHandler} */
const authenticate = () => {
	return async (req, res, next) => {
		const session = req.cookies?.session ?? "";

		if (typeof session !== "string" || session === "") {
			return res.status(401).redirect("/login");
		}

		try {
			res.locals.userId = (await auth.verifySessionCookie(session, true)).uid;
		} catch (error) {
			console.error(error.code, error.message);
		}

		if (typeof res.locals.userId !== "string" || res.locals.userId === "") {
			return res.clearCookie("session").status(401).redirect("/login");
		}

		try {
			res.locals.userRole = (await db.collection("users").doc(res.locals.userId).get()).data()?.role ?? "";
		} catch (error) {
			console.error(error.code, error.message);
		}

		if (typeof res.locals.userRole !== "string" || res.locals.userRole === "") {
			return res.clearCookie("session").status(401).redirect("/login").send("Unauthorized");
		}

		return next();
	};
};

import User from "./model/user.js";

/**
 * @param {string[]} roles
 * @returns {import("express").RequestHandler}
 */
const authorize = (roles) => {
	return async (req, res, next) => {
		if (!Array.isArray(roles) || roles.some((role) => typeof role !== "string" || !User.Roles.includes(role))) {
			res.status(500).send("Invalid authorized role");
			return;
		}

		if (!roles.includes(res.locals.userRole)) {
			res.status(401).send("Unauthorized");
			return;
		}

		next();
	};
};

export { authenticate, authorize };
