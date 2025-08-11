import { Router } from "express";
import getIngredients from "../../Controller/Ingredients/getIngredients.controller.js";
import getSingleIngredient from "../../Controller/Ingredients/getSingleIngredients.controller.js";
import editIngredients from "../../Controller/Ingredients/editIngredients.controller.js";
import deleteIngredients from "../../Controller/Ingredients/deleteIngredients.controller.js";
import createIngredients from "../../Controller/Ingredients/createIngredients.controller.js";
import { upload } from "../../Middleware/multer.middleware.js";
import getTopIngredients from "../../Controller/Ingredients/getTopIngredients.controller.js";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Ingredient
 *   description: Ingredient management APIs
 */

/**
 * @swagger
 * /ingredient:
 *   get:
 *     summary: Get a paginated list of ingredient
 *     tags: [Ingredient]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of items to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of items to skip
 *     responses:
 *       200:
 *         description: Ingredient fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     ingredient:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Ingredient'
 *                     total:
 *                       type: integer
 *                       example: 128
 *                 message:
 *                   type: string
 *                   example: Ingredient fetched
 *       404:
 *         description: No ingredient found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                   example: No ingredient found
 */

router.route("/").get(getIngredients);

/**
 * @swagger
 * /ingredient/popular:
 *   get:
 *     summary: Get top 25 most used ingredients
 *     tags:
 *       - Ingredient
 *     description: Returns the top 25 most frequently used ingredients across all recipes.
 *     responses:
 *       200:
 *         description: Top ingredients fetched successfully
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "onion"
 *                       count:
 *                         type: integer
 *                         example: 35
 *                 message:
 *                   type: string
 *                   example: Top ingredients fetched successfully
 *       500:
 *         description: Internal server error
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
 *                   example: Internal server error
 */

router.route("/popular").get(getTopIngredients);

/**
 * @swagger
 * /ingredient/create:
 *   post:
 *     summary: Create a new ingredient
 *     tags:
 *       - Ingredient
 *     description: Creates a new ingredient with a name and an image uploaded from the user's device. The image is uploaded to AWS S3.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the ingredient
 *                 example: Tomato
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file of the ingredient
 *     responses:
 *       201:
 *         description: Ingredient created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64bcf3342f456a001c9d50c9
 *                     name:
 *                       type: string
 *                       example: Tomato
 *                     image:
 *                       type: object
 *                       properties:
 *                         url:
 *                           type: string
 *                           example: https://s3.amazonaws.com/your-bucket/filename.jpg
 *                         key:
 *                           type: string
 *                           example: uploads/filename.jpg
 *                 message:
 *                   type: string
 *                   example: Ingredient created
 *       400:
 *         description: Missing required fields or image upload error
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
 *                   example: Please provide an image for the category.
 *       500:
 *         description: Server or S3 upload error
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
 *                   example: Failed to upload the image to the server.
 */

router.route("/create").post(upload.single("image"), createIngredients);

/**
 * @swagger
 * /ingredient/{id}:
 *   get:
 *     summary: Get a single ingredient by ID
 *     tags:
 *       - Ingredient
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Ingredient ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingredient found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Ingredient'
 *                 message:
 *                   type: string
 *                   example: Ingredients found
 *       404:
 *         description: Ingredient not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: No ingredient found
 *
 *   put:
 *     summary: Update an ingredient's image
 *     tags:
 *       - Ingredient
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Ingredient ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New image file to upload
 *     responses:
 *       200:
 *         description: Ingredient updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Ingredient'
 *                 message:
 *                   type: string
 *                   example: Ingredient updated
 *       404:
 *         description: Ingredient not found
 *
 *   delete:
 *     summary: Delete an ingredient by ID
 *     tags:
 *       - Ingredient
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Ingredient ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingredient deleted
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
 *                   example: Ingredient deleted
 *       404:
 *         description: Ingredient not found
 */


router.route("/:id")
      .get(getSingleIngredient)
      .put(upload.single("image"), editIngredients)
      .delete(deleteIngredients);



export default router;
