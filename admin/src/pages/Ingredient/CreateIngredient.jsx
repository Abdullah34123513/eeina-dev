import IngredientForm from "../../components/ingredient/IngredinetForm";

const CreateIngredient = () => {
  return (
        <div className="p-3">
              <div className="panel">
                    <div className="panel-header border-bottom mb-3">
                          Create Ingredient
                    </div>

                    <div className="panel-body p-3 pb-0">
                        <IngredientForm />
                    </div>
              </div>
        </div>
  );
}

export default CreateIngredient