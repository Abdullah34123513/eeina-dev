import { model, Schema } from "mongoose";
import slugify from "slugify";
import NutritionSchema from "./nutrition.schema.js";

const IngredientSchema = new Schema(
      {
            details: { type: Schema.Types.ObjectId, ref: "Ingredient", required: true },
            nameClean: { en: String, ar: String },
            ingrText: { en: String, ar: String },
            amount: { type: Number, required: true },
            unit: {
                  en: String,
                  ar: String,
            },
      },
      { _id: false }
);

const MetadataSchema = new Schema(
      {
            imported: { type: Boolean, default: false },
            site: String,
            originalUrl: String,
            importDate: { type: Date, default: Date.now },
      },
      { _id: false }
);

const RecipeSchema = new Schema(
      {
            title: { en: { type: String }, ar: { type: String } },
            slug: { type: String, unique: true },
            description: { en: String, ar: String },
            ingredients: [IngredientSchema],
            nutrition: NutritionSchema,
            instructions: [
                  {
                        step: { en: String, ar: String },
                        image: { url: String, key: String },
                  },
            ],
            servings: { type: Number, default: 1 },
            time: Number,
            cuisine: [{ en: String, ar: String }],
            category: [{ en: String, ar: String }],
            healthLabels: [{ en: String, ar: String }],
            dietLabels: [{ en: String, ar: String }],
            thumbnail: { url: String, key: String },
            views: { type: Number, default: 0 },
            otherImages: [{ url: String, key: String }],
            videoUrl: String,
            metadata: MetadataSchema,
            likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
            comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
            createdBy: { type: Schema.Types.ObjectId, ref: "User" },
      },
      { timestamps: true }
);

// Slug generation only on title change
// This will create a slug based on the title in English
RecipeSchema.pre("save", async function (next) {
      if (!this.isModified("title.en")) return next();

      if (this.title?.en) {
            const baseSlug = slugify(this.title.en, { lower: true, strict: true });
            let slug = baseSlug;
            let suffix = 1;

            // Loop to ensure uniqueness
            while (
                  await model("Recipe").exists({
                        slug,
                        _id: { $ne: this._id }, // Ignore current document in case of update
                  })
            ) {
                  slug = `${baseSlug}-${suffix}`;
                  suffix++;
            }

            this.slug = slug;
      }

      next();
});


RecipeSchema.index(
      {
            "title.en": "text",
            "description.en": "text",
            "ingredients.ingrText.en": "text",
            "cuisine.en": "text",
            "category.en": "text",
            "healthLabels.en": "text",
            "dietLabels.en": "text",
      },
      {
            name: "EnglishTextIndex",
            default_language: "english",
      }
);

const Recipe = model("Recipe", RecipeSchema);
export default Recipe;
