// ProfileCard.jsx
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useState } from "react";
import handlePostApi from "../../../API/Handler/postApi.handler";
import { User } from "lucide-react";
import { useLang } from "../../../context/LangContext";

const ProfileCard = ({ item, route }) => {
      const { isArabic } = useLang();

      const { user, isAuthenticated } = useSelector((state) => state.user);

      // 1. Store the entire item in a local state so we can modify follower array.
      const [localProfile, setLocalProfile] = useState(item);

      const { _id, firstName, lastName, image: profilePicture, follower = [] } =
            localProfile || {};



      const handleFollowToggle = async () => {
            if (!isAuthenticated) {
                  return alert("Please login to follow or unfollow users.");
            }

            // 2. Check if the logged-in user is already following
            const isAlreadyFollowing = follower.includes(user?._id.toString());

            if (isAlreadyFollowing) {
                  // Optional: Confirm before unfollowing
                  const confirmed = window.confirm("Are you sure you want to unfollow this user?");
                  if (!confirmed) return;

                  // 3a. Unfollow (API call)
                  const res = await handlePostApi(`follow/${_id}/unfollow`, {});
                  if (res?.statusCode === 200 || res?.statusCode === 201) {
                        // 4a. Update local follower array by removing the user's ID
                        setLocalProfile((prev) => ({
                              ...prev,
                              follower: prev.follower.filter((id) => id !== user._id.toString()),
                        }));
                  }
            } else {
                  // 3b. Follow (API call)
                  const res = await handlePostApi(`follow/${_id}`, {});
                  if (res?.statusCode === 200 || res?.statusCode === 201) {
                        // 4b. Add the user's ID to the local follower array
                        setLocalProfile((prev) => ({
                              ...prev,
                              follower: [...prev.follower, user._id.toString()],
                        }));
                  }
            }
      };

      return (
            <div className="w-full lg:max-w-[200px] p-4 bg-white border rounded-lg shadow-md transition-shadow duration-200">
                  <div className="w-full flex flex-col items-center justify-between space-y-4">
                        {/* Profile Image */}
                        <Link to={`${route}/${_id}`} className="w-14 h-14 rounded-full border-2 border-white shadow-sm">
                              <div>
                                    {profilePicture ? (
                                          profilePicture?.url === 'default.webp' ? (
                                                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-secondary text-2xl font-bold uppercase">
                                                      <span className="text-center text-lg font-oswald font-light">
                                                            {isArabic
                                                                  ? firstName?.ar?.[0] || firstName?.[0]
                                                                  : firstName?.en?.[0] || firstName?.[0]}
                                                      </span>
                                                </div>
                                          ) : (
                                                <img
                                                      src={profilePicture?.url}
                                                      alt="Author Image"
                                                      className="w-16 h-16 rounded-full object-cover"
                                                />
                                          )
                                    ) : (
                                          <User size={60} className="rounded-full object-cover" />
                                    )}
                              </div>
                        </Link>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                              <Link to={`${route}/${_id}`} className="hover:no-underline group">
                                    <h2
                                          className="text-sm font-semibold truncate text-gray-900 group-hover:text-primary transition-colors"
                                          dir={isArabic ? 'rtl' : 'ltr'}
                                    >
                                          {(firstName && lastName)
                                                ? isArabic
                                                      ? `${firstName?.ar || firstName} ${lastName?.ar || lastName}`
                                                      : `${firstName?.en || firstName} ${lastName?.en || lastName}`
                                                : 'N/A'}
                                    </h2>
                              </Link>
                        </div>


                        {/* Follow/Unfollow Button */}
                        <button
                              onClick={handleFollowToggle}
                              className={`
                                          ml-2 text-sm font-medium px-7 py-1.5 rounded-md transition-colors
                                          ${follower.includes(user?._id)
                                          ? "bg-gray-100 text-gray-700"
                                          : "bg-btnSecondary text-white"
                                    }
                                    `}
                        >
                              {follower.includes(user?._id) ? "Unfollow" : "Follow"}
                        </button>
                  </div>
            </div>
      );
};

ProfileCard.propTypes = {
      item: PropTypes.shape({
            _id: PropTypes.string,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            profilePicture: PropTypes.string,
            follower: PropTypes.array,
            following: PropTypes.array,
      }),
      route: PropTypes.string.isRequired,
};

export default ProfileCard;
