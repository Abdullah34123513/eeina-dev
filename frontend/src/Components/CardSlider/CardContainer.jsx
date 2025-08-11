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
            <div className='lg:pb-12 mb-6 lg:mb-10'>
                  <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold mb-2" dir={isArabic ? 'rtl' : 'ltr'}>
                              <span className="text-black">
                                    {title?.split(" ")[0]}
                              </span>{" "}
                              <span className="text-primary">
                                    {title?.split(" ")[1]}
                              </span>
                        </h2>

                        <p
                              className="font-oswald font-normal"
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
                        className=' flex justify-center items-center my-5'
                  >
                        <Link
                              to={btnRoute}
                              className='h-full bg-btnSecondary rounded-full text-white px-4 py-2 uppercase text-sm flex items-center space-x-2'
                              dir={isArabic ? 'rtl' : 'ltr'}
                        >
                              <Eye className='' size={22} />
                              <span
                                    className='w-[2px] h-5 bg-white  inline-block'
                              />
                              <span>
                                    {viewAllBtn}
                              </span>
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