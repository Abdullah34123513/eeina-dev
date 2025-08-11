import { asyncHandler } from "../../Utils/asyncHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import Tags from "../../models/tags/tags.model.js";
export const createTags = asyncHandler(async (req, res, next) => {
      let { location, script, status } = req.body;

      const tag = new Tags({
            location,
            script,
            status,
      });

      await tag.save();
      res.json(new apiResponse(201, tag, "Tag created successfully"));
});

export const getAllTags = asyncHandler(async (req, res, next) => {
      const tags = await Tags.find();
      res.json(new apiResponse(200, tags, "All tags"));
});

export const editTags = asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const tag = await Tags.findById(id);

      if (!tag) {
            return next(new apiErrorHandler(404, "Tag not found"));
      }

      // Sanitize input if script is being updated
      if (req.body.script) {
            req.body.script = sanitizeHtml(req.body.script, {
                  allowedTags: ["script", "meta"],
                  allowedAttributes: {
                        script: ["src"],
                        meta: ["name", "content"],
                  },
            });
      }

      const updatedTag = await Tags.findByIdAndUpdate(id, req.body, {
            new: true,
      });

      res.json(new apiResponse(200, updatedTag, "Tag updated successfully"));
});

export const deleteTags = asyncHandler(async (req, res, next) => {
      const { id } = req.params;

      const deletedTag = await Tags.findByIdAndDelete(id);

      if (!deletedTag) return next(new apiErrorHandler(404, "Tag not found"));

      res.json(new apiResponse(200, {}, "Tag deleted successfully"));
});
