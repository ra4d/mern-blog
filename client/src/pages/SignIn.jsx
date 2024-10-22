import { Link , useNavigate} from "react-router-dom";
import {Label , TextInput , Button, Alert, Spinner} from "flowbite-react"
import { useState } from "react";
import { useSelector , useDispatch } from "react-redux";
import userSlice from "../features/user/userSlice";
import axios from "axios";
import Oauth from "../components/Oauth";
export default function SignIn() {
  const dispatch  = useDispatch()
  const data = useSelector((state)=>(state.user));
  const [formData , setFormData] = useState({})
  const navigate = useNavigate()
  const handleChange = (e)=>{
    setFormData({...formData ,  [e.target.id] : e.target.value.trim()})
  }
  const handleSubmit = async (e)=>{
    e.preventDefault();    
    if (!formData.email || !formData.password ) {
      return dispatch(userSlice.actions.signInFailure("please fill out all fields."))
    }
    try {
      dispatch(userSlice.actions.signInStart())
      const res = await fetch("/api/auth/signin", {
        method:"post",
        headers:{"Content-Type" : "application/json"},
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if(data.success === false ){
        dispatch(userSlice.actions.signInFailure(data.message))
      }
      if(res.ok){
        dispatch(userSlice.actions.signInSuccess(data));
        navigate("/")
      }
    }catch(err){
        dispatch(userSlice.actions.signInFailure(err.message));
      }
  }
  return (
    <div className=" min-h-screen mt-20 mx-4 md:mx-10">
      <div className=" flex justify-center flex-col md:flex-row md:items-center gap-5 max-w-3xl mx-auto">
        {/* left */}
      <div className="flex-1">
        <Link className={`whitespace-nowrap text-4xl font-bold dark:text-white`}>
            <span className={`px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500  to-pink-500 rounded-xl text-white`}>Shand's</span>
            Blog
        </Link>
        <p className="text-sm mt-5 " >this is demo project. you can sign up with your email and password or with Google</p>
      </div>
      {/* right */}
      <div className="flex-1 ">
        <form className="flex-1 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label value="your email"/>
            <TextInput type="email" placeholder="name@company.com" id="email" onChange={handleChange} />
          </div>
          <div>
            <Label value="your password"/>
            <TextInput type="password" placeholder="********" id="password" onChange={handleChange} />
          </div>
          <Button gradientDuoTone="purpleToPink" type="submit" className="  font-bold" disabled={data.loading}>
            {
              data.loading ? (<>
                <Spinner size="sm"  /> 
                <span className="pl-3">Loaging...</span>
              </>):"Sign In"
            }
          </Button>
          <Oauth />
        </form>
        <div className="mt-5 flex gap-2 text-sm">
          <span>don't Have an account?</span>
          <Link to="/sign-up" className="text-blue-500">
          Sign up
          </Link>
        </div>
        {
          data.error &&
          (<Alert className="mt-5 relative " color="failure" >
            {data.error}
          </Alert>)
        }
      </div>
    </div>
    </div>
  )
}


