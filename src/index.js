import express from "express";

const app = express();
const port = process.env.APP_PORT ?? 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "src/views");

import cors from "cors";
import cookieParser from "cookie-parser";

app.use(cookieParser(), cors());

import { loginUI } from "./views/login.js";

app.use("/login", loginUI);

app.use("/logout", (req, res) => {
	res.clearCookie("session").redirect("/login");
});

import { authAPI } from "./api/auth.js";

app.use("/api/auth", authAPI);

import { authenticate } from "./middleware.js";

app.use(authenticate());

import { userAPI } from "./api/user.js";

app.use("/api/user", userAPI);

// import { studentAPI } from "./api/student.js";

// app.use("/api/student", studentAPI);

// import { teacherAPI } from "./api/teacher.js";

// app.use("/api/teacher", teacherAPI);

import { courseAPI } from "./api/course.js";

app.use("/api/course", courseAPI);

import { classAPI } from "./api/class.js";

app.use("/api/class", classAPI);

import "./bootstrap.js";

app.listen(port, () => {
	console.log(`App running at http://localhost:${port}`);
});
