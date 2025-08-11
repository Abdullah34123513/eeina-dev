import { Outlet } from "react-router-dom";
import { closeModal } from "../../app/slice/modalSlice";
import Navbar from "../Components/Navbar/Navbar";
import AuthModals from "../Pages/Auth/Auth";
import { useDispatch, useSelector } from "react-redux";
import LeftSideNav from "../Components/FeedComponents/LeftSideNav";
import RightSideNav from "../Components/FeedComponents/RightSideNav";
import Footer from "../Components/Footer/Footer";

const FeedLayout = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.modal.isModalOpen);

  return (
    <div className="font-oswald font-light">
      <Navbar />
      <div className="max-w-defaultContainer mx-auto p-6 lg:p-10 flex items-start justify-between">
        <div className="hidden md:block sticky top-0 w-1/4 h-screen overflow-y-hidden hover:overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-gray-200">
          <LeftSideNav />
        </div>

        {/* Main content */}
        <div className="w-full md:w-1/2 min-h-screen p-4">
          <Outlet />
        </div>

        {/* Right Sidebar */}
        <div className="hidden md:block sticky top-0 w-1/4 min-h-screen py-4">
          <RightSideNav />
        </div>
      </div>
      <Footer />

      <AuthModals
        isOpen={isModalOpen}
        onClose={() => dispatch(closeModal())}
      />
    </div>
  );
};

export default FeedLayout;
