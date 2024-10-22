import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";

import {GoogleAuthProvider , signInWithPopup , getAuth} from "firebase/auth"
import { app } from "../firebase";

import {useDispatch , useSelector } from "react-redux"
import userSlice from "../features/user/userSlice";
import { useNavigate } from "react-router-dom"

export default function Oauth() {
  const dispatch  = useDispatch()
  const navigate = useNavigate()
	const auth = getAuth(app)
	const handleGoogle = async() => { 
		const provider = new GoogleAuthProvider()
		provider.setCustomParameters({prompt :"select_account"})
		try{
			const resultsFromGoogle = await signInWithPopup(auth , provider)
      console.log(resultsFromGoogle);
      const res = await fetch("/api/auth/google",
        {
          method:"post",
          headers:{"Content-Type" : "application/json"},
          body: JSON.stringify({
            name : resultsFromGoogle.user.displayName,
            email : resultsFromGoogle.user.email,
            googlePhotoUrl: resultsFromGoogle.user.photoURL
          })
        })
        const data = await res.json()
        if(res.ok){
          dispatch(userSlice.actions.signInSuccess(data))
          navigate('/')
        }
		}catch(error){
			console.log(error);
		}
	}
  return (
    <Button
    onClick={handleGoogle}
    outline
    gradientDuoTone="pinkToOrange"
    type="button"
    >
        <AiFillGoogleCircle className="w-6 h-6 mr-2" />
        Continue With Google

    </Button>
  )
}
