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
                  className="p-6 bg-white rounded-lg shadow-lg w-full max-w-sm"
            >
                  <form
                        className="w-full p-4 rounded-xl space-y-8"
                        onSubmit={handleSubmit(onSubmit)}
                  >
                        <div className="relative flex items-center justify-center">
                              <span className="absolute left-0">
                                    <ArrowLeft
                                          disabled={loading}
                                          onClick={() =>
                                                setModalType("initial")
                                          }
                                          className="cursor-pointer"
                                    />
                              </span>
                              <h1 className="text-3xl font-bold text-center text-gray-800">
                                    Signup
                              </h1>
                        </div>

                        <div className="space-y-6">
                              <div className="flex space-x-4">
                                    {/* First Name Field */}
                                    <div className="relative group">
                                          <label
                                                htmlFor="firstName"
                                                className=" text-sm text-gray-600 mb-1"
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
                                                className="w-full border-b border-gray-300 py-2 px-4 focus:outline-none focus:border-transparent"
                                          />
                                          {/* Animated blue border */}
                                          <span
                                                className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-b from-[rgb(50,180,81)] via-[rgb(76,183,72)] to-[rgb(123,193,68)]  transform scale-x-0 origin-center transition-transform duration-300 group-focus-within:scale-x-100"
                                                aria-hidden="true"
                                          ></span>
                                          {errors.firstName && (
                                                <span className="text-danger text-xs">
                                                      {errors.firstName.message}
                                                </span>
                                          )}
                                    </div>

                                    {/* Last Name Field */}
                                    <div className="relative group">
                                          <label
                                                htmlFor="lastName"
                                                className=" text-sm text-gray-600 mb-1"
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
                                                className="w-full border-b border-gray-300 py-2 px-4 focus:outline-none focus:border-transparent"
                                          />
                                          {/* Animated blue border */}
                                          <span
                                                className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-b from-[rgb(50,180,81)] via-[rgb(76,183,72)] to-[rgb(123,193,68)]  transform scale-x-0 origin-center transition-transform duration-300 group-focus-within:scale-x-100"
                                                aria-hidden="true"
                                          ></span>
                                          {errors.lastName && (
                                                <span className="text-danger text-xs">
                                                      {errors.lastName.message}
                                                </span>
                                          )}
                                    </div>
                              </div>

                              {/* Email Field */}
                              <div className="relative group">
                                    <label
                                          htmlFor="email"
                                          className="block text-sm text-gray-600 mb-1"
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
                                          className="w-full border-b border-gray-300 py-2 px-4 focus:outline-none focus:border-transparent"
                                    />
                                    {/* Animated blue border */}
                                    <span
                                          className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-b from-[rgb(50,180,81)] via-[rgb(76,183,72)] to-[rgb(123,193,68)]  transform scale-x-0 origin-center transition-transform duration-300 group-focus-within:scale-x-100"
                                          aria-hidden="true"
                                    ></span>
                                    {errors.email && (
                                          <span className="text-danger text-xs">
                                                {errors.email.message}
                                          </span>
                                    )}
                              </div>

                              {/* Password Field */}
                              <div className="relative group">
                                    <label
                                          htmlFor="password"
                                          className="block text-sm text-gray-600 mb-1"
                                    >
                                          Password
                                    </label>
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
                                          className="w-full border-b border-gray-300 py-2 px-4 pr-10 focus:outline-none focus:border-transparent"
                                    />
                                    {/* Toggle Button for showing/hiding the password */}
                                    <button
                                          type="button"
                                          onClick={() =>
                                                setShowPassword((prev) => !prev)
                                          }
                                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                                          tabIndex={-1}
                                    >
                                          {showPassword ? (
                                                <Eye className="text-gray-500" />
                                          ) : (
                                                <EyeClosed className="text-gray-500" />
                                          )}
                                    </button>
                                    {/* Animated blue border */}
                                    <span
                                          className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-b from-[rgb(50,180,81)] via-[rgb(76,183,72)] to-[rgb(123,193,68)] transform scale-x-0 origin-center transition-transform duration-300 group-focus-within:scale-x-100"
                                          aria-hidden="true"
                                    ></span>
                                    {errors.password && (
                                          <span className="text-danger text-xs">
                                                {errors.password.message}
                                          </span>
                                    )}
                              </div>

                              {/* Confirm Password Field */}
                              <div className="relative group">
                                    <label
                                          htmlFor="confirmPassword"
                                          className="block text-sm text-gray-600 mb-1"
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
                                          className={`w-full border-b py-2 px-4 focus:outline-none focus:border-transparent ${errors.confirmPassword ||
                                                isPasswordMismatch
                                                ? "border-detext-danger"
                                                : "border-gray-300"
                                                }`}
                                    />
                                    {/* Animated blue border */}
                                    <span
                                          className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-b from-[rgb(50,180,81)] via-[rgb(76,183,72)] to-[rgb(123,193,68)]  transform scale-x-0 origin-center transition-transform duration-300 group-focus-within:scale-x-100"
                                          aria-hidden="true"
                                    ></span>
                                    {errors.confirmPassword && (
                                          <span className="text-danger text-xs">
                                                {errors.confirmPassword.message}
                                          </span>
                                    )}
                              </div>
                              {errors.root && (
                                    <p className="text-red-500">
                                          {errors.root.message}
                                    </p>
                              )}
                              <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-to-r from-[rgb(50,180,81)] via-[rgb(76,183,72)] to-[rgb(123,193,68)] 
                                                bg-[200%_auto] transition-all duration-500 bg-right
                                                hover:bg-left text-white px-5 py-2 rounded-md mt-4 lg:mt-0 w-full"
                              >
                                    Sign Up
                              </button>

                              <div>
                                    <p className="text-center text-sm text-gray-600 flex items-center space-x-1 justify-center">
                                          <span>Already have an account?</span>
                                          <div
                                                onClick={() =>
                                                      setModalType("login")
                                                }
                                                disabled={loading}
                                                className="text-secondary hover:underline cursor-pointer"
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