/**
 * Cleans an ingredient string by removing any leading quantity and measurement unit.
 *
 * Examples:
 * "2 small cucumbers, cut into 1/4 inch cubes"
 *   => "small cucumbers, cut into 1/4 inch cubes"
 *
 * "3 tablespoons Miso Tare (recipe below), or to taste"
 *   => "Miso Tare (recipe below), or to taste"
 *
 * "12 ounces dried ramen noodles, or favorite noodles of your choice"
 *   => "dried ramen noodles, or favorite noodles of your choice"
 *
 * @param {string} text - The full ingredient string.
 * @returns {string} - The cleaned ingredient text.
 */
function cleanIngredientText(text) {
      // Insert a space between a digit and a letter if not already present.
      text = text.replace(/(\d)([a-zA-Z])/g, "$1 $2");

      let cleaned = text.trim();

      // Remove the leading quantity.
      // This regex covers:
      // - Whole numbers (e.g., "2")
      // - Decimals (e.g., "2.5")
      // - Fractions (e.g., "1/2")
      // - Mixed numbers (e.g., "1 1/2")
      // - Unicode fractions (e.g., "½", "¼")
      // - Articles ("a", "an")
      cleaned = cleaned.replace(
            /^\s*(\d+(?:\.\d+)?(?:\s+\d+\/\d+)?|\d+\/\d+|[¼½¾⅓⅔⅕⅖⅗⅘⅙⅚⅐⅛⅜⅝⅞]+|a|an)\s+/i,
            ""
      );

      // Comprehensive list of measurement units.
      // This regex includes volume units, weight units, and some countable measures
      // with singular, plural, and abbreviated forms.
      const unitRegex =
            /^(?:(?:cup(?:s)?|c(?:up)?\.?)|(?:teaspoon(?:s)?|tsp\.?)|(?:tablespoon(?:s)?|tbsp\.?)|(?:fluid\s*ounce(?:s)?|fl\s*oz\.?)|(?:ounce(?:s)?|oz\.?)|(?:pound(?:s)?|lb(?:s)?\.?)|(?:gram(?:s)?|g\.?)|(?:kilogram(?:s)?|kg\.?)|(?:milliliter(?:s)?|ml\.?)|(?:liter(?:s)?|l\.?)|(?:deciliter(?:s)?|dl\.?)|(?:pinch(?:es)?)|(?:dash(?:es)?)|(?:clove(?:s)?)|(?:slice(?:s)?)|(?:piece(?:s)?)|(?:stick(?:s)?)|(?:package(?:s)?|pkg\.?)|(?:can(?:s)?)|(?:head(?:s)?)|(?:sprig(?:s)?)|(?:bunch(?:es)?)|(?:fillet(?:s)?))\b(?:\s+of)?\s+/i;

      // Remove the measurement unit if present.
      cleaned = cleaned.replace(unitRegex, "");

      return cleaned.trim();
}

export { cleanIngredientText };
