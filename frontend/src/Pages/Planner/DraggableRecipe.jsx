import { motion } from "framer-motion";
import { EllipsisVertical, X } from "lucide-react";
import propTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useLang } from "../../context/LangContext";

function DraggableRecipe({ recipe, source, meal, index, onRemove, dateKey, slideCard }) {
      const [showDropdown, setShowDropdown] = useState(false);
      const dropdownRef = useRef(null);
      const { isArabic } = useLang();

      useEffect(() => {
            function handleClickOutside(event) {
                  if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                        setShowDropdown(false);
                  }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                  document.removeEventListener("mousedown", handleClickOutside);
            };
      }, []);

      const handleDragStart = (e) => {
            e.stopPropagation();
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData(
                  "recipe",
                  JSON.stringify({ recipe, source, meal, index, dateKey })
            );
      };

      const handleDragEnd = (e) => {
            if (source === "meal" && !e.dataTransfer.dropEffect) {
                  onRemove?.(meal, index);
            }
      };

      // Touch event handlers for mobile devices
      const handleTouchStart = (e) => {
            e.stopPropagation();
            window.__dragData = { recipe, source, meal, index, dateKey };
      };

      // eslint-disable-next-line no-unused-vars
      const handleTouchEnd = (e) => {
            // For mobile, the drop is now handled onTouchMove,
            // so onTouchEnd simply clears any remaining drag data.
            setTimeout(() => {
                  window.__dragData = null;
            }, 0);
      };

      return (
            <motion.div
                  className={`relative rounded-lg cursor-grab text-center shadow-lg flex items-end justify-center ${slideCard ? "w-[100px] h-[54px] lg:w-[150px] lg:h-[87px]" : "w-[115px] h-[66px] lg:w-[200px] lg:h-[116px]"}`}
                  draggable="true"
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${recipe?.thumbnail?.url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                  }}
            >
                  <div className="text-white w-full text-start text-base p-2">
                        <p className="text-nowrap overflow-hidden overflow-ellipsis">
                              {isArabic ? recipe?.title?.ar : recipe?.title?.en}
                        </p>
                  </div>
                  {source === "meal" && (
                        <div className="absolute top-0 right-0" ref={dropdownRef}>
                              <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="text-white text-xs rounded-full w-6 h-6 flex items-center justify-center m-3"
                              >
                                    <EllipsisVertical size={20} />
                              </button>
                              {showDropdown && (
                                    <div className="w-20 absolute -top-8 -right-14 mt-2 bg-white shadow-md rounded-md flex items-center justify-center">
                                          <button
                                                onClick={() => onRemove?.(meal, index)}
                                                className="block px-4 py-2 text-sm text-red-500"
                                          >
                                                <X size={20} className="inline-block mr-2" />
                                          </button>
                                    </div>
                              )}
                        </div>
                  )}
            </motion.div>
      );
}

DraggableRecipe.propTypes = {
      recipe: propTypes.shape({
            id: propTypes.string.isRequired,
            title: propTypes.string.isRequired,
            thumbnail: propTypes.shape({
                  url: propTypes.string.isRequired,
            }).isRequired,
      }).isRequired,
      source: propTypes.oneOf(["slider", "meal"]).isRequired,
      meal: propTypes.string,
      index: propTypes.number,
      onRemove: propTypes.func,
      dateKey: propTypes.string,
      slideCard: propTypes.bool,
};

export default DraggableRecipe;
