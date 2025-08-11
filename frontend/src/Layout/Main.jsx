import { Outlet } from "react-router-dom"
import Navbar from "../Components/Navbar/Navbar"
import AuthModals from "../Pages/Auth/Auth";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../app/slice/modalSlice";
import Footer from "../Components/Footer/Footer";

const Main = () => {
      const dispatch = useDispatch();
      const isModalOpen = useSelector((state) => state.modal.isModalOpen);

      return (
            <div className="font-oswald font-light">
                  <Navbar/>
                  <div className="max-w-defaultContainer mx-auto p-6 lg:p-10 min-h-screen">
                        <Outlet />
                  </div>
            <Footer/>
                  <AuthModals
                        isOpen={isModalOpen}
                        onClose={() => dispatch(closeModal())}
                  />
            </div>
      )
}

export default Main