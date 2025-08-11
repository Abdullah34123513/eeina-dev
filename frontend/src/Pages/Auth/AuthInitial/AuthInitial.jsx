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
                  className="p-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-large max-w-md border border-white/20"
            >
                  <div className="flex justify-end items-center mb-6">
                        <button 
                              onClick={closeModal}
                              className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
                        >
                              <X className="w-5 h-5 text-neutral-500" />
                        </button>
                  </div>
                  
                  <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold gradient-text font-display mb-2">Welcome to EEINA!</h2>
                        <p className="text-neutral-600">Join our community of food lovers</p>
                  </div>
                  
                  <div className="w-full flex flex-col space-y-6">
                        <div className="w-full flex flex-col space-y-6">
                              <div className="space-y-6">
                                    <div className="w-full p-[2px] bg-gradient-to-r from-[#4285F4] via-[#DB4437] to-[#F4B400] rounded-2xl">
                                          <button
                                                onClick={handleGoogleLogin} // Start Google OAuth via Passport
                                                className="w-full text-neutral-800 px-6 py-4 rounded-2xl bg-white flex items-center justify-center relative hover:bg-neutral-50 transition-colors font-medium"
                                          >
                                                <span className="absolute left-6">
                                                      <img
                                                            src="/google.png"
                                                            alt="google_icon"
                                                            className="w-6 h-6"
                                                      />
                                                </span>
                                                <span>
                                                      Continue with Google
                                                </span>
                                          </button>
                                    </div>

                                    <div className="flex items-center justify-center space-x-4">
                                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                                          <span className="text-neutral-500 font-medium px-4">
                                                or
                                          </span>
                                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                                    </div>
                                    
                                    <button
                                          onClick={() => setModalType("login")}
                                          className="w-full text-neutral-800 px-6 py-4 rounded-2xl border-2 border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 flex items-center justify-center relative font-medium"
                                    >
                                          <span className="absolute left-6">
                                                <Mail className="w-5 h-5 text-primary-600" />
                                          </span>
                                          <span>Continue with Email</span>
                                    </button>
                              </div>
                              
                              <p className="text-center text-neutral-600">
                                    Don&apos;t have an account?{" "}
                                    <span
                                          onClick={() => setModalType("signup")}
                                          className="text-primary-600 hover:text-primary-700 font-semibold cursor-pointer transition-colors"
                                    >
                                          Sign up
                                    </span>
                              </p>
                        </div>
                        
                        <div className="text-neutral-500 text-center text-xs leading-relaxed pt-6 border-t border-neutral-200">
                              <p className="max-w-sm mx-auto">
                                    By using EEINA Food you agree to our{" "}
                                    <Link to="#" className="text-primary-600 hover:text-primary-700 transition-colors">
                                          Terms
                                    </Link>{" "}
                                    and{" "}
                                    <Link to="#" className="text-primary-600 hover:text-primary-700 transition-colors">
                                          Privacy Policy
                                    </Link>
                                    .
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
