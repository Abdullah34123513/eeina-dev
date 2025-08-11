import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import handleApi from "../../api/handler/apiHanlder";

const UserRoleForm = ({ id }) => {
      const {
            register,
            handleSubmit,
            setValue,
            formState: { errors, isSubmitting },
      } = useForm();

      const [imagePreview, setImagePreview] = useState(null);

      // Fetch user data to prefill current role if editing
      useEffect(() => {
            const getUser = async () => {
                  try {
                        const { data } = await handleApi(
                              `user/profile/${id}`,
                              "GET"
                        );
                        console.log("email", data.email);
                        if (data) {
                              // Assuming the API returns a user object with a "role" property
                              setValue("role", data.role);
                              setValue("name", data.firstName.en + " " + data.lastName.en);
                              setValue("email", data.email);
                              setImagePreview(data.image?.url);
                        }
                  } catch (error) {
                        toast.error(
                              error?.response?.data?.message ||
                                    "An error occurred"
                        );
                  }
            };
            getUser();
      }, [id, setValue]);

      const submitHandler = async (data) => {
            try {
                  const res = await handleApi(`user/admin/edit/${id}`, "PUT", {
                        role: data.role,
                  });
                  if (res.statusCode === 200) {
                        toast.success("User role updated successfully");
                  }
            } catch (error) {
                  toast.error(
                        error?.response?.data?.message ||
                              error?.message ||
                              "An error occurred"
                  );
            }
      };

      return (
            <form onSubmit={handleSubmit(submitHandler)}>
                  {/* Image Preview */}
                  <div className="row">
                        <div className="col-xl-8">
                              <div className="row mb-3">
                                    <div className="col-lg-9 offset-lg-3">
                                          {imagePreview && (
                                                <img
                                                      src={imagePreview}
                                                      alt="User"
                                                      className="img-fluid rounded-2"
                                                      style={{
                                                            width: "150px",
                                                      }}
                                                />
                                          )}
                                    </div>
                              </div>
                              {/*Name */}
                              <div className="row mb-3">
                                    <label
                                          htmlFor="name"
                                          className="col-form-label col-lg-3"
                                    >
                                          Name
                                    </label>
                                    <div className="col-lg-9">
                                          <input
                                                id="name"
                                                type="text"
                                                className="form-control"
                                                {...register("name")}
                                                disabled
                                          />
                                    </div>
                              </div>

                              {/* Email */}
                              <div className="row mb-3">
                                    <label
                                          htmlFor="email"
                                          className="col-form-label col-lg-3"
                                    >
                                          Email
                                    </label>
                                    <div className="col-lg-9">
                                          <input
                                                id="email"
                                                type="text"
                                                className="form-control"
                                                {...register("email")}
                                                disabled
                                          />
                                    </div>
                              </div>

                              {/* Role */}
                              <div className="row mb-3">
                                    <label
                                          htmlFor="role"
                                          className="col-form-label col-lg-3"
                                    >
                                          Role{" "}
                                          <span
                                                style={{
                                                      color: "red",
                                                }}
                                          >
                                                *
                                          </span>
                                    </label>
                                    <div className="col-lg-9">
                                          <select
                                                id="role"
                                                className="form-control"
                                                {...register("role", {
                                                      required: "Role is required",
                                                })}
                                          >
                                                <option value="user">
                                                      User
                                                </option>
                                                <option value="admin">
                                                      Admin
                                                </option>
                                                <option value="super-admin">
                                                      Super Admin
                                                </option>
                                                {/* Add other roles if needed */}
                                          </select>
                                          {errors.role && (
                                                <p
                                                      style={{
                                                            color: "red",
                                                      }}
                                                >
                                                      {errors.role.message}
                                                </p>
                                          )}
                                    </div>
                              </div>

                              {/* Submit Button */}
                              <div className="row mb-3">
                                    <div className="col-lg-9 offset-lg-3">
                                          <button
                                                disabled={isSubmitting}
                                                type="submit"
                                                className="btn btn-primary"
                                          >
                                                {isSubmitting
                                                      ? "Updating..."
                                                      : "Update Role"}
                                          </button>
                                    </div>
                              </div>
                        </div>
                  </div>
            </form>
      );
};

export default UserRoleForm;
