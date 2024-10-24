import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate , useParams} from "react-router-dom";
import {useSelector} from "react-redux"
export default function UpdatePost() {
	const {currentUser} = useSelector((state)=>(state.user))
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [publishError , setPublishError] = useState(null)
  const [formData, setFormData] = useState({});
  const navigate = useNavigate()
	const {postId} = useParams()


	useEffect(()=>{
		const getpost = async()=>{
			try{
				const res = await fetch(`/api/post/getposts?postId=${postId}&?userId=${currentUser._id}`)
				const data = await res.json()
				if(res.ok){
					setFormData(data.posts[0]);
					
				}else{
					console.log(data.message);
					
				}
			}catch(error){
				console.log(error.message);
				
			}
		}
		if(currentUser.isAdmin){
			getpost()
		}

	},[postId])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime + "_" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image Upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image Upload failed");
      setImageUploadProgress(null);
      console.log(error.message);
    }
  };
  const handleSubmit = async(e)=>{
    e.preventDefault()
    try{
      const res = await fetch(`/api/post/updatepost/${currentUser._id}/${postId}`,{
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if(res.ok){
        setPublishError(null)
        navigate(`/post/${data.slug}`)
      }else{
        setPublishError(data.message)
      }
    }catch(error){
      setPublishError(data.message)
    }
  }
  return (
    <div className={`p-3 max-w-3xl mx-auto min-h-screen flex flex-col gap-4`}>
      <h1 className={`text-3xl font-semibold py-7 text-center`}>
        create a post
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className={`flex flex-col sm:flex-row justify-between gap-4`}>
        <TextInput
          placeholder="Title"
          required
          id="title"
          className="flex-1"
          onChange={handleChange}
					value={formData.title || ""}
          />
        <Select
          onChange={(e)=>{setFormData({...formData , category:e.target.value})}}
					value={formData.category || ""}
          >
          <option value="uncategorized">Select a category</option>
          <option value="javascript">JavaScript</option>
          <option value="reactjs">React.js</option>
          <option value="nextjs">Next.js</option>
        </Select>
      </div>
      <div
        className={`flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3`}
        >
        <FileInput
          type="file"
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
					
          />
        <Button
          type="button"
          gradientDuoTone="purpleToBlue"
          size="sm"
          outline
          onClick={handleUploadImage}
          disabled={imageUploadProgress}
          >
          {
            imageUploadProgress ? (<div className="w-16 h-16 ">
              <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`}/>
            </div>):"Upload Image"
          }
        </Button>
      </div>
      {
        imageUploadError && (<Alert color="failure">{imageUploadError}</Alert>)
      }
      {
        formData && formData.image && (<img src={formData.image} alt="upload" className="w-full h-72 object-cover" />)
      }
      <ReactQuill
        as={"div"}
        theme="snow"
        className="h-72 mb-12"
        placeholder="Write something..."
        required
        onChange={(value)=>{setFormData({...formData , content:value})}}
				value={formData.content || ""}
        />
      <Button type="submit" gradientDuoTone="purpleToPink" className="w-full">
        Publish
      </Button>
        </form>
        {
          publishError && (<Alert color="failure">{publishError}</Alert>)
        }
    </div>
  );
}
