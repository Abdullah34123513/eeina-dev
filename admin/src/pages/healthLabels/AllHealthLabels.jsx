import { useEffect, useState } from "react";
import DataTable2 from "../../components/DataTable/DataTable2";
import handleApi from "../../api/handler/apiHanlder";
import toast from "react-hot-toast";
import { Link } from "react-router";

const AllHealthLabels = () => {
      const [categories, setCategories] = useState([]);
      const [allCategories, setAllCategories] = useState([]);

      useEffect(() => {
            let isMounted = true; // Flag indicating if the component is mounted

            const fetchCategories = async () => {
                  try {
                        const { data } = await handleApi("category/label/health-label", "get");
                        if (isMounted) {
                              // Only update state if still mounted
                              setCategories(data);
                              setAllCategories(data);
                        }
                  } catch (error) {
                        if (isMounted) {
                              toast.error(
                                    error || "Failed to fetch categories."
                              );
                        }
                  }
            };

            fetchCategories();

            return () => {
                  isMounted = false; // Cleanup: mark as unmounted
            };
      }, []);

      // Callback to update state after deletion
      const handleEdit = (id) => (
            <Link
                  className="btn btn-primary btn-sm"
                  to={`/health-label/edit/${id}`}
            >
                  <i className="fa-solid fa-pen"></i>
            </Link>
      );

      const handleSearch = (keyWord) => {
            if (!keyWord) {
                  setCategories(allCategories);
                  return;
            }

            const lowerKeyWord = keyWord.toLowerCase();

            // Filter mealtype based on _id, name and image url
            const filteredCat = allCategories.filter((cat) => {
                  const { _id, name, image: {url : imageUrl}} = cat;
                  return (
                        _id?.toLowerCase().includes(lowerKeyWord) ||
                        name?.en?.toLowerCase().includes(lowerKeyWord) ||
                        imageUrl?.toLowerCase().includes(lowerKeyWord)
                  );
            });
            setCategories(filteredCat);
      };

      return (
            <div className="p-3">
                  <div className="panel">
                        <div className="panel-header border-bottom mb-3">
                              All Health Labels
                        </div>

                        <div className="panel-body p-3 pb-0">
                              <DataTable2
                                    tableHeader={[
                                          "ID",
                                          "Name",
                                          "Image",
                                          "Action",
                                    ]}
                                    fields={["_id", "name", "image", "actions"]}
                                    datableData={categories}
                                    onEdit={handleEdit}
                                    onSearch={handleSearch}
                              />
                        </div>
                  </div>
            </div>
      );
};

export default AllHealthLabels;
