import pluralize from "pluralize";
const haramIngredients = [
      "pork",
      "bacon",
      "ham",
      "sausage",
      "alcohol",
      "wine",
      "beer",
      "vodka",
      "whiskey",
      "gin",
      "rum",
      "liqueur",
      "gelatin",
      "gelatine", ,
      "shellfish",
      "caviar",
      "pâté",
      "confit",
      "enzymes",
      "rennet",
];

export const isHaram = (ingredients) => {
      return ingredients.some((ingredient) => {
            const lower = ingredient.toLowerCase();
            return haramIngredients.some((haram) =>
                  new RegExp(`\\b${haram}\\b`, "i").test(lower)
            );
      });
}
