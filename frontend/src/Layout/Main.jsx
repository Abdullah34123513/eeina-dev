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
            <div className="font-body bg-gradient-to-br from-primary-50/30 via-white to-accent-50/30 min-h-screen">
                  <Navbar/>
                  <div className="container-modern min-h-screen">
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