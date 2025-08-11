import List from "../../models/List/list.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";


const createList = asyncHandler(async (req, res) => {
      const { _id } = req.user;
      const data = req.body;

      console.log(data)

      if (!data?.listName || !data?.list || !data?.recipeId) {
            throw new apiErrorHandler(400, "Please provide all the required fields");
      }

      const exitingList = await List.find({ recipeId: data?.recipeId , user: _id });

      if (exitingList.length > 0) {
            return res
                  .status(201)
                  .json(
                        new apiResponse(
                              201,
                              {},
                              "List of this recipe is already created"
                        )
                  )
      }

      const list = new List({
            listName: data?.listName,
            list: data?.list,
            recipeId: data?.recipeId,
            user: _id
      });

      await list.save();

      return res
            .status(201)
            .json(
                  new apiResponse(
                        201,
                        list,
                        "List created successfully"
                  )
            );
});


export default createList;