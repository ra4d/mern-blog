import { Button, Spinner } from 'flowbite-react';
import  { useEffect, useState } from 'react'
import {   useParams} from "react-router-dom";
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';


export default function PostPage() {
    const [post , setPost] = useState(null)
    const [loading , setLoading] = useState(true)
    const [errorPost , setErrorPost] = useState(null)
	const [posRecent , setPosRecent ] = useState(null)

    

    
    const {slug} = useParams()
    useEffect(()=>{
		const getpost = async()=>{
            
			try{
                
				const res = await fetch(`/api/post/getposts?slug=${slug}`)
				const data = await res.json()
				if(res.ok){
					setPost(data.posts[0]);
                    setLoading(false)
										
					
				}else{
					console.log(data.message);
                    setLoading(false)
				}
			}catch(error){
				console.log(error.message);
                setLoading(false)
				
			}
		}
        getpost()

	},[slug])
    
	useEffect(()=>{
		const getrecentpost = async()=>{
            
			try{
                
				const res = await fetch(`/api/post/getposts?limit=3`)
				const data = await res.json()
				if(res.ok){
					setPosRecent(data.posts);
                    
										
					
				}else{
					console.log(data.message);
				}
			}catch(error){
				console.log(error.message);
				
			}
		}
		getrecentpost()

	},[])
	
		if(loading) return (
        <div className='min-h-screen w-full flex justify-center items-center'>
        <Spinner size="xl" />

        </div>
    )
  return (
    <div className='min-h-screen w-full'>
        {
            post ? (
                <div>
									<h3 className='text-3xl font-semibold font-serif text-center my-7'>{post.title}</h3>
									<Button color="gray" pill className='text-center my-7 mx-auto'>{post.category}</Button>
									<div className='max-w-4xl w-full h-[600px]  mx-auto my-7'>
										<img src={post.image} alt={post.title} className='w-full h-full object-contain'/>
									</div>
									<div className='max-w-3xl mx-auto flex justify-between py-7 border-b border-gray-300'>
										<p>{new Date(post.updatedAt).toLocaleDateString() }</p>
										<p>{(post.content.length /1000).toFixed(0) }</p>
									</div>
									<div dangerouslySetInnerHTML={{__html:post.content}} className='max-w-3xl mx-auto content my-12'>

									</div>
									<div className='max-w-4xl w-full mx-auto my-12'>
										<CallToAction />
									</div>
									<div className='max-w-3xl w-full mx-auto my-12'>
										<CommentSection postId={post._id}/>
									</div>
										<h4 className='text-3xl text-center font-semibold '>
											recent post
										</h4>
									<div className='max-w-6xl w-full mx-auto my-12 flex flex-wrap gap-6 justify-center items-center '>
										{
											posRecent && posRecent.map((post)=>(
												<PostCard key={post._id} post={post} />
											))
										}
									</div>
                </div>
            ):
            (<>
            
            </>)
        }
    </div>
  )
}
