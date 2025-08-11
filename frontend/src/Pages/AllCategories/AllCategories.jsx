import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import handleGetApi from "../../API/Handler/getApi.handler";
import { Link } from "react-router-dom";
import { useLang } from "../../context/LangContext";
import useTextLangChange from "../../Constant/text.constant";
import { ChefHat, TrendingUp, Grid3X3, List, Search } from "lucide-react";

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
                  <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                              <h1 className="text-xl font-medium text-gray-600">
                                    {isArabic ? "جاري التحميل..." : "Loading..."}
                              </h1>
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
                        className="group block"
                  >
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary/20 transform hover:-translate-y-1">
                              <div className="relative h-48 overflow-hidden">
                                    <div 
                                          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/30"
                                          style={{
                                                backgroundImage: `url(${cat.image?.url || '/default-category.jpg'})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                          }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    
                                    {/* Category Icon */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                                          <ChefHat className="w-5 h-5 text-primary" />
                                    </div>

                                    {/* Recipe Count Badge */}
                                    <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                                          {cat.count || 0} {isArabic ? "وصفة" : "recipes"}
                                    </div>

                                    {/* Category Name */}
                                    <div className="absolute bottom-4 left-4 right-4">
                                          <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary/90 transition-colors">
                                                {name}
                                          </h3>
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
                        className="group block"
                  >
                        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/20 p-4">
                              <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                          <img 
                                                src={cat.image?.url || '/default-category.jpg'}
                                                alt={name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                          />
                                    </div>
                                    <div className="flex-1">
                                          <h3 className="font-semibold text-lg text-gray-800 group-hover:text-primary transition-colors">
                                                {name}
                                          </h3>
                                          <p className="text-gray-500 text-sm">
                                                {cat.count || 0} {isArabic ? "وصفة متاحة" : "recipes available"}
                                          </p>
                                    </div>
                                    <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                          <ChefHat className="w-6 h-6" />
                                    </div>
                              </div>
                        </div>
                  </Link>
            );
      };

      return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                  {/* Hero Section */}
                  <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16 mb-8">
                        <div className="max-w-6xl mx-auto px-4 text-center">
                              <div className="flex justify-center mb-6">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                                          <ChefHat className="w-12 h-12" />
                                    </div>
                              </div>
                              <h1 
                                    className="text-4xl md:text-5xl font-bold mb-4"
                                    dir={isArabic ? "rtl" : "ltr"}
                              >
                                    {exploreCateTitle}
                              </h1>
                              <p 
                                    className="text-xl opacity-90 max-w-2xl mx-auto"
                                    dir={isArabic ? "rtl" : "ltr"}
                              >
                                    {isArabic 
                                          ? "اكتشف مجموعة واسعة من فئات الوصفات المختارة بعناية لتناسب جميع الأذواق والمناسبات"
                                          : "Discover a wide variety of carefully curated recipe categories to suit all tastes and occasions"
                                    }
                              </p>
                        </div>
                  </div>

                  <div className="max-w-6xl mx-auto px-4 pb-12">
                        {/* Popular Categories Section */}
                        {topCategories.length > 0 && (
                              <div className="mb-12">
                                    <div className="flex items-center gap-3 mb-6" dir={isArabic ? "rtl" : "ltr"}>
                                          <div className="bg-primary/10 rounded-full p-2">
                                                <TrendingUp className="w-6 h-6 text-primary" />
                                          </div>
                                          <h2 className="text-2xl font-bold text-gray-800">
                                                {isArabic ? "الفئات الأكثر شعبية" : "Most Popular Categories"}
                                          </h2>
                                    </div>
                                    
                                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                {topCategories.slice(0, 12).map((cat, i) => {
                                                      const slug = cat._id.en.replace(/\s+/g, '-').toLowerCase();
                                                      const name = isArabic ? cat._id.ar : cat._id.en;
                                                      return (
                                                            <Link
                                                                  to={`/category/${slug}`}
                                                                  key={i}
                                                                  className="group text-center p-3 rounded-xl hover:bg-primary/5 transition-colors"
                                                                  dir={isArabic ? "rtl" : "ltr"}
                                                            >
                                                                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/20 transition-colors">
                                                                        <ChefHat className="w-6 h-6 text-primary" />
                                                                  </div>
                                                                  <h3 className="font-medium text-gray-700 group-hover:text-primary transition-colors text-sm">
                                                                        {name}
                                                                  </h3>
                                                                  <p className="text-xs text-gray-500 mt-1">
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
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                              <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-bold text-gray-800" dir={isArabic ? "rtl" : "ltr"}>
                                          {isArabic ? "جميع الفئات" : "All Categories"}
                                    </h2>
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                          {categories.length} {isArabic ? "فئة" : "categories"}
                                    </span>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                    {/* Search Bar */}
                                    <div className="relative">
                                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                          <input
                                                type="text"
                                                placeholder={isArabic ? "البحث في الفئات..." : "Search categories..."}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-64"
                                                dir={isArabic ? "rtl" : "ltr"}
                                          />
                                    </div>

                                    {/* View Mode Toggle */}
                                    <div className="flex bg-gray-100 rounded-lg p-1">
                                          <button
                                                onClick={() => setViewMode('grid')}
                                                className={`p-2 rounded-md transition-colors ${
                                                      viewMode === 'grid' 
                                                            ? 'bg-white text-primary shadow-sm' 
                                                            : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                          >
                                                <Grid3X3 className="w-5 h-5" />
                                          </button>
                                          <button
                                                onClick={() => setViewMode('list')}
                                                className={`p-2 rounded-md transition-colors ${
                                                      viewMode === 'list' 
                                                            ? 'bg-white text-primary shadow-sm' 
                                                            : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                          >
                                                <List className="w-5 h-5" />
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
                                    <div className="flex justify-center py-8">
                                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                              }
                              endMessage={
                                    <div className="text-center py-8">
                                          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                                <ChefHat className="w-8 h-8 text-gray-400" />
                                          </div>
                                          <p className="text-gray-500 font-medium">
                                                {isArabic ? "تم عرض جميع الفئات" : "You've seen all categories"}
                                          </p>
                                    </div>
                              }
                        >
                              {viewMode === 'grid' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                          {filteredCategories.map((cat, i) => (
                                                <CategoryCard key={cat._id || i} cat={cat} index={i} />
                                          ))}
                                    </div>
                              ) : (
                                    <div className="space-y-4">
                                          {filteredCategories.map((cat, i) => (
                                                <CategoryListItem key={cat._id || i} cat={cat} index={i} />
                                          ))}
                                    </div>
                              )}
                        </InfiniteScroll>

                        {/* Empty State */}
                        {filteredCategories.length === 0 && searchTerm && (
                              <div className="text-center py-16">
                                    <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                          <Search className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                          {isArabic ? "لم يتم العثور على نتائج" : "No results found"}
                                    </h3>
                                    <p className="text-gray-500" dir={isArabic ? "rtl" : "ltr"}>
                                          {isArabic 
                                                ? `لم نجد أي فئات تطابق "${searchTerm}"`
                                                : `We couldn't find any categories matching "${searchTerm}"`
                                          }
                                    </p>
                                    <button
                                          onClick={() => setSearchTerm('')}
                                          className="mt-4 bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
                                    >
                                          {isArabic ? "مسح البحث" : "Clear search"}
                                    </button>
                              </div>
                        )}
                  </div>

                  {/* Floating Action Button for Mobile */}
                  <div className="fixed bottom-6 right-6 md:hidden">
                        <button
                              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                              className="bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary/90 transition-colors"
                        >
                              {viewMode === 'grid' ? <List className="w-6 h-6" /> : <Grid3X3 className="w-6 h-6" />}
                        </button>
                  </div>
            </div>
      );
};

export default AllCategories;