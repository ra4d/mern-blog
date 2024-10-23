import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import User from "../models/user.model.js";

const test = (req, res) => {
  res.send("hello world");
};
const updata = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "you are not allowed to update this user"));
  }
  if (req.body.username) {
    const chackUsername = await User.findOne({username:req.body.username})
    if(chackUsername){
      return next(errorHandler(400, "This username is already in use."));
    }
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(
          400,
          "The letters of the username must be between 7 and 20"
        )
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "The username must not contain a space"));
    }
    if (!req.body.username.toLocaleLowerCase()) {
      return next(errorHandler(400, "The username must by loweCase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "The username must contain letters and numbers only")
      );
    }
  }
  if (req.body.password) {
    if (req.body.password.length <= 6) {
      return next(
        errorHandler(400, "The password must be longer than 6 characters")
      );
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }
  try {
    const updataUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updataUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};









const deleteUser = async(req , res , next )=>{
	if(req.user.id !== req.params.userId && !req.user.admin){
		return next(errorHandler(403 , "you can not delete your email"))
	}
  const userrrr = await User.findOne({_id:req.params.userId})
  if(req.user.id !== req.params.userId && userrrr.isAdmin){
    return next(errorHandler(403 , "You can't delete this email because it's an admin"))
  }
	try{
		await User.findByIdAndDelete(req.params.userId)
		res.status(200).json('User has been delete')
	}catch(error){
		next(error)
	}
}
const signout = async(req , res , next)=>{
	try{
		res.clearCookie("access_token").status(200).json("User has been sign out")
	}catch(error){
		next(error)
	}
}




export { test  , updata , deleteUser , signout};
