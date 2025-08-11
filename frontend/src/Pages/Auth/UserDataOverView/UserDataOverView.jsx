import PropTypes from 'prop-types'
import { motion, useSpring } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { closeModal } from '../../../../app/slice/modalSlice'
import { useLang } from '../../../context/LangContext'

const AnimatedNumber = ({ value, duration = 1000 }) => {
      const spring = useSpring(0, { duration })
      const [display, setDisplay] = useState(0)

      useEffect(() => {
            const unsubscribe = spring.on('change', (latest) => {
                  setDisplay(Math.round(latest))
            })
            // Update the spring value when target value changes
            spring.set(value)
            return unsubscribe
      }, [value, spring])

      return <span>{display}</span>
}

AnimatedNumber.propTypes = {
      value: PropTypes.number.isRequired,
      duration: PropTypes.number,
}

const UserDataOverView = ({ fadeVariants }) => {
      const { user } = useSelector((state) => state.user)
      const navigate = useNavigate()
      const location = useLocation()
      const dispatch = useDispatch()
      const { isArabic } = useLang();

      const from = location.state?.from?.pathname || "/"
      const {
            firstName,
            lastName,
            email,
            dob,
            gender,
            height,
            weight,
            calorieGoal,
            proteinGoal,
            carbGoal,
            fatGoal,
            sugarGoal,
      } = user || {}

      const handleModelClose = () => {
            navigate(from, { replace: true })
            dispatch(closeModal())
      }

      return (
            <motion.div
                  key="userOverview"
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeVariants}
                  transition={{ duration: 0.3 }}
                  className="p-10 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-lg mx-auto space-y-10"
            >
                  {/* Header Section */}
                  <div className="flex flex-col items-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                              {
                                    isArabic ? `${firstName?.ar} ${lastName?.ar}` : `${firstName?.en} ${lastName?.en}`
                              }
                        </h2>
                        <p className="mt-1 text-base text-gray-500">{email}</p>
                  </div>

                  {/* Personal Details */}
                  <div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Personal Details</h3>
                        <div className="grid grid-cols-4 gap-6 text-center">
                              {dob && (
                                    <div className="flex flex-col items-center">
                                          <span className="text-lg font-medium text-gray-700">DOB</span>
                                          <span className="text-base text-gray-500">{dob}</span>
                                    </div>
                              )}
                              {gender && (
                                    <div className="flex flex-col items-center">
                                          <span className="text-lg font-medium text-gray-700">Gender</span>
                                          <span className="text-base text-gray-500">{gender}</span>
                                    </div>
                              )}
                              {height && (
                                    <div className="flex flex-col items-center">
                                          <span className="text-lg font-medium text-gray-700">Height</span>
                                          <span className="text-base text-gray-500">{height} cm</span>
                                    </div>
                              )}
                              {weight && (
                                    <div className="flex flex-col items-center">
                                          <span className="text-lg font-medium text-gray-700">Weight</span>
                                          <span className="text-base text-gray-500">{weight} kg</span>
                                    </div>
                              )}
                        </div>
                  </div>

                  {/* Nutrition Goals */}
                  <div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Nutrition Goals</h3>
                        <div className="grid grid-cols-4 gap-6 text-center">
                              {calorieGoal !== undefined && (
                                    <div className="flex flex-col items-center">
                                          <span className="text-lg font-medium text-gray-700">Calories</span>
                                          <span className="text-base text-gray-500">
                                                <AnimatedNumber value={calorieGoal} duration={1200} />
                                          </span>
                                    </div>
                              )}
                              {proteinGoal !== undefined && (
                                    <div className="flex flex-col items-center">
                                          <span className="text-lg font-medium text-gray-700">Protein</span>
                                          <span className="text-base text-gray-500">
                                                <AnimatedNumber value={proteinGoal} duration={1200} /> g
                                          </span>
                                    </div>
                              )}
                              {carbGoal !== undefined && (
                                    <div className="flex flex-col items-center">
                                          <span className="text-lg font-medium text-gray-700">Carbs</span>
                                          <span className="text-base text-gray-500">
                                                <AnimatedNumber value={carbGoal} duration={1200} /> g
                                          </span>
                                    </div>
                              )}
                              {fatGoal !== undefined && (
                                    <div className="flex flex-col items-center">
                                          <span className="text-lg font-medium text-gray-700">Fats</span>
                                          <span className="text-base text-gray-500">
                                                <AnimatedNumber value={fatGoal} duration={1200} /> g
                                          </span>
                                    </div>
                              )}
                              {sugarGoal !== undefined && (
                                    <div className="flex flex-col items-center">
                                          <span className="text-lg font-medium text-gray-700">Sugars</span>
                                          <span className="text-base text-gray-500">
                                                <AnimatedNumber value={sugarGoal} duration={1200} /> g
                                          </span>
                                    </div>
                              )}
                        </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-center">
                        <button
                              onClick={handleModelClose}
                              className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
                        >
                              Find Recipes
                        </button>
                  </div>
            </motion.div>
      )
}

UserDataOverView.propTypes = {
      fadeVariants: PropTypes.object.isRequired,
}

export default UserDataOverView
