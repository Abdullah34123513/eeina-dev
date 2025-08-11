import { useParams } from "react-router"
import RecipeForm from "../../components/recipe/RecipeForm";
const EditRecipe = () => {
    const { id } = useParams()
  return (
        <div className="p-3">
              <div className="panel">
                    <div className="panel-header border-bottom mb-3">
                          Edit Recipe
                    </div>

                    <div className="panel-body p-3 pb-0">
                          <RecipeForm id={id} />
                    </div>
              </div>
        </div>
  );
}

export default EditRecipe