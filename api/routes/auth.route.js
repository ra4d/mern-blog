import express from "express"
import {sginup , signin , google} from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/signup" , sginup)
router.post("/signin" , signin)
router.post("/google" , google)

export default router;

