import express from "express";
import { createSize, getSizes } from "../controllers/sizeController";

const router = express.Router();
router.route("/").get(getSizes).post(createSize);
export default router;
