import { Link } from "react-router-dom"
import CallToAction from "../components/CallToAction"
import { useEffect, useState } from "react"
import PostCard from "../components/PostCard";

function Home() {
  const [post, setPost] = useState(null);

  useEffect(()=>{
    const getPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=${9}`);
        const data = await res.json();
        if (res.ok) {
          setPost(data.posts);
        } else {
          console.log(data.message);
        }
      } catch (error) {}
    }
    getPosts()
  },[])
  return (
    <div className="">
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto "> 
        <h2 className="lg:text-6xl text-3xl font-bold capitalize">welcome to my blog</h2>
        <p className="text-gray-500 text-xs sm:text-sm">here you w'll find a  on topics such as web development.</p>
        <Link to={'/search'} className=" w-fit"><button className="text-teal-500 hover:underline font-bold">view all posts</button></Link>
      </div>
      <div className="bg-amber-100 p-3 dark:bg-slate-700 my-8">
        <CallToAction />
      </div>
        <h5 className="text-3xl font-bold text-center my-8">recent post</h5>
      <div className=" my-8 max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-6">
        {
          post && post.map((post)=>(
            <PostCard post={post} key={post._id}/>
          ))
        }
      </div>
        <div className="text-center my-4">
        <Link to={'/search'} className="text-xl text-teal-500 font-bold hover:underline">
          view all post
        </Link >
        </div>
    </div>
  )
}

export default Home