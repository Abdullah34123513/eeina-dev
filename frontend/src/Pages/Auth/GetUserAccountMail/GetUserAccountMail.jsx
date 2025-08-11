import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import handlePostApi from '../../../API/Handler/postApi.handler';
import { useState } from 'react';



const GetUserAccountMail = ({
      fadeVariants,
      setModalType,
      setEmail
}) => {
      const { register, handleSubmit, formState: { errors }, reset } = useForm()
      const [loading, setLoading] = useState(false);


      const onSubmit = async (data) => {
            setLoading(true);
            try {
                  console.log(data);
                  const res = await handlePostApi("user/otp", data);

                  console.log(res);
                  if (res?.statusCode === 200) {
                        setEmail(data.email);
                        setLoading(false);
                        reset();
                        setModalType('forgetPassword');
                        toast.success("OTP sent successfully");
                  }
            } catch (error) {
                  console.log(error);
                  toast.error("An error occurred while verifying OTP");
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
                  className="p-6 bg-white rounded-lg shadow-lg w-[400px]"
            >
                  <form
                        className="w-full p-4 rounded-xl space-y-8"
                        onSubmit={handleSubmit(onSubmit)}>
                        <div className="relative flex items-center justify-center">
                              <span className="absolute left-0">
                                    <ArrowLeft
                                          disabled={loading}
                                          onClick={() => setModalType('initial')}
                                          className="cursor-pointer"
                                    />
                              </span>
                              <h1 className="text-3xl font-bold text-center text-gray-800">
                                    Enter Your Email
                              </h1>
                        </div>
                        <div className="space-y-6">
                              <div className="relative group">
                                    <label htmlFor="text" className="block text-sm text-gray-600 mb-1">
                                          Email <small>
                                                (We will send an OTP to this email)
                                          </small>
                                    </label>
                                    <input
                                          id="emall"
                                          type="email"
                                          autoComplete="off"
                                          {...register("email", { required: "This field is required" })}
                                          className="w-full border-b border-gray-300 py-2 px-4 focus:outline-none focus:border-transparent"
                                    />
                                    {/* Animated blue border */}
                                    <span
                                          className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-b from-[rgb(50,180,81)] via-[rgb(76,183,72)] to-[rgb(123,193,68)]  transform scale-x-0 origin-center transition-transform duration-300 group-focus-within:scale-x-100"
                                          aria-hidden="true"
                                    ></span>
                                    {errors.email && (
                                          <span className="text-danger text-xs">
                                                {errors.email.message}
                                          </span>
                                    )}
                              </div>
                              <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-to-r from-[rgb(50,180,81)] via-[rgb(76,183,72)] to-[rgb(123,193,68)] 
                                                bg-[200%_auto] transition-all duration-500 bg-right
                                                hover:bg-left text-white px-5 py-2 rounded-md mt-4 lg:mt-0 w-full"
                              >
                                    Submit
                              </button>
                        </div>
                  </form>
            </motion.div>
      )
}


GetUserAccountMail.propTypes = {
      fadeVariants: PropTypes.object.isRequired,
      setModalType: PropTypes.func.isRequired,
      setEmail: PropTypes.func.isRequired,
};

export default GetUserAccountMail;