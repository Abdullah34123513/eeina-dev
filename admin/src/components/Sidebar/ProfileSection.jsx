import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import profileImg from "../../assets/images/profile.jpg";
import { logoutUser } from "../../features/user/userThunks";
import { IonIcon } from "@ionic/react";
import { person, power } from "ionicons/icons";

const ProfileSection = () => {
      const dispatch = useDispatch();
      const navigate = useNavigate();

      const { user } = useSelector((state) => state.user);

      const logoutHandler = () => {
            dispatch(logoutUser()).then(() => {
                  navigate("/login");
                  toast.success("Logged out successfully");
            });
      }
      return (
            <div className="profile py-2 mb-3">
                  <div className="profile-img-container">
                        <img src={profileImg} alt="Profile image" />
                  </div>
                  <div className="content">
                        <div className="dropdown">
                              <Link
                                    className="dropdown-toggle"
                                    to="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                              >
                                    {user && user.firstName.en}
                              </Link>

                              <ul className="dropdown-menu rounded-0 border-light-subtle">
                                    <li>
                                          <Link
                                                className="dropdown-item"
                                                to="/profile"
                                          >
                                                {" "}
                                                <IonIcon icon={person} />{" "}
                                                My Account
                                          </Link>
                                    </li>
                                    <li>
                                          <Link
                                                className="dropdown-item"
                                                onClick={logoutHandler}
                                          >o
                                                <IonIcon icon={power} />{" "}
                                                Logout
                                          </Link>
                                    </li>
                              </ul>
                        </div>
                        <span className="designation">Administrator</span>
                  </div>
            </div>
      );
};

export default ProfileSection;
