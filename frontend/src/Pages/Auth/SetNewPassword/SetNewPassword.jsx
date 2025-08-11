import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeClosed } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import handlePostApi from '../../../API/Handler/postApi.handler';



const SetNewPassword = ({
      fadeVariants,
      setModalType,
      email
}) => {
      const { register, handleSubmit, formState: { errors }, reset, watch } = useForm()
      const [showPassword, setShowPassword] = useState(false);
      const [loading, setLoading] = useState(false);



      // Watch the password fields for immediate validation
      const password = watch("password", "");
      const confirmPassword = watch("confirmPassword", "");

      // Custom validator: returns an error message if passwords don't match.
      const validatePasswordsMatch = (value) =>
            value === password || "Passwords do not match";


      // Determine if the confirm password field is mismatched (and non-empty)
      const isPasswordMismatch = confirmPassword && confirmPassword !== password;

      const onSubmit = async (data) => {
            setLoading(true);
            try {
                  const formData = {
                        email,
                        password: data.password,
                  }

                  const res = await handlePostApi("user/reset-password", formData);

                  if (res?.statusCode === 200) {
                        setLoading(false);
                        reset();
                        setModalType('login');
                        toast.success("Password reset successfully");
                  }
            } catch (error) {
                  console.log(error);
                  toast.error('Internal server error');
            }
      }



      return (
            <motion.div
                  key="login"
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeVariants}
                  transition={{ duration: 0.3 }}
                  className="p-6 bg-white rounded-lg shadow-lg w-[400px]"
            >
                  <form
                        className="w-full p-4 rounded-xl space-y-8"
                        onSubmit={handleSubmit(onSubmit)}>
                        <div className="relative flex items-center justify-center">
                              <span className="absolute left-0">
                                    <ArrowLeft
                                          disabled={loading}
                                          onClick={() => setModalType('initial')}
                                          className="cursor-pointer"
                                    />
                              </span>
                              <h1 className="text-3xl font-bold text-center text-gray-800">
                                    Set New Password
                              </h1>
                        </div>
                        <div className="space-y-6">
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
                                          type={showPassword ? "text" : "password"}
                                          autoComplete="off"
                                          {...register("password", { required: "This field is required" })}
                                          className="w-full border-b border-gray-300 py-2 px-4 pr-10 focus:outline-none focus:border-transparent"
                                    />
                                    {/* Toggle Button for showing/hiding the password */}
                                    <button
                                          type="button"
                                          onClick={() => setShowPassword((prev) => !prev)}
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
                                          type={showPassword ? "text" : "password"}
                                          autoComplete="off"
                                          {...register("confirmPassword", {
                                                required: "This field is required",
                                                validate: validatePasswordsMatch,
                                          })}
                                          className={`w-full border-b py-2 px-4 focus:outline-none focus:border-transparent ${(errors.confirmPassword || isPasswordMismatch)
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
                              <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-to-r from-[rgb(50,180,81)] via-[rgb(76,183,72)] to-[rgb(123,193,68)] 
                                                bg-[200%_auto] transition-all duration-500 bg-right
                                                hover:bg-left text-white px-5 py-2 rounded-md mt-4 lg:mt-0 w-full"
                              >
                                    Submit
                              </button>
                        </div>
                  </form>
            </motion.div>
      )
}


SetNewPassword.propTypes = {
      fadeVariants: PropTypes.object.isRequired,
      setModalType: PropTypes.func.isRequired,
      email: PropTypes.string.isRequired
};

export default SetNewPassword;