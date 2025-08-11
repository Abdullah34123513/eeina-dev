import Recipe from "../../models/recipe/recipe.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import pluralize from "pluralize";

const getRecipesUsingQuery = asyncHandler(async (req, res) => {
      try {
            let { ingredient, category, limit = 10, skip = 0 } = req.query;
            const query = {};

            // Convert limit and skip to numbers
            limit = parseInt(limit, 10);
            skip = parseInt(skip, 10);

            // Prepare fuzzy regex function
            const buildFuzzyRegex = (term) => {
                  const cleaned = term.replace(/-/g, ' ').trim().toLowerCase();
                  const singular = pluralize.singular(cleaned);
                  const plural = pluralize.plural(cleaned);
                  // Match singular or plural form, allow it anywhere in the string
                  return new RegExp(`(${singular}|${plural})`, 'i');
            };

            // Handle ingredient search (English only, fuzzy singular/plural)
            if (ingredient) {
                  const regex = buildFuzzyRegex(ingredient);
                  query['ingredients.nameClean.en'] = { $regex: regex };
            }

            // Handle category search (English only, fuzzy singular/plural)
            if (category) {
                  const regex = buildFuzzyRegex(category);
                  query['category.en'] = { $regex: regex };
            }

            console.log('MongoDB query:', query);

            // Fetch filtered recipes with pagination and user info
            const recipes = await Recipe.find(query)
                  .populate({
                        path: 'createdBy',
                        select: 'firstName lastName image',
                  })
                  .skip(skip)
                  .limit(limit);

            console.log('Fetched recipes count:', recipes.length);

            // Get total count for pagination info
            const totalRecipes = await Recipe.countDocuments(query);

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              { recipes, totalRecipes },
                              "Recipes fetched successfully"
                        )
                  );
      } catch (error) {
            throw new apiErrorHandler(res, error);
      }
});

export default getRecipesUsingQuery;
