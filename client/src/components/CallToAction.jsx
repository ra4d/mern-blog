import { Button } from 'flowbite-react'
import React from 'react'

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row  justify-center items-center border border-teal-500 gap-5 p-4 sm:gap-4 rounded-tr-3xl rounded-bl-3xl flex-wrap'>
        <div className='flex-1 flex flex-col gap-2'>
					<h4 className='text-3xl font-bold'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reprehenderit, asperiores?</h4>
					<p className='text-gray-500'>you want to learn javascript</p>
					<Button gradientMonochrome="purple" className='w-full rounded-bl-none'>purple</Button>
        </div>
        <div className='flex-1 '>
					<img src={"https://imgs.search.brave.com/UQ-tJnENTrYDQI58ttNZC__qAyYd0SQ-ijHollimYOQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTI4/NDI3MTg3OC9waG90/by9qYXZhc2NyaXB0/LWluc2NyaXB0aW9u/LWFnYWluc3QtbGFw/dG9wLWFuZC1jb2Rl/LWJhY2tncm91bmQt/bGVhcm4tamF2YXNj/cmlwdC1wcm9ncmFt/bWluZy53ZWJwP2E9/MSZiPTEmcz02MTJ4/NjEyJnc9MCZrPTIw/JmM9SXZPckFmVHVl/bVU4cmZieWRaeXpo/Qkh2VE5FZ2dEeXdQ/QjJ5alNJUTN4VT0"} alt="javascript" className='object-cover rounded-md bg-gray-400'/>
        </div>
    </div>
  )
}
