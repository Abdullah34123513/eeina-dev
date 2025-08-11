import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import CardCarousel from '../CardCarousel/CardCarousel';
import { Eye } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import useTextLangChange from '../../Constant/text.constant';


const CardContainer = ({
      title,
      subtitle,
      route,
      btnRoute,
      isProfile = false,
      carouselData,
      profileData
}) => {
      const { isArabic } = useLang()
      const { viewAllBtn } = useTextLangChange()

      return (
            <div className='section-padding'>
                  <div className="text-center mb-12">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-display" dir={isArabic ? 'rtl' : 'ltr'}>
                              <span className="text-neutral-800">
                                    {title?.split(" ")[0]}
                              </span>{" "}
                              <span className="gradient-text">
                                    {title?.split(" ")[1]}
                              </span>
                        </h2>

                        <p
                              className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed"
                              dir={isArabic ? 'rtl' : 'ltr'}
                        >
                              {subtitle}
                        </p>
                  </div>
                  
                  <CardCarousel
                        categories={carouselData}
                        profileData={profileData}
                        isProfile={isProfile}
                        route={route}
                  />
                  
                  <div
                        className='flex justify-center items-center mt-12'
                  >
                        <Link
                              to={btnRoute}
                              className='btn-secondary text-base flex items-center space-x-3 group'
                              dir={isArabic ? 'rtl' : 'ltr'}
                        >
                              <Eye className='group-hover:scale-110 transition-transform' size={20} />
                              <span>
                                    {viewAllBtn}
                              </span>
                              <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                        </Link>
                  </div>
            </div>
      )
}
CardContainer.propTypes = {
      title: PropTypes.string,
      subtitle: PropTypes.string,
      collections: PropTypes.string.isRequired,
      route: PropTypes.string.isRequired,
      isProfile: PropTypes.bool,
      carouselData: PropTypes.array.isRequired,
      profileData: PropTypes.array,
      btnRoute: PropTypes.string
};

export default CardContainer