import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import handleGetApi from "../../API/Handler/getApi.handler";
import Card from "../../Components/CardSlider/Card/Card";
import { Link } from "react-router-dom";
import { useLang } from "../../context/LangContext";
import useTextLangChange from "../../Constant/text.constant";

const AllIngredients = () => {
      const [ingredients, setIngredients] = useState([]);
      const [topIngredients, setTopIngredients] = useState([]);
      const [loading, setLoading] = useState(false);
      const [hasMore, setHasMore] = useState(true);
      const [skip, setSkip] = useState(0);
      const limit = 30;

      const { isArabic } = useLang();
      const { popularIngredients } = useTextLangChange();

      // Fetch top (popular) ingredients once
      useEffect(() => {
            handleGetApi('ingredient/popular')
                  .then(res => setTopIngredients(res.data))
                  .catch(console.error);
      }, []);

      // Fetch a batch of ingredients whenever `skip` changes
      useEffect(() => {
            const fetchIngredients = async () => {
                  setLoading(true);
                  try {
                        const res = await handleGetApi(`ingredient?limit=${limit}&skip=${skip}`);
                        const batch = res.data.ingredients;
                        setIngredients(prev => (skip === 0 ? batch : [...prev, ...batch]));
                        setHasMore(batch.length === limit);
                  } catch (error) {
                        console.error("Error fetching ingredients:", error);
                  } finally {
                        setLoading(false);
                  }
            };

            fetchIngredients();
      }, [skip]);

      if (loading && skip === 0) {
            return <h1 className="text-xl font-medium">Loading...</h1>;
      }

      return (
            <div>
                  {/* Section title and top ingredients */}
                  <h1
                        className="text-2xl font-medium mb-5"
                        dir={isArabic ? "rtl" : "ltr"}
                  >
                        {popularIngredients}
                  </h1>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 shadow rounded-xl p-6 mb-8">
                        {topIngredients.map((ingredient, i) => {
                              const slug = ingredient._id.en.replace(/\s+/g, '-').toLowerCase();
                              return (
                                    <Link
                                          to={`/ingredient/${slug}`}
                                          key={i}
                                          className="mb-4"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    >
                                          <h1 className="text-lg font-medium">
                                                {isArabic ? ingredient._id.ar : ingredient._id.en}
                                          </h1>
                                    </Link>
                              );
                        })}
                  </div>

                  {/* Infinite scroll for all ingredients */}
                  <InfiniteScroll
                        dataLength={ingredients.length}
                        next={() => setSkip(prev => prev + limit)}
                        hasMore={hasMore}
                        loader={<h4 className="text-center py-4">Loading more...</h4>}
                        endMessage={<p className="text-center py-4 font-medium">You’ve reached the end.</p>}
                  >
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                              {ingredients.map((ingredient, i) => (
                                    <Card
                                          key={i}
                                          title={ingredient.name}
                                          image={ingredient.image?.url}
                                          id={ingredient._id}
                                          route="/ingredient"
                                    />
                              ))}
                        </div>
                  </InfiniteScroll>
            </div>
      );
};

export default AllIngredients;