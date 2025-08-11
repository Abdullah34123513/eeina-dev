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
                        <nav className="w-full bg-white/80 backdrop-blur-md border-b border-neutral-200/50 sticky top-0 z-50 shadow-soft">
                              <div className="container-modern">
                                    <div className="flex items-center justify-between h-20">
                                          {/* LEFT: Hamburger + Logo */}
                                          <div className="flex items-center space-x-4">
                                                <button
                                                      type="button"
                                                      className="text-neutral-600 hover:text-primary-600 focus:outline-none md:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors"
                                                      onClick={toggleLeftSidebar}
                                                >
                                                      <AlignJustify size={24} />
                                                </button>
                                                <Link to="/" className="flex items-center">
                                                      <img className="w-36 h-auto" src={logo} alt="eeina-logo" />
                                                </Link>
                                          </div>

                                          {/* MIDDLE: Navigation Links */}
                                          <div className="hidden md:flex flex-1 justify-center space-x-12" dir={isArabic ? "rtl" : "ltr"}>
                                                <Link to="/feed" className="text-neutral-700 hover:text-primary-600 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-primary-50 relative group">
                                                      <span className="relative z-10">{isArabic ? "الرئيسية" : "Home"}</span>
                                                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                                                </Link>
                                                <Link to="/explore" className="text-neutral-700 hover:text-primary-600 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-primary-50 relative group">
                                                      <span className="relative z-10">{isArabic ? "استكشاف" : "Explore"}</span>
                                                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                                                </Link>
                                                <Link to="/saved" className="text-neutral-700 hover:text-primary-600 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-primary-50 relative group">
                                                      <span className="relative z-10">{isArabic ? "المحفوظات" : "Saved"}</span>
                                                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                                                </Link>
                                                <Link to="/planner" className="text-neutral-700 hover:text-primary-600 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-primary-50 relative group">
                                                      <span className="relative z-10">{isArabic ? "المخطط" : "Planner"}</span>
                                                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                                                </Link>
                                                <Link to="/lists" className="text-neutral-700 hover:text-primary-600 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-primary-50 relative group">
                                                      <span className="relative z-10">{isArabic ? "القوائم" : "Lists"}</span>
                                                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                                                </Link>
                                          </div>

                                          {/* RIGHT: Search Bar, Language Toggler, Profile */}
                                          <div className="flex items-center space-x-6">
                                                <form onSubmit={handleSubmit(handleSearch)} className="flex items-center space-x-6">
                                                      <div onClick={() => setShow(true)} className="relative hidden lg:block">
                                                            <input
                                                                  type="text"
                                                                  placeholder={isArabic ? "ابحث عن وصفات" : "Search for recipes"}
                                                                  autoComplete="off"
                                                                  className="input-modern w-80 pl-12"
                                                                  {...register("search", { required: "Search field is required" })}
                                                            />
                                                            <button
                                                                  type="submit"
                                                                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-primary-600 transition-colors"
                                                            >
                                                                  <Search size={20} />
                                                            </button>
                                                      </div>
                                                </form>

                                                <div className="flex items-center space-x-4" dir={isArabic ? "rtl" : "ltr"}>
                                                      <button onClick={() => setShow(true)} className="text-neutral-600 hover:text-primary-600 focus:outline-none md:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors">
                                                            <Search size={24} />
                                                      </button>

                                                      {/* Language Toggler */}
                                                      <div className="relative">
                                                            <div
                                                                  onClick={toggleDropdown}
                                                                  className="flex items-center justify-between w-28 h-12 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-neutral-200 shadow-soft cursor-pointer transition-all duration-300 hover:shadow-medium hover:border-primary-300 group"
                                                            >
                                                                  <div className="flex items-center">
                                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${isArabic ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' : 'bg-neutral-100 text-neutral-700 group-hover:bg-primary-100 group-hover:text-primary-700'}`}>
                                                                              {isArabic ? 'ع' : 'EN'}
                                                                        </div>
                                                                  </div>

                                                                  <svg
                                                                        className={`w-4 h-4 text-neutral-500 transform transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
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
                                                                  className={`absolute top-14 left-0 w-full bg-white rounded-xl shadow-large z-10 overflow-hidden transition-all duration-300 border border-neutral-100 ${isDropdownOpen
                                                                        ? 'opacity-100 transform translate-y-0 visible'
                                                                        : 'opacity-0 transform -translate-y-2 invisible'
                                                                        }`}
                                                            >
                                                                  <div className="py-2">
                                                                        <div
                                                                              className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-200 ${!isArabic
                                                                                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                                                                                    : 'hover:bg-neutral-50'
                                                                                    }`}
                                                                              onClick={() => toggleLang({ target: { value: 'en' } })}
                                                                        >
                                                                              <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold mr-3">
                                                                                    EN
                                                                              </div>
                                                                              <span className="font-medium">English</span>
                                                                              {!isArabic && (
                                                                                    <svg
                                                                                          className="w-4 h-4 ml-auto text-primary-600"
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
                                                                              className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-200 ${isArabic
                                                                                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                                                                                    : 'hover:bg-neutral-50'
                                                                                    }`}
                                                                              onClick={() => toggleLang({ target: { value: 'ar' } })}
                                                                        >
                                                                              <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold mr-3">
                                                                                    ع
                                                                              </div>
                                                                              <span className="font-medium">عربي</span>
                                                                              {isArabic && (
                                                                                    <svg
                                                                                          className="w-4 h-4 ml-auto text-primary-600"
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
                                                                        className="fixed inset-0 bg-black/5 z-0"
                                                                        onClick={() => setIsDropdownOpen(false)}
                                                                  />
                                                            )}
                                                      </div>

                                                      {/* Profile Section */}
                                                      <div className="hidden md:flex items-center relative">
                                                            {isAuthenticated ? (
                                                                  <button type="button" className="flex items-center focus:outline-none group" onClick={toggleProfileDropdown}>
                                                                        <div className="relative">
                                                                              {user?.image?.url ? (
                                                                                    user?.image?.url === "default.webp" ? (
                                                                                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white text-lg font-bold uppercase shadow-soft group-hover:shadow-medium transition-all duration-200">
                                                                                                <span className="font-display">{user?.firstName && user?.firstName[0]}</span>
                                                                                          </div>
                                                                                    ) : (
                                                                                          <img src={user?.image?.url} alt="Profile" className="w-12 h-12 rounded-full object-cover shadow-soft group-hover:shadow-medium transition-all duration-200 border-2 border-white" />
                                                                                    )
                                                                              ) : (
                                                                                    <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                                                                          <User size={24} className="text-neutral-600 group-hover:text-primary-600" />
                                                                                    </div>
                                                                              )}
                                                                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white"></div>
                                                                        </div>
                                                                        <svg className="h-4 w-4 ml-3 text-neutral-600 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                        </svg>
                                                                  </button>
                                                            ) : (
                                                                  <button onClick={() => dispatch(toggleModal())} className="btn-outline text-sm">
                                                                        {isArabic ? "تسجيل الدخول" : "Login"}
                                                                  </button>
                                                            )}

                                                            {isProfileDropdownOpen && (
                                                                  <div className="absolute top-full right-0 mt-3 w-56 bg-white border border-neutral-100 rounded-xl shadow-large py-2 z-50 animate-slide-up" dir={isArabic ? "rtl" : "ltr"}>
                                                                        <div className="px-4 py-3 border-b border-neutral-100">
                                                                              <p className="text-sm font-medium text-neutral-900">
                                                                                    {isArabic 
                                                                                          ? `${user?.firstName?.ar || user?.firstName?.en} ${user?.lastName?.ar || user?.lastName?.en}`
                                                                                          : `${user?.firstName?.en || user?.firstName?.ar} ${user?.lastName?.en || user?.lastName?.ar}`
                                                                                    }
                                                                              </p>
                                                                              <p className="text-xs text-neutral-500">{user?.email}</p>
                                                                        </div>
                                                                        <Link to="/user/profile" className="flex items-center px-4 py-3 text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                                                                              <User size={16} className="mr-3" />
                                                                              {isArabic ? "الملف الشخصي" : "My Profile"}
                                                                        </Link>
                                                                        <Link to="/saved" className="flex items-center px-4 py-3 text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                                                                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                                              </svg>
                                                                              {isArabic ? "المحفوظات" : "Saved"}
                                                                        </Link>
                                                                        <Link to={`/user/${user?._id}/settings`} className="flex items-center px-4 py-3 text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                                                                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                              </svg>
                                                                              {isArabic ? "الإعدادات" : "Settings"}
                                                                        </Link>
                                                                        <hr className="my-1" />
                                                                        <div onClick={handleLogout} className="flex items-center px-4 py-3 text-error hover:bg-error/5 cursor-pointer transition-colors rounded-lg mx-2">
                                                                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                                              </svg>
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
                                                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white text-lg font-bold uppercase shadow-soft">
                                                                                          <span className="font-display">{user?.firstName && user?.firstName[0]}</span>
                                                                                    </div>
                                                                              ) : (
                                                                                    <img src={user?.image?.url} alt="Profile" className="w-12 h-12 rounded-full object-cover shadow-soft border-2 border-white" />
                                                                              )
                                                                        ) : (
                                                                              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
                                                                                    <User size={24} className="text-neutral-600" />
                                                                              </div>
                                                                        )}
                                                                  </button>
                                                            ) : (
                                                                  <button onClick={() => dispatch(toggleModal())} className="btn-outline text-sm">
                                                                        {isArabic ? "دخول" : "Login"}
                                                                  </button>
                                                            )}
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </nav>

                        {(isLeftSidebarOpen || isRightSidebarOpen) && (
                              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30" onClick={closeSidebars} />
                        )}

                        {/* LEFT SIDEBAR (mobile) */}
                        <div className={`
          fixed top-0 left-0 z-40 h-full w-80 bg-white/95 backdrop-blur-md shadow-large transform transition-transform duration-300 border-r border-neutral-200
          ${isLeftSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
                              <div className="flex flex-col h-full p-6" dir={isArabic ? "rtl" : "ltr"}>
                                    <div className="flex items-center justify-between mb-8">
                                          <h2 className="text-xl font-bold gradient-text">{isArabic ? "القائمة" : "Menu"}</h2>
                                          <button onClick={toggleLeftSidebar} className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                          </button>
                                    </div>
                                    <nav className="flex flex-col space-y-2">
                                          <Link to="/feed" className="flex items-center px-4 py-3 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group">
                                                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                                {isArabic ? "الرئيسية" : "Home"}
                                          </Link>
                                          <Link to="/explore" className="flex items-center px-4 py-3 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group">
                                                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                {isArabic ? "استكشاف" : "Explore"}
                                          </Link>
                                          <Link to="/planner" className="flex items-center px-4 py-3 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group">
                                                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {isArabic ? "المخطط" : "Planner"}
                                          </Link>
                                          <Link to="/lists" className="flex items-center px-4 py-3 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group">
                                                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                {isArabic ? "القوائم" : "Lists"}
                                          </Link>
                                    </nav>
                              </div>
                        </div>

                        {/* RIGHT SIDEBAR (mobile) */}
                        <div className={`
          fixed top-0 right-0 z-40 h-full w-80 bg-white/95 backdrop-blur-md shadow-large transform transition-transform duration-300 border-l border-neutral-200
          ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full"}
        `} dir={isArabic ? "rtl" : "ltr"}>
                              <div className="flex flex-col h-full p-6">
                                    <div className="flex items-center justify-between mb-8">
                                          <h2 className="text-xl font-bold gradient-text">{isArabic ? "الملف الشخصي" : "Profile"}</h2>
                                          <button onClick={toggleRightSidebar} className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                          </button>
                                    </div>
                                    <nav className="flex flex-col space-y-2">
                                          <Link to="/user/profile" className="flex items-center px-4 py-3 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group">
                                                <User size={20} className="mr-3 group-hover:scale-110 transition-transform" />
                                                {isArabic ? "الملف الشخصي" : "My Profile"}
                                          </Link>
                                          <Link to="/saved" className="flex items-center px-4 py-3 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group">
                                                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                </svg>
                                                {isArabic ? "المحفوظات" : "Saved"}
                                          </Link>
                                          <Link to={`/user/${user?._id}/settings`} className="flex items-center px-4 py-3 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group">
                                                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {isArabic ? "الإعدادات" : "Settings"}
                                          </Link>
                                          <button onClick={handleLogout} className="flex items-center px-4 py-3 rounded-xl hover:bg-error/5 hover:text-error transition-all duration-200 group text-left w-full">
                                                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                {isArabic ? "تسجيل الخروج" : "Logout"}
                                          </button>
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