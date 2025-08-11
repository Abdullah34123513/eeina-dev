import { format, addDays, subDays } from "date-fns";
import propTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import CircularProgress from "../RecipeDetails/CircularProgress";
import handleGetApi from "../../API/Handler/getApi.handler";
import { useLang } from "../../context/LangContext";

function WeekBar({
      startDate,
      setStartDate,
      weekMealPlans,
      mealNutritionCal,
      // setSelectedDayIndex,
      // setGoalTab,
      goalTab,
}) {
      const { isArabic } = useLang();
      const { user } = useSelector((state) => state.user);
      const [calNutrition, setCalNutrition] = useState([]);

      const endDate = addDays(startDate, 6);
      const formattedStart = format(startDate, "d MMM");
      const formattedEnd = format(endDate, "d MMM");

      const handlePrevWeek = () => setStartDate((prev) => subDays(prev, 7));
      const handleNextWeek = () => setStartDate((prev) => addDays(prev, 7));

      const userGoals = {
            cal: user?.calorieGoal || 2000,
            carbs: user?.carbGoal || 225,
            fat: user?.fatGoal || 66.66,
            pro: user?.proteinGoal || 125,
            sugar: user?.sugarGoal || 50,
      };

      function calculateNutritionTotals(mealPlan) {
            let totals = { calories: 0, protein: 0, sugar: 0, fat: 0, carbs: 0 };

            Object.values(mealPlan)
                  .flat()
                  .forEach((recipe) => {
                        if (recipe?.nutrition?.nutrients) {
                              const getNutrient = (name) =>
                                    recipe.nutrition.nutrients.find(
                                          (n) => n.name?.en?.toLowerCase() === name
                                    )?.amount || 0;

                              totals.calories += Number(getNutrient("calories"));
                              totals.protein += Number(getNutrient("protein"));
                              totals.sugar += Number(getNutrient("sugar"));
                              totals.fat += Number(getNutrient("fat"));
                              totals.carbs +=
                                    Number(getNutrient("carbohydrates")) ||
                                    Number(getNutrient("carbs"));
                        }
                  });

            return [
                  { label: "cal", amount: totals.calories },
                  { label: "pro", amount: totals.protein },
                  { label: "sugar", amount: totals.sugar },
                  { label: "fat", amount: totals.fat },
                  { label: "carbs", amount: totals.carbs },
            ];
      }

      const calculateAverageNutrition = (mealPlans, type) => {
            const totals = { calories: 0, protein: 0, sugar: 0, fat: 0, carbs: 0 };

            mealPlans.forEach((plan) => {
                  const dailyTotals = { calories: 0, protein: 0, sugar: 0, fat: 0, carbs: 0 };

                  Object.values(plan?.mealPlan || {}).forEach((meals) => {
                        meals.forEach((recipe) => {
                              recipe.nutrition?.nutrients?.forEach((nutrient) => {
                                    const name = nutrient.name?.en?.toLowerCase();
                                    const amount = Number(nutrient.amount) || 0;
                                    switch (name) {
                                          case "calories":
                                                dailyTotals.calories += amount;
                                                break;
                                          case "protein":
                                                dailyTotals.protein += amount;
                                                break;
                                          case "sugar":
                                                dailyTotals.sugar += amount;
                                                break;
                                          case "fat":
                                                dailyTotals.fat += amount;
                                                break;
                                          case "carbohydrates":
                                          case "carbs":
                                                dailyTotals.carbs += amount;
                                                break;
                                    }
                              });
                        });
                  });

                  totals.calories += dailyTotals.calories;
                  totals.protein += dailyTotals.protein;
                  totals.sugar += dailyTotals.sugar;
                  totals.fat += dailyTotals.fat;
                  totals.carbs += dailyTotals.carbs;
            });

            let divisor;
            if (type === "week") {
                  divisor = 7;
            } else if (type === "month") {
                  if (mealPlans.length > 0 && mealPlans[0].date) {
                        const planDate = new Date(mealPlans[0].date);
                        const year = planDate.getFullYear();
                        const monthIndex = planDate.getMonth();
                        divisor = new Date(year, monthIndex + 1, 0).getDate();
                  } else {
                        const now = new Date();
                        divisor = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                  }
            } else {
                  divisor = mealPlans.length || 1;
            }

            if (divisor > 0) {
                  totals.calories /= divisor;
                  totals.protein /= divisor;
                  totals.sugar /= divisor;
                  totals.fat /= divisor;
                  totals.carbs /= divisor;
            }

            return [
                  { label: "cal", amount: totals.calories },
                  { label: "pro", amount: totals.protein },
                  { label: "sugar", amount: totals.sugar },
                  { label: "fat", amount: totals.fat },
                  { label: "carbs", amount: totals.carbs },
            ];
      };



      const fetchPlan = useCallback(async () => {
            try {
                  const res = await handleGetApi(`meal-planner/${format(new Date(), "yyyy-MM-dd")}`);
                  if (res?.statusCode === 200) {
                        setCalNutrition(calculateNutritionTotals(res?.data?.mealPlan));
                  }
            } catch (error) {
                  console.log(error);
                  setCalNutrition(calculateNutritionTotals({}));
            }
      }, [setCalNutrition]);

      const monthlyPlan = useCallback(async () => {
            try {
                  const res = await handleGetApi(`meal-planner/month`);
                  if (res?.statusCode === 200) {
                        setCalNutrition(calculateAverageNutrition(res?.data, "month"));
                  }
            } catch (error) {
                  console.log(error);
                  setCalNutrition(calculateNutritionTotals({}));
            }
      }, [setCalNutrition]);

      const weeklyPlan = useCallback(async () => {
            try {
                  const res = await handleGetApi(`meal-planner/week`);
                  if (res?.statusCode === 200) {
                        setCalNutrition(calculateAverageNutrition(res?.data, "week"));
                  }
            } catch (error) {
                  console.log(error);
                  setCalNutrition(calculateNutritionTotals({}));
            }
      }, [setCalNutrition]);

      useEffect(() => {
            setCalNutrition(calculateNutritionTotals(mealNutritionCal));
      }, [mealNutritionCal, weekMealPlans]);


      useEffect(() => {
            if (goalTab === 0) {
                  fetchPlan();
            } else if (goalTab === 1) {
                  weeklyPlan();
            } else if (goalTab === 2) {
                  monthlyPlan();
            }
      }, [goalTab, fetchPlan, weeklyPlan, monthlyPlan]);


      return (
            <div className="flex flex-col lg:flex-row items-center justify-between p-4 bg-white">
                  <div className="w-full lg:w-1/2 flex flex-col space-y-2">
                        <div className="text-center lg:text-start">
                              <h1 className="text-2xl font-medium">
                                    {isArabic ? "خطط لأسبوعك مع إيينا" : "Plan your week with EEINA"}
                              </h1>
                              <p className="text-gray-700">
                                    {isArabic ? "الخطة لـ: " : "Plan for: "}
                                    {isArabic
                                          ? `${user?.firstName?.ar?.charAt(0).toUpperCase()}${user?.firstName?.ar?.slice(1)} ${user?.lastName?.ar?.charAt(0).toUpperCase()}${user?.lastName?.ar?.slice(1)}`
                                          : `${user?.firstName?.en?.charAt(0).toUpperCase()}${user?.firstName?.en?.slice(1)} ${user?.lastName?.en?.charAt(0).toUpperCase()}${user?.lastName?.en?.slice(1)}`
                                    }
                              </p>
                        </div>

                        <div className="flex items-end gap-4">
                              <div className="w-full lg:w-1/2 flex items-center justify-center space-x-4 bg-btnSecondary text-white p-4 rounded-xl">
                                    <button onClick={handlePrevWeek}>
                                          <ChevronLeft size={34} />
                                    </button>
                                    <div className="text-center">
                                          <span>
                                                {isArabic ? "اختيار الأسبوع:" : "Your week selection:"}
                                          </span>
                                          <span className="block font-medium">
                                                {formattedStart} - {formattedEnd}
                                          </span>
                                    </div>
                                    <button onClick={handleNextWeek}>
                                          <ChevronRight size={34} />
                                    </button>
                              </div>
                        </div>
                  </div>

                  {/* Right Panel - Nutrition Details */}
                  <div className="w-full lg:w-1/2 py-4 lg:p-4 lg:shadow-md rounded-xl bg-white">
                        {/* <div className="flex items-center gap-5 pb-2">
                              {[
                                    isArabic ? "هدف اليوم" : "Today's Goal",
                                    isArabic ? "الهدف الأسبوعي" : "Weekly Goal",
                                    // isArabic ? "الهدف الشهري" : "Monthly Goal"
                              ].map((label, index) => (
                                    <button
                                          key={index}
                                          className={`border-2 px-3 py-1 text-sm lg:text-base text-nowrap rounded ${goalTab === index
                                                ? "border-primary"
                                                : "border-gray-400 hover:border-primary"
                                                }`}
                                          onClick={() => {
                                                if (index === 1) {
                                                      setSelectedDayIndex(null);
                                                }
                                                setGoalTab(index);
                                          }}
                                    >
                                          {label}
                                    </button>
                              ))}
                        </div> */}

                        <div className="mt-4">
                              <p className="font-semibold">
                                    {isArabic ? "إجمالي العناصر الغذائية:" : "Nutrition Totals:"}
                              </p>
                              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                                    {calNutrition.map((nutrient, index) => (
                                          <CircularProgress
                                                key={index}
                                                valueString={nutrient.amount.toFixed(0)}
                                                label={nutrient.label}
                                                size={90}
                                                duration={1}
                                                dailyNeed={userGoals[nutrient.label]}
                                          />
                                    ))}
                              </div>
                        </div>
                  </div>
            </div>
      );
}

WeekBar.propTypes = {
      startDate: propTypes.instanceOf(Date).isRequired,
      setStartDate: propTypes.func.isRequired,
      handleSave: propTypes.func,
      handleDeleteDay: propTypes.func,
      weekMealPlans: propTypes.object.isRequired,
      mealNutritionCal: propTypes.object.isRequired,
      setSelectedDayIndex: propTypes.func.isRequired,
      setGoalTab: propTypes.func.isRequired,
      goalTab: propTypes.number.isRequired,
};

export default WeekBar;
