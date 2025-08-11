import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import handleGetApi from "../../API/Handler/getApi.handler";
import { Link } from "react-router-dom";
import { useLang } from "../../context/LangContext";
import useTextLangChange from "../../Constant/text.constant";
import { ChefHat, TrendingUp, Grid3X3, List, Search, Sparkles, ArrowRight, Filter } from "lucide-react";

const AllCategories = () => {
      const [categories, setCategories] = useState([]);
      const [topCategories, setTopCategories] = useState([]);
      const [loading, setLoading] = useState(false);
      const [hasMore, setHasMore] = useState(true);
      const [skip, setSkip] = useState(0);
      const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
      const [searchTerm, setSearchTerm] = useState('');
      const [filteredCategories, setFilteredCategories] = useState([]);
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

      // Filter categories based on search term
      useEffect(() => {
            if (!searchTerm) {
                  setFilteredCategories(categories);
            } else {
                  const filtered = categories.filter(cat => {
                        const name = isArabic ? cat.name?.ar : cat.name?.en;
                        return name?.toLowerCase().includes(searchTerm.toLowerCase());
                  });
                  setFilteredCategories(filtered);
            }
      }, [categories, searchTerm, isArabic]);

      if (loading && skip === 0) {
            return (
                  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
                        <div className="text-center">
                              <div className="relative">
                                    <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary-200 border-t-primary-600 mx-auto mb-6"></div>
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 opacity-20 animate-pulse"></div>
                              </div>
                              <h1 className="text-2xl font-semibold gradient-text">
                                    {isArabic ? "جاري التحميل..." : "Loading..."}
                              </h1>
                              <p className="text-neutral-500 mt-2">{isArabic ? "نحضر لك أفضل الفئات" : "Preparing the best categories for you"}</p>
                        </div>
                  </div>
            );
      }

      const CategoryCard = ({ cat, index }) => {
            const slug = cat._id?.en?.replace(/\s+/g, '-').toLowerCase();
            const name = isArabic ? cat._id?.ar : cat._id?.en;
            
            return (
                  <Link
                        to={`/category/${slug}`}
                        className="group block animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                  >
                        <div className="card card-hover overflow-hidden group-hover:shadow-glow group-hover:border-primary-200">
                              <div className="relative h-56 overflow-hidden">
                                    <div
                                          className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                                          style={{
                                                backgroundImage: `url(${cat.image?.url || '/default-category.jpg'})`
                                          }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 group-hover:from-primary-500/30 group-hover:to-accent-500/30 transition-all duration-300" />
                                    
                                    {/* Floating Elements */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                                          <ChefHat className="w-6 h-6 text-primary-600" />
                                    </div>
                                    
                                    <div className="absolute top-4 left-4 bg-primary-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold group-hover:bg-primary-600 transition-all duration-300 flex items-center space-x-2">
                                          <Sparkles className="w-4 h-4" />
                                          <span>{cat.count || 0} {isArabic ? "وصفة" : "recipes"}</span>
                                    </div>

                                    {/* Category Name with Enhanced Typography */}
                                    <div className="absolute bottom-6 left-6 right-6">
                                          <h3 className="text-white font-bold text-xl leading-tight group-hover:text-primary-200 transition-all duration-300 drop-shadow-lg">
                                                {name}
                                          </h3>
                                          <div className="flex items-center mt-2 text-white/80 group-hover:text-white transition-colors">
                                                <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                                                <span className="text-sm font-medium">{isArabic ? "استكشف الآن" : "Explore now"}</span>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </Link>
            );
      };

      const CategoryListItem = ({ cat, index }) => {
            const slug = cat._id?.en?.replace(/\s+/g, '-').toLowerCase();
            const name = isArabic ? cat._id?.ar : cat._id?.en;
            
            return (
                  <Link
                        to={`/category/${slug}`}
                        className="group block animate-slide-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                  >
                        <div className="card p-6 group-hover:shadow-glow group-hover:border-primary-200 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-primary-50/30">
                              <div className="flex items-center gap-6">
                                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                          <img
                                                src={cat.image?.url || '/default-category.jpg'}
                                                alt={name}
                                                className="w-full h-full object-cover"
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 group-hover:from-primary-500/30 group-hover:to-accent-500/30 transition-all duration-300"></div>
                                    </div>
                                    <div className="flex-1">
                                          <h3 className="font-bold text-xl text-neutral-800 group-hover:text-primary-600 transition-colors mb-2">
                                                {name}
                                          </h3>
                                          <p className="text-neutral-500 text-base flex items-center">
                                                <Sparkles className="w-4 h-4 mr-2 text-accent-500" />
                                                {cat.count || 0} {isArabic ? "وصفة متاحة" : "recipes available"}
                                          </p>
                                    </div>
                                    <div className="text-primary-500 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                                          <ArrowRight className="w-6 h-6" />
                                    </div>
                              </div>
                        </div>
                  </Link>
            );
      };

      return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
                  {/* Hero Section */}
                  <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 text-white py-24 mb-12 overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-float"></div>
                              <div className="absolute top-32 right-20 w-20 h-20 bg-white rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                              <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
                        </div>
                        
                        <div className="container-modern text-center relative z-10">
                              <div className="flex justify-center mb-8">
                                    <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 animate-bounce-gentle">
                                          <ChefHat className="w-16 h-16" />
                                    </div>
                              </div>
                              <h1 
                                    className="text-5xl md:text-7xl font-bold mb-6 font-display"
                                    dir={isArabic ? "rtl" : "ltr"}
                              >
                                    {exploreCateTitle}
                              </h1>
                              <p 
                                    className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed font-light"
                                    dir={isArabic ? "rtl" : "ltr"}
                              >
                                    {isArabic 
                                          ? "اكتشف عالماً من النكهات مع مجموعتنا المتنوعة من فئات الوصفات المختارة بعناية"
                                          : "Discover a world of flavors with our diverse collection of carefully curated recipe categories"
                                    }
                              </p>
                              <div className="mt-8 flex justify-center">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-2">
                                          <Sparkles className="w-5 h-5" />
                                          <span className="font-medium">{isArabic ? "أكثر من 1000 وصفة" : "1000+ Recipes"}</span>
                                    </div>
                              </div>
                        </div>
                  </div>

                  <div className="container-modern pb-16">
                        {/* Popular Categories Section */}
                        {topCategories.length > 0 && (
                              <div className="mb-16">
                                    <div className="flex items-center gap-4 mb-8" dir={isArabic ? "rtl" : "ltr"}>
                                          <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl p-3 shadow-soft">
                                                <TrendingUp className="w-7 h-7 text-white" />
                                          </div>
                                          <h2 className="text-3xl font-bold gradient-text">
                                                {isArabic ? "الفئات الأكثر شعبية" : "Most Popular Categories"}
                                          </h2>
                                          <div className="flex-1 h-px bg-gradient-to-r from-primary-200 to-transparent"></div>
                                    </div>
                                    
                                    <div className="card p-8">
                                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                                {topCategories.slice(0, 12).map((cat, i) => {
                                                      const slug = cat._id.en.replace(/\s+/g, '-').toLowerCase();
                                                      const name = isArabic ? cat._id.ar : cat._id.en;
                                                      return (
                                                            <Link
                                                                  to={`/category/${slug}`}
                                                                  key={i}
                                                                  className="group text-center p-4 rounded-2xl hover:bg-gradient-to-br hover:from-primary-50 hover:to-accent-50 transition-all duration-300 hover:scale-105"
                                                                  dir={isArabic ? "rtl" : "ltr"}
                                                            >
                                                                  <div className="bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-3 group-hover:from-primary-200 group-hover:to-accent-200 transition-all duration-300 group-hover:scale-110">
                                                                        <ChefHat className="w-8 h-8 text-primary-600" />
                                                                  </div>
                                                                  <h3 className="font-semibold text-neutral-800 group-hover:text-primary-700 transition-colors text-sm mb-1">
                                                                        {name}
                                                                  </h3>
                                                                  <p className="text-xs text-neutral-500 group-hover:text-neutral-600 transition-colors">
                                                                        {cat.count} {isArabic ? "وصفة" : "recipes"}
                                                                  </p>
                                                            </Link>
                                                      );
                                                })}
                                          </div>
                                    </div>
                              </div>
                        )}

                        {/* Search and View Controls */}
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
                              <div className="flex items-center gap-6">
                                    <h2 className="text-3xl font-bold gradient-text" dir={isArabic ? "rtl" : "ltr"}>
                                          {isArabic ? "جميع الفئات" : "All Categories"}
                                    </h2>
                                    <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-soft">
                                          {categories.length} {isArabic ? "فئة" : "categories"}
                                    </span>
                              </div>
                              
                              <div className="flex items-center gap-6">
                                    {/* Search Bar */}
                                    <div className="relative">
                                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                                          <input
                                                type="text"
                                                placeholder={isArabic ? "البحث في الفئات..." : "Search categories..."}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="input-modern pl-12 w-80"
                                                dir={isArabic ? "rtl" : "ltr"}
                                          />
                                    </div>

                                    {/* View Mode Toggle */}
                                    <div className="flex bg-neutral-100 rounded-xl p-1.5 shadow-soft">
                                          <button
                                                onClick={() => setViewMode('grid')}
                                                className={`p-3 rounded-lg transition-all duration-200 ${
                                                      viewMode === 'grid' 
                                                            ? 'bg-white text-primary-600 shadow-soft' 
                                                            : 'text-neutral-500 hover:text-neutral-700 hover:bg-white/50'
                                                }`}
                                          >
                                                <Grid3X3 className="w-6 h-6" />
                                          </button>
                                          <button
                                                onClick={() => setViewMode('list')}
                                                className={`p-3 rounded-lg transition-all duration-200 ${
                                                      viewMode === 'list' 
                                                            ? 'bg-white text-primary-600 shadow-soft' 
                                                            : 'text-neutral-500 hover:text-neutral-700 hover:bg-white/50'
                                                }`}
                                          >
                                                <List className="w-6 h-6" />
                                          </button>
                                    </div>
                              </div>
                        </div>

                        {/* Categories Grid/List */}
                        <InfiniteScroll
                              dataLength={filteredCategories.length}
                              next={() => setSkip(prev => prev + limit)}
                              hasMore={hasMore && !searchTerm}
                              loader={
                                    <div className="flex justify-center py-12">
                                          <div className="relative">
                                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 opacity-20 animate-pulse"></div>
                                          </div>
                                    </div>
                              }
                              endMessage={
                                    <div className="text-center py-12">
                                          <div className="bg-gradient-to-br from-primary-100 to-accent-100 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
                                                <ChefHat className="w-10 h-10 text-primary-600" />
                                          </div>
                                          <p className="text-neutral-600 font-semibold text-lg">
                                                {isArabic ? "تم عرض جميع الفئات" : "You've seen all categories"}
                                          </p>
                                          <p className="text-neutral-400 mt-2">{isArabic ? "استمتع بالطبخ!" : "Happy cooking!"}</p>
                                    </div>
                              }
                        >
                              {viewMode === 'grid' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                          {filteredCategories.map((cat, i) => (
                                                <CategoryCard key={cat._id || i} cat={cat} index={i} />
                                          ))}
                                    </div>
                              ) : (
                                    <div className="space-y-6">
                                          {filteredCategories.map((cat, i) => (
                                                <CategoryListItem key={cat._id || i} cat={cat} index={i} />
                                          ))}
                                    </div>
                              )}
                        </InfiniteScroll>

                        {/* Empty State */}
                        {filteredCategories.length === 0 && searchTerm && (
                              <div className="text-center py-20">
                                    <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-8 animate-bounce-gentle">
                                          <Search className="w-12 h-12 text-neutral-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-neutral-700 mb-4">
                                          {isArabic ? "لم يتم العثور على نتائج" : "No results found"}
                                    </h3>
                                    <p className="text-neutral-500 text-lg mb-6" dir={isArabic ? "rtl" : "ltr"}>
                                          {isArabic 
                                                ? `لم نجد أي فئات تطابق "${searchTerm}"`
                                                : `We couldn't find any categories matching "${searchTerm}"`
                                          }
                                    </p>
                                    <button
                                          onClick={() => setSearchTerm('')}
                                          className="btn-primary"
                                    >
                                          {isArabic ? "مسح البحث" : "Clear search"}
                                    </button>
                              </div>
                        )}
                  </div>

                  {/* Floating Action Button for Mobile */}
                  <div className="fixed bottom-8 right-8 md:hidden z-40">
                        <button
                              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl p-4 shadow-large hover:shadow-glow transition-all duration-300 hover:scale-110 active:scale-95"
                        >
                              {viewMode === 'grid' ? <List className="w-7 h-7" /> : <Grid3X3 className="w-7 h-7" />}
                        </button>
                  </div>
            </div>
      );
};

export default AllCategories;