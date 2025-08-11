import Comment from "../../models/comment/comment.model.js";
import Recipe from "../../models/recipe/recipe.model.js";
import detectLanguage from "../../Services/detectLanguage.service.js";
import { translateTexts } from "../../Services/translator.service.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const createComment = asyncHandler(async (req, res, next) => {
      const { content, recipeId, parentId } = req.body;
      const { _id } = req.user;

      if (!recipeId) {
            return next(apiErrorHandler(400, "Recipe id is required."));
      }

      const translatedContent = {
            en: "",
            ar: "",
      };

      const isArabic = await detectLanguage(content);

      if (isArabic === "ar") {
            translatedContent.ar = content;
            const [translatedContentEn] = await translateTexts([content], "en-US");
            translatedContent.en = translatedContentEn;
      } else {
            translatedContent.en = content;
            const [translatedContentAr] = await translateTexts([content], "ar");
            translatedContent.ar = translatedContentAr;
      }

      console.log("translatedContent", translatedContent);

      const comment = new Comment({
            content: translatedContent,
            user: _id,
            recipe: recipeId,
            parent: parentId || null,
      });

      await comment.save();
      await comment.populate("user", "firstName lastName image");

      // If it is a reply, push the comment to the parent comment
      if (parentId) {
            const parentComment = await Comment.findById(parentId);
            if (!parentComment) {
                  return next(
                        apiErrorHandler(404, "Parent comment not found.")
                  );
            }
            parentComment.replies.push(comment._id);
            await parentComment.save();
      } else {
            // If it is a main comment, push the comment to the recipe
            const recipe = await Recipe.findById(recipeId);
            if (!recipe) {
                  return next(apiErrorHandler(404, "Recipe not found."));
            }
            recipe.comments.push(comment._id);
            await recipe.save();
      }

      return res
            .status(201)
            .json(
                  new apiResponse(201, comment, "Comment created successfully.")
            );
});

export { createComment };
