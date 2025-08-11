import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import handleApi from "../../api/handler/apiHanlder";

const IngredientForm = ({ id }) => {
      const {
            register,
            handleSubmit,
            setValue,
            formState: { errors, isSubmitting },
      } = useForm();

      const [imagePreview, setImagePreview] = useState(null);
      const isEditing = !!id; // Check if we are in edit mode

      useEffect(() => {
            if (isEditing) {
                  const getCategory = async () => {
                        try {
                              const { data } = await handleApi(
                                    `ingredient/${id}`,
                                    "GET"
                              );
                              if (data) {
                                    const { name, image } = data;
                                    setValue("name", name?.en);
                                    if (image) setImagePreview(image.url);
                              }
                        } catch (error) {
                              toast.error(error || "An error occurred");
                        }
                  };
                  getCategory();
            }
      }, [id, setValue, isEditing]);

      const handleImageChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                  const imageUrl = URL.createObjectURL(file);
                  setImagePreview(imageUrl);
            } else {
                  setImagePreview(null);
            }
      };

      const submitHandler = async (data) => {
            const formData = new FormData();
            formData.append("name", data.name);
            if (data.image[0]) {
                  formData.append("image", data.image[0]);
            }

            try {
                  let res;
                  if (isEditing) {
                        res = await handleApi(
                              `ingredient/${id}`,
                              "PUT",
                              formData
                        ); // Update existing Category
                        console.log(res);
                        if (res.statusCode === 200)
                              toast.success("Ingredient updated successfully");
                  } else {
                        res = await handleApi(
                              "ingredient/create",
                              "POST",
                              formData
                        ); // Create new Category
                        if (res.statusCode === 201)
                              toast.success("Ingredient created successfully");
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
            <div>
                  <form onSubmit={handleSubmit(submitHandler)}>
                        <div className="panel-body p-4">
                              <div className="row">
                                    <div className="col-xl-8">
                                          {/* Name */}
                                          <div className="row mb-3">
                                                <label
                                                      htmlFor="name"
                                                      className="col-form-label col-lg-3"
                                                >
                                                      Name{" "}
                                                      <span
                                                            style={{
                                                                  color: "red",
                                                            }}
                                                      >
                                                            *
                                                      </span>
                                                </label>
                                                <div className="col-lg-9">
                                                      <input
                                                            type="text"
                                                            id="name"
                                                            className="form-control"
                                                            placeholder="Name"
                                                            {...register(
                                                                  "name",
                                                                  {
                                                                        required: "Name is required",
                                                                  }
                                                            )}
                                                            disabled
                                                      />
                                                      {errors.name && (
                                                            <p
                                                                  style={{
                                                                        color: "red",
                                                                  }}
                                                            >
                                                                  {
                                                                        errors
                                                                              .name
                                                                              .message
                                                                  }
                                                            </p>
                                                      )}
                                                </div>
                                          </div>

                                          {/* Image */}
                                          <div className="row mb-3">
                                                <label
                                                      htmlFor="image"
                                                      className="col-form-label col-lg-3"
                                                >
                                                      Image
                                                </label>
                                                <div className="col-lg-9">
                                                      <input
                                                            type="file"
                                                            id="image"
                                                            className="form-control"
                                                            accept="image/*"
                                                            {...register(
                                                                  "image"
                                                            )}
                                                            onChange={
                                                                  handleImageChange
                                                            }
                                                      />
                                                      {imagePreview && (
                                                            <div className="mt-2">
                                                                  <img
                                                                        src={
                                                                              imagePreview
                                                                        }
                                                                        alt="Preview"
                                                                        className="img-preview"
                                                                  />
                                                            </div>
                                                      )}
                                                </div>
                                          </div>

                                          {/* Submit Button */}
                                          <div className="row mb-3">
                                                <div className="col-lg-9 offset-lg-3">
                                                      <button
                                                            disabled={
                                                                  isSubmitting
                                                            }
                                                            type="submit"
                                                            className="btn btn-primary"
                                                      >
                                                            {isSubmitting
                                                                  ? isEditing
                                                                        ? "Updating..."
                                                                        : "Creating..."
                                                                  : isEditing
                                                                    ? "Update"
                                                                    : "Create"}
                                                      </button>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </form>
            </div>
      );
};

export default IngredientForm;
