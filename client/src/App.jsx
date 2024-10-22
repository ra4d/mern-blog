import {BrowserRouter , Routes , Route} from "react-router-dom"

import {Home , About , Projects , Dashboard , SignIn , SignUp  , CreatePost} from "./pages/index.js"
import PrivateRoute from "./components/PrivateRoute.jsx"
import Header from "./components/Header.jsx"
import FooterSection from "./components/FooterSection.jsx"
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute.jsx"
import UpdatePost from "./pages/UpdatePost.jsx"
import PostPage from "./pages/PostPage.jsx"
import ScrollToTop from "./components/ScrollToTop.jsx"
import Search from "./components/Search.jsx"

function App() {
  return (
    <>
    <BrowserRouter>
    <ScrollToTop />
    <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/projects" element={<Projects/>}/>
        <Route element={<PrivateRoute/>}>
        <Route path="/dashboard" element={<Dashboard/>}/>
        </Route>
        <Route element={<OnlyAdminPrivateRoute/>}>
        <Route path="/create-post" element={<CreatePost/>}/>
        <Route path="/update-post/:postId" element={<UpdatePost />}/>
        </Route>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/post/:slug" element={<PostPage/>}/>
        <Route path="/search" element={<Search/>}/>


      </Routes>
      <FooterSection/>
    </BrowserRouter>
    </>
  )
}

export default App
