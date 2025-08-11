import Categories from "../../models/categories/Categories.model.js";
import HealthLabels from "../../models/healthLabels/healthLabels.model.js";
import DietLabels from "../../models/dietLabels/dietLabels.model.js";
import Cuisine from "../../models/cuisine/cuisine.model.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";

export const getAllCategory = asyncHandler(async (req, res, next) => {
      const type = req.params.type;

      let categories = [];

      switch (type) {
            case "meal-type":
                  categories = await Categories.find({});
                  break;
            case "health-label":
                  categories = await HealthLabels.find({});
                  break;
            case "diet-label":
                  categories = await DietLabels.find({});
                  break;
            case "cuisine":
                  categories = await Cuisine.find({});
                  break;
            default:
                  return next(
                        new apiErrorHandler(400, "Invalid category type")
                  );
      }

      res.status(200).json(
            new apiResponse(200, categories, "categories found successfully")
      );
});


export const totalCategories = asyncHandler(async (req, res, next) => {
      let { limit = 30, skip = 0 } = req.query;
      const limitNum = parseInt(limit, 10);
      const skipNum = parseInt(skip, 10);

      // Fetch all category arrays in parallel
      const categoriesArrays = await Promise.all([
            Categories.find({}, { name: 1, image: 1 }),
            HealthLabels.find({}, { name: 1, image: 1 }),
            DietLabels.find({}, { name: 1, image: 1 }),
            Cuisine.find({}, { name: 1, image: 1 }),
      ]);

      // Flatten and paginate
      const allCats = categoriesArrays.flat();
      const total = allCats.length;
      const paginated = allCats.slice(skipNum, skipNum + limitNum);

      return res.status(200).json(
            new apiResponse(200, { categories: paginated, total }, "Categories fetched successfully")
      );
});
