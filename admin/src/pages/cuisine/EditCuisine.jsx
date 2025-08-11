import { useParams } from "react-router";
import CategoryForm from "../../components/category/CategoryForm";

const EditCuisine = () => {
      const { id } = useParams();
      return (
            <div className="p-3">
                  <div className="panel">
                        <div className="panel-header border-bottom mb-3">
                              Edit Cuisine
                        </div>

                        <div className="panel-body p-3 pb-0">
                              <CategoryForm
                                    id={id}
                                    url={"category/label/cuisine/"}
                              />
                        </div>
                  </div>
            </div>
      );
};

export default EditCuisine;
