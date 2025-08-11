import { Router } from "express";
import passport from "../../Configs/passport.js";
import { registerUser, updateGenderAndAge, updateOtherDataToCalCalories } from "../../Controller/User/signup.controller.js";
import loginUser from "../../Controller/User/loginUser.controller.js";
import logoutUser from "../../Controller/User/logout.controller.js";
import { SendOtpForForgottenUserEmail } from "../../Controller/User/GetForgetUserMailSendOtp.controller.js";
import { userOtpVerification } from "../../Controller/User/userOtpVerification.controller.js";
import setNewPassword from "../../Controller/User/setNewPassword.controller.js";
import { oauthLoginController } from "../../Controller/User/authLogin.controller.js";
import { isAuthenticated, isAdmin } from "../../Middleware/auth.middleware.js";
import { getUserProfile } from "../../Controller/User/getUserProfile.controller.js";
import getUserDetails from "../../Controller/User/getUserDetails.controller.js";
import getUserCreatedRecipe from "../../Controller/User/GetUserCreatedRecipe.controller.js";
import getAllUser from "../../Controller/User/getAllUser.controller.js";
import updateUser from "../../Controller/User/updateUser.controller.js";
import { upload } from "../../Middleware/multer.middleware.js";
import adminLogin from "../../Controller/Admin/user/adminLogin.controller.js";
import getTopCreators from "../../Controller/User/getTopUser.controller.js";
import adminEditUser from "../../Controller/Admin/user/editUser.controller.js";
import rateLimit from "express-rate-limit";
import { verify } from "crypto";
import { verifyEmail } from "../../Controller/User/verify-email.controller.js";



const authLimiter = rateLimit({
      windowMs: 5 * 60 * 1000,   // 5 minutes
      max: 20,
      message: { message: "Too many login attempts, please wait 5 minutes" }
});


const router = Router();
/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     description: Logs in a user and sets HTTP-only access & refresh tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successful user login
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only cookies with accessToken and refreshToken
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid credentials or unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               height:
 *                 type: string
 *                 example: "175"
 *               weight:
 *                 type: string
 *                 example: "70"
 *               activityLevel:
 *                 type: string
 *                 enum: [sedentary, light, moderate, active, veryActive]
 *                 example: "moderate"
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *                 example: "male"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /user/auth/google:
 *   get:
 *     summary: Google OAuth login
 *     tags: [Authentication]
 *     description: Redirects to Google OAuth consent screen
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */

/**
 * @swagger
 * /user/otp:
 *   post:
 *     summary: Send OTP for password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /user/otp-verify:
 *   post:
 *     summary: Verify OTP for password reset
 *     tags: [Authentication]
 *     description: Verify the OTP sent to user's email for password reset. Sets a reset token cookie upon successful verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *                 description: Email address of the user
 *               otp:
 *                 type: string
 *                 example: "123456"
 *                 description: 6-digit OTP code sent to user's email
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only cookie with reset token (valid for 10 minutes)
 *             schema:
 *               type: string
 *               example: "resetToken=abc123; HttpOnly; Secure; SameSite=None"
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "OTP verified successfully, you can now reset your password"
 *       400:
 *         description: Invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Invalid or expired OTP"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "User not found"
 */

/**
 * @swagger
 * /user/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: "NewSecurePass123!"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /user/email-verification:
 *   post:
 *     summary: Verify email address during registration
 *     tags: [Authentication]
 *     description: Verify user's email address with OTP code sent during registration. This completes the user registration process and enables login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *                 description: Email address used during registration
 *               otp:
 *                 type: string
 *                 example: "123456"
 *                 description: 6-digit OTP code sent to email during registration
 *     responses:
 *       200:
 *         description: Email verified successfully, account activated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Email verified successfully"
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Invalid or expired OTP"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "User not found"
 */

