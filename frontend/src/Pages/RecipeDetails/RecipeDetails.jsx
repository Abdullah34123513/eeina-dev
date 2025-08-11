import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import handleGetApi from "../../API/Handler/getApi.handler";
import toast from "react-hot-toast";
import Nutrients from "./Nutrients";
import Ingredients from "./Ingredients";
import RecipeAds from "./RecipeAds";
import RecipeShortDetails from "./RecipeShortDetails";
import Instructions from "./Instructions";
import RecipeComments from "./RecipeComments";
import ShareProfileModal from "../../Components/URLShareModal/URLShareModal";
import { useSelector } from "react-redux";

const RecipeDetails = () => {
      const { id } = useParams();
      const [recipe, setRecipe] = useState(null);
      const [isOpen, setIsOpen] = useState(false);
      const { user, isAuthenticated } = useSelector((state) => state.user);
      const [showModal, setShowModal] = useState(false);

      const getRecipe = useCallback(async () => {
            try {
                  const res = await handleGetApi(`recipe/${id}`);
                  if (res?.statusCode === 200 || res?.statusCode === 201) {
                        setRecipe(res.data);
                  }
            } catch (error) {
                  console.error("Failed to fetch recipe details:", error);
                  toast.error("Failed to fetch recipe details");
            }
      }, [id]);

      useEffect(() => {
            // Scroll to top when the component is mounted or when `id` changes
            window.scrollTo(0, 0);
            getRecipe();
      }, [id]);

      if (!recipe) {
            return (
                  <div className="text-center mt-10">
                        <div className="animate-pulse flex flex-col space-y-4">
                              <div className="bg-gray-300 h-64 w-full rounded"></div>
                              <div className="bg-gray-300 h-6 w-1/2 mx-auto rounded"></div>
                              <div className="bg-gray-300 h-4 w-3/4 mx-auto rounded"></div>
                        </div>
                        <p className="mt-4 text-lg text-gray-600">
                              Loading recipe details...
                        </p>
                  </div>
            );
      }

      const {
            _id,
            title,
            thumbnail,
            otherImages,
            ingredients,
            instructions,
            author,
            time,
            videoUrl,
            nutrition,
            servings,
            follower = 0,
            recipeData,
            createdBy,
            comments,
            description,
      } = recipe || {};

      return (
            <div className="max-w-6xl mx-auto p-4">
                  <div className="flex flex-col space-y-6">
                        {/* Image & Short Data Top Section */}
                        <div className="w-full p-4 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-md">
                              <RecipeShortDetails
                                    id={id}
                                    title={title}
                                    thumbnail={thumbnail}
                                    otherImages={otherImages}
                                    videoUrl={videoUrl}
                                    author={author}
                                    cookTime={time}
                                    follower={follower}
                                    ingredients={ingredients}
                                    nutrition={nutrition}
                                    setIsOpen={setIsOpen}
                                    createdBy={createdBy}
                                    user={user}
                                    isAuthenticated={isAuthenticated}
                                    recipe={recipe}
                                    showModal={showModal}
                                    setShowModal={setShowModal}
                                    description={description}
                              />
                        </div>

                        {/* Recipe Details */}
                        <div className="mt-2 rounded-md flex flex-col lg:flex-row gap-4">
                              <div className="w-full lg:w-1/2 p-4 shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                                    <Ingredients
                                          ingredients={ingredients}
                                          servings={servings}
                                          recipeId={_id}
                                          recipeTitle={title}
                                    />
                              </div>
                              <div className="w-full lg:w-1/2 flex flex-col">
                                    <Nutrients
                                          nutrition={nutrition}
                                          showModal={showModal}
                                          setShowModal={setShowModal}
                                    />
                                    <RecipeAds />
                              </div>
                        </div>

                        {/* Instructions */}
                        <div className="shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-md px-7">
                              <Instructions instructions={instructions} />
                        </div>

                        {/* Comments */}
                        <div className="shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-md">
                              <RecipeComments
                                    comments={comments}
                                    recipeId={recipe?._id}
                                    user={user}
                                    isAuthenticated={isAuthenticated}
                              />
                        </div>
                  </div>

                  <ShareProfileModal isOpen={isOpen} setIsOpen={setIsOpen} />

                  {/* JSON‑LD Script for SEO */}
                  {recipeData && (
                        <script
                              type="application/ld+json"
                              dangerouslySetInnerHTML={{
                                    __html: JSON.stringify(recipeData),
                              }}
                        />
                  )}
            </div>
      );
};

export default RecipeDetails;
