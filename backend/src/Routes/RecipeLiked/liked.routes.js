import { Router } from "express"
import handleLikedRecipe from "../../Controller/LikedRecipe/handleLikedRecipe.controller.js";
import { isAuthenticated } from "../../Middleware/auth.middleware.js";
import getUserLikedRecipes from "../../Controller/LikedRecipe/getUserLikedRecipes.controller.js";


const router = Router();

/**
 * @swagger
 * /like/{recipeId}:
 *   post:
 *     summary: Like or unlike a recipe
 *     tags: [Social]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         description: Recipe ID to like/unlike
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe liked/unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.route("/:recipeId").post(isAuthenticated, handleLikedRecipe);
router.route("/").get(isAuthenticated, getUserLikedRecipes);
/**
 * @swagger
 * /like:
 *   get:
 *     summary: Get user's liked recipes
 *     tags: [Social]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User liked recipes fetched successfully
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
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


export default router;