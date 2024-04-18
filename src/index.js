import express from "express";

const app = express();
const port = process.env.APP_PORT ?? 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import cookieParser from "cookie-parser";
import { authenticate } from "./middleware.js";

app.use(cookieParser(), authenticate());

import { authAPI } from "./api/auth.js";

app.use("/api/auth", authAPI);

import { userAPI } from "./api/user.js";

app.use("/api/user", userAPI);

import { courseAPI } from "./api/course.js";

app.use("/api/course", courseAPI);

import { classAPI } from "./api/class.js";

app.use("/api/class", classAPI);

import "./bootstrap.js";

app.listen(port, () => {
	console.log(`App running at http://localhost:${port}`);
});
