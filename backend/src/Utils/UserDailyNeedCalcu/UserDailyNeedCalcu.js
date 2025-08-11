

function calculateDailyNeeds({ weight, height, dob, gender, activityLevel }) {


      // convert data in the right format
      weight = parseFloat(weight);
      height = parseFloat(height);

      function calculateAge(dob) {
            const birthYear = new Date(dob).getFullYear();
            const currentYear = new Date().getFullYear();
            return currentYear - birthYear;
      }
      let age = calculateAge(dob);

      let bmr;
      if (gender === 'male') {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
      } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
      }

      // Define activity multipliers
      const activityFactors = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            veryActive: 1.9
      };

      // Calculate TDEE
      const tdee = bmr * (activityFactors[activityLevel] || 1.2);

      // Macronutrient distribution percentages
      const proteinPercentage = 0.25; // 25%
      const fatPercentage = 0.30;     // 30%
      const carbPercentage = 0.45;    // 45%
      const sugarPercentage = 0.10;   // 10% for added sugars (optional)

      // Calculate macronutrients in grams
      const proteinGrams = (tdee * proteinPercentage) / 4;
      const fatGrams = (tdee * fatPercentage) / 9;
      const carbGrams = (tdee * carbPercentage) / 4;
      const sugarGrams = (tdee * sugarPercentage) / 4;


      return {
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            calorieGoal: Math.round(tdee),
            proteinGrams: Math.round(proteinGrams),
            fatGrams: Math.round(fatGrams),
            carbGrams: Math.round(carbGrams),
            sugarGrams: Math.round(sugarGrams)
      };
}


export default calculateDailyNeeds;
