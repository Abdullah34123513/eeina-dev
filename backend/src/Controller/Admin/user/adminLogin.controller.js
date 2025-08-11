import { asyncHandler } from "../../../Utils/asyncHandler.js";
import { apiErrorHandler } from "../../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../../Utils/apiResponseHandler.js";
import User from "../../../models/user.model.js";



const adminLogin = asyncHandler(async (req, res) => {
      const { email, password } = req.body;
      try {
            // Validate input fields
            if (!email || !password) {
                  throw new apiErrorHandler(
                        400,
                        "Email and password are required"
                  );
            }

            // Find user by email and ensure the password field is selected
            const user = await User.findOne({ email }).select("+password");
            if (!user) {
                  throw new apiErrorHandler(
                        400,
                        "User not found with this email"
                  );
            }

            if (!user.role == "admin" || !user.role == "master") {
                  throw new apiErrorHandler(
                        400,
                        "Only admin can access this route"
                  );
            }

            // Compare provided password with the hashed password stored in DB
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                  throw new apiErrorHandler(400, "Invalid password");
            }

            // Update the user's last login time
            user.lastLogin = Date.now();
            await user.save();

            // Generate an access token using the instance method defined on the user model
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();

            const cookiesOption = {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  sameSite:
                        process.env.NODE_ENV === "production" ? "none" : "lax",
                  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
            };

            // Return a successful response including the token and user details
            return res
                  .status(200)
                  .cookie("refreshToken", refreshToken, {
                        ...cookiesOption,
                  })
                  .cookie("accessToken", accessToken, {
                        ...cookiesOption,
                  })
                  .json(
                        new apiResponse(
                              200,
                              {
                                    user: {
                                          _id: user._id,
                                          firstName: user.firstName,
                                          lastName: user.lastName,
                                          email: user.email,
                                          role: user.role,
                                    },
                              },
                              "User logged in successfully"
                        )
                  );
      } catch (error) {
            throw new apiErrorHandler(400, error.message);
      }
});

export default adminLogin;
