import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { errorHandler } from "../utils/error.js"
const sginup = async (req , res , next) => {
    const {username , email , password} = req.body
    if(!username || !email || !password || username==="" ||  email==="" || password === ""){
        return next(errorHandler(400, "All fild are requird"));
    }
	const chackUser = await User.findOne({email})
	if(chackUser){
		return next(errorHandler(400, "This email is already in use."));
	}
	const chackUsername = await User.findOne({username})
	if(chackUsername){
		return next(errorHandler(400, "This username is already in use."));
	}
    const hashedPassword = bcrypt.hashSync(password , 10)
    const newUser = new User({
        username,
        email,
        password:hashedPassword,
    })

    try {
        await newUser.save()
        res.status(200).json("siginup successfull")
    }catch(error){
        next(error)
    }

}

const signin = async (req , res , next)=>{
	const {email , password} = req.body;
	if( !email || !password || email==="" || password === ""){
		next(errorHandler(400, "All fild are requird"));
	}
	try{
		const validUser = await User.findOne({email})
		if(!validUser){
			return next(errorHandler(404 , "User Not Found"))
			
		}
		const validPassword = bcrypt.compareSync(password , validUser.password);
		if(!validPassword){
			return next(errorHandler(400 , "Invalid Password"))
		}
		const token = jwt.sign(
			{id : validUser._id , admin:validUser.isAdmin },
			process.env.JWT_SECRET
		);
		const {password : pass , ...rest} = validUser._doc;
		res.status(200).cookie("access_token" , token ,{
			httpOnly : true,
		}).json(rest);
	}
	catch(error){
		next(error);
	}
}




const google = async (req , res , next) => { 
	const { name , email , googlePhotoUrl}  = req.body;
	try{
		const user = await User.findOne({email})
		if(user){
			const token = jwt.sign({id:user._id , admin:user.isAdmin } , process.env.JWT_SECRET);
			const { password, ...rest} = user._doc;
			res.status(200).cookie( "access_token", token , {
				httpOnly:true,
			}).json(rest)
		}
		else{
			const generatPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
			const hashPassword = await bcrypt.hash(generatPassword , 10);
			const newUser = new User({
				username : name ,
				email,
				password:hashPassword,
				profilePicture:googlePhotoUrl,
			});
			await newUser.save()
			const token = jwt.sign({id:newUser._id , admin:newUser.isAdmin } , process.env.JWT_SECRET);
			const {password, ...rest} = newUser._doc;
			res.status(200).cookie("access_token" , token ,{
				httpOnly:true,
			}).json(rest)
		}
	}catch(error){
		next(error)
	}
}


export {sginup , signin , google};


