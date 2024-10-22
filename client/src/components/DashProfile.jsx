import { Alert, Button, TextInput, Modal } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import userSlice from "../features/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageUpload, setImageUpload] = useState(false);
  const [updataUserSuccess, setUpdataUserSuccess] = useState(null);
  const [updataUserError, setUpdataUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const inputImage = useRef();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageURL(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  const uploadImage = async () => {
    // service firebase.storage {
    // 	match /b/{bucket}/o {
    // 		match /{allPaths=**} {
    // 			allow read;
    // 			allow write: if
    // 			request.resource.size < 2 * 1024 * 1024
    // 			&&
    // 			request.resource.contentType.matches('image/.*')
    // 		}
    // 	}
    // }
    setImageUpload(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageURL = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageURL, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageURL(null);
        setImageUpload(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((dowloadURL) => {
          setImageURL(dowloadURL);
          setFormData({ ...formData, profilePicture: dowloadURL });
          setImageUpload(false);
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSumbit = async (e) => {
    setUpdataUserSuccess(null);
    setUpdataUserError(null);
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setUpdataUserError("no changes made");
      return;
    }
    try {
      dispatch(userSlice.actions.updataStart());
      const res = await fetch(`/api/user/updata/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(userSlice.actions.updataSuccess(data));
        setUpdataUserSuccess("User's profile updata successfully");
      } else {
        dispatch(userSlice.actions.updataFailure(data.message));
      }
    } catch (error) {
      dispatch(userSlice.actions.updataFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    setOpenModal(false);
    try {
      dispatch(userSlice.actions.deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "delete",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(userSlice.actions.deleteSuccess());
      } else {
        dispatch(userSlice.actions.deleteFailure(data.message));
      }
    } catch (error) {
      dispatch(userSlice.actions.deleteFailure(error.message));
    }
  };
  const handleSingout = async () => {
    try {
      const res = await fetch(`/api/user/signout/${currentUser._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(userSlice.actions.signoutSuccess());
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className=" flex flex-col max-w-lg w-full mx-auto gap-4">
      <h1 className="text-4xl font-bold self-center py-7">profile</h1>

      <form className="flex flex-col w-full gap-4" onSubmit={handleSumbit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={inputImage}
          hidden
        />

        <div
          className="relative self-center w-28 h-28 rounded-full cursor-pointer"
          onClick={() => {
            inputImage.current.click();
          }}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: "0",
                  left: "0",
                },
                path: {
                  stroke: `rgb(62 , 152, 199 , ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageURL || currentUser.profilePicture}
            alt="user"
            className={`w-full h-full rounded-full border-8 border-[lightgray] object-cover 
              ${
                imageFileUploadProgress &&
                imageFileUploadProgress < 100 &&
                "opacity-60"
              }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />

        <TextInput
          type="text"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />

        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageUpload}
        >
          {loading ? "loading..." : "Update"}
        </Button>
        {currentUser.isAdmin ? (
          <Link to="/create-post">
            <Button gradientDuoTone="purpleToPink" className="w-full">
              create a post
            </Button>
          </Link>
        ) : null}
      </form>
      <div className=" text-red-500 flex justify-between cursor-pointer">
        <span onClick={() => setOpenModal(true)}>Delete Account</span>
        <span onClick={handleSingout}>Sign Out</span>
      </div>
      {error && <Alert color="failure">{error}</Alert>}
      {updataUserSuccess && <Alert color="green">{updataUserSuccess}</Alert>}
      {updataUserError && <Alert color="failure">{updataUserError}</Alert>}
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
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
