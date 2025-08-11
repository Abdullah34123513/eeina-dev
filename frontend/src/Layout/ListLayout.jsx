import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { useEffect, useState } from "react";
import handleGetApi from "../API/Handler/getApi.handler";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { Plus } from "lucide-react";
import { useLang } from "../context/LangContext";

const ListLayout = () => {
      const { isArabic } = useLang();
      const langKey = isArabic ? "ar" : "en";
      const [lists, setLists] = useState([]);
      const [loading, setLoading] = useState(true);

      const labels = {
            sidebarTitle: { en: "Your list", ar: "قائمتك" },
            mobileTitle: { en: "Your Lists", ar: "قوائمك" },
            buttonNew: { en: "New", ar: "جديد" },
            noLists: { en: "No lists available", ar: "لا توجد قوائم" },
            fallbackName: { en: "Shopping List", ar: "قائمة التسوق" },
            item_singular: { en: "item", ar: "عنصر" },
            item_plural: { en: "items", ar: "عناصر" },
            allLists: { listName: { en: "All Lists", ar: "جميع القوائم" }, _id: "all-lists" },
      };

      const fetchLists = async () => {
            try {
                  setLoading(true);
                  const res = await handleGetApi("list");
                  let fetchedLists = res?.data || [];
                  fetchedLists.length > 0 && fetchedLists.unshift(labels.allLists);
                  setLists(fetchedLists);
                  console.log(fetchedLists);
            } catch (error) {
                  console.error("Error fetching lists:", error);
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchLists();
      }, []);

      return (
            <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <div className="flex-1 flex justify-center items-center my-auto">
                        <div className="max-w-full mx-auto px-4 py-8">
                              <div className="flex flex-col lg:flex-row items-center gap-8">
                                    {/* Sidebar (Desktop) */}
                                    <div className="hidden lg:block w-72 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-md">
                                          <div
                                                className="bg-white rounded-xl shadow-sm p-6"
                                                dir={isArabic ? "rtl" : "ltr"}
                                          >
                                                <h2 className="text-2xl font-bold mb-6">
                                                      {labels.sidebarTitle[langKey]}
                                                </h2>

                                                <div className="space-y-1">
                                                      {loading ? (
                                                            <div className="space-y-2">
                                                                  {[...Array(3)].map((_, i) => (
                                                                        <div
                                                                              key={i}
                                                                              className="h-12 bg-gray-100 rounded-md animate-pulse"
                                                                        ></div>
                                                                  ))}
                                                            </div>
                                                      ) : lists.length > 0 ? (
                                                            lists.map((list) => {
                                                                  const count =
                                                                        list?.list?.length || 0;
                                                                  const itemLabel =
                                                                        count === 1
                                                                              ? labels
                                                                                      .item_singular[
                                                                                      langKey
                                                                                ]
                                                                              : labels.item_plural[
                                                                                      langKey
                                                                                ];
                                                                  return (
                                                                        <NavLink
                                                                              key={list?._id}
                                                                              to={`/lists/${list?._id}`}
                                                                              className={({
                                                                                    isActive,
                                                                              }) =>
                                                                                    `flex items-center justify-between p-3 rounded-lg transition-colors
                            ${isActive ? "bg-btnSecondary/10 text-btnSecondary" : "hover:bg-gray-100"}`
                                                                              }
                                                                        >
                                                                              <span className="font-medium truncate">
                                                                                    {list
                                                                                          .listName?.[
                                                                                          langKey
                                                                                    ] ||
                                                                                          labels
                                                                                                .fallbackName[
                                                                                                langKey
                                                                                          ]}
                                                                              </span>
                                                                              {list?._id !==
                                                                                    "all-lists" && (
                                                                                    <span className="ms-2 text-sm text-gray-500">
                                                                                          {count}{" "}
                                                                                          {
                                                                                                itemLabel
                                                                                          }
                                                                                    </span>
                                                                              )}
                                                                        </NavLink>
                                                                  );
                                                            })
                                                      ) : (
                                                            <p className="text-gray-500 text-center py-4">
                                                                  {labels.noLists[langKey]}
                                                            </p>
                                                      )}
                                                </div>
                                          </div>
                                    </div>

                                    {/* Mobile List Navigation (Swiper) */}
                                    <div
                                          className="lg:hidden w-full mb-6"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    >
                                          <h2 className="text-xl font-bold mb-3 px-4">
                                                {labels.mobileTitle[langKey]}
                                          </h2>
                                          <div className="relative">
                                                <Swiper
                                                      slidesPerView="auto"
                                                      spaceBetween={12}
                                                      freeMode={true}
                                                      modules={[FreeMode]}
                                                      className="!px-4 !overflow-visible"
                                                >
                                                      <SwiperSlide className="!w-auto">
                                                            <button className="flex items-center gap-1 bg-primary text-white py-2 px-4 rounded-full text-sm whitespace-nowrap">
                                                                  <Plus size={16} />
                                                                  <span>
                                                                        {labels.buttonNew[langKey]}
                                                                  </span>
                                                            </button>
                                                      </SwiperSlide>
                                                      {lists.map((list) => (
                                                            <SwiperSlide
                                                                  key={list?._id}
                                                                  className="!w-auto"
                                                            >
                                                                  <NavLink
                                                                        to={`/lists/${list?._id}`}
                                                                        className={({ isActive }) =>
                                                                              `block py-2 px-4 rounded-full text-sm whitespace-nowrap border transition-colors
                          ${isActive ? "border-primary bg-primary/10 text-primary" : "border-gray-200 hover:border-gray-300"}`
                                                                        }
                                                                  >
                                                                        {list.listName?.[langKey] ||
                                                                              labels.fallbackName[
                                                                                    langKey
                                                                              ]}
                                                                  </NavLink>
                                                            </SwiperSlide>
                                                      ))}
                                                </Swiper>
                                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
                                          </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className="w-full flex-1">
                                          <div className="w-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-md overflow-hidden">
                                                <Outlet />
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
                  <Footer />
            </div>
      );
};

export default ListLayout;
