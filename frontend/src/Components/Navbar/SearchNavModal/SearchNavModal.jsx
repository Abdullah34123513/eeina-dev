import { motion, AnimatePresence } from 'framer-motion';
import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import handleGetApi from '../../../API/Handler/getApi.handler';
import { Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useLang } from '../../../context/LangContext';

const modalVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
};

const SearchNavModal = ({ show, setShow, search, ref, handleSearchByQuery, handleSearch }) => {
      const {
            register,
            handleSubmit
      } = useForm();
      const [topIngredients, setTopIngredients] = useState([]);
      const [topCategory, setTopCategory] = useState([]);
      // eslint-disable-next-line no-unused-vars
      const [searchHistory, setSearchHistory] = useState([]);
      const [loading, setLoading] = useState(false);
      const { isArabic } = useLang();

      async function ingredientsDataFetch() {
            setLoading(true);
            Promise.all([
                  handleGetApi('category/popular'),
                  handleGetApi('ingredient/popular')
            ])
                  .then(([res, topIngredientsRes]) => {
                        // Limit to 10 items if needed
                        setTopCategory(res?.data.slice(0, 10));
                        setTopIngredients(topIngredientsRes?.data.slice(0, 10));
                        setLoading(false);
                  })
                  .catch(error => {
                        console.error("Error fetching data:", error);
                        setLoading(false);
                  });
      }

      // Load popular ingredients & categories on mount
      useEffect(() => {
            ingredientsDataFetch();
      }, []);

      // Load search history from local storage on mount
      useEffect(() => {
            const storedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
            setSearchHistory(storedHistory);
      }, []);

      // Update search history whenever the `search` prop changes and is not empty
      useEffect(() => {
            if (search.trim() !== "") {
                  setSearchHistory(prevHistory => {
                        // Remove duplicate if it already exists
                        let updatedHistory = prevHistory.filter(item => item !== search);
                        // Add new search term to the end
                        updatedHistory.push(search);
                        // If more than 10, remove the oldest entry
                        if (updatedHistory.length > 10) {
                              updatedHistory.shift();
                        }
                        // Update local storage
                        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
                        return updatedHistory;
                  });
            }
      }, [search]);



      return (
            <AnimatePresence>
                  {show && (
                        <motion.div
                              ref={ref}
                              variants={modalVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              transition={{ duration: 0.3 }}
                              className="w-full min-h-screen lg:w-[900px] lg:min-h-[400px] shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl bg-white fixed top-0 lg:top-20 left-1/2 -translate-x-1/2 z-[999999999]"
                        >
                              {loading && (
                                    <div className="flex justify-center items-center h-full">
                                          {
                                                isArabic
                                                      ? <h1 className="text-3xl font-medium text-primary my-6">جاري التحميل...</h1>
                                                      : <h1 className="text-3xl font-medium text-primary my-6">Loading...</h1>
                                          }
                                    </div>
                              )}
                              <div>
                                    <div className="flex justify-between items-center p-4 border-b border-gray-200"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    >
                                          <h1 className="text-lg font-semibold">
                                                {isArabic ? "البحث" : "Search"}
                                          </h1>
                                          <button onClick={() => setShow(false)} className="focus:outline-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                          </button>
                                    </div>
                                    <form
                                          onSubmit={handleSubmit(handleSearch)}
                                          className="flex items-center space-x-10 w-full my-4 lg:hidden">
                                          {/* Search Bar */}
                                          <div onClick={() => setShow(true)} className="w-full relative  ">
                                                <input
                                                      type="text"
                                                      placeholder="Search Something..."
                                                      autoComplete="off"
                                                      className="border border-gray-300 rounded-full py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                                                      {...register("search", {
                                                            required: "Search field is required"
                                                      })}
                                                />
                                                <button
                                                      type="submit"
                                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                                                >
                                                      <Search size={18} />
                                                </button>
                                          </div>
                                    </form>
                                    <div className="p-4">
                                          <div className="mt-4"
                                                dir={isArabic ? "rtl" : "ltr"}
                                          >
                                                <div className='flex justify-between items-center'>
                                                      <h2 className="text-lg font-semibold">
                                                            {isArabic ? "المكونات الشائعة" : "Popular Ingredients"}
                                                      </h2>
                                                      <Link
                                                            to='/ingredients'
                                                            onClick={() => setShow(false)}
                                                            className='text-sm text-btnSecondary'
                                                      >
                                                            {isArabic ? "عرض الكل" : "See all"}
                                                      </Link>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                      {topIngredients.map((ingredient, index) => (
                                                            <button
                                                                  key={index}
                                                                  onClick={() => handleSearchByQuery(ingredient._id?.en, 'ingredient')}
                                                                  className="bg-gray-100 px-2 py-1 rounded-lg hover:bg-gray-200 focus:outline-none"
                                                            >
                                                                  {isArabic ? ingredient?._id?.ar : ingredient?._id?.en} {ingredient.count && `(${ingredient.count})`}
                                                            </button>
                                                      ))}
                                                </div>
                                          </div>
                                          {/* Popular Categories */}
                                          <div className="mt-4"
                                                dir={isArabic ? "rtl" : "ltr"}
                                          >
                                                <div className='flex justify-between items-center'>
                                                      <h2 className="text-lg font-semibold">
                                                            {isArabic ? "الفئات الشائعة" : "Popular Categories"}
                                                      </h2>
                                                      <Link
                                                            to='/categories'
                                                            onClick={() => setShow(false)}
                                                            className='text-sm text-btnSecondary'
                                                      >
                                                            {isArabic ? "عرض الكل" : "See all"}
                                                      </Link>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                      {topCategory.map((category, index) => (
                                                            <button
                                                                  key={index}
                                                                  onClick={() => handleSearchByQuery(category._id?.en, 'category')}
                                                                  className="bg-gray-100 px-2 py-1 rounded-lg hover:bg-gray-200 focus:outline-none"
                                                            >
                                                                  {
                                                                        isArabic ? category?._id?.ar : category?._id?.en
                                                                  }
                                                            </button>
                                                      ))}
                                                </div>
                                          </div>
                                          {/* Recent Searches */}
                                          {/* <div className="mt-4">
                                                <h2 className="text-lg font-semibold">Recent Searches</h2>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                      {searchHistory.map((item, index) => (
                                                            <button
                                                                  key={index}
                                                                  onClick={() => handleSearchByQuery(item, 'keyword')}
                                                                  className="bg-gray-100 px-2 py-1 rounded-lg hover:bg-gray-200 focus:outline-none"
                                                            >
                                                                  
                                                            </button>
                                                      ))}
                                                </div>
                                          </div> */}
                                    </div>
                              </div>
                        </motion.div>
                  )}
            </AnimatePresence>
      );
};

SearchNavModal.propTypes = {
      show: propTypes.bool.isRequired,
      setShow: propTypes.func.isRequired,
      search: propTypes.string.isRequired,
      ref: propTypes.object.isRequired,
      handleSearchByQuery: propTypes.func.isRequired,
      handleSearch: propTypes.func.isRequired,
};

export default SearchNavModal;
