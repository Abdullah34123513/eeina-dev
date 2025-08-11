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
                                    Login
                              </h1>
                        </div>
                        <div className="space-y-8">
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

                              {/* Remember Me Checkbox */}
                              <div className="flex items-center justify-between pt-2">
                                    <label
                                          htmlFor="remember"
                                          className="flex items-center cursor-pointer group"
                                    >
                                          <input
                                                id="remember"
                                                type="checkbox"
                                                className="mr-3 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2"
                                          />
                                          <span className="text-sm text-neutral-600 group-hover:text-neutral-800 transition-colors">
                                                Remember me
                                          </span>
                                    </label>

                                    <div
                                          onClick={() =>
                                                setModalType("getUserMail")
                                          }
                                          className="text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer transition-colors"
                                    >
                                          Forgot password?
                                    </div>
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
                                                <span>Logging in...</span>
                                          </div>
                                    ) : (
                                          "Login"
                                    )}
                              </button>

                              <div>
                                    <p className="text-center text-sm text-neutral-600 flex items-center space-x-1 justify-center">
                                          <span>
                                                Don&apos;t have an account?
                                          </span>
                                          <div
                                                onClick={() =>
                                                      setModalType("signup")
                                                }
                                                disabled={loading}
                                                className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer transition-colors"
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
