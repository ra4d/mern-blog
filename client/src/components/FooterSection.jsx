import {Footer} from  "flowbite-react"
import { Link } from "react-router-dom";
import { BsFacebook , BsInstagram  , BsTwitter , BsGithub} from "react-icons/bs";


function FooterSection() {
  return (
    <Footer className={`border border-teal-700 border-t-8`}>
      <div className=" w-full max-w-7xl mx-auto p-5">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className=" ">
            <Link to="/" className={`self-center whitespace-nowrap text-lg font-semibold dark:text-white`}>
              <span className={`px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500  to-pink-500 rounded-xl text-white`}>Shand's</span>
              Blog
            </Link>
          </div>
          <div className={`grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6`}>
            <div>
            <Footer.Title title="About" />
            <Footer.LinkGroup col >
              <Footer.Link href="/" >
                100 js project
              </Footer.Link>
              <Footer.Link href="/" >
                Sahand's Blog
              </Footer.Link>
            </Footer.LinkGroup>
            </div>
            <div>
            <Footer.Title title="FOLLOW US" />
            <Footer.LinkGroup col >
              <Footer.Link href="/" >
                Github
              </Footer.Link>
              <Footer.Link href="/" >
                Discord
              </Footer.Link>
            </Footer.LinkGroup>
            </div>
            <div>
            <Footer.Title title="LEGAL" />
            <Footer.LinkGroup col >
              <Footer.Link href="/" >
                Privacy Policy
              </Footer.Link>
              <Footer.Link href="/" >
                Terms & Conditions
              </Footer.Link>
            </Footer.LinkGroup>
            </div>

          </div>
        </div>
        <Footer.Divider />
        <div className=" w-full sm:flex sm:justify-between sm:items-center">
          <Footer.Copyright by="ra4d" href="/" year={new Date().getFullYear()} />
          <div className=" flex gap-6  sm:mt-0 mt-4 sm:justify-center">
          <Footer.Icon href="/" icon={BsFacebook} />
          <Footer.Icon href="/" icon={BsInstagram} />
          <Footer.Icon href="/" icon={BsTwitter} />
          <Footer.Icon href="/" icon={BsGithub} />
        </div>
        </div>
        
      </div>
    </Footer>
  )
}

export default FooterSection;