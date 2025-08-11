import propTypes from "prop-types";
import DraggableRecipe from "./DraggableRecipe";
import { PlusCircle } from "lucide-react";

function MealCell({ meal, index, recipe, onDrop, onRemove, readOnly }) {
      const handleDragOver = (e) => e.preventDefault();

      const handleDropEvent = (e) => {
            e.preventDefault();
            if (readOnly) return;
            const data = e.dataTransfer.getData("recipe");
            if (data) {
                  const { recipe: droppedRecipe, source, meal: fromMeal, index: fromIndex } = JSON.parse(data);
                  if (source === "meal" && (meal !== fromMeal || index !== fromIndex)) {
                        onRemove(fromMeal, fromIndex);
                  }
                  onDrop(meal, index, droppedRecipe);
            }
      };

      // onTouchMove handler: as soon as the finger moves into the drop field, trigger the drop.
      const handleTouchMove = (e) => {
            if (readOnly) return;
            if (!window.__dragData) return;
            const touch = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            if (
                  touch.clientX >= rect.left &&
                  touch.clientX <= rect.right &&
                  touch.clientY >= rect.top &&
                  touch.clientY <= rect.bottom
            ) {
                  // Drop the recipe immediately and clear drag data.
                  const { recipe: droppedRecipe, source, meal: fromMeal, index: fromIndex } = window.__dragData;
                  if (source === "meal" && (meal !== fromMeal || index !== fromIndex)) {
                        onRemove(fromMeal, fromIndex);
                  }
                  onDrop(meal, index, droppedRecipe);
                  window.__dragData = null;
            }
      };

      // onTouchEnd fallback (in case onTouchMove wasn't triggered)
      // eslint-disable-next-line no-unused-vars
      const handleTouchEnd = (e) => {
            if (readOnly) return;
            if (window.__dragData) {
                  const { recipe: droppedRecipe, source, meal: fromMeal, index: fromIndex } = window.__dragData;
                  if (source === "meal" && (meal !== fromMeal || index !== fromIndex)) {
                        onRemove(fromMeal, fromIndex);
                  }
                  onDrop(meal, index, droppedRecipe);
                  window.__dragData = null;
            }
      };

      return (
            <div
                  onDragOver={handleDragOver}
                  onDrop={handleDropEvent}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="border-dashed border-2 border-gray-300 rounded-lg m-2 w-[115px] h-[66px] lg:w-[200px] lg:h-[116px] flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-gray-200"
            >
                  {recipe ? (
                        <DraggableRecipe recipe={recipe} source="meal" meal={meal} index={index} onRemove={onRemove} />
                  ) : (
                        <span className="text-gray-500">
                              <PlusCircle className="font-light text-gray-300" size={40} />
                        </span>
                  )}
            </div>
      );
}

MealCell.propTypes = {
      meal: propTypes.string.isRequired,
      index: propTypes.number.isRequired,
      recipe: propTypes.shape({
            id: propTypes.string,
            title: propTypes.string,
            image: propTypes.string,
      }),
      onDrop: propTypes.func.isRequired,
      onRemove: propTypes.func.isRequired,
      readOnly: propTypes.bool,
};

export default MealCell;
