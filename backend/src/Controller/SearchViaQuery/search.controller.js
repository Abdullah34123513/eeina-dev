import Recipe from "../../models/recipe/recipe.model.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import Fuse from "fuse.js";
import detectLanguage from "../../Services/detectLanguage.service.js";

// Helper function to parse potential JSON array strings or comma-separated lists
const parseQueryArray = (param) => {
      if (!param) return [];
      try {
            const parsed = JSON.parse(param);
            if (Array.isArray(parsed)) {
                  return parsed;
            }
      } catch (error) {
            return param.split(",").map(item => item.trim());
      }
      return [];
};

const searchRecipes = asyncHandler(async (req, res) => {
      const {
            keyword,
            ingredients,
            categories,
            cuisines,
            diets,
            healthLabels,
            cookTime, // cookTime is received from the query parameters
            page = 1, // Default page number
            limit = 30 // Default limit per page
      } = req.query;

      let searchCriteria = {};
      const ingredientsArray = parseQueryArray(ingredients);
      if (ingredientsArray.length) {
            searchCriteria["ingredients.nameClean.en"] = { $in: ingredientsArray };
      }
      const categoriesArray = parseQueryArray(categories);
      if (categoriesArray.length) {
            searchCriteria["category.en"] = { $in: categoriesArray };
      }

      let similarRecipes = [];
      let mainRecipe = [];

      // Step 1: Filter by language-specific keyword, ingredients, categories
      if (keyword) {
            const lang = await detectLanguage(keyword); 
            const titleField = `title.${lang}`;
            const descField = `description.${lang}`;
            const ingredientField = `ingredients.nameClean.${lang}`;
            const dietField = `dietLabels.${lang}`;
            const healthField = `healthLabels.${lang}`;

            // Step 1: Main recipe exact/near match using title regex
            mainRecipe = await Recipe.find({
                  ...searchCriteria,
                  [titleField]: { $regex: keyword, $options: "i" }
            })
                  .limit(1)
                  .populate({ path: "createdBy", select: "firstName lastName image" });

            // Step 2: Fuzzy search over title, description, ingredients, diets, healthLabels
            const recipesForFuzzy = await Recipe.find(searchCriteria)
                  .populate({ path: "createdBy", select: "firstName lastName image" });

            const fuseOptions = {
                  keys: [titleField, descField, ingredientField, dietField, healthField],
                  threshold: 0.4
            };
            const fuse = new Fuse(recipesForFuzzy, fuseOptions);
            const fuseResults = fuse.search(keyword);
            similarRecipes = fuseResults.map(result => result.item);

            // Remove duplicates and prioritize mainRecipe
            if (mainRecipe.length) {
                  const mainId = mainRecipe[0]._id.toString();
                  similarRecipes = similarRecipes.filter(r => r._id.toString() !== mainId);
                  similarRecipes.unshift(mainRecipe[0]);
            }
      } else {
            // If no keyword, search by ingredients/categories only
            similarRecipes = await Recipe.find(searchCriteria)
                  .populate({ path: "createdBy", select: "firstName lastName image" });
      }

      // Step 2: Apply additional filters for cuisines, healthLabels, and dietLabels
      if (cuisines) {
            const cuisinesArray = parseQueryArray(cuisines);
            if (cuisinesArray.length) {
                  similarRecipes = similarRecipes.filter(recipe =>
                        cuisinesArray.some(c => recipe.cuisine.some(cObj => cObj.en === c || cObj.ar === c))
                  );
            }
      }

      if (healthLabels) {
            const healthArray = parseQueryArray(healthLabels);
            if (healthArray.length) {
                  similarRecipes = similarRecipes.filter(recipe =>
                        healthArray.some(h => recipe.healthLabels.some(hObj => hObj.en === h || hObj.ar === h))
                  );
            }
      }

      if (diets) {
            const dietsArray = parseQueryArray(diets);
            if (dietsArray.length) {
                  similarRecipes = similarRecipes.filter(recipe =>
                        dietsArray.some(d => recipe.dietLabels.some(dObj => dObj.en === d || dObj.ar === d))
                  );
            }
      }

      // Step 3: Apply cookTime filter
      if (cookTime) {
            const cookTimeNum = parseInt(cookTime, 10);
            if (!isNaN(cookTimeNum)) {
                  if (cookTimeNum === 121) {
                        // Over 2 hours
                        similarRecipes = similarRecipes.filter(r => r.time >= 121);
                  } else {
                        // Under specified minutes
                        similarRecipes = similarRecipes.filter(r => r.time <= cookTimeNum);
                  }
            }
      }

      // Step 4: Pagination
      const totalCount = similarRecipes.length;
      const totalPages = Math.ceil(totalCount / limit);
      const skip = (page - 1) * limit;
      const paginated = similarRecipes.slice(skip, skip + limit);


      console.log("mainRecipe", mainRecipe);

      return res.status(200).json(
            new apiResponse(
                  200,
                  {
                        mainRecipe,
                        similarRecipes: paginated,
                        pagination: { currentPage: page, totalPages, totalCount }
                  },
                  "Search results fetched successfully"
            )
      );
});

export default searchRecipes;
