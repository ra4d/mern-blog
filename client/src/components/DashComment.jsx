
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashComment() {
  const { currentUser } = useSelector((state) => state.user);
  const [allComment, setAllComment] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [commentId, setCommentId] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/comment/getallcomments`);
        const data = await res.json();
        if (res.ok) {
          setAllComment(data.AllComments);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchPost();
    }
  }, [currentUser._id]);

  const handleDeletecomment = async () => {
    setOpenModal(false);
    try {
      const res = await fetch(
        `/api/comment/delete/${commentId}`,
        {
          method: "delete",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setAllComment((prev) => prev.filter((e) => e._id !== commentId));
      } else {
        dispatch(userSlice.actions.deleteFailure(data.message));
      }
    } catch (error) {
      dispatch(userSlice.actions.deleteFailure(error.message));
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 w-full">
      {currentUser.isAdmin && allComment.length > 0 ? (
        <>
          <Table className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updata</Table.HeadCell>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>number of likes</Table.HeadCell>
              <Table.HeadCell>postId</Table.HeadCell>
              <Table.HeadCell>userId</Table.HeadCell>
              <Table.HeadCell>
                <span>delete</span>
              </Table.HeadCell>
            </Table.Head>
            {allComment.map((comment) => (
              <Table.Body key={comment._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {comment.content}
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white" >
                      {comment.likes.length}
                  </Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>
										{
											comment.userId
										}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setOpenModal(true);
                        setCommentId(comment._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
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
                  <Button color="failure" onClick={handleDeletecomment}>
                    Yes, I'm sure
                  </Button>
                  <Button color="gray" onClick={() => setOpenModal(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <p>don't have any comment</p>
      )}
    </div>
  );
}
