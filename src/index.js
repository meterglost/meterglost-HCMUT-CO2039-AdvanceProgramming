import express from "express";

const app = express();
const port = process.env.APP_PORT ?? 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import cookieParser from "cookie-parser";
import { authenticate } from "./middleware.js";

app.use(cookieParser(), authenticate());

import { userAPI } from "./api/user.js";

app.use("/api/user", userAPI);

import "./bootstrap.js";

app.listen(port, () => {
	console.log(`App running at http://localhost:${port}`);
});
