import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Mail, X } from "lucide-react";
import { Link } from "react-router-dom";

const AuthInitial = ({ setModalType, closeModal, fadeVariants }) => {
      // This function redirects to the backend Google auth route
      const handleGoogleLogin = () => {
            window.location.href = "/api/v1/user/auth/google";
      };

      return (
            <motion.div
                  key="initial"
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeVariants}
                  transition={{ duration: 0.3 }}
                  className="p-6 bg-white rounded-lg shadow-lg max-w-[400px]"
            >
                  <div className="flex justify-end items-center mb-4">
                        <X className="cursor-pointer" onClick={closeModal} />
                  </div>
                  <h2 className="text-2xl font-semibold mb-8">Welcome!</h2>
                  <div className="w-full flex flex-col space-y-4">
                        <div className="w-full flex flex-col space-y-4">
                              <div className="space-y-4">
                                    <div className="w-full p-[2px] bg-gradient-to-r from-[#4285F4] via-[#DB4437] to-[#F4B400] rounded-full mb-2">
                                          <button
                                                onClick={handleGoogleLogin} // Start Google OAuth via Passport
                                                className="w-full text-black px-4 py-2 rounded-full bg-white flex items-center justify-center relative"
                                          >
                                                <span className="absolute left-4">
                                                      <img
                                                            src="/google.png"
                                                            alt="google_icon"
                                                            className="w-9 aspect-square"
                                                      />
                                                </span>
                                                <span>
                                                      Continue with Google
                                                </span>
                                          </button>
                                    </div>

                                    <div className="flex items-center justify-center space-x-4 px-4">
                                          <div className="w-full h-[1px] border-b border-gray-400" />
                                          <span className="text-gray-500">
                                                or
                                          </span>
                                          <div className="w-full h-[1px] border-b border-gray-400" />
                                    </div>
                                    <button
                                          onClick={() => setModalType("login")}
                                          className="w-full text-black px-4 py-2 rounded-full border border-gray-400 duration-300 hover:border-gray-900 mb-2 flex items-center justify-center relative"
                                    >
                                          <span className="absolute left-4">
                                                <Mail />
                                          </span>
                                          <span>Continue with Email</span>
                                    </button>
                              </div>
                              <p className="text-center text-gray-500 cursor-pointer">
                                    Don&apos;t have an account?{" "}
                                    <span
                                          onClick={() => setModalType("signup")}
                                          className="text-black font-semibold"
                                    >
                                          Sign up
                                    </span>
                              </p>
                        </div>
                        <div className="text-gray-500 text-center max-w-[80%] mx-auto">
                              <p>
                                    By using EEINA Food you agree to our{" "}
                                    <Link to="#" className="text-primary">
                                          Terms
                                    </Link>{" "}
                                    and{" "}
                                    <Link to="#" className="text-primary">
                                          Privacy Policy
                                    </Link>
                                    . This site is protected by reCAPTCHA and
                                    the Google{" "}
                                    <Link to="#" className="text-primary">
                                          Privacy Policy
                                    </Link>{" "}
                                    and{" "}
                                    <Link to="#" className="text-primary">
                                          Terms of Service
                                    </Link>{" "}
                                    apply.
                              </p>
                        </div>
                  </div>
            </motion.div>
      );
};

AuthInitial.propTypes = {
      setModalType: PropTypes.func.isRequired,
      closeModal: PropTypes.func.isRequired,
      fadeVariants: PropTypes.object.isRequired,
};

export default AuthInitial;
