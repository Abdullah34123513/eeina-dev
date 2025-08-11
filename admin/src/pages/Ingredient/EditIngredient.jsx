import { useParams } from "react-router";
import IngredientForm from "../../components/ingredient/IngredinetForm";

const EditIngredient = () => {
      const { id } = useParams();
      return (
            <div className="p-3">
                  <div className="panel">
                        <div className="panel-header border-bottom mb-3">
                              Edit Ingredient
                        </div>

                        <div className="panel-body p-3 pb-0">
                              <IngredientForm id={id} />
                        </div>
                  </div>
            </div>
      );
};

export default EditIngredient;
