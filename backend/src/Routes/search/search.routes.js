import { Router } from "express";
import searchRecipes from "../../Controller/SearchViaQuery/search.controller.js";


const router = Router();

/**
 * @swagger
 * /search/query:
 *   get:
 *     summary: Search recipes by keyword, ingredients, categories, cuisines, diets, health labels, and cook time.
 *     tags:
 *       - Recipe
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Keyword to search in title, description, ingredients, diets, and health labels.
 *       - in: query
 *         name: ingredients
 *         schema:
 *           type: string
 *         description: JSON array or comma-separated string of ingredients (e.g., '["chicken","rice"]' or 'chicken,rice').
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: JSON array or comma-separated string of categories.
 *       - in: query
 *         name: cuisines
 *         schema:
 *           type: string
 *         description: JSON array or comma-separated string of cuisines.
 *       - in: query
 *         name: diets
 *         schema:
 *           type: string
 *         description: JSON array or comma-separated string of diets.
 *       - in: query
 *         name: healthLabels
 *         schema:
 *           type: string
 *         description: JSON array or comma-separated string of health labels.
 *       - in: query
 *         name: cookTime
 *         schema:
 *           type: integer
 *         description: Maximum cooking time in minutes. 121 means more than 2 hours.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of results per page.
 *     responses:
 *       200:
 *         description: Successfully retrieved recipes based on filters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Search results fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     mainRecipe:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Recipe'
 *                     similarRecipes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Recipe'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalCount:
 *                           type: integer
 *       400:
 *         description: Invalid query parameters
 */


router.route("/query").get(searchRecipes);


export default router;