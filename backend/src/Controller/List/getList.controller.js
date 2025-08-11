import List from "../../models/List/list.model.js";
import User from "../../models/user.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";


const getList = asyncHandler(async (req, res) => {
      const { _id } = req.user;


      const checkUser = await User.findById(_id);

      if (!_id || !checkUser || checkUser === null || checkUser === undefined) {
            throw new apiErrorHandler(400, "User not found");
      }


      const list = await List.find({ user: _id })

      return res
            .status(200)
            .json(
                  new apiResponse(
                        200,
                        list,
                        "List fetched successfully"
                  )
            )

});


export default getList;