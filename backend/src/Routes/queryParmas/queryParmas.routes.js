import { Router } from "express";
import getCombinedData from "../../Controller/QueryParams/GetQueryParams.controller.js";


const router = Router();

/**
 * @swagger
 * /query:
 *   get:
 *     summary: Get combined filter data (cuisines, diet labels, health labels)
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Combined data fetched successfully
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
 *                         cuisines:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Category'
 *                         dietLabels:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Category'
 *                         healthLabels:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.route("/").get(getCombinedData)



export default router;