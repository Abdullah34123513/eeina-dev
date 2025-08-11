import { useForm } from "react-hook-form";

const ProfileDeletion = () => {
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
                        <textarea
                              id="delete_reason"
                              placeholder="Tell us why you want to leave us?"
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
                              className="bg-danger text-white rounded-md p-2"
                        >
                              Delete
                        </button>
                  </form>
            </div>
      )
}

export default ProfileDeletion