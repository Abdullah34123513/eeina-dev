import { PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom"
import handlePostApi from "../../API/Handler/postApi.handler";
import toast from "react-hot-toast";
import { useLang } from "../../context/LangContext";
import { useState } from "react";

const RightSideNav = () => {
      const {
            register: registerRecipe,
            handleSubmit: handleSubmitRecipe,
            formState: { errors: errorsRecipe },
            reset,
      } = useForm();
      const { isArabic } = useLang();
      const [loading, setLoading] = useState(false);


      // Recipe Import Function
      const onSubmitRecipe = async (data) => {
            try {
                  setLoading(true);
                  const res = await handlePostApi('recipe/import', data);
                  if (res?.statusCode === 201) {
                        toast.success(res?.message);
                        reset();
                        setLoading(false);
                  }
            } catch (error) {
                  console.log(error);
                  toast.error('Something went wrong');
            }
      };

      return (
            <div
                  className="space-y-6"
            >
                  <div
                        className="shadow-[0_0_10px_rgba(0,0,0,0.1)]  rounded-xl bg-white"
                  >
                        <Link
                              to="/recipe/create"
                              className="p-14"
                        >
                              <PlusCircle
                                    className="text-primary mx-auto"
                                    size={60} />
                              <p
                                    className="text-center text-lg "
                                    dir={isArabic ? "rtl" : "ltr"}
                              >
                                    {
                                          isArabic ? "إضافة وصفة جديدة" : "Add New Recipe"
                                    }
                              </p>
                        </Link>
                  </div>

                  <div
                        className="shadow-[0_0_10px_rgba(0,0,0,0.1)]  rounded-xl bg-white py-10 px-2"
                  >
                        <div className="w-full flex items-center justify-between">
                              <form className="w-full space-y-5 flex flex-col items-center justify-center " onSubmit={handleSubmitRecipe(onSubmitRecipe)}>
                                    <input
                                          type="url"
                                          dir={isArabic ? "rtl" : "ltr"}
                                          placeholder={isArabic ? "أدخل رابط الوصفة" : "Enter Recipe URL"}
                                          autoComplete="off"
                                          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-primary placeholder:text-primary"
                                          {...registerRecipe('recipeUrl', { required: true })}
                                    />

                                    {errorsRecipe.recipeUrl && (
                                          <span
                                                className="text-red-500"
                                                dir={isArabic ? "rtl" : "ltr"}
                                          >
                                                {
                                                      isArabic ? "هذا الحقل مطلوب" : "This field is required"
                                                }
                                          </span>
                                    )}
                                    <button
                                          type="submit"
                                          className=" bg-btnSecondary text-white p-3 rounded-lg"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    >
                                          {
                                                loading ? (
                                                      <div className="flex justify-center items-center">
                                                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                                                      </div>) :
                                                      isArabic ? "استيراد وصفة" : "Import Recipe"
                                          }
                                    </button>
                              </form>
                        </div>
                  </div>
            </div>
      )
}

export default RightSideNav