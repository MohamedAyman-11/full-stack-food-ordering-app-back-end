import express from "express";
import { createExtra, getExtras } from "../controllers/extraController";

const router = express.Router();
router.route("/").get(getExtras).post(createExtra);
export default router;
