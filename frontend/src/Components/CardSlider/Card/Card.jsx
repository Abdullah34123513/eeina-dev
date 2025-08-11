import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useLang } from '../../../context/LangContext';

const Card = ({ title, image, route }) => {
      const { isArabic } = useLang();

      const urlTitle = title?.en?.replace(/ /g, "-").toLowerCase();

      return (
            <Link to={`${route}/${urlTitle}`} className="group block lg:w-52">
                  {/* Image Container */}
                  <div className="relative w-full aspect-square bg-neutral-200 rounded-2xl overflow-hidden shadow-soft group-hover:shadow-medium transition-all duration-300">
                        <div
                              className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 group-hover:scale-110"
                              style={{ backgroundImage: `url(${image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/60 transition-all duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 group-hover:from-primary-500/30 group-hover:to-accent-500/30 transition-all duration-300" />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="text-primary-700 font-semibold text-sm">
                                          {isArabic ? "استكشف الآن" : "Explore Now"}
                                    </span>
                              </div>
                        </div>
                        {/* Text Container */}
                  </div>
                  <div className="mt-4">
                        <h3
                              className={`text-neutral-800 group-hover:text-primary-600 text-center font-semibold text-lg transition-colors duration-300 line-clamp-2`}
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              {isArabic ? title?.ar : title?.en}
                        </h3>
                  </div>
            </Link>
      );
};

Card.propTypes = {
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      id: PropTypes.string,
      route: PropTypes.string.isRequired,
      titleColor: PropTypes.string,
};

export default Card;