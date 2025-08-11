// src/components/Navbar.jsx
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlignJustify, Search, User } from "lucide-react";
import logo from "../../assets/EEINA_final_141123/Logo/logo.png";
import { useLang } from "../../context/LangContext";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../app/slice/useSlice";
import toast from "react-hot-toast";
import { toggleModal } from "../../../app/slice/modalSlice";
import SearchNavModal from "./SearchNavModal/SearchNavModal";
import useOnClickOutside from "../../Hook/useOnClickOutside";
import { useForm } from "react-hook-form";

const Navbar = () => {
      const {
            register,
            handleSubmit,
            // reset
      } = useForm();

      const { user, isAuthenticated } = useSelector((state) => state.user);
      const { isArabic, toggleLang } = useLang();

      // State for sidebars and dropdowns
      const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
      const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
      const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
      const [isDropdownOpen, setIsDropdownOpen] = useState(false);
      const [isAnimating, setIsAnimating] = useState(false);
      const [show, setShow] = useState(false);
      const ref = useRef();

      useOnClickOutside(ref, () => setShow(false));

      // Disable scroll when search modal is open
      useEffect(() => {
            const handleKeyDown = (e) => {
                  const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
                  if (scrollKeys.includes(e.key)) {
                        e.preventDefault();
                  }
            };

            if (show) {
                  document.body.style.overflow = 'hidden';
                  window.addEventListener('keydown', handleKeyDown, { passive: false });
            } else {
                  document.body.style.overflow = '';
                  window.removeEventListener('keydown', handleKeyDown);
            }
            return () => {
                  document.body.style.overflow = '';
                  window.removeEventListener('keydown', handleKeyDown);
            };
      }, [show]);

      const [search, setSearch] = useState("");
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const location = useLocation();
      const from = location.state?.from?.pathname || "/";

      const handleLogout = () => {
            dispatch(logoutUser())
                  .unwrap()
                  .then((res) => {
                        console.log(res);
                        setIsProfileDropdownOpen(false);
                        toast.success("Logout successful");
                        navigate(from, { replace: true });
                  })
                  .catch((err) => {
                        toast.error(err);
                  });
      };

      const updateSearchHistory = (searchTerm) => {
            if (!searchTerm) return;
            let storedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
            storedHistory = storedHistory.filter(item => item !== searchTerm);
            storedHistory.push(searchTerm);
            if (storedHistory.length > 10) {
                  storedHistory.shift();
            }
            localStorage.setItem("searchHistory", JSON.stringify(storedHistory));
      };

      const handleSearch = (data) => {
            const searchTerm = data.search.trim();
            if (!searchTerm) return;
            updateSearchHistory(searchTerm);
            navigate(`/search?keyword=${searchTerm}`);
            setSearch("");
            setShow(false);
      };

      const handleSearchByQuery = (query, queryType) => {
            const searchTerm = query.trim();
            if (!searchTerm) return;
            updateSearchHistory(searchTerm);
            let queryStr = "";
            if (queryType === "category") {
                  queryStr = `?categories=${searchTerm}`;
            } else if (queryType === "ingredient") {
                  queryStr = `?ingredients=${searchTerm}`;
            } else {
                  queryStr = `?keyword=${searchTerm}`;
            }
            setSearch("");
            navigate(`/search${queryStr}`);
            setShow(false);
      };

      const toggleDropdown = () => {
            if (isAnimating) return;

            setIsAnimating(true);
            setIsDropdownOpen(!isDropdownOpen);

            setTimeout(() => {
                  setIsAnimating(false);
            }, 300);
      };

      // Sidebar toggles
      const toggleLeftSidebar = () => setIsLeftSidebarOpen(!isLeftSidebarOpen);
      const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen);
      const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
      const closeSidebars = () => {
            setIsLeftSidebarOpen(false);
            setIsRightSidebarOpen(false);
      };


      return (
            <>
                  <div className="relative z-[100]">
                        {/* NAVBAR */}
                        <nav className="w-full bg-white border-b border-gray-200"/*  dir={isArabic ? "rtl" : "ltr"} */>
                              <div className="lg:max-w-defaultContainer mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="flex items-center justify-between h-16">
                                          {/* LEFT: Hamburger + Logo */}
                                          <div className="flex items-center space-x-4">
                                                <button
                                                      type="button"
                                                      className="text-gray-600 hover:text-gray-900 focus:outline-none md:hidden"
                                                      onClick={toggleLeftSidebar}
                                                >
                                                      <AlignJustify size={24} />
                                                </button>
                                                <Link to="/" className="flex items-center">
                                                      <img className="w-32" src={logo} alt="eeina-logo" />
                                                </Link>
                                          </div>

                                          {/* MIDDLE: Navigation Links */}
                                          <div className="hidden md:flex flex-1 justify-center space-x-20" dir={isArabic ? "rtl" : "ltr"}>
                                                <Link to="/feed" className="text-gray-600 hover:text-gray-900 transition-colors">
                                                      {isArabic ? "استكشاف" : "Home"}
                                                </Link>
                                                <Link to="/explore" className="text-gray-600 hover:text-gray-900 transition-colors">
                                                      {isArabic ? "استكشاف" : "Explore"}
                                                </Link>
                                                <Link to="/saved" className="text-gray-600 hover:text-gray-900 transition-colors">
                                                      {isArabic ? "أنقذ" : "Saved"}
                                                </Link>
                                                <Link to="/planner" className="text-gray-600 hover:text-gray-900 transition-colors">
                                                      {isArabic ? "مخطط" : "Planner"}
                                                </Link>
                                                <Link to="/lists" className="text-gray-600 hover:text-gray-900 transition-colors">
                                                      {isArabic ? "القوائم" : "Lists"}
                                                </Link>
                                          </div>

                                          {/* RIGHT: Search Bar, Language Toggler, Profile */}
                                          <div className="flex items-center space-x-10">
                                                <form onSubmit={handleSubmit(handleSearch)} className="flex items-center space-x-10">
                                                      <div onClick={() => setShow(true)} className="relative hidden lg:block">
                                                            <input
                                                                  type="text"
                                                                  placeholder={isArabic ? "ابحث عن وصفات" : "Search for recipes"}
                                                                  autoComplete="off"
                                                                  className="border border-gray-300 rounded-full py-2 px-4 w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                                                                  {...register("search", { required: "Search field is required" })}
                                                            />
                                                            <button
                                                                  type="submit"
                                                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                                                            >
                                                                  <Search size={18} />
                                                            </button>
                                                      </div>
                                                </form>

                                                <div className="flex items-center space-x-4" dir={isArabic ? "rtl" : "ltr"}>
                                                      <button onClick={() => setShow(true)} className="text-gray-600 hover:text-gray-900 focus:outline-none md:hidden">
                                                            <Search size={24} />
                                                      </button>

                                                      {/* Language Toggler */}
                                                      <div className="relative">
                                                            <div
                                                                  onClick={toggleDropdown}
                                                                  className="flex items-center justify-between w-24 h-12 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full border border-gray-200 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary group"
                                                            >
                                                                  <div className="flex items-center">
                                                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${isArabic ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}>
                                                                              {isArabic ? 'AR' : 'EN'}
                                                                        </div>
                                                                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                                                                              {isArabic ? 'عربي' : 'English'}
                                                                        </span>
                                                                  </div>

                                                                  <svg
                                                                        className={`w-4 h-4 text-gray-500 transform transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                  >
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                                  </svg>
                                                            </div>

                                                            {/* Dropdown with smooth animation */}
                                                            <div
                                                                  className={`absolute top-14 left-0 w-full bg-white rounded-xl shadow-lg z-10 overflow-hidden transition-all duration-300 ${isDropdownOpen
                                                                        ? 'opacity-100 transform translate-y-0'
                                                                        : 'opacity-0 transform -translate-y-2 pointer-events-none'
                                                                        }`}
                                                            >
                                                                  <div className="py-2">
                                                                        <div
                                                                              className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-200 ${!isArabic
                                                                                    ? 'bg-gray-50 text-primary'
                                                                                    : 'hover:bg-gray-50'
                                                                                    }`}
                                                                              onClick={() => toggleLang({ target: { value: 'en' } })}
                                                                        >
                                                                              <span className="ml-3 text-sm font-medium">English</span>
                                                                              {!isArabic && (
                                                                                    <svg
                                                                                          className="w-4 h-4 ml-auto text-primary"
                                                                                          fill="none"
                                                                                          stroke="currentColor"
                                                                                          viewBox="0 0 24 24"
                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                    >
                                                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                                    </svg>
                                                                              )}
                                                                        </div>

                                                                        <div
                                                                              className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-200 ${isArabic
                                                                                    ? 'bg-gray-50 text-primary'
                                                                                    : 'hover:bg-gray-50'
                                                                                    }`}
                                                                              onClick={() => toggleLang({ target: { value: 'ar' } })}
                                                                        >
                                                                              <span className="ml-3 text-sm font-medium">عربي</span>
                                                                              {isArabic && (
                                                                                    <svg
                                                                                          className="w-4 h-4 ml-auto text-primary"
                                                                                          fill="none"
                                                                                          stroke="currentColor"
                                                                                          viewBox="0 0 24 24"
                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                    >
                                                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                                    </svg>
                                                                              )}
                                                                        </div>
                                                                  </div>
                                                            </div>

                                                            {/* Background overlay */}
                                                            {isDropdownOpen && (
                                                                  <div
                                                                        className="fixed inset-0 bg-black bg-opacity-10 z-0"
                                                                        onClick={() => setIsDropdownOpen(false)}
                                                                  />
                                                            )}
                                                      </div>
                                                </div>

                                                {/* Profile Section */}
                                                <div className="hidden md:flex items-center relative">
                                                      {isAuthenticated ? (
                                                            <button type="button" className="flex items-center focus:outline-none" onClick={toggleProfileDropdown}>
                                                                  <div>
                                                                        {user?.image?.url ? (
                                                                              user?.image?.url === "default.webp" ? (
                                                                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-secondary text-2xl font-bold uppercase">
                                                                                          <span className="text-center text-lg font-oswald font-light">{user?.firstName && user?.firstName[0]}</span>
                                                                                    </div>
                                                                              ) : (
                                                                                    <img src={user?.image?.url} alt="Author" className="w-10 h-10 rounded-full object-cover" />
                                                                              )
                                                                        ) : (
                                                                              <User size={30} className="rounded-full object-cover" />
                                                                        )}
                                                                  </div>
                                                                  <svg className="h-4 w-4 ml-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                  </svg>
                                                            </button>
                                                      ) : (
                                                            <button onClick={() => dispatch(toggleModal())} className="text-gray-600 hover:text-white border border-black hover:bg-black px-3 py-1 rounded-full transition-colors">
                                                                  Login
                                                            </button>
                                                      )}

                                                      {isProfileDropdownOpen && (
                                                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md py-2" dir={isArabic ? "rtl" : "ltr"}>
                                                                  <Link to="/user/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                                        {isArabic ? "الملف الشخصي" : "My Profile"}
                                                                  </Link>
                                                                  <Link to="/saved" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                                        {isArabic ? "المحفوظات" : "Saved"}
                                                                  </Link>
                                                                  <Link to={`/user/${user?._id}/settings`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                                        {isArabic ? "الإعدادات" : "Settings"}
                                                                  </Link>
                                                                  <hr className="my-1" />
                                                                  <div onClick={handleLogout} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                                                                        {isArabic ? "تسجيل الخروج" : "Logout"}
                                                                  </div>
                                                            </div>
                                                      )}
                                                </div>

                                                {/* Mobile: Avatar for Right Sidebar */}
                                                <div className="md:hidden">
                                                      {isAuthenticated ? (
                                                            <button type="button" className="focus:outline-none" onClick={toggleRightSidebar}>
                                                                  {user?.image?.url ? (
                                                                        user?.image?.url === "default.webp" ? (
                                                                              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-secondary text-2xl font-bold uppercase">
                                                                                    <span className="text-center text-lg font-oswald font-light">{user?.firstName && user?.firstName[0]}</span>
                                                                              </div>
                                                                        ) : (
                                                                              <img src={user?.image?.url} alt="Author" className="w-10 h-10 rounded-full object-cover" />
                                                                        )
                                                                  ) : (
                                                                        <User size={30} className="rounded-full object-cover" />
                                                                  )}
                                                            </button>
                                                      ) : (
                                                            <button onClick={() => dispatch(toggleModal())} className="text-gray-600 hover:text-white border border-black hover:bg-black px-3 py-1 rounded-full transition-colors">
                                                                  Login
                                                            </button>
                                                      )}
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </nav>

                        {(isLeftSidebarOpen || isRightSidebarOpen) && (
                              <div className="fixed inset-0 bg-black bg-opacity-30 z-30" onClick={closeSidebars} />
                        )}

                        {/* LEFT SIDEBAR (mobile) */}
                        <div className={`
          fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-md transform transition-transform duration-300
          ${isLeftSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
                              <div className="flex flex-col h-full p-4" dir={isArabic ? "rtl" : "ltr"}>
                                    <h2 className="text-lg font-semibold mb-4">{isArabic ? "قائمة" : "Menu"}</h2>
                                    <nav className="flex flex-col space-y-2">
                                          <Link to="/feed" className="hover:text-primary">{isArabic ? "استكشاف" : "Home"}</Link>
                                          <Link to="/explore" className="hover:text-primary">{isArabic ? "استكشاف" : "Explore"}</Link>
                                          <Link to="/planner" className="hover:text-primary">{isArabic ? "وصفات" : "Planner"}</Link>
                                          <Link to="/lists" className="hover:text-primary">{isArabic ? "التصنيفات" : "Lists"}</Link>
                                    </nav>
                              </div>
                        </div>

                        {/* RIGHT SIDEBAR (mobile) */}
                        <div className={`
          fixed top-0 right-0 z-40 h-full w-64 bg-white shadow-md transform transition-transform duration-300
          ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full"}
        `} dir={isArabic ? "rtl" : "ltr"}>
                              <div className="flex flex-col h-full p-4">
                                    <h2 className="text-lg font-semibold mb-4">{isArabic ? "الملف الشخصي" : "Profile"}</h2>
                                    <nav className="flex flex-col space-y-2">
                                          <Link to="/user/profile" className="hover:text-primary">{isArabic ? "الملف الشخصي" : "My Profile"}</Link>
                                          <Link to="/saved" className="hover:text-primary">{isArabic ? "المحفوظات" : "Saved"}</Link>
                                          <Link to={`/user/${user?._id}/settings`} className="hover:text-primary">{isArabic ? "الإعدادات" : "Settings"}</Link>
                                          <button onClick={handleLogout} className="w-fit hover:text-primary">{isArabic ? "تسجيل الخروج" : "Logout"}</button>
                                    </nav>
                              </div>
                        </div>
                  </div>
                  <SearchNavModal
                        show={show}
                        setShow={setShow}
                        search={search}
                        setSearch={setSearch}
                        ref={ref}
                        handleSearchByQuery={handleSearchByQuery}
                        handleSubmit={handleSubmit}
                        handleSearch={handleSearch}
                        register={register}
                  />
            </>
      );
};

Navbar.propTypes = {
      setIsModalOpen: PropTypes.func.isRequired,
};

export default Navbar;
