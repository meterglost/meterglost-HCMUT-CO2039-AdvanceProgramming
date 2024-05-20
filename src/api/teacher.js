import express from "express";
import validator from "validator";

import { db } from "../firebase/server.js";
import { authorize } from "../middleware.js";
import { arrayUnion } from "firebase/firestore";

const teacherAPI = express.Router();

teacherAPI.use(authorize(["teacher"]));