/**
 * @swagger
 * /user/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     description: Logs in an admin user and sets HTTP-only access & refresh tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successful admin login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid credentials or unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// admin routes
router.route("/").get(isAuthenticated, isAdmin, getAllUser); // admin route
router.route("/admin/login").post(adminLogin);
router.route("/admin/edit/:id").put(isAuthenticated, isAdmin, adminEditUser);


router.route("/signup").post(registerUser);
router.route("/user-personal-data").post(isAuthenticated, updateGenderAndAge);
router.route("/user-other-data").post(isAuthenticated, updateOtherDataToCalCalories);
router.route("/login").post(authLimiter, loginUser);

router.route("/logout").post(isAuthenticated, logoutUser);
router.route("/update").put(
      isAuthenticated,
      upload.fields([
            {
                  name: 'profilePicture',
                  maxCount: 1
            }
      ]),
      updateUser);
router.route("/profile").get(isAuthenticated, getUserProfile);
router.route("/profile/:id").get(getUserDetails);
router.route("/otp").post(SendOtpForForgottenUserEmail);
router.route("/otp-verify").post(userOtpVerification);
router.route("/reset-password").post(setNewPassword);
router.route("/recipes/:id").get(isAuthenticated, getUserCreatedRecipe);

// Google authentication route
router.get(
      "/auth/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback route using a custom callback
router.get("/auth/google/callback", (req, res, next) => {
      passport.authenticate("google", { session: false }, (err, data, info) => {
            if (err) {
                  return next(err);
            }
            // Now handle cookie setting and response via your controller
            oauthLoginController(data, req, res);
      })(req, res, next);
});

// router.route('/otp-generate').post(userOtpGenerator)
// router.route('/verify-email').post(verifyEmail)
// router.route('/forget-password-request').post(forgotPasswordRequest)
// router.route('/forget-password').post(forgotPassword)

router.route('/get-all').get(getAllUser)
router.route('/top-creators').get(getTopCreators)

/**
 * @swagger
 * /user/get-all:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All users retrieved successfully
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
 *                         $ref: '#/components/schemas/User'
 *       401:
 *         description: Admin access required
 */

/**
 * @swagger
 * /user/top-creators:
 *   get:
 *     summary: Get top 10 creators by follower count
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Top creators retrieved successfully
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
 *                         allOf:
 *                           - $ref: '#/components/schemas/User'
 *                           - type: object
 *                             properties:
 *                               followerCount:
 *                                 type: integer
 *                                 example: 1250
 */

/**
 * @swagger
 * /user/user-personal-data:
 *   post:
 *     summary: Update user personal data (gender and age)
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dob
 *               - gender
 *             properties:
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *                 example: "male"
 *     responses:
 *       200:
 *         description: Personal data updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: User not found
 */

/**
 * @swagger
 * /user/user-other-data:
 *   post:
 *     summary: Update user health data and calculate daily nutrition needs
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - height
 *               - weight
 *               - activityLevel
 *             properties:
 *               height:
 *                 type: string
 *                 example: "175"
 *                 description: Height in centimeters
 *               weight:
 *                 type: string
 *                 example: "70"
 *                 description: Weight in kilograms
 *               activityLevel:
 *                 type: string
 *                 enum: [sedentary, light, moderate, active, veryActive]
 *                 example: "moderate"
 *     responses:
 *       200:
 *         description: Health data updated and nutrition goals calculated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UserHealthData'
 *       400:
 *         description: User not found or invalid data
 */

/**
 * @swagger
 * /user/profile/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/recipes/{id}:
 *   get:
 *     summary: Get recipes created by a specific user
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User recipes retrieved successfully
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
 *         description: Unauthorized
 */

router.route('/email-verification').post(verifyEmail);
/**
 * @swagger
 * /user/email-verification:
 *   post:
 *     summary: Verify email address during registration
 *     tags: [Authentication]
 *     description: Verify user's email address with OTP code sent during registration. This completes the user registration process and enables login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *                 description: Email address used during registration
 *               otp:
 *                 type: string
 *                 example: "123456"
 *                 description: 6-digit OTP code sent to email during registration
 *     responses:
 *       200:
 *         description: Email verified successfully, account activated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Email verified successfully"
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Invalid or expired OTP"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "User not found"
 */

export default router;
