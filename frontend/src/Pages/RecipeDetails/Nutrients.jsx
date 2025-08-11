import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLang } from "../../context/LangContext";

const Nutrients = ({ nutrition, showModal, setShowModal }) => {
      const { isArabic } = useLang();


      // List of nutrient names to show on the main view (in lowercase for comparison)
      const mainNutrientsKeys = [
            "calories",
            "fat",
            "carbohydrates",
            "sugar",
            "protein",
            "sodium",
            "fiber",
      ];

      // Filter main nutrients and the others (using toLowerCase() for case-insensitive matching)
      const displayedNutrients =
            nutrition?.nutrients.filter((nutrient) =>
                  mainNutrientsKeys.includes(nutrient.name?.en.toLowerCase())
            ) || [];
      const otherNutrients =
            nutrition?.nutrients.filter(
                  (nutrient) =>
                        !mainNutrientsKeys.includes(nutrient.name?.en.toLowerCase())
            ) || [];

      // Framer Motion variants for backdrop and modal pop-out effect
      const backdropVariants = {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
      };

      const modalVariants = {
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 },
      };

      return (
            <>
                  <div className="p-4 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-md">
                        <h1 className="text-3xl font-medium text-primary my-6 text-center">
                              {isArabic ? "توازن المغذيات" : "Nutrition Balance"}
                        </h1>
                        <div className="px-10">
                              <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-medium">
                                          {isArabic ? "توازن المغذيات" : "Nutrition Balance"}:
                                    </h2>
                                    <p className="text-primary text-lg font-medium">
                                          {
                                                isArabic ?
                                                      "متوازن" :
                                                      "Balanced "

                                          }
                                    </p>
                              </div>
                              {/* Main Nutrients List */}
                              <div className="flex flex-col items-center justify-center">
                                    {displayedNutrients.map((nutrient, index) => (
                                          <div
                                                key={index}
                                                className="flex justify-between items-center w-full py-1"
                                                dir={isArabic ? "rtl" : "ltr"}
                                          >
                                                <span>{
                                                      isArabic
                                                            ? nutrient.name.ar
                                                            : nutrient.name.en
                                                }</span>
                                                <span>
                                                      {nutrient.amount} {isArabic ? nutrient.unit.ar : nutrient.unit.en}
                                                </span>
                                          </div>
                                    ))}
                              </div>
                              {/* See All Button (only shows if there are extra nutrients) */}
                              {otherNutrients.length > 0 && (
                                    <div className="mt-4 text-center">
                                          <button
                                                onClick={() => setShowModal(true)}
                                                className="text-blue-500 hover:underline"
                                          >
                                                {isArabic ? "عرض الكل" : "See All"}
                                          </button>
                                    </div>
                              )}
                        </div>
                  </div>

                  {/* Modal for Other Nutrients with Framer Motion */}
                  <AnimatePresence>
                        {showModal && (
                              <motion.div
                                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999999999] "
                                    variants={backdropVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    onClick={() => setShowModal(false)} // Clicking outside modal closes it
                              >
                                    <motion.div
                                          className="bg-white rounded-md shadow-md p-4 max-w-lg w-full h-[60vh] overflow-y-auto"
                                          variants={modalVariants}
                                          initial="hidden"
                                          animate="visible"
                                          exit="exit"
                                          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                                    >
                                          <div className="relative flex items-center">
                                                <h1 className="absolute inset-0 text-center text-3xl font-medium text-primary my-6 flex items-center justify-center">
                                                      {isArabic ? "المغذيات الأخرى" : "Other Nutrients"}
                                                </h1>
                                                <div className="ml-auto">
                                                      <X
                                                            className="cursor-pointer"
                                                            onClick={() => setShowModal(false)}
                                                      />
                                                </div>
                                          </div>

                                          <div className="flex flex-col space-y-2 p-10">
                                                {otherNutrients.map((nutrient, index) => (
                                                      <div
                                                            key={index}
                                                            className="flex justify-between items-center "
                                                            dir={isArabic ? "rtl" : "ltr"}
                                                      >
                                                            <span>{
                                                                  isArabic
                                                                        ? nutrient.name.ar
                                                                        : nutrient.name.en
                                                            }</span>
                                                            <span>
                                                                  {nutrient.amount} {isArabic ? nutrient.unit.ar : nutrient.unit.en}
                                                            </span>
                                                      </div>
                                                ))}
                                          </div>
                                    </motion.div>
                              </motion.div>
                        )}
                  </AnimatePresence>
            </>
      );
};

Nutrients.propTypes = {
      nutrition: PropTypes.shape({
            nutrients: PropTypes.arrayOf(
                  PropTypes.shape({
                        name: PropTypes.string.isRequired,
                        amount: PropTypes.number.isRequired,
                        unit: PropTypes.string.isRequired,
                  })
            ).isRequired,
      }).isRequired,
      showModal: PropTypes.bool.isRequired,
      setShowModal: PropTypes.func.isRequired,
};

export default Nutrients;
