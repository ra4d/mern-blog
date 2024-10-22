import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaUsers } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { BiCommentDetail } from "react-icons/bi";
import { HiArrowNarrowRight, HiUser, HiDocumentText } from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashboardCom() {
  const [users, setUsers] = useState(null);
  const [totaleUsers, setTotaleUsers] = useState(null);
  const [lastMonthUsers, setLastMonthUsers] = useState(null);

  const [post, setPost] = useState(null);
  const [totalePosts, setTotalePosts] = useState(null);
  const [lastMonthPost, setLastMonthPost] = useState(null);

  const [comment, setComment] = useState(null);
  const [totaleComment, setTotaleComment] = useState(null);
  const [lastMonthComment, setLastMonthComment] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
	
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers?limit=${5}`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotaleUsers(data.TU);
          setLastMonthUsers(data.LMTU);
        } else {
          console.log(data.message);
        }
      } catch (error) {}
    };
    const getPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=${5}`);
        const data = await res.json();
        if (res.ok) {
          setPost(data.posts);
          setTotalePosts(data.totalPosts);
          setLastMonthPost(data.lastMonthPosts);
        } else {
          console.log(data.message);
        }
      } catch (error) {}
    };
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getallcomments?limit=${5}`);
        const data = await res.json();
        if (res.ok) {
          setComment(data.AllComments);
          setTotaleComment(data.totalComment);
          setLastMonthComment(data.commentfromonemonthago);
        } else {
          console.log(data.message);
        }
      } catch (error) {}
    };
    if (currentUser && currentUser.isAdmin) {
      getPosts();
      getComments();
      getUsers();
    }
  }, [currentUser]);
  return (
    <div className="w-full">
      {currentUser && currentUser.isAdmin && (
        <>
          <div className="max-w-6xl w-full  p-3 mx-auto flex gap-4 flex-wrap justify-center items-center">
            <div className="w-80 h-40 rounded-lg shadow-lg flex flex-col justify-between p-3">
              <div className="flex justify-between ">
                <div>
                  <h4 className="text-lg uppercase font-bold text-gray-500">
                    totale users
                  </h4>
                  <span className="text-lg uppercase font-bold mt-2">
                    {totaleUsers}
                  </span>
                </div>
                <FaUsers className="text-6xl bg-teal-500 rounded-full p-2" />
              </div>
              <div className="flex gap-2 items-center text-teal-500">
                <span className="flex gap-2 items-center text-teal-500">
                  <FaArrowUp />
                  {lastMonthUsers}
                </span>
                <p className="text-lg text-gray-500">last month</p>
              </div>
            </div>

            <div className="w-80 h-40  rounded-lg shadow-lg flex flex-col justify-between p-3">
              <div className="flex justify-between ">
                <div>
                  <h4 className="text-lg uppercase font-bold text-gray-500">
                    totale comment
                  </h4>
                  <span className="text-lg uppercase font-bold mt-2">
                    {totaleComment}
                  </span>
                </div>
                <BiCommentDetail className="text-6xl bg-indigo-500 rounded-full p-2" />
              </div>
              <div className="flex gap-2 items-center text-indigo-500">
                <span className="flex gap-2 items-center text-indigo-500">
                  <FaArrowUp />
                  {lastMonthComment}
                </span>
                <p className="text-lg text-gray-500">last month</p>
              </div>
            </div>

            <div className="w-80 h-40 rounded-lg shadow-lg flex flex-col justify-between p-3">
              <div className="flex justify-between ">
                <div>
                  <h4 className="text-lg uppercase font-bold text-gray-500">
                    totale post
                  </h4>
                  <span className="text-lg uppercase font-bold mt-2">
                    {totalePosts}
                  </span>
                </div>
                <HiDocumentText className="text-6xl bg-green-500 rounded-full p-2" />
              </div>
              <div className="flex gap-2 items-center text-green-500">
                <span className="flex gap-2 items-center text-green-500">
                  <FaArrowUp />
                  {lastMonthPost}
                </span>
                <p className="text-lg text-gray-500">last month</p>
              </div>
            </div>
          </div>

          <div className="max-w-6xl w-full mx-auto p-3 flex gap-4 flex-wrap justify-center ">
            <div className=" shadow-lg rounded-xl ">
              <div className="font-bold text-xl flex justify-between items-center p-2">
                <h1>recent users</h1>
                <Link to={"/dashboard?tab=user"}>
                  <Button outline gradientDuoTone="purpleToPink">
                    see all
                  </Button>
                </Link>
              </div>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>user image</Table.HeadCell>
                  <Table.HeadCell>username</Table.HeadCell>
                </Table.Head>
                {
									users && users.map((e)=>(
										<Table.Body className="divide-y" key={e._id}>
								<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <img src={e.profilePicture} alt={e.username}  className="w-10 h-10 rounded-full"/>
                    </Table.Cell>
                    <Table.Cell>{e.username}</Table.Cell>
                    
                  </Table.Row>
                </Table.Body>
									))
								}
              </Table>
            </div>


						<div className=" shadow-lg rounded-xl ">
              <div className="font-bold text-xl flex justify-between items-center p-2">
                <h1>recent comments</h1>
                <Link to={"/dashboard?tab=comment"}>
                  <Button outline gradientDuoTone="purpleToPink">
                    see all
                  </Button>
                </Link>
              </div>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>comment content</Table.HeadCell>
                  <Table.HeadCell>Likes</Table.HeadCell>
                </Table.Head>
                {
									comment && comment.map((e)=>(
										<Table.Body className="divide-y" key={e._id}>
								<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white w-96">
                      {e.content}
                    </Table.Cell>
                    <Table.Cell>{e.numberOfLikes}</Table.Cell>
                    
                  </Table.Row>
                </Table.Body>
									))
								}
              </Table>
            </div>





						<div className=" shadow-lg rounded-xl ">
              <div className="font-bold text-xl flex justify-between items-center p-2">
                <h1>recent posts</h1>
                <Link to={"/dashboard?tab=post"}>
                  <Button outline gradientDuoTone="purpleToPink">
                    see all
                  </Button>
                </Link>
              </div>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>post image</Table.HeadCell>
                  <Table.HeadCell>post title</Table.HeadCell>
                  <Table.HeadCell>category</Table.HeadCell>
                </Table.Head>
                {
									post && post.map((e)=>(
										<Table.Body className="divide-y" key={e._id}>
								<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <img src={e.image} alt={e.title}  className="w-10 h-10 rounded-full"/>
                    </Table.Cell>
                    <Table.Cell className="w-96">{e.title}</Table.Cell>
                    <Table.Cell>{e.category}</Table.Cell>
                    
                  </Table.Row>
                </Table.Body>
									))
								}
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
