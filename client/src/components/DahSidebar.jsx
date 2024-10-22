import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { HiArrowNarrowRight, HiUser, HiDocumentText } from "react-icons/hi";
import { FaUsers } from "react-icons/fa";


import { MdDashboard } from "react-icons/md";

import { BiCommentDetail } from "react-icons/bi";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import userSlice from "../features/user/userSlice";

export default function DahSidebar() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const URLParams = new URLSearchParams(location.search);
    const URLFormTab = URLParams.get("tab");
    if (URLFormTab) {
      setTab(URLFormTab);
    }
  }, [location.search]);
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
    <Sidebar className=" w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2">
        {currentUser.isAdmin && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={MdDashboard}
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=user">
              <Sidebar.Item
                active={tab === "user"}
                icon={FaUsers}
                as="div"
              >
                user
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=post">
              <Sidebar.Item
                active={tab === "post"}
                icon={HiDocumentText}
                as="div"
              >
                Post
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=comment">
              <Sidebar.Item
                active={tab === "comment"}
                icon={BiCommentDetail}
                as="div"
              >
                Comment
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            className="cursor-pointer"
            icon={HiArrowNarrowRight}
            as="div"
            onClick={handleSingout}
          >
            Sign Up
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
