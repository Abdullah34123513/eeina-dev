import PropTypes from 'prop-types';
import RecipeCard from '../RecipeCard/RecipeCard';

const DiscoverCardContainer = ({ recipes, profile, searchPage, lastRecipeElementRef }) => {

      if (searchPage) {
            return (
                  <div className="flex items-start justify-between gap-4 my-8">
                        <div className={`w-full grid grid-cols-2 ${profile ? "md:grid-cols-3 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3"} gap-4`}>
                              {recipes.map((recipe, index) => {
                                    if (recipes.length === index + 1) {
                                          return (
                                                <div key={recipe._id || index} ref={lastRecipeElementRef}>
                                                      <RecipeCard recipe={recipe} />
                                                </div>
                                          );
                                    } else {
                                          return (
                                                <RecipeCard
                                                      key={recipe._id || index}
                                                      recipe={recipe}
                                                />
                                          );
                                    }
                              })}
                        </div>
                  </div>
            );
      }

      return (
            <div className="flex items-start justify-between gap-4 my-8">
                  <div className={`w-full  grid  ${profile ? "grid-cols-2  md:grid-cols-4 lg:grid-cols-5" : "grid-cols-2  md:grid-cols-3 lg:grid-cols-4"} gap-4`}
                  >
                        {recipes.map((recipe, index) => {
                              if (recipe.length === index + 1) {
                                    return (
                                          <div key={recipe._id || index} ref={lastRecipeElementRef}>
                                                <RecipeCard recipe={recipe} />
                                          </div>
                                    );
                              } else {
                                    return (
                                          <RecipeCard
                                                key={recipe._id || index}
                                                recipe={recipe}
                                          />
                                    );
                              }
                        })}
                  </div>
            </div>
      );
};

DiscoverCardContainer.propTypes = {
      recipes: PropTypes.arrayOf(
            PropTypes.shape({
                  name: PropTypes.string.isRequired,
                  videoUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
            })
      ).isRequired,
      profile: PropTypes.bool,
      searchPage: PropTypes.bool,
      lastRecipeElementRef: PropTypes.func, // Add ref prop validation
};

export default DiscoverCardContainer;
