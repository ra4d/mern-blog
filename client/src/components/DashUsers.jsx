import { Alert, Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FcCheckmark } from "react-icons/fc";
import { IoCloseSharp } from "react-icons/io5";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashUsers() {
	const [openModal, setOpenModal] = useState(false);
	const [user , setUser] = useState(null)
	const [userID , setUserId] = useState(null)
  const { currentUser } = useSelector((state) => state.user);
  const [ deleteuser , setDeleteuser ] = useState()
  const [showMore , setShowMore] = useState(true)

  useEffect(() => {
    const getusers = async() => {
			try {
				const res = await fetch('/api/user/getusers')
				const data = await res.json()
				if(res.ok){
					setUser(data.users)
          if(data.users.length < 9){
            setShowMore(false)
          }
				}
			} catch (error) {
				console.log(error);
			}};
    if( currentUser && currentUser.isAdmin) {
      getusers();
    }
  }, []);
  const handleShowMore = async()=> {
    const startIndex = user.length
    try{
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`)
      const data = await res.json()
      if(res.ok){
        setUser((prev)=> [...prev , ...data.users])
        if(data.users.length < 9){
          setShowMore(false)
        }
      }else{
        console.log(data.message);
        
      }
    }catch(error){
      console.log(error.message);
      
    }
  }
	const handleDeleteUser = async() => { 
		setOpenModal(false)
		try {
			const res =await fetch(`/api/user/delete/${userID}` , {
				method : "DELETE"
			})
			const data = await res.json()
			if(res.ok){
				setUser((prev)=>prev.filter((e) => e._id !==userID) )
			}else{
        console.log(data.message);
        setDeleteuser(data.message)
      }
		} catch (error) {
      setDeleteuser(error.message)
		}

		}
	

  return <div className="w-full p-2">

		{
			user ? (<>
			<div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Date updata	</Table.HeadCell>
          <Table.HeadCell>user Image	</Table.HeadCell>
          <Table.HeadCell>username</Table.HeadCell>
          <Table.HeadCell>email</Table.HeadCell>
          <Table.HeadCell>admin</Table.HeadCell>
          <Table.HeadCell>
            <span className="">delete</span>
          </Table.HeadCell>
        </Table.Head>
				{
					user.map((e)=>(
						<Table.Body className="divide-y" key={e._id}>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {new Date(e.updatedAt).toLocaleDateString() }
            </Table.Cell>
            <Table.Cell> <img src={e.profilePicture} className="w-10 h-10 object-cover rounded-full"/> </Table.Cell>
            <Table.Cell>{e.username}</Table.Cell>
            <Table.Cell>{e.email}</Table.Cell>
            <Table.Cell>{e.isAdmin ? <FcCheckmark/>:<IoCloseSharp className="text-red-500"/> }</Table.Cell>
            <Table.Cell className="cursor-pointer" onClick={()=>{
							setUserId(e._id)
							setOpenModal(true)
						}}>
              <span href="#" className="font-medium text-red-600 hover:underline dark:text-red-500">
                Delete
              </span>
            </Table.Cell>
          </Table.Row>
          
        </Table.Body>
					))
				}
        <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      </Table>
      {
          showMore && (<Button gradientMonochrome="purple" onClick={handleShowMore} className='w-full my-2'>
              show more
          </Button>)
        }
      {
        deleteuser && (<>
          <Alert color="failure" className="font-bold text-base">{deleteuser}</Alert>
        </>)
      }
    </div>
			</>):(<>
			<p>not users yet!</p>
			</>)
		}
	</div>;
}
