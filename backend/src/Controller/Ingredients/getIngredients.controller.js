import Ingredient from "../../models/Ingredient/Ingredient.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Ingredient:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64c25f59d03ac204a8f3ed34"
 *         name:
 *           type: string
 *           example: "Tomato"
 *         category:
 *           type: string
 *           example: "Vegetable"
 *         calories:
 *           type: number
 *           example: 18
 *         protein:
 *           type: number
 *           example: 0.9
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */


const getIngredients = asyncHandler(async (req, res) => {
      let { limit = 30, skip = 0 } = req.query;
      const limitNum = parseInt(limit, 10);
      const skipNum = parseInt(skip, 10);

      // Fetch paginated ingredients
      const ingredients = await Ingredient.find()
            .skip(skipNum)
            .limit(limitNum);

      // Total count for client-side hasMore logic
      const total = await Ingredient.countDocuments();

      if (!ingredients) {
            return apiErrorHandler(res, 'No ingredients found', 404);
      }

      return res
            .status(200)
            .json(
                  new apiResponse(
                        200,
                        { ingredients, total },
                        'Ingredients fetched'
                  )
            );
});

export default getIngredients;