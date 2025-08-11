import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// Import required modules
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../Card/Card";
import ProfileCard from "../Card/ProfileCard";

const CardSlider = ({ categories, isProfile, route }) => {
      const [activeIndex, setActiveIndex] = useState(0);
      const [isEnd, setIsEnd] = useState(false);
      const swiperRef = useRef(null);

      return (
            <div className="relative w-full my-6">
                  {/* Swiper Component */}
                  <Swiper
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        onSlideChange={(swiper) => {
                              setActiveIndex(swiper.activeIndex);
                              setIsEnd(swiper.isEnd);
                        }}
                        breakpoints={{
                              0: {
                                    slidesPerView: 2.5,
                                    spaceBetween: 30,
                              },
                              768: {
                                    slidesPerView: 5,
                                    spaceBetween: 30,
                              },
                              1024: {
                                    slidesPerView: isProfile? 8 : 6,
                                    spaceBetween: 30,
                              },
                        }}
                        modules={[Navigation]}
                        className="mySwiper"
                  >
                        {categories?.map((item, index) => (
                              <SwiperSlide
                                    key={index}
                                    className="min-h-20 flex justify-center items-center"
                              >
                                    {
                                          isProfile ?
                                                <ProfileCard
                                                      item={item}
                                                      route={route}
                                                />
                                                :
                                                <Card
                                                      title={item.title}
                                                      image={item.imageUrl}
                                                      slug={item.slug}
                                                      route={route}
                                                />}
                              </SwiperSlide>
                        ))}
                  </Swiper>

                  {/* Custom Navigation Buttons */}
                  <button
                        className={`absolute -left-4 z-50 top-1/2 transform -translate-y-1/2 p-2 bg-background text-text shadow-custom rounded-full ${activeIndex === 0 ? "hidden" : ""
                              }`}
                        onClick={() => swiperRef.current?.slidePrev()}
                  >
                        <ChevronLeft />
                  </button>

                  <button
                        className={`absolute -right-4 z-50 top-1/2 transform -translate-y-1/2 p-2 bg-background text-text shadow-custom rounded-full ${isEnd ? "hidden" : ""
                              }`}
                        onClick={() => swiperRef.current?.slideNext()}
                  >
                        <ChevronRight />
                  </button>
            </div>
      );
};

CardSlider.propTypes = {
      categories: PropTypes.array.isRequired,
      isProfile: PropTypes.bool,
      route: PropTypes.string.isRequired,
};

export default CardSlider;
