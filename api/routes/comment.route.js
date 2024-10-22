import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { errorHandler } from "../utils/error.js";

import { createComment, deletecomment, editcomment, getallcomment, getcomment, likescomment } from "../controllers/comment.controller.js";
import Comment from "../models/comment.model.js";

const router = express.Router();


router.post('/create', verifyToken , createComment)
router.get('/getcomments/:postId',   getcomment)
router.put('/like/:commentId' , verifyToken , likescomment)  
router.put('/edit/:commentId' , verifyToken , editcomment)  
router.delete('/delete/:commentId' , verifyToken , deletecomment)  
router.get('/getallcomments',verifyToken ,    getallcomment)



export default router;