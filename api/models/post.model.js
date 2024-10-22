import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
        unique:true,
    },
    image:{
        type:String,
        default:"https://imgs.search.brave.com/EJyHGWDW5DNMkAuadHbZ3fg3ukB9rls65UB9SP0bMQg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jcmVh/dGUudmlzdGEuY29t/L3MzLXN0YXRpYy9j/cmVhdGUvdXBsb2Fk/cy8yMDIyLzA5L2Js/b2ctaGVhZGVyLTkw/MHg4OTEtMS53ZWJw"
    },
    category:{
        type:String,
        default:"uncategorized"
    },
    slug:{
        type:String,
        required:true,
        unique:true,
    },
    

},{timestamps:true})


const Post = mongoose.model("post" ,postSchema)



export default Post;