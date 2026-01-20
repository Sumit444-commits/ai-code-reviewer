import express from "express";
import aiController  from "../controllers/ai.controller.js";
const router = express.Router();

router.route("/get-review").post(aiController.getReview)


export default router;