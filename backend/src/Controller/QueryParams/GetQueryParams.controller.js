
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import Cuisine from "../../models/cuisine/cuisine.model.js";
import DietLabels from "../../models/dietLabels/dietLabels.model.js";
import HealthLabels from "../../models/healthLabels/healthLabels.model.js";

const getCombinedData = asyncHandler(async (req, res) => {
      try {
            // Fetch data concurrently from 3 collections
            const [cuisines, dietLabels, healthLabels] = await Promise.all([
                  Cuisine.find({}).lean(),  // Using lean() for performance
                  DietLabels.find({}).lean(),
                  HealthLabels.find({}).lean(),
            ]);

            // Return combined data
            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              { cuisines, dietLabels, healthLabels },
                              "Combined data fetched successfully"
                        )
                  );
      } catch (error) {
            throw new apiErrorHandler(error, 500);
      }
});

export default getCombinedData;
