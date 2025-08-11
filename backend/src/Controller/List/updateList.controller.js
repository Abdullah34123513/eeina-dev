import List from "../../models/List/list.model.js";
import User from "../../models/user.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const updateList = asyncHandler(async (req, res) => {
      const { _id } = req.user;
      const { listID } = req.params;
      // Extract potential fields from request body.
      // Map `name` to `listName` as per the model.
      const { name, list, recipeId } = req.body;

      // Make sure at least one field is provided for update.
      if (!name && !list && !recipeId) {
            throw new apiErrorHandler(400, "Please provide at least one field to update");
      }

      const checkUser = await User.findById(_id);
      if (!_id || !checkUser) {
            throw new apiErrorHandler(400, "User not found");
      }

      const listDocument = await List.findById(listID);
      if (!listDocument) {
            throw new apiErrorHandler(404, "List not found");
      }

      // Verify that the list belongs to the logged-in user.
      if (listDocument.user.toString() !== _id.toString()) {
            throw new apiErrorHandler(403, "You are not authorized to update this list");
      }

      // Update only the provided fields.
      if (name) listDocument.listName = name;
      if (Array.isArray(list)) listDocument.list = list;
      if (recipeId) listDocument.recipeId = recipeId;

      await listDocument.save();

      return res.status(200).json(
            new apiResponse(
                  200,
                  listDocument,
                  "List updated successfully"
            )
      );
});

export default updateList;
