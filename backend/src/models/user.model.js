      import mongoose, { Schema } from "mongoose";
      import bcrypt from "bcrypt";
      import crypto from "crypto";
      import jwt from "jsonwebtoken";
      import validator from "validator";

      const userSchema = new Schema(
            {
                  firstName: {
                        type: {
                              en: {
                                    type: String,
                                    trim: true,
                                    lowercase: true,
                              },
                              ar: {
                                    type: String,
                                    trim: true,
                              }
                        },
                        required: [true, "First name is required"],
                        validate: {
                              validator: function (v) {
                                    return v.en || v.ar;
                              },
                              message: "At least one language version required for first name"
                        }
                  },
                  lastName: {
                        type: {
                              en: {
                                    type: String,
                                    trim: true,
                                    lowercase: true,
                              },
                              ar: {
                                    type: String,
                                    trim: true,
                              }
                        },
                        required: [true, "Last name is required"],
                        validate: {
                              validator: function (v) {
                                    return v.en || v.ar;
                              },
                              message: "At least one language version required for last name"
                        }
                  },
                  email: {
                        type: String,
                        unique: true,
                        sparse: true,
                        validate: {
                              validator: function (value) {
                                    if (!this.googleId && !this.facebookId) {
                                          if (!value) throw new Error("Email is required for local signups.");
                                          if (!validator.isEmail(value)) throw new Error("Invalid email address.");
                                    }
                                    return true;
                              },
                        },
                  },
                  username: {
                        type: String,
                        unique: true,
                        sparse: true,
                        maxlength: [30, "Username should not exceed 30 characters"],
                        lowercase: true,
                        trim: true,
                  },
                  dob: String,
                  bio: {
                        en: {
                              type: String,
                              maxlength: [200, "Bio should not exceed 200 characters"],
                              trim: true,
                        },
                        ar: {
                              type: String,
                              maxlength: [200, "Bio should not exceed 200 characters"],
                              trim: true,
                        },
                  },
                  youtubeURL: String,
                  instagramURL: String,
                  facebookURL: String,
                  tiktokURL: String,
                  googleId: {
                        type: String,
                        unique: true,
                        sparse: true,
                  },
                  facebookId: {
                        type: String,
                        unique: true,
                        sparse: true,
                  },
                  address: { type: String, trim: true },
                  phone: {
                        type: String,
                        trim: true,
                        match: [
                              /^\+?[1-9]\d{1,14}$/,
                              "Please enter a valid phone number (E.164 format)",
                        ],
                  },
                  password: {
                        type: String,
                        required: [
                              function () {
                                    return !this.googleId && !this.facebookId;
                              },
                              "Password is required for local signups.",
                        ],
                        minlength: [6, "Password should be at least 6 characters"],
                        validate: {
                              validator: function (value) {
                                    return validator.isStrongPassword(value, {
                                          minLowercase: 1,
                                          minUppercase: 1,
                                          minNumbers: 1,
                                          minSymbols: 1,
                                    });
                              },
                              message: "Please enter a stronger password.",
                        },
                        select: false,
                  },
                  role: {
                        type: String,
                        enum: ["admin", "super-admin", "user"],
                        default: "user",
                  },
                  status: {
                        type: String,
                        enum: ["active", "inactive", "banned"],
                        default: "active",
                  },
                  otp: { type: String, default: null, select: false },
                  otpExpires: { type: Date, select: false },
                  isEmailVerified: { type: Boolean, default: false },
                  accessToken: { type: String, select: false },
                  refreshToken: { type: String, select: false },
                  resetPasswordToken: { type: String, select: false },
                  resetPasswordExpires: { type: Date, select: false },
                  image: {
                        url: { type: String, default: "/default.webp" },
                        key: String,
                  },
                  lastPasswordChanged: Date,
                  lastLogin: Date,
                  savedRecipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
                  follower: [{ type: Schema.Types.ObjectId, ref: "User" }],
                  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
                  language: {
                        type: String,
                        default: "english",
                  },
                  gender: String,
                  age: String,
                  height: String,
                  weight: String,
                  activityLevel: String,
                  bmr: Number,
                  tdee: Number,
                  calorieGoal: Number,
                  proteinGoal: Number,
                  fatGoal: Number,
                  carbGoal: Number,
                  sugarGoal: Number,
            },
            { timestamps: true }
      );

      // Custom Validators
      userSchema.path("firstName").validate(function (value) {
            return value.en || value.ar;
      }, "At least one language version of first name is required.");

      userSchema.path("lastName").validate(function (value) {
            return value.en || value.ar;
      }, "At least one language version of last name is required.");


      // Password Hashing
      userSchema.pre("save", async function (next) {
            if (!this.isModified("password")) return next();
            try {
                  const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS || 10));
                  this.password = await bcrypt.hash(this.password, salt);
                  this.lastPasswordChanged = Date.now();
                  next();
            } catch (err) {
                  next(err);
            }
      });

      // Auth Methods
      userSchema.methods.comparePassword = async function (candidatePassword) {
            return bcrypt.compare(candidatePassword, this.password);
      };

      userSchema.methods.generateAccessToken = function () {
            return jwt.sign(
                  {
                        _id: this._id,
                        firstName: this.firstName,
                        lastName: this.lastName,
                        email: this.email,
                        role: this.role,
                  },
                  process.env.ACCESS_TOKEN_SECRET,
                  { expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRES_IN }
            );
      };

      userSchema.methods.generateRefreshToken = function () {
            return jwt.sign(
                  { _id: this._id },
                  process.env.REFRESH_TOKEN_SECRET,
                  { expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRES_IN }
            );
      };

      userSchema.methods.generateResetPasswordToken = async function () {
            const resetToken = crypto.randomBytes(32).toString("hex");
            this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
            this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
            // await this.save({ validateBeforeSave: false });
            return resetToken;
      };

      // OTP Methods
      userSchema.methods.generateOTP = async function () {
            const otp = crypto.randomInt(100000, 999999).toString();
            const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
            const salt = bcrypt.genSaltSync(10);
            this.otp = bcrypt.hashSync(otp, salt);
            this.otpExpires = expires;
            return otp;
      };

      userSchema.methods.verifyOTP = async function (otp) {
            console.log("Verifying OTP:", otp, "this.otp:", this.otp);
            const isMatch = await bcrypt.compare(otp, this.otp);
            if (isMatch && Date.now() < this.otpExpires.getTime()) {
                  this.otp = undefined;
                  this.otpExpires = undefined;
                  // await this.save(); // Ensure changes persist in the DB
                  return true;
            }
            return false;
      };

      // Indexes
      userSchema.index({ email: 1 });
      userSchema.index({ status: 1 });
      userSchema.index({ role: 1 });

      const User = mongoose.model("User", userSchema);
      export default User;