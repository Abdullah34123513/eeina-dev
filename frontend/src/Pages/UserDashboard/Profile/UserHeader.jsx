import { BadgeCheck, Check, Plus, Settings, Share, User } from 'lucide-react';
import PropTypes from 'prop-types';
import ShareProfileModal from '../../../Components/URLShareModal/URLShareModal';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import handlePostApi from '../../../API/Handler/postApi.handler';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import handleGetApi from '../../../API/Handler/getApi.handler';
import { useLang } from '../../../context/LangContext';

const UserHeader = ({ profile }) => {
      const [loading, setLoading] = useState(false);
      const { user, isAuthenticated } = useSelector((state) => state.user);
      const navigate = useNavigate();
      const { isArabic } = useLang();

      const {
            register: registerRecipe,
            handleSubmit: handleSubmitRecipe,
            formState: { errors: errorsRecipe },
            reset,
      } = useForm();

      const [isOpen, setIsOpen] = useState(false);
      const [localProfile, setLocalProfile] = useState(profile);
      const [celebrate, setCelebrate] = useState(false);
      const [userRecipes, setUserRecipes] = useState([]);

      // Update local profile if the prop changes
      useEffect(() => {
            setLocalProfile(profile);
      }, [profile]);

      const {
            _id,
            firstName,
            lastName,
            username,
            follower = [],
            following,
            image: profilePicture,
            isEmailVerified,
      } = localProfile || {};
      console.log('Local Profile:', localProfile);

      useEffect(() => {
            async function getRecipesOfUser() {
                  const res = await handleGetApi(`user/recipes/${_id}`);
                  if (res?.statusCode === 200 || res?.statusCode === 201) {
                        setUserRecipes(res.data);
                  }
            }
            if (_id) getRecipesOfUser();
      }, [_id]);

      // Recipe Import Function
      const onSubmitRecipe = async (data) => {
            try {
                  setLoading(true);
                  const res = await handlePostApi('recipe/import', data);
                  if (res?.statusCode === 201) {
                        toast.success(res?.message);
                        reset();
                        setLoading(false);
                        window.location.reload();
                  }
            } catch (error) {
                  setLoading(false);
                  console.log(error);
                  toast.error(error?.response?.data?.message || error?.message || 'Something went wrong');
            }
      };

      const handleFollowToggle = async () => {
            if (!isAuthenticated) return;

            // Check if the logged-in user is already following the recipe author
            const isAlreadyFollowing = follower?.includes(user?._id.toString());

            if (isAlreadyFollowing) {
                  // Show confirmation popup
                  const confirmed = window.confirm('Are you sure you want to unfollow this user?');
                  if (!confirmed) return;

                  // Unfollow user
                  const res = await handlePostApi(`follow/${_id}/unfollow`, {});
                  if (res?.statusCode === 200 || res?.statusCode === 201) {
                        // Remove the user's ID from the local follower list
                        setLocalProfile((prev) => ({
                              ...prev,
                              follower: prev.follower?.filter((id) => id !== user._id.toString()),
                        }));
                  }
            } else {
                  // Follow user
                  const res = await handlePostApi(`follow/${_id}`, {});
                  if (res?.statusCode === 200 || res?.statusCode === 201) {
                        // Update the local follower list immediately
                        setLocalProfile((prev) => ({
                              ...prev,
                              follower: prev?.follower ? [...prev.follower, user._id.toString()] : [user._id.toString()],
                        }));
                        // Trigger celebration animation
                        setCelebrate(true);
                        setTimeout(() => setCelebrate(false), 2000);
                  }
            }
            console.log('Response data:', isAlreadyFollowing ? 'Unfollowed' : 'Followed');
      };


      const capitalize = (str) => {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
      };


      return (
            <>
                  <div className="w-[95%] h-[60vh] md:h-[40vh] mx-auto my-10 flex flex-col md:flex-row justify-start items-center md:justify-center space-y-5 md:space-x-12 p-6 lg:p-10 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl">
                        <div>
                              {profilePicture?.url ? (
                                    profilePicture?.url === 'default.webp' ? (
                                          <div className="w-36 h-36 rounded-full bg-primary flex items-center justify-center text-secondary text-2xl font-bold uppercase">
                                                <span className="text-center text-7xl font-oswald font-light">
                                                      {
                                                            isArabic
                                                                  ? `${firstName?.ar?.charAt(0).toUpperCase()}${lastName?.ar?.charAt(0).toUpperCase()}`.replace(/ /g, '')
                                                                  : `${firstName?.en?.charAt(0).toUpperCase()}${lastName?.en?.charAt(0).toUpperCase()}`.replace(/ /g, '')
                                                      }
                                                </span>
                                          </div>
                                    ) : (
                                          <img src={profilePicture?.url} alt="Author Image" className="w-36 h-36 rounded-full object-cover" />
                                    )
                              ) : (
                                    <User size={100} className="w-36 h-36 rounded-full object-cover" />
                              )}
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                              <div className="flex flex-col items-center md:items-start space-y-4">
                                    <div>
                                          <h1 className="text-3xl font-oswald font-light flex items-center space-x-2">
                                                <span>
                                                      {isArabic
                                                            ? `${capitalize(firstName?.ar)} ${capitalize(lastName?.ar)}`
                                                            : `${capitalize(firstName?.en)} ${capitalize(lastName?.en)}`}
                                                </span>

                                                <span>
                                                      {isEmailVerified ? (
                                                            <BadgeCheck className='text-primary' />
                                                      ) : (
                                                            <span className="text-red-500">!</span>
                                                      )}
                                                </span>
                                          </h1>
                                          <p>{username}</p>
                                    </div>
                                    <div className="flex items-center space-x-8">
                                          <div className="flex flex-col items-center justify-center gap-2">
                                                <span className="text-lg font-oswald font-medium">
                                                      {
                                                            isArabic ? "المشاركات" : "Posts"
                                                      }
                                                </span>
                                                <span>{userRecipes?.length || 0}</span>
                                          </div>
                                          <div className="flex flex-col items-center justify-center gap-2">
                                                <span className="text-lg font-oswald font-medium">
                                                      {
                                                            isArabic ? "المتابعين" : "Followers"
                                                      }
                                                </span>
                                                <span>{follower?.length}</span>
                                          </div>
                                          <div className="flex flex-col items-center justify-center gap-2">
                                                <span className="text-lg font-oswald font-medium">
                                                      {isArabic ? "المتابعة" : "Following"}
                                                </span>
                                                <span>{following?.length}</span>
                                          </div>
                                    </div>
                              </div>
                              {user?._id === localProfile?._id ? (
                                    <div className="flex items-center space-x-12 font-semibold">
                                          <Share size={24} className="cursor-pointer" onClick={() => setIsOpen(true)} />
                                          <Settings
                                                onClick={() => {
                                                      navigate(`/user/${user?._id}/settings`)
                                                }}
                                                size={24} className="cursor-pointer" />
                                    </div>
                              ) : (
                                    <div>
                                          {isAuthenticated && (
                                                <motion.button
                                                      whileTap={{ scale: celebrate ? 1.4 : 1 }}
                                                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                      className="flex items-center gap-2 text-primary hover:text-white hover:bg-primary duration-300 border rounded-md px-2 py-1 me-5"
                                                      onClick={handleFollowToggle}
                                                >
                                                      {follower?.includes(user?._id.toString()) ? (
                                                            <>
                                                                  <Check size={16} />
                                                                  {
                                                                        isArabic ? "متابعة" : "Following"
                                                                  }
                                                            </>
                                                      ) : (
                                                            <>
                                                                  <Plus size={16} />
                                                                  {
                                                                        isArabic ? "متابعة" : "Follow"
                                                                  }
                                                            </>
                                                      )}
                                                </motion.button>
                                          )}
                                    </div>
                              )}
                        </div>
                  </div>
                  {user?._id === localProfile?._id && (
                        <div className="w-[95%] mx-auto my-10 flex flex-col md:flex-row justify-start items-center md:justify-center space-y-5 md:space-x-12 p-6 lg:p-10 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl">
                              <div className="w-full flex flex-col lg:flex-row items-center justify-between space-x-4 space-y-10  lg:space-y-0">
                                    <Link to="/recipe/create" className="w-full flex items-center justify-center bg-gray-200 text-primary rounded-xl"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    >
                                          <Plus size={50} className="rounded-full object-cover" />
                                          <span>
                                                {isArabic ? "إنشاء وصفة جديدة" : "Create New Recipe"}
                                          </span>
                                    </Link>
                                    <div className="w-full flex items-center justify-between">
                                          <form className="w-full flex items-center" onSubmit={handleSubmitRecipe(onSubmitRecipe)}>
                                                <input
                                                      type="url"
                                                      placeholder={isArabic ? "رابط الوصفة" : "Recipe URL"}
                                                      autoComplete="off"
                                                      className="w-[60%] lg:w-[80%] border border-gray-300 p-3 rounded-s-lg focus:outline-none focus:border-primary placeholder:text-primary"
                                                      {...registerRecipe('recipeUrl', { required: true })}
                                                />
                                                {errorsRecipe.recipeUrl && (
                                                      <span className="text-red-500">
                                                            {isArabic ? "هذا الحقل مطلوب" : "This field is required"}
                                                      </span>
                                                )}
                                                <button type="submit" className="w-[40%] lg:w-[20%] bg-btnSecondary text-white p-3 rounded-e-lg">
                                                      {
                                                            loading ? (
                                                                  <div className="flex justify-center items-center">
                                                                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                                                                  </div>
                                                            ) : (
                                                                  isArabic ? "استيراد الوصفة" : "Import Recipe"
                                                            )
                                                      }
                                                </button>
                                          </form>
                                    </div>
                              </div>
                        </div>
                  )}
                  <ShareProfileModal isOpen={isOpen} setIsOpen={setIsOpen} />
            </>
      );
};

UserHeader.propTypes = {
      profile: PropTypes.object.isRequired,
};

export default UserHeader;
