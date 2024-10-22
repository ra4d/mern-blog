import React from 'react'
import { Link } from 'react-router-dom'

export default function PostCard({post}) {
  return (
    <div className='group w-full border p-2 border-teal-500 rounded-lg hover:border-2 h-[400px] sm:w-[340px] overflow-hidden'>
        <Link to={`/post/${post.slug}`}>
            <img src={post.image} alt="image cover" className='h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20' />
        </Link>
        <div className='relative flex flex-col  gap-4 mt-4'>
            <p className='text-2xl font-bold'>{post.title}</p>
            <span className='text-base '>{post.category}</span>
            <Link to={`/post/${post.slug}`}>
            <button className='
                border border-teal-500 rounded-lg !rounded-tl-none 
                text-xl p-2 font-bold text-teal-500
                hover:bg-teal-500 hover:text-white
                transition-all duration-300
                absolute w-full top-[200px] left-0 right-0 group-hover:top-[115px]
            '>Show More</button>
            </Link>
        </div>
    </div>
  )
}
