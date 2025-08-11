import { Router } from "express";
const router = Router();

import { isAuthenticated } from "../../Middleware/auth.middleware.js";
import { createComment } from "../../Controller/comment/createComment.controller.js";
import likedComment from "../../Controller/comment/likedComment.controller.js";
import editComment from "../../Controller/comment/editComment.controller.js";
import deleteComment from "../../Controller/comment/deleteComment.controller.js";
import { getComments } from "../../Controller/comment/getComments.controller.js";


/**
 * @swagger
 * /comment/create:
 *   post:
 *     summary: Create a new comment
 *     tags: [Social]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - recipeId
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Great recipe! I loved it."
 *               recipeId:
 *                 type: string
 *                 example: "60c72b2f5f1b2c001f3e4567"
 *               parentId:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *                 description: ID of parent comment for replies
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.route("/create").post(isAuthenticated, createComment);

/**
 * @swagger
 * /comment/like/{id}:
 *   post:
 *     summary: Like or unlike a comment
 *     tags: [Social]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment liked/unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/like/:id").post(isAuthenticated, likedComment)

/**
 * @swagger
 * /comment/edit/{id}:
 *   put:
 *     summary: Edit a comment
 *     tags: [Social]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated comment content"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/edit/:id").put(isAuthenticated, editComment)

/**
 * @swagger
 * /comment/delete/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Social]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/delete/:id").delete(isAuthenticated, deleteComment)

/**
 * @swagger
 * /comment/{recipeId}:
 *   get:
 *     summary: Get comments for a recipe
 *     tags: [Social]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         description: Recipe ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
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
 *                         $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/:recipeId").get(isAuthenticated, getComments)


export default router;