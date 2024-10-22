import { Alert, Button, Textarea } from "flowbite-react"
import { useEffect, useState } from "react"
import {useSelector} from "react-redux"
import { Link , useNavigate } from "react-router-dom"
import Comments from "./Comments"

export default function CommentSection({postId}) {
  const {currentUser} = useSelector((state)=>(state.user))
  const [comment , setComment] = useState(null)
  const [commentat , setCommentat] = useState([])
  const navigate = useNavigate()

  const [errorComment , setErrorComment] = useState(null)
  const handleSubmit = async(e)=>{
    e.preventDefault()
    if(comment.length > 200){
      return ;
    }
    try{
      const res = await fetch(`/api/comment/create`,{
        method : "POST",
        headers: {"Content-Type":"application/json"} ,
        body : JSON.stringify({
          content:comment,
          postId,
          userId : currentUser._id,
        })
      })
      const data = await res.json()
      if(res.ok){
        setComment("")
        setCommentat([data , ...commentat])
      }else{
        setErrorComment(data.message)
      }
    }catch(error){
      setErrorComment(error.message)
    }
  }
  useEffect(()=>{
    const getcomments = async() => {
      try{
        const res = await fetch(`/api/comment/getcomments/${postId}`)
        const data = await res.json()
        if(res.ok){
          setCommentat(data)
        }else{
          console.log(data.message);
          
        }
      }catch(error){
        console.log(error);
        
      }
    }
    getcomments()
  },[postId])
  const handleLike = async(commentId) => {
    try{
      if(!currentUser){
        navigate('/sign-in')
        return;
      }
      const res = await fetch(`/api/comment/like/${commentId}`,{
        method : "PUT",
      })
      const data = await res.json()
      if(res.ok){
        setCommentat(commentat.map((element)=>
          element._id === commentId ? 
        {
          ...element,
          likes : data.likes,
          numberOfLikes : data.likes.length,
        }
        :element ))
        
      }else{
        console.log(data.message);
        
      }
    }catch(error){
      console.log(error);
      
    }
  }
  const handledit = async(comment , editContent) => {
    try{
      if(!currentUser){
        navigate('/sign-in')
        return;
      }
      const res = await fetch(`/api/comment/edit/${comment._id}`,{
        method : "PUT",
        headers : {"Content-Type":"application/json"},
        body : JSON.stringify({
          content:editContent
        })
      })
      const data = await res.json()
      if(res.ok){
        setCommentat(commentat.map((element)=>
        element._id === comment._id ? 
      {
        ...element,
        content : data.content
      }
      :element ))
      }
      else{
        console.log(data.message);
        
      }
      
      
    }catch(error){
      console.log(error.message);
      
    }
  }
  const handldelete = async(comment) => {
    try{
      if(!currentUser){
        navigate('/sign-in')
        return;
      }
      const res = await fetch(`/api/comment/delete/${comment._id}`,{
        method : "DELETE",
      })
      const data = await res.json()
      if(res.ok){
        setCommentat(commentat.filter((element)=>
        element._id !== comment._id ))
      
      }
      else{
        console.log(data.message);
        
      }
      
      
    }catch(error){
      console.log(error.message);
      
    }
  }
  
  return (
    
    <div>
      {
        currentUser ? (<>
          <div className="flex items-center gap-1 my-7">
            <p className="text-gray-500">Signed in as:</p>
            <img src={currentUser.profilePicture} alt={currentUser.username} className="w-5 h-5 rounded-full object-cover" />
            <Link to={'/dashboard?tab=profile'}>
            <p className="text-cyan-500 hover:underline cursor-pointer">@{currentUser.username}</p>
            </Link>
          </div>

          
        </>):(<>
        <p className="text-teal-500 capitalize">
          you must be Signed in to comment.{" "}<Link to={'/sign-in'}>
            <span className="text-base text-blue-500 capitalize hover:underline">sign in</span>
          </Link>
        </p></>)
      }
      {
        currentUser && (
          <form className="flex flex-col p-4 gap-4 border border-teal-500 rounded-xl" onSubmit={handleSubmit}>
            <div>
              <Textarea placeholder="Add a comment" rows={3} value={comment || ""} onChange={(e)=>{setComment(e.target.value)}} maxLength={200}/>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">{comment ?  (200-comment.length):(200) } characters remaining</p>
              <Button className="font-bold" outline gradientDuoTone="purpleToBlue" type="submit">submit</Button>
            </div>
            {
        errorComment && (
          <Alert color="failure" className="m-2">{errorComment}</Alert>
        )
        }
          </form>
        )
      }
      {
        commentat &&
        commentat.length > 0 ? (<>

        <div className="mt-4 flex items-center gap-2">
          <p>comments</p>
          <div className="border border-gray-400 py-1 px-2 w-fit rounded-sm "><p>{commentat.length}</p></div>
        </div>
          {
            commentat.map((element)=>(
              <Comments key={element._id} comment={element} onLike={handleLike} onedit={handledit} ondelete={handldelete}/>
            ))
          }
        
        </>):(<>
        <p>No comments</p>
        </>) 
      }
      
    </div>
  )
}
