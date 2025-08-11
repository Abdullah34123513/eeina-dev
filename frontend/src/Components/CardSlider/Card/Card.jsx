import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useLang } from '../../../context/LangContext';

const Card = ({ title, image, route }) => {
      const { isArabic } = useLang();

      const urlTitle = title?.en?.replace(/ /g, "-").toLowerCase();

      return (
            <Link to={`${route}/${urlTitle}`} className="block lg:w-48">
                  {/* Image Container */}
                  <div className="relative w-full aspect-square bg-gray-300 rounded-xl overflow-hidden">
                        <div
                              className="absolute inset-0 bg-cover bg-center transform transition-transform duration-300 hover:scale-110"
                              style={{ backgroundImage: `url(${image})` }}
                        />
                        {/* Text Container */}
                  </div>
                  <div className="mt-2">
                        <h3
                              className={`text-black text-nowrap mb-2 text-center font-oswald font-normal overflow-hidden text-ellipsis`}
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