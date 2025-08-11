import { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeClosed } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { getUserProfile, loginUser } from "../../../../app/slice/useSlice";
import { closeModal } from "../../../../app/slice/modalSlice";


const Login = ({ fadeVariants, setModalType }) => {
      const [showPassword, setShowPassword] = useState(false);
      const {
            register,
            handleSubmit,
            formState: { errors },
            setError,
            reset,
      } = useForm();
      const [loading, setLoading] = useState(false);

      const dispatch = useDispatch();
      const navigate = useNavigate();
      const location = useLocation();

      const from = location.state?.from?.pathname || "/";

      const onSubmit = async (data) => {
            setLoading(true);
            try {
                  setLoading(true);
                  await dispatch(loginUser(data)).unwrap();
                  toast.success("Login successful");
                  dispatch(getUserProfile());
                  reset();
                  navigate(from, { replace: true });
                  dispatch(closeModal());
            } catch (error) {
                  setError("root", {
                        type: "manual",
                        message: error,
                  });
            } finally {
                  setLoading(false);
            }
      };

      return (
            <motion.div
                  key="login"
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeVariants}
                  transition={{ duration: 0.3 }}
                  className="p-6 bg-white rounded-lg shadow-lg w-full"
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
                                    Login
                              </h1>
                        </div>
                        <div className="space-y-6">
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

                              {/* Remember Me Checkbox */}
                              <div className="flex items-center justify-between">
                                    <label
                                          htmlFor="remember"
                                          className="flex items-center"
                                    >
                                          <input
                                                id="remember"
                                                type="checkbox"
                                                className="mr-2"
                                          />
                                          <span className="text-sm text-gray-600">
                                                Remember me
                                          </span>
                                    </label>

                                    <div
                                          onClick={() =>
                                                setModalType("getUserMail")
                                          }
                                          className="text-sm text-secondary hover:underline cursor-pointer"
                                    >
                                          Forgot password?
                                    </div>
                              </div>

                              {errors.root && <p className="text-red-500">{errors.root.message}</p>}
                              <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-to-r from-[rgb(50,180,81)] via-[rgb(76,183,72)] to-[rgb(123,193,68)] 
                                                bg-[200%_auto] transition-all duration-500 bg-right
                                                hover:bg-left text-white px-5 py-2 rounded-md mt-4 lg:mt-0 w-full"
                              >
                                    Login
                              </button>

                              <div>
                                    <p className="text-center text-sm text-gray-600 flex items-center space-x-1 justify-center">
                                          <span>
                                                Don&apos;t have an account?
                                          </span>
                                          <div
                                                onClick={() =>
                                                      setModalType("signup")
                                                }
                                                disabled={loading}
                                                className="text-secondary hover:underline cursor-pointer"
                                          >
                                                Create one
                                          </div>
                                    </p>
                              </div>
                        </div>
                  </form>
            </motion.div>
      );
};
Login.propTypes = {
      fadeVariants: PropTypes.object.isRequired,
      setModalType: PropTypes.func.isRequired,
};

export default Login;
