import { useEffect, useState } from "react";
import handleApi from "../../../api/handler/apiHanlder";
import Loader from "../../../components/Loader";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import DataTable2 from "../../../components/DataTable/DataTable2";
import { toast } from "react-hot-toast";


const AllImportRecipe = () => {
      const [recipes, setRecipes] = useState([]);
      const [allRecipes, setAllRecipes] = useState([]);
      const [loading, setLoading] = useState(true);

      const [actionLoading, setActionLoading] = useState(false);

      const [page, setPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);
      const recipesPerPage = 15;

      useEffect(() => {
            fetchRecipes(page);
      }, [page]);

      const fetchRecipes = async (page, keyword) => {
            setLoading(true);
            try {
                  const res = await handleApi(`recipe/admin`, "GET", {
                        page: page,
                        limit: recipesPerPage,
                        keyword,
                        imported: true,
                  });
                  setRecipes(res?.data?.recipes);
                  setAllRecipes(res?.data?.recipes);
                  setTotalPages(Math.ceil(res?.data?.total / recipesPerPage));

                  // Scroll to the top when changing pages
                  window.scrollTo({ top: 0, behavior: "smooth" });
            } catch (error) {
                  console.error("Error fetching imported recipes:", error);
            }
            setLoading(false);
      };

      const onEdit = (id) => (
            console.log("Edit recipe with id:", id),
            (
                  <Link
                        className="btn btn-primary btn-sm"
                        to={`/recipe/edit/${id}`}
                  >
                        <i className="fa-solid fa-pen"></i>
                  </Link>
            )
      );

      const handleDelete = async (id) => {
            setActionLoading(true);
            try {
                  await handleApi(`recipe/delete/${id}`, "DELETE");
                  toast.success("Recipe deleted successfully");
                  setRecipes(recipes.filter((recipe) => recipe._id !== id));
                  setAllRecipes(
                        allRecipes.filter((recipe) => recipe._id !== id)
                  );
            } catch (error) {
                  console.error("Error deleting recipe:", error);
                  toast.error("Failed to delete recipe");
            } finally {
                  setActionLoading(false);
            }
      };

      const handleSearch = async (keyword) => {
            setPage(1);
            fetchRecipes(1, keyword);
      };

      return (
            <>
                  {/* Dark overlay with disabled interaction during loading */}
                  {loading && <Loader />}

                  <div className="p-3">
                        <div className="panel">
                              <div className="panel-header border-bottom mb-3">
                                    All Imported Recipes
                              </div>

                              <div className="panel-body border-bottom mx-3 pt-3">
                                    <DataTable2
                                          tableHeader={[
                                                "ID",
                                                "Title",
                                                "Image",
                                                "Meal Type",
                                                "Cuisine",
                                                "Health Labels",
                                                "Diet Labels",
                                                "Actions",
                                          ]}
                                          fields={[
                                                "_id",
                                                "title",
                                                "image",
                                                "category",
                                                "cuisine",
                                                "healthLabels",
                                                "dietLabels",
                                                "actions",
                                          ]}
                                          datableData={allRecipes}
                                          onEdit={onEdit}
                                          onDelete={handleDelete}
                                          loading={actionLoading}
                                          onSearch={handleSearch}
                                    />
                              </div>

                              {/* Pagination */}
                              <div className="panel-footer p-3">
                                    <div className="d-flex align-items-center gap-3 w-100">
                                          <button
                                                disabled={page === 1 || loading}
                                                onClick={() =>
                                                      setPage(page - 1)
                                                }
                                                className="btn btn-primary"
                                          >
                                                <ArrowLeft size={20} />
                                          </button>
                                          <span className="text-secondary">
                                                Page {page} of {totalPages}
                                          </span>
                                          <button
                                                disabled={
                                                      page === totalPages ||
                                                      loading
                                                }
                                                onClick={() =>
                                                      setPage(page + 1)
                                                }
                                                className="btn btn-primary"
                                          >
                                                <ArrowRight size={20} />
                                          </button>
                                    </div>
                              </div>
                        </div>
                  </div>
            </>
      );
};

export default AllImportRecipe;
