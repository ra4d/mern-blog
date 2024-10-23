import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation , useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import themeSlice from "../features/them/themeSlice.js";
import userSlice from "../features/user/userSlice.js";
import { useEffect, useState } from "react";

function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme.theme);
  const [searchTrem , setSearchTrem] = useState("")

  
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const searchTremFromUrl = urlParams.get("searchTrem")
    if(searchTremFromUrl){
      setSearchTrem(searchTremFromUrl)
    }

    
  },[location.search])
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
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search)
    urlParams.set("searchTrem" , searchTrem)
    navigate(`/search?${urlParams.toString()}`)
  }
  return (
    <Navbar className={`border-b-2`}>
      <Link
        to="/"
        className={`self-center whitespace-nowrap text-sm sm:text-lg font-semibold dark:text-white`}
      >
        <span
          className={`px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500  to-pink-500 rounded-xl text-white`}
        >
          Shand's
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          className="hidden lg:inline"
          value={searchTrem || ""}
          onChange={(e)=>{
            setSearchTrem(e.target.value)
          }}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-12 hidden sm:inline"
          color="gray"
          pill
          onClick={() => {
            dispatch(themeSlice.actions.toggleThem());
          }}
        >
          {theme == "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className=" text-sm block">@{currentUser.username}</span>
              <span className=" text-sm block font-medium truncate">
                @{currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>profile</Dropdown.Item>
            </Link>

            <Dropdown.Item onClick={handleSingout}>sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Porjects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
