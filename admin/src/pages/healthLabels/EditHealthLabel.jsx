import { useParams } from "react-router";
import CategoryForm from "../../components/category/CategoryForm";

const EditHealthLabel = () => {
      const { id } = useParams();
      return (
            <div className="p-3">
                  <div className="panel">
                        <div className="panel-header border-bottom mb-3">
                              Edit Health Label
                        </div>

                        <div className="panel-body p-3 pb-0">
                              <CategoryForm
                                    id={id}
                                    url={"category/label/health-label/"}
                              />
                        </div>
                  </div>
            </div>
      );
};

export default EditHealthLabel;
