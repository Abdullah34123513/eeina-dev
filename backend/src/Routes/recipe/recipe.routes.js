import { Router } from "express";
import importRecipe from "../../Controller/Recipes/importRecipe.controller.js";
import getRecipe from "../../Controller/Recipes/getRecipe.controller.js";
import getSingleRecipe from "../../Controller/Recipes/getSingleRecipe.controller.js";
import createRecipe from "../../Controller/CustomRecipe/createRecipe.controller.js";
import { upload } from "../../Middleware/multer.middleware.js";
import deleteSingleRecipe from "../../Controller/Recipes/deleteRecipe.controller.js";
import {
      RequestForRecipes,
      SaveRecipeInDB,
} from "../../Controller/Admin/Recipe/AddRecipeViaApi.controller.js";
import { editRecipeController } from "../../Controller/Recipes/editRecipe.controller.js";
import { AllImportRecipeGet } from "../../Controller/Recipes/AllRecipeGet.controller.js";
import { isAdmin, isAuthenticated } from "../../Middleware/auth.middleware.js";
import { generateRecipePdf } from "../../Controller/RecipePFD/recipePdf.controller.js";
import getRecipesUsingQuery from "../../Controller/Recipes/getRecipesUsingQuery.controller.js";
import getRandomRecipes from "../../Controller/Recipes/getRandomRecipes.controller.js";
import getPopularRecipe from "../../Controller/Recipes/getPopularRecipe.controller.js";
import { adminQueryGetRecipe } from "../../Controller/Admin/Recipe/searchRecipe.controller.js";

const router = Router();

// admin routes
/**
 * @swagger
 * /recipe/admin:
 *   get:
 *     summary: Admin search and filter recipes
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword (can be recipe ID, title, description, ingredients)
 *       - in: query
 *         name: imported
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by imported recipes
 *     responses:
 *       200:
 *         description: Recipes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         recipes:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Recipe'
 *                         total:
 *                           type: integer
 *       401:
 *         description: Unauthorized - Admin access required
 */
router.route("/admin").get(adminQueryGetRecipe);

/**
 * @swagger
 * /recipe/delete/{id}:
 *   delete:
 *     summary: Delete a recipe
 *     tags: [Recipe]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Recipe ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: Not authorized to delete this recipe
 *       404:
 *         description: Recipe not found
 */
router.route("/delete/:id").delete(isAuthenticated, deleteSingleRecipe);
/**
 * @swagger
 * /recipe/api-get:
 *   get:
 *     summary: Get recipes from external API (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: random
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Get random recipes
 *       - in: query
 *         name: cuisines
 *         schema:
 *           type: string
 *         description: Filter by cuisine type
 *       - in: query
 *         name: diet
 *         schema:
 *           type: string
 *         description: Filter by diet type
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by recipe type
 *       - in: query
 *         name: number
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of recipes to fetch
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset for pagination
 *       - in: query
 *         name: recipe_first_letter
 *         schema:
 *           type: string
 *         description: Filter by first letter of recipe name
 *     responses:
 *       200:
 *         description: External recipes fetched successfully
 *       401:
 *         description: Admin access required
 *       404:
 *         description: No recipes found
 */
router.route("/api-get").get(isAuthenticated, isAdmin, RequestForRecipes);
/**
 * @swagger
 * /recipe/save-recipe:
 *   post:
 *     summary: Save external recipes to database (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipeData
 *               - recipeApiType
 *             properties:
 *               recipeData:
 *                 type: array
 *                 items:
 *                   type: object
 *                 description: Array of recipe data from external API
 *               recipeApiType:
 *                 type: string
 *                 enum: [ids, bulk]
 *                 description: Type of recipe data (IDs or full recipe objects)
 *     responses:
 *       200:
 *         description: Recipes saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         successCount:
 *                           type: integer
 *                         skippedCount:
 *                           type: integer
 *                         failedCount:
 *                           type: integer
 *       400:
 *         description: No recipe data provided
 *       401:
 *         description: Admin access required
 */
router.route("/save-recipe").post(isAuthenticated, SaveRecipeInDB);


/**
 * @swagger
 * /recipe:
 *   get:
 *     summary: Get paginated list of recipes
 *     tags: [Recipe]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of recipes per page (default is 3)
 *     responses:
 *       200:
 *         description: List of recipes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *                 message:
 *                   type: string
 *                   example: Recipes retrieved successfully.
 *       400:
 *         description: Bad request or error during fetching
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve recipes.
 */
router.route("/").get(getRecipe);


/**
 * @swagger
 * /recipe/import:
 *   get:
 *     summary: Get all imported recipes (Admin)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Imported recipes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         recipes:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Recipe'
 *                         total:
 *                           type: integer
 *   post:
 *     summary: Import recipe from URL
 *     tags: [Recipe]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipeUrl
 *             properties:
 *               recipeUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/recipe/123"
 *                 description: URL of the recipe to import
 *     responses:
 *       201:
 *         description: Recipe imported successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid URL or unsupported site
 *       500:
 *         description: Import failed
 */
router.route("/import").get(isAuthenticated, AllImportRecipeGet);

/**
 * @swagger
 * /recipe/random:
 *   get:
 *     summary: Get random recipes
 *     tags: [Recipe]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of recipes to return (default is 10)
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Number of recipes to skip (default is 0)
 *     responses:
 *       200:
 *         description: Random recipes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *                 message:
 *                   type: string
 *                   example: Recipes retrieved successfully.
 *       400:
 *         description: Bad request or error fetching random recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve recipes.
 */

router.route("/random").get(getRandomRecipes);


