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
                  className="bg-gradient-to-r from-[#13964B] to-[#018558] text-white text-center px-8 lg:px-0 py-10 min-h-[117px] relative"
                  dir={isArabic ? "rtl" : "ltr"}
            >
                  <div className="absolute bottom-0 lg:right-1 text-xs">
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
