import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { useLang } from "../../context/LangContext";

const Instructions = ({ instructions }) => {
      const [activeStep, setActiveStep] = useState(0);
      const prevRef = useRef(null);
      const nextRef = useRef(null);
      const swiperRef = useRef(null);
      const { isArabic } = useLang();


      const instructionArray = Array.isArray(instructions)
            ? instructions
            : Object.values(instructions).filter((item) => typeof item === "object");

      const handleSlideChange = (swiper) => {
            setActiveStep(swiper.activeIndex);
      };

      // Assign custom navigation buttons after the component mounts
      useEffect(() => {
            if (swiperRef.current && prevRef.current && nextRef.current) {
                  swiperRef.current.params.navigation.prevEl = prevRef.current;
                  swiperRef.current.params.navigation.nextEl = nextRef.current;
                  swiperRef.current.navigation.init();
                  swiperRef.current.navigation.update();
            }
      }, []);

      console.log(instructionArray);
      return (
            <div className="w-full p-4 md:p-6 relative">
                  <div className="text-center mb-8 relative overflow-hidden rounded-lg py-6 bg-gradient-to-r from-primary/5 to-primary/0">
                        <h1 className="text-3xl font-light text-gray-900 mb-2">
                              {
                                    isArabic ?
                                          "تعليمات الطهي" :
                                          "Cooking Instructions"
                              }
                        </h1>
                        <div className="text-gray-500">
                              {
                                    isArabic ?
                                          "اتبع الخطوات التالية لتحضير الوصفة بنجاح." :
                                          "Follow the steps below to prepare the recipe successfully."
                              }
                        </div>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-4 mb-8">
                        <div className="text-sm text-primary font-medium">
                              {activeStep + 1}/{instructionArray.length}
                        </div>
                        <div className="flex-1 bg-gray-100 h-1 rounded-full">
                              <div
                                    className="bg-gradient-to-r from-primary to-primary/60 h-1 rounded-full transition-all duration-500"
                                    style={{
                                          width: `${((activeStep + 1) / instructionArray.length) * 100}%`,
                                    }}
                              />
                        </div>
                  </div>

                  <div className="relative bg-white rounded-lg">
                        <Swiper
                              autoHeight={true} // Enable dynamic height
                              observer={true} // Watch for content changes
                              observeParents={true} // Watch parent element changes
                              onSwiper={(swiper) => (swiperRef.current = swiper)}
                              spaceBetween={30}
                              slidesPerView={1}
                              onSlideChange={handleSlideChange}
                              modules={[Navigation]}
                              className="w-full"
                              onResize={(swiper) => swiper.updateAutoHeight()} // Handle window resize
                        >
                              {instructionArray.map((instruction, index) => (
                                    <SwiperSlide key={index}>
                                          <div className="flex flex-col md:flex-row gap-6 items-start min-h-[200px]" dir={isArabic ? "rtl" : "ltr"} >
                                                {/* Image Section */}
                                                {instruction?.image?.url && (
                                                      <div className="w-full md:w-2/5 aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-primary/0">
                                                            <img
                                                                  src={instruction.image.url}
                                                                  alt={`Step ${index + 1}`}
                                                                  className="w-full h-full object-cover mix-blend-multiply"
                                                                  onLoad={() =>
                                                                        swiperRef.current?.updateAutoHeight()
                                                                  } // Update height when images load
                                                            />
                                                            <div className="mt-3 text-xs font-medium text-primary">
                                                                  Step {index + 1}
                                                            </div>
                                                      </div>
                                                )}

                                                {/* Content Section */}
                                                <div className="flex-1 py-2">
                                                      <div className="text-gray-700 text-lg leading-relaxed">
                                                            {
                                                                  isArabic ? instruction.step.ar : instruction.step.en
                                                                        .split("\n")
                                                                        .map((line, i) => (
                                                                              <p key={i} className="mb-4">
                                                                                    {line}
                                                                              </p>
                                                                        ))}
                                                      </div>
                                                </div>
                                          </div>
                                    </SwiperSlide>
                              ))}
                        </Swiper>

                        {/* Navigation Buttons */}
                        <button
                              ref={prevRef}
                              className="absolute top-1/2 -left-8 -translate-y-1/2 z-10
                                          text-gray-400 hover:text-primary transition-colors"
                        >
                              <ChevronLeft size={32} strokeWidth={1.5} />
                        </button>
                        <button
                              ref={nextRef}
                              className="absolute top-1/2 -right-8 -translate-y-1/2 z-10
                                          text-gray-400 hover:text-primary transition-colors"
                        >
                              <ChevronRight size={32} strokeWidth={1.5} />
                        </button>
                  </div>

                  {/* Step Indicator Lines */}
                  <div className="flex justify-center gap-1.5 mt-8">
                        {instructionArray.map((_, index) => (
                              <div
                                    key={index}
                                    className={`h-1 w-6 transition-all duration-300 cursor-pointer
            ${index === activeStep
                                                ? "bg-gradient-to-r from-primary to-primary/70"
                                                : "bg-gray-200 hover:bg-primary/20"
                                          }`}
                                    onClick={() => swiperRef.current?.slideTo(index)}
                              />
                        ))}
                  </div>
            </div>
      );
};

Instructions.propTypes = {
      instructions: PropTypes.arrayOf(
            PropTypes.shape({
                  step: PropTypes.string.isRequired,
                  image: PropTypes.shape({
                        url: PropTypes.string,
                        key: PropTypes.string,
                  }),
            })
      ).isRequired,
};

export default Instructions;
