import { useEffect, useState } from "react";
import { Link } from "react-router";
import handleApi from "../../api/handler/apiHanlder";
import toast from "react-hot-toast";
import DataTable2 from "../../components/DataTable/DataTable2";

const AllIngredients = () => {
      const [ingredients, setIngredients] = useState([]);
      const [allIngredients, setAllIngredients] = useState([]);

      useEffect(() => {
            let isMounted = true;
            const fetchIngredients = async () => {
                  try {
                        const { data } = await handleApi("ingredient", "get");
                        if (isMounted) {
                              setAllIngredients(data.ingredients);
                              setIngredients(data.ingredients);
                        }
                  } catch (error) {
                        toast.error(error || "Failed to fetch ingredients.");
                  }
            };
            fetchIngredients();
            return () => {
                  isMounted = false;
            };
      }, []);

      const onEdit = (id) => (
            <Link className="btn btn-primary btn-sm" to={`/ingredient/edit/${id}`}>
                  <i className="fa-solid fa-pen"></i>
            </Link>
      );

      const handleSearch = (keyWord) => {
            if (!keyWord) {
                  setIngredients(allIngredients);
                  return;
            }

            const lowerKeyWord = keyWord.toLowerCase();

            // Filter ingredients based on _id, name, or image url.
            const filteredIngredients = allIngredients.filter((ingredient) => {
                  const { _id, name, image } = ingredient;
                  const imageUrl = image?.url ? image?.url : "";
                  return (
                        _id?.toLowerCase().includes(lowerKeyWord) ||
                        name?.en?.toLowerCase().includes(lowerKeyWord) ||
                        imageUrl?.toLowerCase().includes(lowerKeyWord)
                  );
            });
            setIngredients(filteredIngredients);
      };

      return (
            <div className="p-3">
                  <div className="panel">
                        <div className="panel-header border-bottom mb-3">All Ingredients</div>

                        <div className="panel-body p-3 pb-0">
                              <DataTable2
                                    tableHeader={["ID", "Name", "Image", "Actions"]}
                                    fields={["_id", "name", "image", "actions"]}
                                    datableData={ingredients}
                                    onEdit={onEdit}
                                    onSearch={handleSearch}
                              />
                        </div>
                  </div>
            </div>
      );
};

export default AllIngredients;
