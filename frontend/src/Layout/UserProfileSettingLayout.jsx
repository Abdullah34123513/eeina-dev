import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { logoutUser } from '../../app/slice/useSlice';
import Footer from '../Components/Footer/Footer';
import { useLang } from '../context/LangContext';

const UserProfileSettingLayout = () => {
      const { id } = useParams();
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const location = useLocation();
      const { isArabic } = useLang();
      const from = location.state?.from?.pathname || "/";

      const handleLogout = () => {
            dispatch(logoutUser())
                  .unwrap()
                  .then(() => {
                        toast.success(isArabic ? 'تم تسجيل الخروج بنجاح' : 'Logout successful');
                        navigate(from, { replace: true });
                  })
                  .catch((err) => {
                        toast.error(err);
                  });
      };

      return (
            <div className="flex flex-col min-h-screen font-oswald font-light text-black" >
                  <div className="sticky top-0 z-50">
                        <Navbar />
                  </div>

                  <div className="lg:mx-40 flex flex-1">
                        {/* Sidebar */}
                        <div
                              className={`
            fixed lg:sticky lg:top-44 left-0 h-full
            bg-gray-800 lg:bg-transparent
            text-white lg:text-black
            w-96 p-5 transition-transform duration-300
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
          `}
                        >
                              <button
                                    className="block lg:hidden absolute top-4 right-4"
                                    onClick={() => setIsSidebarOpen(false)}
                              >
                                    <X size={24} />
                              </button>

                              <ul className="w-full h-full mt-10 lg:mt-0 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl">
                                    <li>
                                          <NavLink
                                                to={`/user/${id}/settings`}
                                                end
                                                onClick={() => setIsSidebarOpen(false)}
                                                className={({ isActive }) =>
                                                      `block border-b border-gray-300 px-2 py-3 text-center
                    ${isActive
                                                            ? 'text-primary border border-primary rounded-md'
                                                            : 'text-white lg:text-black'
                                                      }`
                                                }
                                                dir={isArabic ? 'rtl' : 'ltr'}
                                          >
                                                {isArabic ? 'حسابي' : 'My Account'}
                                          </NavLink>
                                    </li>
                                    <li>
                                          <button
                                                className="w-full block border-b border-gray-300 px-2 py-3 text-center text-white lg:text-black hover:opacity-80"
                                                onClick={handleLogout}
                                                dir={isArabic ? 'rtl' : 'ltr'}
                                          >
                                                {isArabic ? 'تسجيل الخروج' : 'Logout'}
                                          </button>
                                    </li>
                              </ul>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 p-6 min-h-screen">
                              <button
                                    className="block md:hidden text-gray-800 mb-4"
                                    onClick={() => setIsSidebarOpen(true)}
                              >
                                    <Menu size={24} />
                              </button>
                              <Outlet />
                        </div>
                  </div>

                  <Footer />
            </div>
      );
};

export default UserProfileSettingLayout;
