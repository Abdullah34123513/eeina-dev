import axios from "axios";
import pluralize from "pluralize";
import { EDAMAM_APP_ID, EDAMAM_APP_KEY } from "../../constant.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { cleanIngredientText } from "../../Utils/cleanIngredientText.js";

const nutrientMap = {
      ENERC_KCAL: "Calories",
      FAT: "Fat",
      FASAT: "Saturated Fat",
      CHOCDF: "Carbohydrates",
      "CHOCDF.net": "Net Carbohydrates",
      SUGAR: "Sugar",
      CHOLE: "Cholesterol",
      NA: "Sodium",
      PROCNT: "Protein",
      VITC: "Vitamin C",
      VITK1: "Vitamin K",
      FIBTG: "Fiber",
      TOCPHA: "Vitamin E",
      FOLDFE: "Folate",
      MG: "Magnesium",
      K: "Potassium",
      FE: "Iron",
      THIA: "Vitamin B1",
      RIBF: "Vitamin B2",
      NIA: "Vitamin B3",
      VITB6A: "Vitamin B6",
      ZN: "Zinc",
      VITA_RAE: "Vitamin A",
      P: "Phosphorus",
      CA: "Calcium",
};

// helpers
const formatNutritionData = (totalNutrients, totalDaily, servings = 1) => {
      const nutrients = Object.entries(totalNutrients)
            .filter(([key]) => nutrientMap[key])
            .map(([key, nutrient]) => ({
                  name: nutrientMap[key],
                  amount: Math.round((nutrient.quantity / servings) * 100) / 100,
                  unit: nutrient.unit,
                  percentOfDailyNeeds: totalDaily[key]
                        ? Math.round((totalDaily[key].quantity / servings) * 100) / 100
                        : 0,
            }));

      return nutrients;
};

function removeWhole(text) {
      return text.replace(/\bwhole\b/i, '').trim().replace(/\s+/g, ' ');
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const normalizeLabels = (inputArray) => {
      return inputArray.flatMap((item) => {
            return item.includes("/")
                  ? item.split("/").map((i) => capitalize(i))
                  : capitalize(item.replace(/_/g, " "));
      });
};

export class EdamamNutritionService {
      constructor() {
            this.client = axios.create({
                  baseURL: "https://api.edamam.com/api/nutrition-details",
                  params: {
                        app_id: EDAMAM_APP_ID,
                        app_key: EDAMAM_APP_KEY,
                  },
                  headers: {
                        "Content-Type": "application/json",
                        // "Edamam-Account-User": EDAMAM_USER_ID,
                  },
            });
      }

      async getNurition(ingredients, title, servings) {
            try {
                  const { data } = await this.client.post("", {
                        title,
                        ingr: ingredients,
                  });
                  const pasedIngredients = data.ingredients
                        .map((item) => {
                              const { parsed, text } = item;
                              if (parsed && parsed.length) {
                                    const { quantity, measure, food } = parsed[0];
                                    return {
                                          ingrText: cleanIngredientText(text),
                                          nameClean: pluralize.singular(removeWhole(food)),
                                          amount: quantity,
                                          unit: measure === "whole" ? "" : measure,
                                    };
                              }
                              return null;
                        })
                        .filter((item) => item !== null);

                  return {
                        nutrients: formatNutritionData(
                              data.totalNutrients,
                              data.totalDaily,
                              servings
                        ),
                        ingredients: pasedIngredients,
                        category: [
                              ...normalizeLabels(data.mealType),
                              ...normalizeLabels(data.dishType),
                        ],
                        cuisine: normalizeLabels(data.cuisineType),
                        healthLabels: normalizeLabels(data.healthLabels),
                        dietLabels: normalizeLabels(data.dietLabels),
                  };
            } catch (error) {
                  console.error("Error fetching nutrition data:", error);
                  throw new apiErrorHandler(
                        400,
                        `Plase format the ingredients in the correct format.`
                  );
            }
      }
}
