import { useState } from "react";
import PropTypes from 'prop-types';
import { useForm } from "react-hook-form";
import { ArrowLeft, Eye, EyeClosed } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getUserProfile, signupUser } from "../../../../app/slice/useSlice";

const SignUp = ({
      fadeVariants,
      setModalType,
      setEmail
}) => {
      const [showPassword, setShowPassword] = useState(false);
      const [loading, setLoading] = useState(false);
      const dispatch = useDispatch();


      const {
            register,
            handleSubmit,
            formState: { errors },
            watch,
            setError,
            reset
      } = useForm();



      // Watch the password fields for immediate validation
      const password = watch("password", "");
      const confirmPassword = watch("confirmPassword", "");

      // Custom validator: returns an error message if passwords don't match.
      const validatePasswordsMatch = (value) =>
            value === password || "Passwords do not match";


      // Determine if the confirm password field is mismatched (and non-empty)
      const isPasswordMismatch = confirmPassword && confirmPassword !== password;


      // Handle form submission
      const handleSignup = async (data) => {
            try {
                  // Set email for further use
                  setEmail(data.email);
                  setLoading(true);
                  const res = await dispatch(signupUser(data)).unwrap();
                  console.log(res);
                  toast.success("User registered successfully");
                  dispatch(getUserProfile());
                  reset();
                  setModalType("emailVerifyOtp")

            } catch (err) {
                  setError("root", {
                        type: "manual",
                        message: err
                  });
                  setEmail("");
            } finally {
                  setLoading(false);
            }
      };

      const onSubmit = (data) => handleSignup(data);



      return (
            <motion.div
                  key="signup"
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeVariants}
                  transition={{ duration: 0.3 }}
                  className="p-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-large w-full max-w-md border border-white/20"
            >
                  <form
                        className="w-full space-y-8"
                        onSubmit={handleSubmit(onSubmit)}
                  >
                        <div className="relative flex items-center justify-center">
                              <span className="absolute left-0">
                                    <ArrowLeft
                                          disabled={loading}
                                          onClick={() =>
                                                setModalType("initial")
                                          }
                                          className="cursor-pointer p-2 rounded-xl hover:bg-neutral-100 transition-colors"
                                    />
                              </span>
                              <h1 className="text-3xl font-bold text-center gradient-text font-display">
                                    Signup
                              </h1>
                        </div>

                        <div className="space-y-8">
                              <div className="grid grid-cols-2 gap-4">
                                    {/* First Name Field */}
                                    <div className="relative group">
                                          <label
                                                htmlFor="firstName"
                                                className="block text-sm font-medium text-neutral-700 mb-2"
                                          >
                                                First Name
                                          </label>
                                          <input
                                                id="firstName"
                                                type="text"
                                                autoComplete="off"
                                                {...register("firstName", {
                                                      required: "This field is required",
                                                })}
                                                className="input-modern"
                                          />
                                          {errors.firstName && (
                                                <span className="text-error text-sm mt-1 block">
                                                      {errors.firstName.message}
                                                </span>
                                          )}
                                    </div>

                                    {/* Last Name Field */}
                                    <div className="relative group">
                                          <label
                                                htmlFor="lastName"
                                                className="block text-sm font-medium text-neutral-700 mb-2"
                                          >
                                                Last Name
                                          </label>
                                          <input
                                                id="lastName"
                                                type="text"
                                                autoComplete="off"
                                                {...register("lastName", {
                                                      required: "This field is required",
                                                })}
                                                className="input-modern"
                                          />
                                          {errors.lastName && (
                                                <span className="text-error text-sm mt-1 block">
                                                      {errors.lastName.message}
                                                </span>
                                          )}
                                    </div>
                              </div>

                              {/* Email Field */}
                              <div className="relative group">
                                    <label
                                          htmlFor="email"
                                          className="block text-sm font-medium text-neutral-700 mb-2"
                                    >
                                          Email
                                    </label>
                                    <input
                                          id="email"
                                          type="email"
                                          autoComplete="off"
                                          {...register("email", {
                                                required: "This field is required",
                                          })}
                                          className="input-modern"
                                    />
                                    {errors.email && (
                                          <span className="text-error text-sm mt-1 block">
                                                {errors.email.message}
                                          </span>
                                    )}
                              </div>

                              {/* Password Field */}
                              <div className="relative group">
                                    <label
                                          htmlFor="password"
                                          className="block text-sm font-medium text-neutral-700 mb-2"
                                    >
                                          Password
                                    </label>
                                    <div className="relative">
                                          <input
                                                id="password"
                                                type={
                                                      showPassword
                                                            ? "text"
                                                            : "password"
                                                }
                                                autoComplete="off"
                                                {...register("password", {
                                                      required: "This field is required",
                                                })}
                                                className="input-modern pr-12"
                                          />
                                          {/* Toggle Button for showing/hiding the password */}
                                          <button
                                                type="button"
                                                onClick={() =>
                                                      setShowPassword((prev) => !prev)
                                                }
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
                                                tabIndex={-1}
                                          >
                                                {showPassword ? (
                                                      <Eye className="text-neutral-500 w-5 h-5" />
                                                ) : (
                                                      <EyeClosed className="text-neutral-500 w-5 h-5" />
                                                )}
                                          </button>
                                    </div>
                                    {errors.password && (
                                          <span className="text-error text-sm mt-1 block">
                                                {errors.password.message}
                                          </span>
                                    )}
                              </div>

                              {/* Confirm Password Field */}
                              <div className="relative group">
                                    <label
                                          htmlFor="confirmPassword"
                                          className="block text-sm font-medium text-neutral-700 mb-2"
                                    >
                                          Confirm Password
                                    </label>
                                    <input
                                          id="confirmPassword"
                                          type={
                                                showPassword
                                                      ? "text"
                                                      : "password"
                                          }
                                          autoComplete="off"
                                          {...register("confirmPassword", {
                                                required: "This field is required",
                                                validate: validatePasswordsMatch,
                                          })}
                                          className={`input-modern ${errors.confirmPassword || isPasswordMismatch
                                                ? "border-error focus:border-error focus:ring-error/20"
                                                : ""
                                                }`}
                                    />
                                    {errors.confirmPassword && (
                                          <span className="text-error text-sm mt-1 block">
                                                {errors.confirmPassword.message}
                                          </span>
                                    )}
                              </div>
                              
                              {errors.root && (
                                    <div className="bg-error/10 border border-error/20 rounded-xl p-4">
                                          <p className="text-error text-sm font-medium">{errors.root.message}</p>
                                    </div>
                              )}
                              
                              <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                    {loading ? (
                                          <div className="flex items-center justify-center space-x-2">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Creating account...</span>
                                          </div>
                                    ) : (
                                          "Sign Up"
                                    )}
                              </button>

                              <div>
                                    <p className="text-center text-sm text-neutral-600 flex items-center space-x-1 justify-center">
                                          <span>Already have an account?</span>
                                          <div
                                                onClick={() =>
                                                      setModalType("login")
                                                }
                                                disabled={loading}
                                                className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer transition-colors"
                                          >
                                                Login now
                                          </div>
                                    </p>
                              </div>
                        </div>
                  </form>
            </motion.div>
      );
}
SignUp.propTypes = {
      fadeVariants: PropTypes.object.isRequired,
      setModalType: PropTypes.func.isRequired,
      setEmail: PropTypes.func.isRequired
};

export default SignUp;