/**
 * @swagger
 * /recipe/popular:
 *   get:
 *     summary: Get top 10 popular recipes
 *     tags: [Recipe]
 *     description: Retrieves the most popular recipes sorted by likes and views.
 *     responses:
 *       200:
 *         description: Popular recipes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *                 message:
 *                   type: string
 *                   example: Popular recipes retrieved successfully.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.route("/popular").get(getPopularRecipe);
router.route("/import").post(isAuthenticated, importRecipe);
/**
 * @swagger
 * /recipe/edit/{id}:
 *   put:
 *     summary: Edit an existing recipe
 *     tags: [Recipe]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Recipe ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Grilled Chicken"
 *               description:
 *                 type: string
 *                 example: "An updated delicious grilled chicken recipe"
 *               ingredients:
 *                 type: string
 *                 description: JSON string array of ingredients
 *                 example: '["2 chicken breasts", "1 tsp salt", "2 tbsp olive oil"]'
 *               instructions:
 *                 type: string
 *                 description: JSON string array of instruction objects
 *                 example: '[{"step": "Preheat grill to medium-high heat"}]'
 *               time:
 *                 type: integer
 *                 example: 30
 *               servings:
 *                 type: integer
 *                 example: 4
 *               videoUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://youtube.com/watch?v=xyz"
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Recipe thumbnail image
 *               otherImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Additional recipe images
 *               instructionImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Images for instruction steps
 *               toDeleteImages:
 *                 type: string
 *                 description: JSON array of image keys to delete
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Recipe'
 *       201:
 *         description: New recipe created (if user doesn't own original)
 *       400:
 *         description: Missing required fields or invalid data
 *       403:
 *         description: Not authorized to edit this recipe
 *       404:
 *         description: Recipe not found
 */
router.route("/edit/:id").put(
      isAuthenticated,
      upload.fields([
            {
                  name: "otherImages",
                  maxCount: 5,
            },
            {
                  name: "thumbnail",
                  maxCount: 1,
            },
            { name: "instructionImages", maxCount: 1000 }, // Added instructionImages field
      ]),
      editRecipeController
);

router.route("/edit/:id").put(
      isAuthenticated,
      upload.fields([
            {
                  name: "otherImages",
                  maxCount: 5,
            },
            {
                  name: "thumbnail",
                  maxCount: 1,
            },
            { name: "instructionImages", maxCount: 100 }, // Added instructionImages field
      ]),
      editRecipeController
);
router.route("/edit/:id").put(
      isAuthenticated,
      upload.fields([
            {
                  name: "otherImages",
                  maxCount: 5,
            },
            {
                  name: "thumbnail",
                  maxCount: 1,
            },
            { name: "instructionImages", maxCount: 100 }, // Added instructionImages field
      ]),
      editRecipeController
);

// custom recipe routes
/**
 * @swagger
 * /recipe/custom:
 *   post:
 *     summary: Create a custom recipe
 *     tags: [Recipe]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - ingredients
 *               - instructions
 *               - time
 *               - servings
 *               - thumbnail
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My Special Grilled Chicken"
 *               description:
 *                 type: string
 *                 example: "A delicious homemade grilled chicken recipe"
 *               ingredients:
 *                 type: string
 *                 description: JSON string array of ingredients
 *                 example: '["2 chicken breasts", "1 tsp salt", "2 tbsp olive oil"]'
 *               instructions:
 *                 type: string
 *                 description: JSON string array of instruction objects
 *                 example: '[{"step": "Preheat grill to medium-high heat", "image": {"url": "", "key": ""}}]'
 *               time:
 *                 type: integer
 *                 example: 30
 *                 description: Cooking time in minutes
 *               servings:
 *                 type: integer
 *                 example: 4
 *                 description: Number of servings
 *               videoUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://youtube.com/watch?v=xyz"
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Recipe thumbnail image (required)
 *               otherImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Additional recipe images (max 5)
 *               instructionImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Images for instruction steps (max 100)
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Missing required fields or invalid ingredients
 *       401:
 *         description: Authentication required
 */
router.route("/custom").post(
      isAuthenticated,
      upload.fields([
            { name: "otherImages", maxCount: 5 },
            { name: "thumbnail", maxCount: 1 },
            { name: "instructionImages", maxCount: 100 }, // Added instructionImages field
      ]),
      createRecipe
);

/**
 * @swagger
 * /recipe/{id}:
 *   get:
 *     summary: Get a single recipe by ID
 *     tags: [Recipe]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Recipe ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe found successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Recipe ID is required
 *       404:
 *         description: Recipe not found
 */
router.route("/:id").get(getSingleRecipe);
/**
 * @swagger
 * /recipe/pdf:
 *   post:
 *     summary: Generate recipe PDF
 *     tags: [Recipe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipe
 *             properties:
 *               recipe:
 *                 $ref: '#/components/schemas/Recipe'
 *               recipeLang:
 *                 type: string
 *                 enum: [en, ar]
 *                 default: en
 *                 description: Language for PDF generation
 *     responses:
 *       200:
 *         description: PDF generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid recipe payload
 *       500:
 *         description: Failed to generate PDF
 */
router.route("/pdf").post(generateRecipePdf);
/**
 * @swagger
 * /recipe/search/query:
 *   get:
 *     summary: Simple recipe search
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: ingredient
 *         schema:
 *           type: string
 *         description: Search by ingredient name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Search by category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: Recipes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         recipes:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Recipe'
 *                         totalRecipes:
 *                           type: integer
 *       400:
 *         description: Search error
 */
router.route("/search/query").get(getRecipesUsingQuery);

export default router;