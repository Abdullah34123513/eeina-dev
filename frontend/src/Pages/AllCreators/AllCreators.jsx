import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import handleGetApi from "../../API/Handler/getApi.handler";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import handlePostApi from "../../API/Handler/postApi.handler";
import { useLang } from "../../context/LangContext";


const AllCreators = () => {
      const { user, isAuthenticated } = useSelector((state) => state.user);
      const [profileData, setProfileData] = useState([]);
      const { isArabic } = useLang();


      useEffect(() => {
            async function profileDataFetch() {
                  const res = await handleGetApi("user/get-all");
                  if (res?.data) {
                        if (isAuthenticated) {
                              // Filter out the logged-in user.
                              const filteredData = res.data.filter(
                                    (data) => data._id !== user._id
                              );
                              setProfileData(filteredData);
                        } else {
                              setProfileData(res.data);
                        }
                  }
            }
            profileDataFetch();
      }, [user, isAuthenticated]);

      const handleFollowToggle = async (data) => {
            if (!isAuthenticated) {
                  return alert("Please login to follow or unfollow users.");
            }

            // Check if the logged-in user is already following.
            const isAlreadyFollowing = data.follower.includes(user._id.toString());

            if (isAlreadyFollowing) {
                  // Optional: Confirm before unfollowing
                  const confirmed = window.confirm("Are you sure you want to unfollow this user?");
                  if (!confirmed) return;
            }

            // Keep a copy of the current follower list for potential revert.
            const previousFollower = data.follower;

            // Calculate the updated follower list.
            const newFollower = isAlreadyFollowing
                  ? previousFollower.filter((id) => id !== user._id.toString())
                  : [...previousFollower, user._id.toString()];

            // Optimistically update the profileData state.
            setProfileData((prevData) =>
                  prevData.map((profile) =>
                        profile._id === data._id ? { ...profile, follower: newFollower } : profile
                  )
            );

            try {
                  const endpoint = isAlreadyFollowing
                        ? `follow/${data._id}/unfollow`
                        : `follow/${data._id}`;
                  const res = await handlePostApi(endpoint, {});

                  // If the API call fails, revert the state.
                  if (!(res?.statusCode === 200 || res?.statusCode === 201)) {
                        setProfileData((prevData) =>
                              prevData.map((profile) =>
                                    profile._id === data._id ? { ...profile, follower: previousFollower } : profile
                              )
                        );
                  }
            } catch (error) {
                  console.log("Error toggling follow:", error);
                  // Revert state on error.
                  setProfileData((prevData) =>
                        prevData.map((profile) =>
                              profile._id === data._id ? { ...profile, follower: previousFollower } : profile
                        )
                  );
            }
      };

      return (
            <div>
                  <div
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4"
                  >
                        {profileData.map((data) => (
                              <div
                                    key={data._id}
                                    className="w-full aspect-square p-4 bg-white border rounded-lg hover:shadow-md transition-shadow duration-200 border-gray-200"
                              >
                                    <div className="w-full flex flex-col items-center justify-between space-y-4">
                                          {/* Profile Image */}
                                          <Link
                                                to={`/creators/${data._id}`}
                                                className="flex-shrink-0 w-24 h-24 rounded-full border-2 border-white shadow-sm"
                                          >
                                                <div>
                                                      {data?.image ? (
                                                            data.image?.url === "default.webp" ? (
                                                                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-secondary  uppercase">
                                                                        <span className="text-center text-3xl font-oswald font-light">
                                                                              {data?.firstName && data.firstName[0]}
                                                                        </span>
                                                                  </div>
                                                            ) : (
                                                                  <img
                                                                        src={data.image.url}
                                                                        alt="Author Image"
                                                                        className="w-24 h-24 rounded-full object-cover"
                                                                  />
                                                            )
                                                      ) : (
                                                            <User size={100} className="w-24 h-24 rounded-full object-cover" />
                                                      )}
                                                </div>
                                          </Link>

                                          {/* User Info */}
                                          <div className="flex flex-col items-center justify-center space-y-4">
                                                <Link
                                                      to={`/creators/${data._id}`}
                                                      className="hover:no-underline group">
                                                      <h2 className="text-xl font-oswald font-normal truncate text-gray-900 group-hover:text-primary transition-colors">
                                                            {
                                                                  data?.firstName && (
                                                                        <span className="text-sm font-oswald font-normal text-gray-600">
                                                                              {isArabic
                                                                                    ? ` ${data?.firstName?.ar}`
                                                                                    : ` ${data?.firstName?.en}`}
                                                                        </span>
                                                                  )
                                                            }
                                                            {data?.lastName && (
                                                                  <span className="text-sm font-oswald font-normal text-gray-600">
                                                                        {isArabic
                                                                              ? ` ${data?.lastName?.ar}`
                                                                              : ` ${data?.lastName?.en}`}
                                                                  </span>
                                                            )}
                                                      </h2>
                                                </Link>

                                                <div className="flex items-center gap-3 mt-1">
                                                      <span className="text-xs text-gray-600">
                                                            <span className="font-medium text-gray-900">
                                                                  {data?.following.length}
                                                            </span>{" "}
                                                            Following
                                                      </span>
                                                      <span className="text-xs text-gray-600">
                                                            <span className="font-medium text-gray-900">
                                                                  {data?.follower.length}
                                                            </span>{" "}
                                                            Followers
                                                      </span>
                                                </div>
                                          </div>

                                          {/* Follow/Unfollow Button */}
                                          <button
                                                onClick={() => handleFollowToggle(data)}
                                                className={`w-full ml-2 text-base font-oswald font-normal px-3.5 py-1.5 rounded-lg transition-colors ${data.follower.includes(user?._id)
                                                      ? "border border-btnSecondary text-black"
                                                      : "bg-btnSecondary text-white"
                                                      }`}
                                          >
                                                {data.follower.includes(user?._id) ? "Unfollow" : "Follow"}
                                          </button>
                                    </div>
                              </div>
                        ))}
                  </div>
            </div>
      );
};

export default AllCreators;
