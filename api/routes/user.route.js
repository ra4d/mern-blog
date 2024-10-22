import express from "express";
import { test , updata , deleteUser  , signout} from "../controllers/user.controlle.js";
const router = express.Router();
import { verifyToken } from "../utils/verifyUser.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import User from "../models/user.model.js";

router.put("/updata/:userId", verifyToken, updata );
router.delete('/delete/:userId' , verifyToken , deleteUser);
router.post('/signout/:userId' , verifyToken , signout)

router.get('/getusers' , verifyToken , async(req , res , next)=>{
	if(!req.user.admin){
		return next(errorHandler(404 , "unothorized"))
	}
	const startIndex = req.query.startIndex || 0;
	const limit = req.query.limit || 9;
	const sortDirection = req.query.order === "asc" ? 1:-1 ;
	try {
		const users = await User.find().sort({updatadAt:sortDirection}).skip(startIndex).limit(limit)
		const UWOP = users.map((e)=>{
			const {password:pass , ...rest} = e._doc
			return rest;
		})
		const TU = await User.countDocuments()
		const now = new Date()
		const oneMonthAgo = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			now.getDay()
		)

		const LMTU =  await User.countDocuments({createdAt:{$gte : oneMonthAgo}})
		res.status(200).json({users:UWOP , TU , LMTU})
	} catch (error) {
		next(error)
	}
	
})
router.get('/:userId', async(req , res ,next)=>{
	try{
		const user = await User.findById(req.params.userId)
		const {password , ...rest} = user._doc;
		res.status(200).json(rest)
	}catch(error){
		next(error)
	}
});



export default router;
