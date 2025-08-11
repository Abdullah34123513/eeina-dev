// CardCarousel.jsx
import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import PropTypes from "prop-types";
import ProfileCard from "../CardSlider/Card/ProfileCard";
import Card from "../CardSlider/Card/Card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CardCarousel = ({ categories, profileData, isProfile, route }) => {
      const prevRef = useRef(null);
      const nextRef = useRef(null);
      const swiperRef = useRef(null);
      
      useEffect(() => {
            if (swiperRef.current && swiperRef.current.params.navigation) {
                  // Update the navigation elements after refs are set
                  swiperRef.current.params.navigation.prevEl = prevRef.current;
                  swiperRef.current.params.navigation.nextEl = nextRef.current;
                  // Destroy and re-init navigation to update changes
                  swiperRef.current.navigation.destroy();
                  swiperRef.current.navigation.init();
                  swiperRef.current.navigation.update();
            }
      }, [swiperRef, prevRef, nextRef]);

      return (
            <div className="max-w-screen-xl mx-auto px-4 relative">
                  <Swiper
                        onSwiper={(swiper) => {
                              swiperRef.current = swiper;
                        }}
                        modules={[Navigation, Pagination, EffectCoverflow]}
                        // For profiles, use a simple slide effect:
                        effect={isProfile ? "slide" : "coverflow"}
                        // Decide if you want loop or not
                        loop
                        centeredSlides={false}
                        navigation
                        pagination={false}
                        // Controls spacing between slides
                        spaceBetween={20}
                        // Only apply coverflow if not isProfile
                        coverflowEffect={{
                              rotate: 20,
                              stretch: -30,
                              depth: 150,
                              modifier: 1.2,
                              slideShadows: false,
                        }}
                        // Breakpoints for responsive slides
                        breakpoints={{
                              320: {
                                    slidesPerView: 1.3, // for very small screens
                              },
                              640: {
                                    slidesPerView: 2.3, // medium screens
                              },
                              1024: {
                                    slidesPerView: isProfile ? 7 : 5.5, // bigger screens
                              },
                        }}
                        className="pb-10"
                  >
                        {isProfile ? (
                              profileData.map((item, index) => (
                                    <SwiperSlide key={index}>
                                          <ProfileCard item={item} route={route} />
                                    </SwiperSlide>
                              ))
                        ) : (
                              categories?.map((item, index) => (
                                    <SwiperSlide key={index}>
                                          <Card
                                                title={item._id}
                                                image={item.image?.url}
                                                id={item._id}
                                                route={route}
                                          />
                                    </SwiperSlide>
                              ))
                        )}
                  </Swiper>

                  {/* Custom navigation buttons */}
                  <button
                        ref={prevRef}
                        className="custom-prev absolute top-1/2 left-2 sm:left-10 transform -translate-y-1/2 z-10 bg-primary hover:bg-primary/90 text-white p-2 rounded-full transition-colors"
                  >
                        <ChevronLeft size={18} />
                  </button>
                  <button
                        ref={nextRef}
                        className="custom-next absolute top-1/2 right-2 sm:right-10 transform -translate-y-1/2 z-10 bg-primary hover:bg-primary/90 text-white p-2 rounded-full transition-colors"
                  >
                        <ChevronRight size={18} />
                  </button>
            </div>
      );
};

CardCarousel.propTypes = {
      categories: PropTypes.array.isRequired,
      isProfile: PropTypes.bool,
      route: PropTypes.string.isRequired,
      profileData: PropTypes.array,
};

export default CardCarousel;
