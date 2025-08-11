import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import AuthModals from "../Pages/Auth/Auth";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../app/slice/modalSlice";
import handleGetApi from "../API/Handler/getApi.handler";
import QuerySearchSideBar from "../Components/QuerySearch/QuerySearchSideBar";
import { Filter, X } from "lucide-react";
import Footer from "../Components/Footer/Footer";
import { useLang } from "../context/LangContext";

const SearchQueryLayout = () => {
      const dispatch = useDispatch();
      const isModalOpen = useSelector((state) => state.modal.isModalOpen);
      const [topIngredients, setTopIngredients] = useState([]);
      const [topCategory, setTopCategory] = useState([]);
      const [queryParams, setQueryParams] = useState({});
      const [loading, setLoading] = useState(false);
      // State to toggle mobile sidebar (filter)
      const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
      const navigate = useNavigate();
      const { isArabic } = useLang()


      async function ingredientsDataFetch() {
            setLoading(true);
            Promise.all([
                  handleGetApi("category/popular"),
                  handleGetApi("ingredient/popular"),
                  handleGetApi("query"),
            ])
                  .then(([res, topIngredientsRes, query]) => {
                        // Set your data – adjust slicing if needed
                        setTopCategory(res?.data);
                        setTopIngredients(topIngredientsRes?.data);
                        setQueryParams(query?.data);
                        setLoading(false);
                  })
                  .catch((error) => {
                        console.error("Error fetching data:", error);
                        setLoading(false);
                  });
      }

      // Load popular ingredients & categories on mount
      useEffect(() => {
            ingredientsDataFetch();
      }, []);

      if (loading) {
            return <div>Loading...</div>;
      }



      return (
            <div className="font-oswald font-light">
                  <Navbar />
                  <div className="max-w-defaultContainer mx-auto p-2 lg:p-10">
                        <div className="flex flex-col lg:flex-row gap-4">
                              {/* Main Search Results */}
                              <div className="w-full lg:w-3/4 bg-white p-2 lg:p-4 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl">
                                    <div className="flex items-center justify-between px-2"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    >
                                          <h1 className="text-2xl font-semibold my-3">
                                                {
                                                      isArabic ?
                                                            "نتائج البحث:" :
                                                            "Search Results:"
                                                }</h1>
                                          {/* Mobile Filter button visible only on small screens */}
                                          <Filter
                                                size={24}
                                                className="text-primary lg:hidden cursor-pointer"
                                                onClick={() => setIsMobileSidebarOpen(true)}
                                          />
                                          <div>
                                                <h1
                                                      className="text-sm text-red-600 my-3 flex items-center gap3 cursor-pointer"
                                                      onClick={() => {
                                                            navigate("/search"); // Reset filters
                                                      }}
                                                >
                                                      {isArabic ? "إعادة تعيين" : "Reset"}
                                                      {" "}<X size={20} />
                                                </h1>
                                          </div>
                                    </div>
                                    <div className="lg:p-3">
                                          <Outlet />
                                    </div>
                              </div>
                              {/* Sidebar shown on large screens */}
                              <div className="hidden lg:block w-full lg:w-1/4 min-h-[80vh] shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl p-4">
                                    <QuerySearchSideBar
                                          topIngredients={topIngredients}
                                          topCategory={topCategory}
                                          cuisines={queryParams?.cuisines || []}
                                          dietLabels={queryParams?.dietLabels || []}
                                          healthLabels={queryParams?.healthLabels || []}
                                    />

                              </div>
                        </div>
                  </div>
                  <Footer />

                  <AuthModals
                        isOpen={isModalOpen}
                        onClose={() => dispatch(closeModal())}
                  />

                  {/* Mobile Sidebar Overlay */}
                  {isMobileSidebarOpen && (
                        <div className="lg:hidden fixed inset-0 z-50">
                              {/* Backdrop */}
                              <div
                                    className="absolute inset-0 bg-black opacity-50"
                                    onClick={() => setIsMobileSidebarOpen(false)}
                              ></div>
                              {/* Sidebar content */}
                              <div className="absolute top-0 right-0 w-3/4 h-full bg-white shadow-md p-4 overflow-auto">
                                    <div className="flex justify-end">
                                          <button
                                                onClick={() => setIsMobileSidebarOpen(false)}
                                                className="text-gray-600"
                                          >
                                                <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      className="h-6 w-6"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      stroke="currentColor"
                                                >
                                                      <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                      />
                                                </svg>
                                          </button>
                                    </div>
                                    <QuerySearchSideBar
                                          topIngredients={topIngredients}
                                          topCategory={topCategory}
                                          cuisines={queryParams?.cuisines || []}
                                          dietLabels={queryParams?.dietLabels || []}
                                          healthLabels={queryParams?.healthLabels || []}
                                    />

                              </div>
                        </div>
                  )}
            </div>
      );
};

export default SearchQueryLayout;
