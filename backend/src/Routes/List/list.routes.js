import { Router } from "express";
import { isAuthenticated } from "../../Middleware/auth.middleware.js";
import getList from "../../Controller/List/getList.controller.js";
import createList from "../../Controller/List/createList.controller.js";
import updateList from "../../Controller/List/updateList.controller.js";
import removeList from "../../Controller/List/removeList.controller.js";
import getSingleList from "../../Controller/List/getSingleList.controller.js";
import generateListPDF from "../../Controller/List/generateListPDF.controller.js";


const router = Router();

/**
 * @swagger
 * /list:
 *   get:
 *     summary: Get user's shopping lists
 *     tags: [Shopping Lists]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Shopping lists retrieved successfully
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
 *                         $ref: '#/components/schemas/ShoppingList'
 *       400:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/").get(isAuthenticated, getList)

/**
 * @swagger
 * /list/{listID}:
 *   get:
 *     summary: Get a single shopping list
 *     tags: [Shopping Lists]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: listID
 *         required: true
 *         description: Shopping list ID or "all-lists" for combined list
 *         schema:
 *           type: string
 *           example: "60c72b2f5f1b2c001f3e1111"
 *     responses:
 *       200:
 *         description: Shopping list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ShoppingList'
 *       404:
 *         description: Shopping list not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/:listID").get(isAuthenticated, getSingleList)

/**
 * @swagger
 * /list/create:
 *   post:
 *     summary: Create a new shopping list
 *     tags: [Shopping Lists]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - listName
 *               - list
 *               - recipeId
 *             properties:
 *               listName:
 *                 type: string
 *                 example: "Weekly Shopping"
 *               list:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60c72b2f5f1b2c001f3e1234", "60c72b2f5f1b2c001f3e1235"]
 *               recipeId:
 *                 type: string
 *                 example: "60c72b2f5f1b2c001f3e4567"
 *     responses:
 *       201:
 *         description: Shopping list created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ShoppingList'
 *       400:
 *         description: Bad request or list already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/create").post(isAuthenticated, createList)

/**
 * @swagger
 * /list/update/{listID}:
 *   put:
 *     summary: Update a shopping list
 *     tags: [Shopping Lists]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: listID
 *         required: true
 *         description: Shopping list ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Shopping List"
 *               list:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60c72b2f5f1b2c001f3e1234"]
 *               recipeId:
 *                 type: string
 *                 example: "60c72b2f5f1b2c001f3e4567"
 *     responses:
 *       200:
 *         description: Shopping list updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Shopping list not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/update/:listID").put(isAuthenticated, updateList)

/**
 * @swagger
 * /list/delete/{listID}:
 *   delete:
 *     summary: Delete a shopping list
 *     tags: [Shopping Lists]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: listID
 *         required: true
 *         description: Shopping list ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shopping list deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Shopping list not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/delete/:listID").delete(isAuthenticated, removeList)

/**
 * @swagger
 * /list/pdf:
 *   post:
 *     summary: Generate shopping list PDF
 *     tags: [Shopping Lists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - list
 *               - lang
 *             properties:
 *               list:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                           example: "chicken"
 *                         ar:
 *                           type: string
 *                           example: "دجاج"
 *               lang:
 *                 type: string
 *                 enum: [en, ar]
 *                 example: "en"
 *     responses:
 *       200:
 *         description: PDF generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid list payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/pdf").post(generateListPDF);





export default router;