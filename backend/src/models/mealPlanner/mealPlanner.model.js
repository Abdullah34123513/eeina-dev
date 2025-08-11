import { Schema, model } from "mongoose";

const mealPlanSchema = new Schema(
      {
            user: {
                  type: Schema.Types.ObjectId,
                  ref: "User",
                  required: true,
            },
            date: {
                  type: Date,
                  required: true,
            },
            mealPlan: {
                  type: Schema.Types.Mixed,
                  default: {},
            },
            mealTypes: {
                  type: [String],
                  default: [],
            },
      },
      { timestamps: true }
);

mealPlanSchema.index({ user: 1, date: 1 }, { unique: true });

const MealPlan = model("MealPlan", mealPlanSchema);

export default MealPlan;
