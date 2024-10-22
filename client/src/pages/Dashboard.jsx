import { useEffect, useState } from "react"
import {useLocation} from "react-router-dom"
import DahSidebar from "../components/DahSidebar"
import DashProfile from "../components/DashProfile"
import DashPost from "../components/DashPost"
import DashComment from "../components/DashComment"
import DashboardCom from "../components/DashboardCom"
import DashUsers from "../components/DashUsers"


function Dashboard(){
  const location = useLocation()
  const [tab, setTab] = useState('')
  useEffect(()=>{
    const URLParams = new URLSearchParams(location.search)
    const URLFormTab = URLParams.get('tab')
    if(URLFormTab){
      setTab(URLFormTab)
    }
  },[location.search])

  return(
    <div className="min-h-screen flex flex-col md:flex-row ">
      <div className="md:w-56">
        {/* Sidebar */}
        <DahSidebar/>
      </div>
      {/* profile... */}
      {
        tab == "profile" && <DashProfile />
      }
      {/* user... */}
      {
          tab == "user" && <DashUsers/>
        }
      {/* posts... */}
        {
          tab == "post" && <DashPost/>
        }
        {/* comment */}
        {
          tab == "comment" && <DashComment />
        }
        {/* dashboard */}
        {
          tab == "dash" && <DashboardCom />
        }
    </div>
  )
}

export default Dashboard