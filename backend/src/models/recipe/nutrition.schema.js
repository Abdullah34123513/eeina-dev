import { Schema } from "mongoose";
// Define sub-schemas for nutrition components
const NutritionComponentSchema = Schema(
      {
            name: {
                  en: { type: String },
                  ar: { type: String },
            },
            amount: {
                  type: Number,
                  required: true,
            },
            unit: {
                  en: { type: String },
                  ar: { type: String },
            },
            percentOfDailyNeeds: {
                  type: Number,
                  required: true,
            },
      },
      { _id: false }
);

// Nutrition schema to store nutrition information
const NutritionSchema = new Schema(
      {
            nutrients: {
                  type: [NutritionComponentSchema],
                  required: true,
            },
            glycemixIndex: {
                  type: Number,
            },
            glycemicLoad: {
                  type: Number,
            },
            nutritionBalanceScore: {
                  type: Number,
            },
      },
      { _id: false }
);

export default NutritionSchema;
