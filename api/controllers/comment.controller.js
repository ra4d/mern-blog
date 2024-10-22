import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async(req , res , next)=>{
    const { content , postId , userId  } = req.body;
    if(req.user.id !== userId){
        return next(errorHandler(404 , "You cannot create this comment."))
    }
    try{
        const newComment = new Comment({
            content,
            postId,
            userId,

        })
        await newComment.save()
        res.status(200).json(newComment)
    }catch(error){
        next(error)
    }
}
export const getcomment = async(req,res,next)=>{
    try{
        const Comments = await Comment.find({postId:req.params.postId}).sort({
            createdAt : -1
        })
        res.status(200).json(Comments)
    }catch(error){
        next(error)
    }
}
export const likescomment = async(req , res ,next)=>{
    try{
    const comment = await Comment.findById(req.params.commentId)
    if(!comment){
        next(errorHandler(404 , "comment not found"))
    }
    const userIndex = comment.likes.indexOf(req.user.id)
    if(userIndex === -1){
        comment.numberOfLikes += 1 ;
        comment.likes.push(req.user.id)
    }else{
        comment.likes.splice(userIndex , 1)
        comment.numberOfLikes -= 1;
    }
    await comment.save()
    res.status(200).json(comment)


    }catch(error){
        next(error)
    }
}

export const editcomment = async(req , res ,next)=>{
    try{
    const comment = await Comment.findById(req.params.commentId)
    if(!comment){
        next(errorHandler(404 , "comment not found"))
    }
    if(comment.userId !== req.user.id && !req.user.admin){
        next(errorHandler(404 , "you cannot updata this comment"))
    }
    const editedComment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        {
            content : req.body.content,
        },{
            new: true
        }
    )
    res.status(200).json(editedComment)


    }catch(error){
        next(error)
    }
}
export const deletecomment = async(req , res ,next)=>{
    try{
    const comment = await Comment.findById(req.params.commentId)
    if(!comment){
        next(errorHandler(404 , "comment not found"))
    }
    if(comment.userId !== req.user.id && !req.user.admin){
        next(errorHandler(404 , "you cannot updata this comment"))
    }
    
    await Comment.findByIdAndDelete(req.params.commentId)
    res.status(200).json("delete successfull")
    }catch(error){
        next(error)
    }
}
export const getallcomment = async(req,res,next)=>{
    try{
        if(!req.user.admin){
            return next(errorHandler(404 , "unUthorized"))
        }
        const startIndex = req.query.startIndex || 0 ;
        const limit = req.query.limit || 9 ;
        const sortDirection = req.query.order === "desc" ? 1:-1 ;
        const AllComments = await Comment.find().sort({
            createdAt : sortDirection
        }).skip(startIndex).limit(limit)
        const totalComment = await Comment.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() -1 ,
            now.getDay()
        )
        const commentfromonemonthago = await Comment.countDocuments({createdAt: { $gte:oneMonthAgo}})
        res.status(200).json({AllComments , totalComment , commentfromonemonthago})
    }catch(error){
        next(error)
    }
}