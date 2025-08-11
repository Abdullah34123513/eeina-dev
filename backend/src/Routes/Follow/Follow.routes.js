import { Router } from "express";
import { isAuthenticated } from "../../Middleware/auth.middleware.js";
import { followUser, unfollowUser } from "../../Controller/Follow/followUser.controller.js";


const router = Router();

/**
 * @swagger
 * /follow/{id}:
 *   post:
 *     summary: Follow a user
 *     tags:
 *       - Social
 *     security:
 *       - cookieAuth: []  # if you're using HTTP-only cookie-based JWT auth
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to follow
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User followed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Already following this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.route("/:id")
      .post(isAuthenticated, followUser);

/**
* @swagger
* /follow/{id}/unfollow:
*   post:
*     summary: Unfollow a user
*     tags:
 *       - Social
*     security:
*       - cookieAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: ID of the user to unfollow
*         schema:
*           type: string
*     responses:
*       200:
*         description: User unfollowed successfully
*         content:
*           application/json:
*             schema:
 *               $ref: '#/components/schemas/ApiResponse'
*       400:
*         description: Not following this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
*       404:
*         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
*/


router.route("/:id/unfollow")
      .post(isAuthenticated, unfollowUser);


export default router;