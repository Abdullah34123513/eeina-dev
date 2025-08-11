import { Outlet } from "react-router-dom"
import Navbar from "../Components/Navbar/Navbar"

const AdminLayout = () => {
      return (
            <div>
                  <Navbar />
                  <div className="max-w-defaultContainer mx-auto p-6 lg:p-10">
                        <Outlet />
                  </div>
            </div>
      )
}

export default AdminLayout