import propTypes from "prop-types";
import MealCell from "./MealCell";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useLang } from "../../context/LangContext";

function MealPlanGrid({ mealPlan, onDrop, onRemove, readOnly, allMealTimes, openModal }) {
      const [isMobile, setIsMobile] = useState(false);
      const { isArabic } = useLang();

      // Listen for window resize to determine mobile vs PC.
      useEffect(() => {
            const handleResize = () => {
                  setIsMobile(window.innerWidth <= 768);
            };
            handleResize();
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
      }, []);

      // Custom navigation refs for slider
      const prevRef = useRef(null);
      const nextRef = useRef(null);
      const [swiperInstance, setSwiperInstance] = useState(null);

      useEffect(() => {
            if (swiperInstance) {
                  swiperInstance.params.navigation.prevEl = prevRef.current;
                  swiperInstance.params.navigation.nextEl = nextRef.current;
                  swiperInstance.navigation.init();
                  swiperInstance.navigation.update();
            }
      }, [swiperInstance]);

      return (
            <>
                  <div className="p-4">
                        {allMealTimes.map((meal) => {
                              const recipesForMeal = mealPlan[meal] || [];
                              // Determine if we should use slider.
                              const useSlider = isMobile ? recipesForMeal.length > 2 : recipesForMeal.length > 4;
                              const slidesPerView = isMobile ? 2.5 : 4;
                              return (
                                    <div key={meal} className="mb-6 relative">
                                          <h2 className="text-xl font-semibold mb-2">{meal}</h2>
                                          <div className="relative">
                                                {useSlider ? (
                                                      <div className="relative">
                                                            <button
                                                                  ref={prevRef}
                                                                  className="custom-prev absolute top-1/2 left-0 sm:left-10 transform -translate-y-1/2 z-10 bg-primary hover:bg-primary/90 text-white p-2 rounded-full transition-colors"
                                                            >
                                                                  <ChevronLeft size={18} />
                                                            </button>
                                                            <Swiper
                                                                  spaceBetween={10}
                                                                  slidesPerView={slidesPerView}
                                                                  onSwiper={setSwiperInstance}
                                                                  modules={[Navigation]}
                                                                  className="flex"
                                                            >
                                                                  {recipesForMeal.map((recipe, index) => (
                                                                        <SwiperSlide key={index}>
                                                                              <MealCell
                                                                                    meal={meal}
                                                                                    index={index}
                                                                                    recipe={recipe}
                                                                                    onDrop={onDrop}
                                                                                    onRemove={onRemove}
                                                                                    readOnly={readOnly}
                                                                              />
                                                                        </SwiperSlide>
                                                                  ))}
                                                                  <SwiperSlide>
                                                                        <MealCell
                                                                              meal={meal}
                                                                              index={recipesForMeal.length}
                                                                              onDrop={onDrop}
                                                                              onRemove={onRemove}
                                                                              readOnly={readOnly}
                                                                        />
                                                                  </SwiperSlide>
                                                            </Swiper>
                                                            <button
                                                                  ref={nextRef}
                                                                  className="custom-next absolute top-1/2 right-0 sm:right-10 transform -translate-y-1/2 z-10 bg-primary hover:bg-primary/90 text-white p-2 rounded-full transition-colors"
                                                            >
                                                                  <ChevronRight size={18} />
                                                            </button>
                                                      </div>
                                                ) : (
                                                      <div className="flex flex-wrap">
                                                            {recipesForMeal.map((recipe, index) => (
                                                                  <MealCell
                                                                        key={index}
                                                                        meal={meal}
                                                                        index={index}
                                                                        recipe={recipe}
                                                                        onDrop={onDrop}
                                                                        onRemove={onRemove}
                                                                        readOnly={readOnly}
                                                                  />
                                                            ))}
                                                            <MealCell
                                                                  meal={meal}
                                                                  index={recipesForMeal.length}
                                                                  onDrop={onDrop}
                                                                  onRemove={onRemove}
                                                                  readOnly={readOnly}
                                                            />
                                                      </div>
                                                )}
                                          </div>
                                    </div>
                              );
                        })}
                  </div>
                  <button
                        onClick={openModal}
                        className="w-full border-2 border-dashed border-gray-400 py-10 text-xl font-semibold rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-3"
                  >
                        <div
                              dir={isArabic ? "rtl" : "ltr"}
                              className="flex items-center justify-center gap-3"
                        >
                              <PlusCircle className="text-primary" size={40} /> {isArabic ? "إضافة وصفة" : "Add Recipe"}
                        </div>
                  </button>
            </>
      );
}

MealPlanGrid.propTypes = {
      mealPlan: propTypes.object.isRequired,
      onDrop: propTypes.func.isRequired,
      onRemove: propTypes.func.isRequired,
      readOnly: propTypes.bool,
      allMealTimes: propTypes.arrayOf(propTypes.string).isRequired,
      openModal: propTypes.func.isRequired,
};

export default MealPlanGrid;
