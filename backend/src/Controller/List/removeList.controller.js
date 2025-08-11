import List from "../../models/List/list.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";


const removeList = asyncHandler(async (req, res) => {
      const { _id } = req.user;
      const { listID } = req.params;

      const checkUser = await User.findById(_id);

      if (!_id || !checkUser || checkUser === null || checkUser === undefined) {
            throw new apiErrorHandler(400, "User not found");
      }


      const list = await List.findById(listID);

      const isUserList = list.user.toString() === _id.toString();

      if (!isUserList) {
            throw new apiErrorHandler(400, "You are not authorized to delete this list");
      }

      await List.findByIdAndDelete(listID);

      return res
            .status(200)
            .json(
                  new apiResponse(
                        200,
                        {},
                        "List deleted successfully"
                  )
            )


});


export default removeList;