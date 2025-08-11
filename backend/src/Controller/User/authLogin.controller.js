// Controller/User/oauthLogin.controller.js
import { apiResponse } from "../../Utils/apiResponseHandler.js";

export const oauthLoginController = (data, req, res) => {
      const { accessToken, refreshToken, user } = data;

      const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      };

     res.cookie("accessToken", accessToken, {
           ...cookieOptions,
           expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
     });
     res.cookie("refreshToken", refreshToken, {
           ...cookieOptions,
           expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
     });

      // Either redirect to your client or send a JSON response.
      // For a typical SPA, you might redirect to the homepage:
      return res.redirect(
            process.env.CLIENT_URL || `${req.protocol}://${req.get("host")}`
      );

      // Alternatively, if you prefer a JSON response:
      // return res.status(200).json(
      //   new apiResponse(200, { user }, "Google login successful")
      // );
};
