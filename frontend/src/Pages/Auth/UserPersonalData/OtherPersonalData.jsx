import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import handlePostApi from '../../../API/Handler/postApi.handler'
import { getUserProfile } from '../../../../app/slice/useSlice'

const OtherPersonalData = ({ fadeVariants,setModalType }) => {
      const {
            register,
            handleSubmit,
            formState: { errors },
      } = useForm()
      const dispatch = useDispatch();

      const handleAgeGenderForm = async (data) => {
            const res = await handlePostApi('user/user-other-data', data)

            if (res?.statusCode === 200) {
                  dispatch(getUserProfile());
                  setModalType('showCaseUserPersonalData');
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
                  className="p-10 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto"
            >
                  <h1 className="text-2xl font-semibold text-center text-primary mb-6">
                        Calories Needs Calculation
                  </h1>
                  <form onSubmit={handleSubmit(handleAgeGenderForm)} className="space-y-6">
                        <div>
                              <label
                                    className="text-gray-600 mb-2"
                                    htmlFor="height">
                                    Height (CM)
                              </label>
                              <input
                                    placeholder="height (CM)"
                                    {...register("height", { required: "Height is required" })}
                                    className="focus:outline-primary border p-2 rounded w-full"
                                    type="number"
                              />
                        </div>
                        <div>
                              <label
                                    className="text-gray-600 mb-2"
                                    htmlFor="weight">
                                    Weight (KG)
                              </label>
                              <input
                                    placeholder="weight (KG)"
                                    {...register("weight", { required: "Weight is required" })}
                                    className="focus:outline-primary border p-2 rounded w-full"
                                    type="number"
                              />
                        </div>
                        <div>
                              <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                                    Activity Level
                              </label>
                              <select
                                    id="activityLevel"
                                    {...register("activityLevel", { required: "Activity Level is required" })}
                                    defaultValue=""
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
                              >
                                    <option value="" disabled>
                                          Select Activity Level
                                    </option>
                                    {["sedentary", "light", "moderate", "active", "very active"].map((opt) => (
                                          <option key={opt} value={opt}>
                                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                          </option>
                                    ))}
                              </select>
                              {errors.activityLevel && (
                                    <p className="mt-1 text-xs text-red-500">{errors.activityLevel.message}</p>
                              )}
                        </div>

                        <div>
                              <button
                                    type="submit"
                                    className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors duration-200"
                              >
                                    Next
                              </button>
                        </div>
                  </form>
            </motion.div>
      )
}

OtherPersonalData.propTypes = {
      fadeVariants: PropTypes.object.isRequired,
      setModalType: PropTypes.func.isRequired,
}

export default OtherPersonalData
