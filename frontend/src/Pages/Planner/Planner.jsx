/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
      format,
      addDays,
      startOfWeek,
      isBefore,
      startOfDay,
} from "date-fns";
import handleGetApi from "../../API/Handler/getApi.handler";
import handlePostApi from "../../API/Handler/postApi.handler";
import handleDeleteApi from "../../API/Handler/deleteApi.handler";
import { toast } from "react-hot-toast";
import MealPlanGrid from "./MealPlanGrid";
import RecipeSlider from "./RecipeSlider";
import DaySelector from "./DaySelector";
import WeekBar from "./WeekBar";

// Default meal types

// Utility: create an empty meal plan object for a set of meal types.
function createEmptyMealPlan(mealTypes) {
      const plan = {};
      mealTypes.forEach((meal) => {
            plan[meal] = [null];
      });
      return plan;
}

function Planner() {
      const defaultMealTimes = ["Breakfast", "Lunch", "Snacks", "Dinner"];
      // Set week start to Saturday by using weekStartsOn: 6.
      const [startDate, setStartDate] = useState(
            startOfWeek(new Date(), { weekStartsOn: 6 })
      );
      const [selectedDayIndex, setSelectedDayIndex] = useState(null);
      const [allMealTimes, setAllMealTimes] = useState(defaultMealTimes);
      const [weekMealPlans, setWeekMealPlans] = useState({});
      // This state will be used for calculating nutrition totals in WeekBar.
      const [mealNutritionCal, setMealNutritionCal] = useState({});
      const [goalTab, setGoalTab] = useState(1);


      const wholeWeekMode = selectedDayIndex === null;
      const weekDates = Array.from(
            { length: 7 },
            (_, i) => format(addDays(startDate, i), "yyyy-MM-dd")
      );
      const remainingValidDays = weekDates.filter(
            (date) => !isBefore(new Date(date), startOfDay(new Date()))
      );
      const firstValidDay = remainingValidDays[0] || weekDates[0];

      const currentDayKey = wholeWeekMode
            ? firstValidDay
            : format(addDays(startDate, selectedDayIndex), "yyyy-MM-dd");
      const currentDayPlan =
            weekMealPlans[currentDayKey] || createEmptyMealPlan(allMealTimes);
      const isPast = wholeWeekMode
            ? false
            : isBefore(
                  startOfDay(addDays(startDate, selectedDayIndex)),
                  startOfDay(new Date())
            );

      // Fetch plan for the current day
      useEffect(() => {
            const fetchPlan = async () => {
                  try {
                        const res = await handleGetApi(
                              `meal-planner/${currentDayKey}`
                        );
                        if (res.statusCode === 404) return;
                        setWeekMealPlans((prev) => ({
                              ...prev,
                              [currentDayKey]: res.data?.mealPlan || {},
                        }));
                        setMealNutritionCal(res.data?.mealPlan || {});
                  } catch (error) {
                        // Handle error if needed.
                  }
            };
            if (currentDayKey) fetchPlan();
      }, [currentDayKey]);

      // Update mealNutritionCal whenever weekMealPlans or currentDayKey changes
      useEffect(() => {
            setMealNutritionCal(
                  weekMealPlans[currentDayKey] || createEmptyMealPlan(allMealTimes)
            );
      }, [weekMealPlans, currentDayKey, allMealTimes]);

      const transformMealPlan = (mealPlan) => {
            const newPlan = {};
            Object.keys(mealPlan).forEach((meal) => {
                  newPlan[meal] = mealPlan[meal].map(
                        (item) => item?._id || null
                  );
            });
            return newPlan;
      };

      // Modified autoSave that can suppress individual toasts.
      const autoSave = async (dateKeys, plan, suppressToast = false) => {
            const dates = Array.isArray(dateKeys) ? dateKeys : [dateKeys];
            for (const dateKey of dates) {
                  if (isBefore(new Date(dateKey), startOfDay(new Date()))) continue;
                  const payload = { date: dateKey, mealPlan: transformMealPlan(plan) };
                  try {
                        await handlePostApi("meal-planner/create", payload);
                        if (!suppressToast) {
                              toast.success(`Auto-saved changes for ${dateKey}!`);
                        }
                  } catch (error) {
                        if (!suppressToast) {
                              toast.error(`Auto-save failed for ${dateKey}!`);
                        }
                  }
            }
      };

      // Updated updateMultipleDays to suppress individual toasts and show one toast when done.
      const updateMultipleDays = (updateFn) => {
            const newWeekPlans = { ...weekMealPlans };
            remainingValidDays.forEach((dateKey) => {
                  const dayPlan =
                        newWeekPlans[dateKey] || createEmptyMealPlan(allMealTimes);
                  newWeekPlans[dateKey] = updateFn(structuredClone(dayPlan));
            });
            setWeekMealPlans(newWeekPlans);
            Promise.all(
                  remainingValidDays.map((dateKey) =>
                        autoSave(dateKey, newWeekPlans[dateKey], true)
                  )
            ).then(() => {
                  toast.success("Auto-saved changes for the whole week!");
            });
      };

      // In the Planner component, update these functions:

      const handleDrop = async (meal, index, recipe) => {
            // When Today's Goal is selected (goalTab === 0), only update today's date
            if (goalTab === 0) {
                  const todayKey = format(new Date(), 'yyyy-MM-dd');
                  const newPlan = structuredClone(weekMealPlans[todayKey] || createEmptyMealPlan(allMealTimes));

                  if (!newPlan[meal]) newPlan[meal] = [null];
                  while (newPlan[meal].length <= index) newPlan[meal].push(null);
                  newPlan[meal][index] = recipe;
                  if (index === newPlan[meal].length - 1 && recipe !== null) {
                        newPlan[meal].push(null);
                  }

                  setWeekMealPlans((prev) => ({
                        ...prev,
                        [todayKey]: newPlan,
                  }));
                  setMealNutritionCal(newPlan);
                  await autoSave(todayKey, newPlan);
            }
            // For Weekly/Monthly goals, keep the existing logic
            else if (wholeWeekMode) {
                  updateMultipleDays((plan) => {
                        if (!plan[meal]) plan[meal] = [null];
                        while (plan[meal].length <= index) plan[meal].push(null);
                        plan[meal][index] = recipe;
                        if (index === plan[meal].length - 1 && recipe !== null) {
                              plan[meal].push(null);
                        }
                        return plan;
                  });
            } else {
                  const newPlan = structuredClone(
                        currentDayPlan || createEmptyMealPlan(allMealTimes)
                  );
                  if (!newPlan[meal]) newPlan[meal] = [null];
                  newPlan[meal][index] = recipe;
                  if (index === newPlan[meal].length - 1 && recipe !== null) {
                        newPlan[meal].push(null);
                  }
                  setWeekMealPlans((prev) => ({
                        ...prev,
                        [currentDayKey]: newPlan,
                  }));
                  setMealNutritionCal(newPlan);
                  await autoSave(currentDayKey, newPlan);
            }
      };

      const handleRemove = async (meal, index) => {
            const processPlan = (plan) => {
                  plan[meal][index] = null;
                  while (
                        plan[meal].length > 1 &&
                        plan[meal][plan[meal].length - 1] === null
                  ) {
                        plan[meal].pop();
                  }
                  if (plan[meal].length === 0) plan[meal] = [null];
                  if (plan[meal][plan[meal].length - 1] !== null) {
                        plan[meal].push(null);
                  }
                  return plan;
            };

            // When Today's Goal is selected (goalTab === 0), only update today's date
            if (goalTab === 0) {
                  const todayKey = format(new Date(), 'yyyy-MM-dd');
                  const newPlan = processPlan(
                        structuredClone(weekMealPlans[todayKey] || createEmptyMealPlan(allMealTimes))
                  );

                  setWeekMealPlans((prev) => ({
                        ...prev,
                        [todayKey]: newPlan,
                  }));
                  setMealNutritionCal(newPlan);
                  await autoSave(todayKey, newPlan);
            }
            // For Weekly/Monthly goals, keep the existing logic
            else if (wholeWeekMode) {
                  updateMultipleDays(processPlan);
            } else {
                  const newPlan = processPlan(structuredClone(currentDayPlan));
                  setWeekMealPlans((prev) => ({
                        ...prev,
                        [currentDayKey]: newPlan,
                  }));
                  setMealNutritionCal(newPlan);
                  await autoSave(currentDayKey, newPlan);
            }
      };

      const handleSave = async () => {
            const today = startOfDay(new Date());
            if (!wholeWeekMode && isPast) {
                  alert("This day is expired and cannot be updated.");
                  return;
            }
            if (wholeWeekMode) {
                  let allSaved = true;
                  for (const dateKey of weekDates) {
                        const dateValue = startOfDay(new Date(dateKey));
                        if (isBefore(dateValue, today)) continue;
                        const payload = {
                              date: dateKey,
                              mealPlan: transformMealPlan(currentDayPlan),
                        };
                        try {
                              const res = await handlePostApi(
                                    "meal-planner/create",
                                    payload
                              );
                              toast.success(
                                    res.data.message || `Saved plan for ${dateKey}!`
                              );
                        } catch (error) {
                              allSaved = false;
                              alert("Save error: " + error.message);
                        }
                  }
                  if (allSaved) alert("Saved plan for the remaining days!");
            } else {
                  const payload = {
                        date: currentDayKey,
                        mealPlan: transformMealPlan(weekMealPlans[currentDayKey]),
                  };
                  try {
                        const res = await handlePostApi(
                              "meal-planner/create",
                              payload
                        );
                        toast.success(
                              res.data.message ||
                              `Saved plan for ${currentDayKey}!`
                        );
                  } catch (error) {
                        alert(error.message);
                  }
            }
      };

      const handleDeleteDay = async () => {
            if (isPast) {
                  alert("Expired plans cannot be deleted.");
                  return;
            }
            try {
                  const res = await handleDeleteApi("meal-planner/delete", currentDayKey);
                  const data = res.data;
                  setWeekMealPlans((prev) => {
                        const copy = { ...prev };
                        delete copy[currentDayKey];
                        return copy;
                  });
                  setMealNutritionCal({});
                  alert(data.message || `Deleted plan for ${currentDayKey}!`);
            } catch (error) {
                  alert(error.message);
            }
      };

      const [showModal, setShowModal] = useState(false);
      const [newMealType, setNewMealType] = useState("");

      const openModal = () => {
            setShowModal(true);
            setNewMealType("");
      };
      const closeModal = () => {
            setShowModal(false);
            setNewMealType("");
      };

      const handleAddMealType = () => {
            const mealName = newMealType.trim();
            if (!mealName) return;
            setAllMealTimes((prev) => {
                  if (prev.includes(mealName)) return prev;
                  return [...prev, mealName];
            });
            setWeekMealPlans((prev) => {
                  const copy = { ...prev };
                  Object.keys(copy).forEach((dateKey) => {
                        if (!copy[dateKey][mealName]) {
                              copy[dateKey][mealName] = [null];
                        }
                  });
                  return copy;
            });
            closeModal();
      };

      return (
            <div className="min-h-screen">
                  <WeekBar
                        startDate={startDate}
                        setStartDate={setStartDate}
                        handleSave={handleSave}
                        handleDeleteDay={handleDeleteDay}
                        weekMealPlans={weekMealPlans}
                        mealNutritionCal={mealNutritionCal}
                        setSelectedDayIndex={setSelectedDayIndex}
                        goalTab={goalTab}
                        setGoalTab={setGoalTab}
                  />

                  <DaySelector
                        startDate={startDate}
                        selectedDayIndex={selectedDayIndex}
                        setSelectedDayIndex={setSelectedDayIndex}
                        isPast={isPast}
                        goalTab={goalTab}
                  />

                  <div className="lg:p-4">
                        <RecipeSlider />
                        <MealPlanGrid
                              mealPlan={currentDayPlan}
                              onDrop={isPast ? () => { } : handleDrop}
                              onRemove={isPast ? () => { } : handleRemove}
                              readOnly={isPast}
                              allMealTimes={allMealTimes}
                              openModal={openModal}
                        />
                        {isPast && (
                              <p className="text-center text-gray-600 mt-4">
                                    This day is expired and cannot be updated.
                              </p>
                        )}
                  </div>

                  {showModal && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                              <div className="bg-white p-6 rounded shadow-lg w-80">
                                    <h2 className="text-xl mb-4">
                                          Add New Meal Type
                                    </h2>
                                    <input
                                          type="text"
                                          placeholder="Meal type name"
                                          className="border p-2 w-full rounded mb-4"
                                          value={newMealType}
                                          onChange={(e) =>
                                                setNewMealType(e.target.value)
                                          }
                                    />
                                    <div className="flex justify-end space-x-2">
                                          <button
                                                onClick={closeModal}
                                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                          >
                                                Cancel
                                          </button>
                                          <button
                                                onClick={handleAddMealType}
                                                className="px-4 py-2 rounded bg-btnSecondary text-white"
                                          >
                                                Add
                                          </button>
                                    </div>
                              </div>
                        </div>
                  )}
            </div>
      );
}

export default Planner;
