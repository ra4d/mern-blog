import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";
import { create, deletepost, getPosts, updatapost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);

router.get("/getposts",  getPosts);
router.delete('/deletepost/:userId/:postId' , verifyToken , deletepost)
router.put('/updatepost/:userId/:postId' , verifyToken , updatapost)

export default router;
