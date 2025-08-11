// mealPlanner.routes.js
import { Router } from "express";
import createMealPlanner from "../../Controller/MealPlanner/CreateMealPlanner.controller.js";
import { isAuthenticated } from "../../Middleware/auth.middleware.js";
import getMealPlanner from "../../Controller/MealPlanner/getMealPlanner.controller.js";
import deleteMealPlanner from "../../Controller/MealPlanner/DeleteMealPlanner.controller.js";
import { getMealNutritions, getMealNutritionsCurrentWeek } from "../../Controller/MealPlanner/MealNutritions.controller.js";

const router = Router();

/**
 * @swagger
 * /meal-planner/create:
 *   post:
 *     summary: Create or update a meal plan
 *     tags: [Meal Planning]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - mealPlan
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               mealPlan:
 *                 type: object
 *                 properties:
 *                   Breakfast:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["60c72b2f5f1b2c001f3e4567"]
 *                   Lunch:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["60c72b2f5f1b2c001f3e4568"]
 *                   Dinner:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["60c72b2f5f1b2c001f3e4569"]
 *                   Snacks:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: []
 *     responses:
 *       200:
 *         description: Meal plan saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/MealPlan'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /meal-planner/{date}:
 *   get:
 *     summary: Get meal plan for a specific date
 *     tags: [Meal Planning]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         description: Date in YYYY-MM-DD format
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-15"
 *     responses:
 *       200:
 *         description: Meal plan retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/MealPlan'
 *       404:
 *         description: Meal plan not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /meal-planner/week:
 *   get:
 *     summary: Get current week's meal nutrition data
 *     tags: [Meal Planning]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Weekly meal nutrition data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MealPlan'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /meal-planner/month:
 *   get:
 *     summary: Get current month's meal nutrition data
 *     tags: [Meal Planning]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Monthly meal nutrition data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MealPlan'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /meal-planner/delete/{date}:
 *   delete:
 *     summary: Delete a meal plan for a specific date
 *     tags: [Meal Planning]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         description: Date in YYYY-MM-DD format
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-15"
 *     responses:
 *       200:
 *         description: Meal plan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Meal plan not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/week").get(isAuthenticated, getMealNutritionsCurrentWeek);
router.route("/month").get(isAuthenticated, getMealNutritions);
router.route("/:date").get(isAuthenticated, getMealPlanner);
router.route("/create").post(isAuthenticated, createMealPlanner);
router.route("/delete/:date").delete(isAuthenticated, deleteMealPlanner);

export default router;
