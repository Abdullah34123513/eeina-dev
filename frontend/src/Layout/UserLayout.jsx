import { Outlet } from "react-router-dom"
import Navbar from "../Components/Navbar/Navbar"
import { useSelector } from "react-redux";
import UserHeader from "../Pages/UserDashboard/Profile/UserHeader";
import Footer from "../Components/Footer/Footer";

const UserLayout = () => {
      const { user } = useSelector((state) => state.user);
      return (
            <div className="font-oswald font-light">
                  <Navbar />
                  <UserHeader
                        profile={user}
                  />
                  <div className="w-[95%] mx-auto lg:p-4 shadow-[0_0_10px_rgba(0,0,0,0.1)]  rounded-xl">
                        <Outlet />
                  </div>
            <Footer/>
            </div>
      )
}

export default UserLayout