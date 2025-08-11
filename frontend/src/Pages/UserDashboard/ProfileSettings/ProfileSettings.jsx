// src/components/ProfileSetting.jsx
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import handleGetApi from "../../../API/Handler/getApi.handler";
import handleEditApi from "../../../API/Handler/editHandler.Api";
import { getUserProfile } from "../../../../app/slice/useSlice";
import { useLang } from "../../../context/LangContext";
import ImageUploader from "../../../Components/ImageUploader/ImageUploader";
// import getCircularCroppedImg from "../../../Utils/imageCropper";

const initialData = {
      firstName: { en: "", ar: "" },
      lastName: { en: "", ar: "" },
      username: "",
      bio: { en: "", ar: "" },
      dob: "",
      email: "",
      youtubeURL: "",
      instagramURL: "",
      facebookURL: "",
      tiktokURL: "",
      language: "",
      gender: "",
      activityLevel: "",
      height: "",
      weight: "",
};

const ProfileSetting = () => {
      const { isArabic } = useLang();
      const langKey = isArabic ? "ar" : "en";
      const {
            register,
            handleSubmit,
            formState: { errors, isDirty },
            reset,
      } = useForm({ defaultValues: initialData });

      const { user } = useSelector((state) => state.user);
      // const [userData, setUserData] = useState(null);
      const [loading, setLoading] = useState(false);
      const [profileImage, setProfileImage] = useState(null);
      const dispatch = useDispatch();

      // Labels toggled by language
      const labels = {
            firstName: { en: 'First Name', ar: 'الاسم الأول' },
            lastName: { en: 'Last Name', ar: 'اسم العائلة' },
            bio: { en: 'Bio', ar: 'سيرة ذاتية' },
            username: { en: 'Username', ar: 'اسم المستخدم' },
            dob: { en: 'Date of Birth', ar: 'تاريخ الميلاد' },
            email: { en: 'Email', ar: 'البريد الإلكتروني' },
            youtubeURL: { en: 'Add YouTube URL', ar: 'رابط يوتيوب' },
            instagramURL: { en: 'Add Instagram URL', ar: 'رابط انستغرام' },
            facebookURL: { en: 'Add Facebook URL', ar: 'رابط فيسبوك' },
            tiktokURL: { en: 'Add TikTok URL', ar: 'رابط تيك توك' },
            language: { en: 'Select Language', ar: 'اختر اللغة' },
            gender: { en: 'Gender', ar: 'الجنس' },
            activityLevel: { en: 'Activity Level', ar: 'مستوى النشاط' },
            height: { en: 'Height (CM)', ar: 'الطول (سم)' },
            weight: { en: 'Weight (KG)', ar: 'الوزن (كجم)' },
      };

      useEffect(() => {
            async function fetchUserData() {
                  const res = await handleGetApi(`user/profile/${user?._id}`);
                  reset(res.data);
                  setProfileImage(res.data?.image);
                  // setUserData(res.data);
            }
            if (user?._id) fetchUserData();
      }, [reset, user?._id]);







      useEffect(() => {
            const handleBeforeUnload = (e) => {
                  if (isDirty) {
                        e.preventDefault();
                        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
                        return e.returnValue;
                  }
            };
            window.addEventListener("beforeunload", handleBeforeUnload);
            return () => window.removeEventListener("beforeunload", handleBeforeUnload);
      }, [isDirty,]);

      const onSubmit = async (data) => {
            setLoading(true);
            const formData = new FormData();

            formData.append("profilePicture", profileImage);

            // localized fields
            formData.append(`firstName.${langKey}`, data.firstName[langKey] || "");
            formData.append(`lastName.${langKey}`, data.lastName[langKey] || "");
            formData.append(`bio.${langKey}`, data.bio[langKey] || "");
            // flat fields
            [
                  "username",
                  "dob",
                  "email",
                  "youtubeURL",
                  "instagramURL",
                  "facebookURL",
                  "tiktokURL",
                  "language",
                  "gender",
                  "activityLevel",
                  "height",
                  "weight",
            ].forEach((key) => {
                  formData.append(key, data[key] ?? "");
            });

            try {
                  await handleEditApi(`user/update`, formData);
                  toast.success("Profile updated successfully!");
                  reset(data);
                  dispatch(getUserProfile());
            } catch (error) {
                  console.error(error);
                  toast.error("Failed to update profile. Please try again later.");
            } finally {
                  setLoading(false);
            }
      };

      // const isSaveEnabled = isDirty;

      return (
            <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto space-y-4" dir={isArabic ? "rtl" : "ltr"}>


                  {/* Profile Image */}
                  <div className="flex flex-col lg:flex-row shadow rounded-xl">
                        <div className="px-10 py-7 border-r flex flex-col items-center">
                              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
                                    <ImageUploader
                                          onImageUpload={(image) => setProfileImage(image)}
                                          initialImage={profileImage}
                                          onDelete={(image) => console.log("Image deleted", image)}
                                    />
                              </div>
                        </div>

                        <div className="p-8 lg:p-10 w-full">
                              {/* Name */}
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                          <input
                                                {...register(`firstName.${langKey}`, { required: `${labels.firstName[langKey]} is required` })}
                                                placeholder={labels.firstName[langKey]}
                                                className="border p-2 rounded w-full"
                                                dir={isArabic ? "rtl" : "ltr"}
                                          />
                                          {errors.firstName?.[langKey] && (
                                                <p className="text-red-500 text-xs mt-1">
                                                      {errors.firstName[langKey].message}
                                                </p>
                                          )}
                                    </div>
                                    <div>
                                          <input
                                                {...register(`lastName.${langKey}`, { required: `${labels.lastName[langKey]} is required` })}
                                                placeholder={labels.lastName[langKey]}
                                                className="border p-2 rounded w-full"
                                                dir={isArabic ? "rtl" : "ltr"}
                                          />
                                          {errors.lastName?.[langKey] && (
                                                <p className="text-red-500 text-xs mt-1">
                                                      {errors.lastName[langKey].message}
                                                </p>
                                          )}
                                    </div>
                              </div>

                              {/* Username & Bio */}
                              <div className="mb-4">
                                    <input
                                          {...register("username")}
                                          placeholder={labels.username[langKey]}
                                          className="border p-2 rounded w-full mb-4"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    />
                                    {/* No required error for username */}

                                    <textarea
                                          {...register(`bio.${langKey}`)}
                                          placeholder={labels.bio[langKey]}
                                          className="border p-2 rounded w-full"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    />
                                    {/* No required error for bio */}
                              </div>

                              {/* DOB & Email */}
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                          <input
                                                type="date"
                                                {...register("dob", { required: `${labels.dob[langKey]} is required` })}
                                                className="border p-2 rounded w-full"
                                                dir={isArabic ? "rtl" : "ltr"}
                                          />
                                          {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
                                    </div>
                                    <div>
                                          <input
                                                type="email"
                                                {...register("email", { required: `${labels.email[langKey]} is required` })}
                                                placeholder={labels.email[langKey]}
                                                className="border p-2 rounded w-full"
                                                dir={isArabic ? "rtl" : "ltr"}
                                          />
                                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                    </div>
                              </div>

                              {/* Social Links */}
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                    {['youtubeURL', 'instagramURL', 'facebookURL', 'tiktokURL'].map((key) => (
                                          <input
                                                key={key}
                                                {...register(key)}
                                                placeholder={labels[key][langKey]}
                                                className="border p-2 rounded w-full"
                                                dir={isArabic ? "rtl" : "ltr"}
                                          />
                                    ))}
                              </div>
                        </div>
                  </div>

                  {/* Preferences Card */}
                  <div className="shadow rounded-xl p-4 lg:p-10" dir={isArabic ? "rtl" : "ltr"}>
                        <div className="mb-4">
                              <select
                                    {...register("language", { required: `${labels.language[langKey]} is required` })}
                                    className="border p-2 rounded w-full"
                                    dir={isArabic ? "rtl" : "ltr"}
                              >
                                    <option value="">{labels.language[langKey]}</option>
                                    <option value="english">English</option>
                                    <option value="arabic">العربية</option>
                                    <option value="spanish">Spanish</option>
                              </select>
                              {errors.language && <p className="text-red-500 text-xs mt-1">{errors.language.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                              {[
                                    { name: "gender", options: ["male", "female"] },
                                    { name: "activityLevel", options: ["sedentary", "light", "moderate", "active", "very active"] }
                              ].map(({ name, options }) => (
                                    <div key={name}>
                                          <select
                                                {...register(name)}
                                                className="border p-2 rounded w-full"
                                                dir={isArabic ? "rtl" : "ltr"}
                                                defaultValue=""
                                          >
                                                <option value="" disabled>{labels[name][langKey]}</option>
                                                {options.map(opt => (
                                                      <option key={opt} value={opt}>
                                                            {isArabic ? opt : opt}
                                                      </option>
                                                ))}
                                          </select>
                                    </div>
                              ))}
                              <div>
                                    <input
                                          type="number"
                                          {...register("height", { required: `${labels.height[langKey]} is required` })}
                                          placeholder={labels.height[langKey]}
                                          className="border p-2 rounded w-full"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    />
                                    {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height.message}</p>}
                              </div>
                              <div>
                                    <input
                                          type="number"
                                          {...register("weight", { required: `${labels.weight[langKey]} is required` })}
                                          placeholder={labels.weight[langKey]}
                                          className="border p-2 rounded w-full"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    />
                                    {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
                              </div>
                        </div>
                  </div>

                  <button
                        type="submit"
                        disabled={loading}
                        className={`w-full rounded-md p-2 flex justify-center ${loading ? "bg-primary text-white" : "bg-gray-400 text-gray-200"}`}
                        dir={isArabic ? "rtl" : "ltr"}
                  >
                        {loading ? (
                              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z" />
                              </svg>
                        ) : null}
                        {loading ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : (isArabic ? 'حفظ التغييرات' : 'Save Changes')}
                  </button>
            </form>
      );
};

export default ProfileSetting;