import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import { getUserProfile, loginUser } from "../features/user/userThunks";
import MetaData from "../components/seo/MetaData";
import { useEffect } from "react";

const Login = () => {
      const { loading, isAuthenticated } = useSelector((state) => state.user);
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");

      const navigate = useNavigate();
      const dispatch = useDispatch();

      useEffect(() => {
            if (isAuthenticated) {
                  navigate("/");
            }
      }, [isAuthenticated, navigate]);

      // Compute form validation
      const isEmailValid = /\S+@\S+\.\S+/.test(email);
      const isPasswordValid = password.length >= 6;
      const isFormValid = isEmailValid && isPasswordValid;

      const handleSubmit = async (e) => {
            e.preventDefault();

            // Check validation before submission
            const isEmailValid = /\S+@\S+\.\S+/.test(email);
            const isPasswordValid = password.length >= 6;

            if (!isEmailValid || !isPasswordValid) return;

            try {
                  await dispatch(loginUser({ email, password })).unwrap();
                  toast.success("Logged in successfully");
                  dispatch(getUserProfile());
                  navigate("/");
            } catch (error) {
                  toast.error(error);
            }
      };

      return (
            <>
                  <MetaData title={"Login"} />
                  <div
                        className="container d-flex justify-content-center align-items-center"
                        id="login-container"
                  >
                        <form id="login-form" onSubmit={handleSubmit}>
                              <div className="form-header mb-5">
                                    <h2>EEINA</h2>
                                    <h5>Admin Panel</h5>
                              </div>

                              <div className="floating-label mb-3">
                                    <input
                                          type="email"
                                          id="email"
                                          value={email}
                                          onChange={(e) =>
                                                setEmail(e.target.value)
                                          }
                                    />
                                    <label
                                          className={email ? "typed" : ""}
                                          htmlFor="email"
                                    >
                                          Email
                                    </label>
                              </div>

                              <div className="floating-label mb-3">
                                    <input
                                          type="password"
                                          id="password"
                                          value={password}
                                          onChange={(e) =>
                                                setPassword(e.target.value)
                                          }
                                    />
                                    <label
                                          className={password ? "typed" : ""}
                                          htmlFor="password"
                                    >
                                          Password
                                    </label>
                              </div>

                              <button
                                    type="submit"
                                    className="btn btn-success w-100 my-3"
                                    disabled={loading || !isFormValid}
                              >
                                    {loading ? "Logging in..." : "Login"}
                              </button>
                        </form>
                  </div>
            </>
      );
};

export default Login;
