import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import handlePostApi from '../../../API/Handler/postApi.handler'

const AgeGender = ({ fadeVariants, setModalType }) => {
      const {
            register,
            handleSubmit,
            formState: { errors },
      } = useForm()

      const handleAgeGenderForm = async (data) => {
            const res = await handlePostApi('user/user-personal-data', data)
            if(res?.statusCode === 200) setModalType('otherPersonalData')
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
                              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                                    Date of Birth
                              </label>
                              <input
                                    id="dob"
                                    type="date"
                                    {...register("dob", { required: "Date of birth is required" })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
                              />
                              {errors.dob && (
                                    <p className="mt-1 text-xs text-red-500">{errors.dob.message}</p>
                              )}
                        </div>

                        <div>
                              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                    Gender
                              </label>
                              <select
                                    id="gender"
                                    {...register("gender", { required: "Gender is required" })}
                                    defaultValue=""
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
                              >
                                    <option value="" disabled>
                                          Select Gender
                                    </option>
                                    {["male", "female"].map((opt) => (
                                          <option key={opt} value={opt}>
                                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                          </option>
                                    ))}
                              </select>
                              {errors.gender && (
                                    <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>
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

AgeGender.propTypes = {
      fadeVariants: PropTypes.object.isRequired,
      setModalType: PropTypes.func.isRequired,
}

export default AgeGender
