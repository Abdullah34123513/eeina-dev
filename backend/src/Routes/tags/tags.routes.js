import {
      createTags,
      deleteTags,
      editTags,
      getAllTags,
} from "../../Controller/tags/tags.controller.js";
import { isAdmin, isAuthenticated } from "../../Middleware/auth.middleware.js";

import { Router } from "express";
const router = Router();

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Get all tags
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All tags retrieved successfully
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
 *                             type: string
 *                           location:
 *                             type: string
 *                             example: "header"
 *                           script:
 *                             type: string
 *                             example: "<script>console.log('Hello');</script>"
 *                           status:
 *                             type: string
 *                             enum: [active, inactive]
 *                             example: "active"
 *       401:
 *         description: Authentication required
 */
router.route("/").get(isAuthenticated, getAllTags);
router.route("/create").post(isAuthenticated, isAdmin, createTags);
/**
 * @swagger
 * /tags/create:
 *   post:
 *     summary: Create a new tag (Admin only)
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
 *               - location
 *               - script
 *             properties:
 *               location:
 *                 type: string
 *                 example: "header"
 *                 description: Where the tag should be placed
 *               script:
 *                 type: string
 *                 example: "<script>console.log('Hello');</script>"
 *                 description: The script/tag content
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 default: active
 *                 description: Tag status
 *     responses:
 *       201:
 *         description: Tag created successfully
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
 *                         _id:
 *                           type: string
 *                         location:
 *                           type: string
 *                         script:
 *                           type: string
 *                         status:
 *                           type: string
 *       401:
 *         description: Admin access required
 */
/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     summary: Update a tag (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Tag ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *                 example: "footer"
 *               script:
 *                 type: string
 *                 example: "<script>console.log('Updated');</script>"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Tag not found
 *       401:
 *         description: Admin access required
 *   delete:
 *     summary: Delete a tag (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Tag ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Tag not found
 *       401:
 *         description: Admin access required
 */
router.route("/:id")
      .put(isAuthenticated, isAdmin, editTags)
      .delete(isAuthenticated, isAdmin, deleteTags);

export default router;
