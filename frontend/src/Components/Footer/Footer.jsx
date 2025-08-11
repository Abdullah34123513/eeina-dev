import { Link } from "react-router-dom";
import logo from "../../assets/EEINA_final_141123/Logo/Green_BG/logo2.png";
import { useLang } from "../../context/LangContext";

const Footer = () => {
      const { isArabic } = useLang();
      const langKey = isArabic ? "ar" : "en";

      const labels = {
            version: { en: "Dev_Version 1.1.0", ar: "نسخة المطور 1.1.0" },
            home: { en: "Home", ar: "الرئيسية" },
            aboutUs: { en: "About Us", ar: "معلومات عنا" },
            blogs: { en: "Blogs", ar: "المدونات" },
            privacy: { en: "Privacy & Policy", ar: "سياسة الخصوصية" },
            terms: { en: "Terms & Conditions", ar: "الشروط والأحكام" },
            categories: { en: "Categories", ar: "الفئات" },
            ingredients: { en: "Ingredients", ar: "المكونات" },
      };

      return (
            <footer
                  className="relative bg-gradient-to-r from-primary-700 via-primary-600 to-accent-600 text-white overflow-hidden"
                  dir={isArabic ? "rtl" : "ltr"}
            >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-5 left-10 w-20 h-20 bg-white rounded-full animate-float"></div>
                        <div className="absolute bottom-10 right-20 w-16 h-16 bg-white rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
                        <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-white rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
                  </div>
                  
                  <div className="relative z-10 section-padding">
                        <div className="container-modern">
                              <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
                                    {/* Brand Section */}
                                    <div className="lg:col-span-1 text-center lg:text-left">
                                          <Link to="/" className="inline-block mb-6">
                                                <img
                                                      className="w-40 h-auto"
                                                      src={logo}
                                                      alt={isArabic ? "شعار إينا" : "eeina-logo"}
                                                />
                                          </Link>
                                          <p className="text-white/80 text-lg leading-relaxed mb-6" dir={isArabic ? "rtl" : "ltr"}>
                                                {isArabic 
                                                      ? "منصتك المفضلة لاكتشاف وصفات لذيذة من جميع أنحاء العالم"
                                                      : "Your favorite platform for discovering delicious recipes from around the world"
                                                }
                                          </p>
                                          <div className="flex justify-center lg:justify-start space-x-4">
                                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                                      </svg>
                                                </div>
                                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                                                      </svg>
                                                </div>
                                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                                                      </svg>
                                                </div>
                                          </div>
                                    </div>
                                    
                                    {/* Navigation Links */}
                                    <div className="lg:col-span-3">
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <div>
                                                      <h3 className="text-xl font-bold mb-6">{isArabic ? "الصفحات الرئيسية" : "Main Pages"}</h3>
                                                      <ul className="space-y-4">
                                                            <li>
                                                                  <Link to="/feed" className="text-white/80 hover:text-white transition-colors flex items-center group">
                                                                        <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                                                        {labels.home[langKey]}
                                                                  </Link>
                                                            </li>
                                                            <li>
                                                                  <Link to="#" className="text-white/80 hover:text-white transition-colors flex items-center group">
                                                                        <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                                                        {labels.aboutUs[langKey]}
                                                                  </Link>
                                                            </li>
                                                            <li>
                                                                  <Link to="https://eeina.com/blog/" className="text-white/80 hover:text-white transition-colors flex items-center group">
                                                                        <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                                                        {labels.blogs[langKey]}
                                                                  </Link>
                                                            </li>
                                                      </ul>
                                                </div>
                                                
                                                <div>
                                                      <h3 className="text-xl font-bold mb-6">{isArabic ? "السياسات" : "Policies"}</h3>
                                                      <ul className="space-y-4">
                                                            <li>
                                                                  <Link to="#" className="text-white/80 hover:text-white transition-colors flex items-center group">
                                                                        <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                                                        {labels.privacy[langKey]}
                                                                  </Link>
                                                            </li>
                                                            <li>
                                                                  <Link to="#" className="text-white/80 hover:text-white transition-colors flex items-center group">
                                                                        <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                                                        {labels.terms[langKey]}
                                                                  </Link>
                                                            </li>
                                                      </ul>
                                                </div>
                                                
                                                <div>
                                                      <h3 className="text-xl font-bold mb-6">{isArabic ? "الاستكشاف" : "Explore"}</h3>
                                                      <ul className="space-y-4">
                                                            <li>
                                                                  <Link to="/categories" className="text-white/80 hover:text-white transition-colors flex items-center group">
                                                                        <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                                                        {labels.categories[langKey]}
                                                                  </Link>
                                                            </li>
                                                            <li>
                                                                  <Link to="/ingredients" className="text-white/80 hover:text-white transition-colors flex items-center group">
                                                                        <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                                                        {labels.ingredients[langKey]}
                                                                  </Link>
                                                            </li>
                                                      </ul>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                              
                              {/* Bottom Bar */}
                              <div className="border-t border-white/20 mt-12 pt-8">
                                    <div className="container-modern flex flex-col md:flex-row justify-between items-center">
                                          <div className="text-white/60 text-sm mb-4 md:mb-0">
                                                © 2024 EEINA. {isArabic ? "جميع الحقوق محفوظة" : "All rights reserved"}.
                                          </div>
                                          <div className="text-white/40 text-xs">
                                                {labels.version[langKey]}
                                          </div>
                                    </div>
                              </div>
                        </div>



      export default Footer;
                        {labels.version[langKey]}
                  </div>
                  <div className="max-w-defaultContainer mx-auto flex flex-col lg:flex-row items-start lg:items-end justify-between" dir={isArabic ? "rtl" : "ltr"}>
                        <div className="flex flex-col lg:flex-row items-start lg:items-end text-start gap-6 lg:gap-36">
                              <div>
                                    <ul>
                                          <li>
                                                <Link to="/feed">{labels.home[langKey]}</Link>
                                          </li>
                                          <li>
                                                <Link to="#">{labels.aboutUs[langKey]}</Link>
                                          </li>
                                          <li>
                                                <Link to="https://eeina.com/blog/">{labels.blogs[langKey]}</Link>
                                          </li>
                                    </ul>
                              </div>
                              <div>
                                    <ul>
                                          <li>
                                                <Link to="#">{labels.privacy[langKey]}</Link>
                                          </li>
                                          <li>
                                                <Link to="#">{labels.terms[langKey]}</Link>
                                          </li>
                                    </ul>
                              </div>
                              <div>
                                    <ul>
                                          <li>
                                                <Link to="/categories">{labels.categories[langKey]}</Link>
                                          </li>
                                          <li>
                                                <Link to="/ingredients">{labels.ingredients[langKey]}</Link>
                                          </li>
                                    </ul>
                              </div>
                        </div>
                        <div>
                              <Link to="/" className="flex items-center">
                                    <img
                                          className="w-32 aspect-auto"
                                          src={logo}
                                          alt={isArabic ? "شعار إينا" : "eeina-logo"}
                                    />
                              </Link>
                        </div>
                  </div>
            </footer>
      );
};

export default Footer;
