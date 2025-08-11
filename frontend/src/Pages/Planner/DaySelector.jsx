import { addDays, format, isToday } from "date-fns";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import propTypes from "prop-types";
import { useLang } from "../../context/LangContext";

const arabicWeekdays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

function DaySelector({ startDate, selectedDayIndex, setSelectedDayIndex, goalTab }) {
      const [isMobile, setIsMobile] = useState(false);
      const { isArabic } = useLang();

      useEffect(() => {
            const checkScreenSize = () => {
                  setIsMobile(window.innerWidth <= 768);
            };
            checkScreenSize();
            window.addEventListener("resize", checkScreenSize);
            return () => window.removeEventListener("resize", checkScreenSize);
      }, []);

      const days = Array.from({ length: 7 }, (_, i) => {
            const d = addDays(startDate, i);
            return {
                  label: isArabic
                        ? `${arabicWeekdays[d.getDay()]} ${d.getDate()}`
                        : format(d, "EEE d"),
                  index: i,
                  date: d,
                  isToday: isToday(d),
            };
      });

      const getButtonClass = (date, index) => {
            if (goalTab === 0) {
                  return isToday(date)
                        ? "shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                        : "border border-gray-100";
            }
            if (selectedDayIndex === null || selectedDayIndex === index) {
                  return "shadow-[0_0_10px_rgba(0,0,0,0.1)]";
            }
            return "border border-gray-100";
      };

      return (
            <div className={`px-4 bg-white py-2 my-5 ${isArabic ? "text-right" : "text-left"}`} dir={isArabic ? "rtl" : "ltr"}>
                  {isMobile ? (
                        <Swiper spaceBetween={10} slidesPerView={3.2}>
                              {days.map(({ label, index, date }) => (
                                    <SwiperSlide key={index}>
                                          <button
                                                onClick={() => setSelectedDayIndex(index)}
                                                className={`w-full p-6 rounded-md text-nowrap ${getButtonClass(date, index)} transition`}
                                          >
                                                {label}
                                          </button>
                                    </SwiperSlide>
                              ))}
                        </Swiper>
                  ) : (
                        <div className={`flex justify-between items-center space-x-4 ${isArabic ? "flex-row-reverse space-x-reverse" : ""}`}>
                              {days.map(({ label, index, date }) => (
                                    <button
                                          key={index}
                                          onClick={() => setSelectedDayIndex(index)}
                                          className={`w-full p-6 rounded-md text-nowrap ${getButtonClass(date, index)} transition`}
                                    >
                                          {label}
                                    </button>
                              ))}
                        </div>
                  )}
            </div>
      );
}

DaySelector.propTypes = {
      startDate: propTypes.instanceOf(Date).isRequired,
      selectedDayIndex: propTypes.number,
      setSelectedDayIndex: propTypes.func.isRequired,
      goalTab: propTypes.number.isRequired,
};

export default DaySelector;
