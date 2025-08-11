import { Router } from "express";
const router = Router();

import { upload } from "../../Middleware/multer.middleware.js";

import { createCategory } from "../../Controller/category/createCategory.controller.js";
import { getAllCategory, totalCategories } from "../../Controller/category/getAllCategories.controller.js";
import { editCategory } from "../../Controller/category/editCategory.controller.js";
import { deleteCategory } from "../../Controller/category/deleteCategory.controller.js";
import { getSingleCategory } from "../../Controller/category/getSingleCategory.controller.js";
import getTopCategory from "../../Controller/category/getTopCategory.controller.js";

/**
 * @swagger
 * /category/label/{type}:
 *   get:
 *     summary: Get categories by type
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         description: Category type
 *         schema:
 *           type: string
 *           enum: [meal-type, health-label, diet-label, cuisine]
 *     responses:
 *       200:
 *         description: Categories found successfully
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
 *                         $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid category type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/label/:type").get(getAllCategory);
router.route("/").get(totalCategories);
/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories with pagination
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of categories to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of categories to skip
 *     responses:
 *       200:
 *         description: Categories fetched successfully
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
 *                         categories:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Category'
 *                         total:
 *                           type: integer
 */

/**
 * @swagger
 * /category/label/{type}/{id}:
 *   get:
 *     summary: Get a single category by type and ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         description: Category type
 *         schema:
 *           type: string
 *           enum: [meal-type, health-label, diet-label, cuisine]
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category found successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid category type
 *       404:
 *         description: Category not found
 *   put:
 *     summary: Update a category's image
 *     tags: [Category]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         description: Category type
 *         schema:
 *           type: string
 *           enum: [meal-type, health-label, diet-label, cuisine]
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New category image
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       400:
 *         description: Image is required or invalid category type
 *       404:
 *         description: Category not found
 *       500:
 *         description: Failed to upload image
 */
router.route("/label/:type/:id")
      .get(getSingleCategory)
      .put(upload.single("image"), editCategory);

/**
 * @swagger
 * /category/popular:
 *   get:
 *     summary: Get top 25 most used categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Top categories fetched successfully
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
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: object
 *                             properties:
 *                               en:
 *                                 type: string
 *                               ar:
 *                                 type: string
 *                           count:
 *                             type: integer
 *       500:
 *         description: Internal server error
 */
router.route("/popular").get(getTopCategory);
router.route("/create").post(upload.single("image"), createCategory);
/**
 * @swagger
 * /category/create:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     security:
 *       - cookieAuth: []
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
 *                 description: Category name
 *                 example: "Italian"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Category image
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       400:
 *         description: Please provide an image for the category
 *       500:
 *         description: Failed to upload the image to the server
 */


export default router;
