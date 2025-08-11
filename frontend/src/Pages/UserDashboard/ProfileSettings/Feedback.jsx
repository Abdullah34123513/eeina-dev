import { useForm } from "react-hook-form";

const Feedback = () => {
      const {
            register,
            handleSubmit,
            formState: { errors },
      } = useForm();

      const onSubmit = (data) => {
            console.log(data);
      };


      return (
            <div>
                  <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col space-y-4 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl     p-4"
                  >
                        <input
                              type="email"
                              id="email"
                              {...register("email", { required: true })}
                              placeholder="Email"
                              className="border border-gray-300 rounded-md p-2 focus:outline-primary "
                        />
                        {errors.email && (
                              <span className="text-red-500">This field is required</span>
                        )}
                        <textarea
                              id="feedback"
                              placeholder="Feedback"
                              cols="30"
                              rows="10"
                              {...register("feedback", { required: true })}
                              className="border border-gray-300 rounded-md p-2 focus:outline-primary "
                        ></textarea>
                        {errors.feedback && (
                              <span className="text-red-500">This field is required</span>
                        )}
                        <button
                              type="submit"
                              className="bg-primary text-white rounded-md p-2"
                        >
                              Submit
                        </button>
                  </form>
            </div>
      )
}

export default Feedback