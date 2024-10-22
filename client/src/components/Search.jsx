import { Button, Select, TextInput } from 'flowbite-react'
import  { useEffect, useState } from 'react'
import { useLocation , useNavigate } from 'react-router-dom'
import PostCard from './PostCard'

export default function Search() {
	const navigate = useNavigate()
	const location = useLocation()
	const [sidebarData , setSidebarData] = useState({
		searchTrem:"",
		sort:"desc",
		category:"uncategorized",

	})
	const [posts , setPosts] = useState()
	const [loading , setLoading] = useState(false)
	const [showMore , setShowMore] = useState(false)

	useEffect(()=>{
		const urlParams = new URLSearchParams(location.search)
		const searchTremFromUrl = urlParams.get("searchTrem")
		const sortFromUrl = urlParams.get("sort")
		const categoryFromUrl = urlParams.get("category")
		if(searchTremFromUrl || sortFromUrl || categoryFromUrl ){
			setSidebarData({
				...sidebarData,
				searchTrem:searchTremFromUrl,
				sort:sortFromUrl,
				category:categoryFromUrl,

			})
		}
		const getPosts = async() => {
			setLoading(true)
			const searchQuery = urlParams.toString()
			console.log(searchQuery);
			
			try {
				const res = await fetch(`/api/post/getposts?${searchQuery}`)
				const data = await res.json()
				if(res.ok){
					setLoading(false)
					setPosts(data.posts)
					if(data.posts.length === 9){
						setShowMore(true)
					}else{
						setShowMore(false)
					}
				}else{
					console.log(data.message);
					setLoading(false)
				}
			} catch (error) {
				console.log(error.message);
				setLoading(false)
			}

		}
		getPosts()
		console.log();
		
	},[location.search])


	console.log(sidebarData);



	const handleCange = (e) => {
		if(e.target.id === "searchTrem"){
			setSidebarData({
				...sidebarData,
				searchTrem:e.target.value,
			})
		}
		if(e.target.id === "sort"){
			const order = e.target.value || "desc"
			setSidebarData({
				...sidebarData,
				sort:order,
			})
			
		}
		if(e.target.id === "category"){
			const category = e.target.value || "uncategorized";
			setSidebarData({
				...sidebarData,
				category:category,
			})
			
		}
	}
	const handleSunmit = (e)=>{
		e.preventDefault()
		const urlParams = new URLSearchParams(location.search)
		urlParams.set("sort" , sidebarData.sort);
		urlParams.set("category" , sidebarData.category);
		const searchQuery = urlParams.toString()
		console.log(searchQuery);
		navigate(`/search?${searchQuery}`)
	}
	const handleShowMore = async(e) =>{
		e.preventDefault()
		const numberOfPosts = posts.length
		const startIndex = numberOfPosts;
		const urlParams = new URLSearchParams(location.search)
		urlParams.set("startIndex",startIndex)
		const searchQuery = urlParams.toString()
		console.log(searchQuery);
		
		try {
			const res = await fetch(`/api/post/getposts?${searchQuery}`)
			const data = await res.json()
			if(res.ok){
				setPosts([
					...posts,
					data.posts
				])
				if(data.posts === 9 ){
					setShowMore(true)
				}else{
					setShowMore(false)
				}
			}else{
				console.log(error.message);
			}
		} catch (error) {
			console.log(error.message);
			
		}

	}
  return (
    <div className=' flex flex-col md:flex-row'>
			<div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
				<form className='flex flex-col gap-8' onSubmit={handleSunmit}>
					<div className='flex items-center gap-2 '>
						<label className='font-bold whitespace-nowrap'>Search Term:</label>
						<TextInput
						placeholder='search...'
						id='searchTrem'
						type='text'
						value={sidebarData.searchTrem || ""}
						onChange={handleCange}
						/>
					</div>


					<div className='flex  items-center gap-2 '>
						<label className='font-bold whitespace-nowrap'>sort:</label>
						<Select onChange={handleCange} value={sidebarData.sort || ""} id='sort'>
							<option value="desc">Latest</option>
							<option value="asc">Oldest</option>
						</Select>
					</div>




					<div className='flex  items-center gap-2 '>
						<label className='font-bold whitespace-nowrap'>category:</label>
						<Select onChange={handleCange} value={sidebarData.category || ""} id='category'>
							<option value="uncategorized">Uncategorized</option>
							<option value="javascript">JavaScript</option>
							<option value="reactjs">React.js</option>
							<option value="nextjs">Next.js</option>
						</Select>
					</div>
					<Button gradientDuoTone="purpleToPink" outline type='submit'>search</Button>
				</form>
			</div>

			<div className='w-full'>
				<h1 className='text-3xl font-bold sm:border-b border-gray-500 p-3 mt-5 '>Posts results:</h1>
				<div className='p-7 flex flex-wrap gap-4 justify-center'>
						{
							!loading && posts && posts.length === 0 && (
								<p className='text-gray-500  text-xl'>
									no posts found
								</p>
							)
						}
						{
							loading &&  (
								<p className='text-gray-500  text-xl'>
									loading...
								</p>
							)
						}
						{
							!loading && posts && posts.map((post)=>(
								<PostCard  post={post} key={post._id}/>
							))
						}
				</div>
						{
							showMore && (<div className='w-full flex justify-center'>
								<button className='
							text-teal-500 text-2xl font-bold py-4 my-3 text-center w-[95%] border-teal-500 rounded-xl border-2 hover:text-white hover:bg-teal-500 transition-all duration-300 
							'
							onClick={handleShowMore}
							>
								showMore
							</button>
								</div>)
						}
			</div>
		</div>
  )
}
