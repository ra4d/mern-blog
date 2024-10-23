import React, { useEffect, useState } from 'react'
import {useSelector , useDispatch} from "react-redux"
import { Button, Modal, Table } from "flowbite-react"
import {Link} from "react-router-dom"
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashPost() {
  const {currentUser} = useSelector((state)=>(state.user))
  const [userPosts , setUserPosts] = useState([])
  const [showMore , setShowMore] = useState(true)
  const [openModal, setOpenModal] = useState(false);
  const [postId, setPostId] = useState(null);


  
  useEffect(()=>{
    const fetchPost = async() => {
      try{
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json()
        if(res.ok){
          setUserPosts(data.posts)
          if(data.posts.length < 9){
            setShowMore(false)
          }
          else{
            console.log(data.message);
            
          }
        }
      }catch(error){
        console.log(error)
      }
    }
    if(currentUser.isAdmin){
      fetchPost()
    }
  },[currentUser._id])
  const handleShowMore = async()=> {
    const starIndex = userPosts.length
    try{
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&starIndex=${starIndex}`)
      const data = await res.json()
      if(res.ok){
        setUserPosts((prev)=> [...prev , ...data.posts])
        if(data.posts.length < 9){
          setShowMore(false)
        }
      }else{
        console.log(data.message);
        
      }
    }catch(error){
      console.log(error.message);
      
    }
  }


  const handleDeletePost = async () => {
    setOpenModal(false);
    try {
      const res = await fetch(`/api/post/deletepost/${currentUser._id}/${postId}`, {
        method: "delete",
      });
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev)=> prev.filter((e)=> e._id !== postId ) )
      } else {
        dispatch(userSlice.actions.deleteFailure(data.message));
      }
    } catch (error) {
      dispatch(userSlice.actions.deleteFailure(error.message));
    }
  };


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 w-full'>
      {
        currentUser.isAdmin && userPosts.length > 0 ? (<>
          <Table className='shadow-md'>
        <Table.Head>
          <Table.HeadCell>Date updata</Table.HeadCell>
          <Table.HeadCell>Post image</Table.HeadCell>
          <Table.HeadCell>Post title</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
          <Table.HeadCell>
            <span>Edit</span>
          </Table.HeadCell>
        </Table.Head>
        {
          userPosts.map((post)=>(
            <Table.Body key={post._id} className='divide-y'>
          <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800 '>
            <Table.Cell >{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
            <Table.Cell>
            <Link to={`/post/${post.slug}`}>
              <img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500'/>
              </Link>
              </Table.Cell>
            <Table.Cell>
            <Link to={`/post/${post.slug}`} className='font-medium text-gray-900 dark:text-white '>
              {post.title}
            </Link>
              </Table.Cell>
            <Table.Cell>{post.category}</Table.Cell>
            <Table.Cell ><span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={() => {setOpenModal(true) ; setPostId(post._id) } }>Delete</span></Table.Cell>
            <Table.Cell>
              <Link to={`/update-post/${post._id}`} className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                Edit
              </Link>
            </Table.Cell>
          </Table.Row>
        </Table.Body>

          ))
        }
        
      </Table>
      {
          showMore && (<Button gradientMonochrome="purple" onClick={handleShowMore} className='w-full my-2'>
              show more
          </Button>)
        }
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
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
        </>):(<p>don't have any post</p>)
      }
    </div>
  )
}
