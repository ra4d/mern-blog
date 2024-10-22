import { useEffect, useState } from "react"
import moment from "moment"
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Alert, Button, TextInput, Modal, Textarea } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function Comments({comment , onLike , onedit , ondelete}) {
	const {currentUser} = useSelector((state)=>(state.user))
	const [user , setUser] = useState({})
	const [isEditing , setIsEditing]  = useState(false)
	const [editContent , setEditContent]  = useState(comment.content)
	const [ openModal , setOpenModal ] = useState(false)
  useEffect(()=>{

		const getusers = async()=>{
			try{
				const res = await fetch(`/api/user/${comment.userId}`)
				const data = await res.json()
				if(res.ok){
					setUser(data)	
				}else{
					console.log(data);
					
				}
			}catch(error){
				console.log(error.message);
				
			}
		}
		getusers()
	},[comment])
	
	const handleEdit = ()=>{
		setIsEditing(true)
		setEditContent(comment.content)
		

	}
	
  return (
    <div className="flex gap-2 my-6 border-b  ">
			<div>
				<img src={user.profilePicture} alt={user.username} className="w-10 h-10 rounded-full object-cover"/>
			</div>
			<div className="flex-1 flex flex-col gap-1">
				{
					user ? (<>
						<div >
							<span className="text-sm font-semibold">@{user.username}</span>
							<span className="text-xs ">{" "+ moment(comment.createdAt).fromNow()}</span>
						</div>
						{
							isEditing ? (<>
							<Textarea value={editContent || ""} onChange={(e)=>{setEditContent(e.target.value)}}/>
							<div className="flex my-2 justify-end gap-2">
								<Button gradientDuoTone="purpleToBlue" onClick={()=>{onedit(comment,editContent) ; setIsEditing(false)}}>save</Button>
								<Button outline gradientDuoTone="purpleToBlue" onClick={()=>{setIsEditing(false) }}>cancel</Button>
							</div>
							</>):(<>
							<p className="text-gray-600 dark:text-gray-300 text-base px-3 pb-2">
							{comment.content}
						</p>
						<div className="flex text-sm my-1 py-2 gap-3 items-center border-t dark:border-gray-700 max-w-fit ">
							<button onClick={()=>{onLike(comment._id)}} className={`text-gray-400 text-sm hover:text-blue-500 ${
								currentUser && comment.likes.includes(currentUser._id) && "!text-blue-500"
							}`}>
								<FaThumbsUp  className="w-full h-full"/>
							</button>
							<p className="text-gray-400">
								{
									comment.numberOfLikes > 0 && comment.numberOfLikes + " " +(comment.numberOfLikes === 1 ?  "like":"likes")
								}
							</p>
								{
									currentUser && (comment.userId === currentUser._id || currentUser.isAdmin) && (
										<button 
											type="submit"
											onClick={()=>{handleEdit()}}
										className="text-gray-400 hover:text-blue-500">
												edit
										</button>
									)
								}
								{
									currentUser && (comment.userId === currentUser._id || currentUser.isAdmin) && (
										<button 
											type="submit"
											onClick={()=>{setOpenModal(true)}}
										className="text-gray-400 hover:text-red-500">
												delete
										</button>
									)
								}
								</div>
								<Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={()=>{ondelete(comment) ;setOpenModal(false) }}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
							</>)
						}
						
						
					</>):"anonymous"
				}
			</div>
    </div>
  )
}
