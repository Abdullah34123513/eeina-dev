import { Router } from "express";
import { isAuthenticated } from "../../Middleware/auth.middleware.js";
import { getSavedRecipes, saveRecipeToUser, unsaveRecipeToUser } from "../../Controller/User/savedRecipeToUser.controller.js";


const router = Router();

/**
 * @swagger
 * /recipe-user/save/{id}:
 *   post:
 *     summary: Save a recipe to user's saved recipes
 *     tags: [Social]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Recipe ID to save
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Recipe already saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Recipe or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/save/:id").post(isAuthenticated, saveRecipeToUser);
router.route("/unsave/:id").post(isAuthenticated, unsaveRecipeToUser);
/**
 * @swagger
 * /recipe-user/unsave/{id}:
 *   post:
 *     summary: Remove a recipe from user's saved recipes
 *     tags: [Social]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Recipe ID to unsave
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe unsaved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Recipe not saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Recipe or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /recipe-user:
 *   get:
 *     summary: Get user's saved recipes
 *     tags: [Social]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Saved recipes fetched successfully
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
 *                         $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/").get(isAuthenticated, getSavedRecipes)




export default router;