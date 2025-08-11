import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import handleGetApi from "../../API/Handler/getApi.handler";
import Card from "../../Components/CardSlider/Card/Card";
import { Link } from "react-router-dom";
import { useLang } from "../../context/LangContext";
import useTextLangChange from "../../Constant/text.constant";

const AllCategories = () => {
      const [categories, setCategories] = useState([]);
      const [topCategories, setTopCategories] = useState([]);
      const [loading, setLoading] = useState(false);
      const [hasMore, setHasMore] = useState(true);
      const [skip, setSkip] = useState(0);
      const limit = 30;

      const { isArabic } = useLang();
      const { exploreCateTitle } = useTextLangChange();

      // Fetch popular/top categories on mount
      useEffect(() => {
            handleGetApi('category/popular')
                  .then(res => setTopCategories(res.data))
                  .catch(err => console.error(err));
      }, []);

      // Fetch categories whenever skip changes
      useEffect(() => {
            const fetchCategories = async () => {
                  setLoading(true);
                  try {
                        const res = await handleGetApi(`category?limit=${limit}&skip=${skip}`);
                        const batch = res.data.categories;
                        const total = res.data.total;

                        setCategories(prev => (skip === 0 ? batch : [...prev, ...batch]));
                        setHasMore(prev => prev && categories.length + batch.length < total);
                  } catch (error) {
                        console.error("Error fetching categories:", error);
                  } finally {
                        setLoading(false);
                  }
            };

            fetchCategories();
      }, [skip]);

      if (loading && skip === 0) {
            return <h1 className="text-xl font-medium">Loading...</h1>;
      }

      return (
            <div>
                  {/* Section title & top categories */}
                  <h1
                        className="text-2xl font-medium mb-5"
                        dir={isArabic ? "rtl" : "ltr"}
                  >
                        {exploreCateTitle}
                  </h1>

                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 shadow rounded-xl p-6 mb-8">
                        {topCategories.map((cat, i) => {
                              const slug = cat._id.en.replace(/\s+/g, '-').toLowerCase();
                              return (
                                    <Link
                                          to={`/category/${slug}`}
                                          key={i}
                                          className="mb-4"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    >
                                          <h1 className="text-lg font-medium">
                                                {isArabic ? cat._id.ar : cat._id.en}
                                          </h1>
                                    </Link>
                              );
                        })}
                  </div>

                  {/* Infinite scroll for categories */}
                  <InfiniteScroll
                        dataLength={categories.length}
                        next={() => setSkip(prev => prev + limit)}
                        hasMore={hasMore}
                        loader={<h4 className="text-center py-4">Loading more...</h4>}
                        endMessage={<p className="text-center py-4 font-medium">You’ve reached the end.</p>}
                  >
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                              {categories.map((cat, i) => (
                                    <Card
                                          key={i}
                                          title={cat.name}
                                          image={cat.image?.url}
                                          id={cat._id}
                                          route="/category"
                                    />
                              ))}
                        </div>
                  </InfiniteScroll>
            </div>
      );
};

export default AllCategories;