import List from "../../models/List/list.model.js";
import User from "../../models/user.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const getSingleList = asyncHandler(async (req, res) => {
      const { _id } = req.user;
      const { listID } = req.params;

      const checkUser = await User.findById(_id);

      if (!_id || !checkUser || checkUser === null || checkUser === undefined) {
            throw new apiErrorHandler(400, "User not found");
      }

      console.log("listID", listID);

      if (listID === "all-lists") {
            const lists = await List.find({ user: _id }).populate({
                  path: "list",
                  select: "name unit image",
            });
            // Flatten all ingredients
            const allIngredients = lists.map((list) => list.list).flat();

            // Remove duplicates
            // Use a Map to keep only one ingredient per unique name
            const nameMap = new Map();
            for (const ingr of allIngredients) {
                  const key = ingr.name?.en?.toLowerCase().trim(); // normalize
                  if (key && !nameMap.has(key)) {
                        nameMap.set(key, ingr);
                  }
            }

            const filteredIngr = Array.from(nameMap.values());

            console.log("filteredIngr", filteredIngr);

            const list = {
                  name: "All Lists",
                  list: filteredIngr,
            };
            return res.json(new apiResponse(200, list, "All lists found"));
      }

      const list = await List.findOne({ user: _id, _id: listID }).populate({
            path: "list",
            select: "name unit image",
      });

      console.log("list", list);

      if (!list) {
            throw new apiErrorHandler(404, "List not found");
      }

      return res.json(new apiResponse(200, list, "List is found"));
});

export default getSingleList;
