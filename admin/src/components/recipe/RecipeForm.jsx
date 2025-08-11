import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import handleApi from "../../api/handler/apiHanlder";


const formatIngredients = (ingredients) => {
      return ingredients.map(ing => (
            `${ing.quantity} ${ing.unit} ${ing.name}`
      ));
};


const RecipeForm = ({ id }) => {
      const {
            register,
            handleSubmit,
            setValue,
            control,
            reset,
            watch,
            formState: { errors, isSubmitting },
      } = useForm({
            defaultValues: {
                  title: "",
                  description: "",
                  ingredients: [{ name: "", quantity: "", unit: "" }],
                  instructions: [{ step: "", image: { url: "", key: "" } }],
                  servings: "",
                  time: "",
                  cuisine: "",
                  category: "",
                  healthLabels: "",
                  dietLabels: "",
                  thumbnail: "",
                  videoUrl: "",
            },
      });

      const [thumbnail, setThumbnail] = useState(null);

      const [otherImages, setOtherImages] = useState([]);
      const [toDeleteImages, setToDeleteImages] = useState([]);

      console.log("toDeleteImages:", toDeleteImages);


      const fileRefInput = useRef(null);
      const otherImagesRefInput = useRef([]);

      // Field arrays for dynamic ingredients and instructions
      const {
            fields: ingredientFields,
            append: appendIngredient,
            remove: removeIngredient,
      } = useFieldArray({
            control,
            name: "ingredients",
      });

      const {
            append: appendInstruction,
            remove: removeInstruction,
      } = useFieldArray({
            control,
            name: "instructions",
      });

      const watchedInstructions = watch("instructions");

      console.log("Watched Instructions:", watchedInstructions);

      const isEditing = !!id;

      // If editing, fetch recipe data and populate the form
      useEffect(() => {
            if (!isEditing) return;

            const fetchRecipe = async () => {
                  try {
                        const { data } = await handleApi(`recipe/${id}`, "GET");
                        if (!data) return;

                        console.log(data.ingredients);

                        const formattedData = {
                              ...data,
                              title: data.title.en,
                              description: data.description.en,
                              ingredients: (data.ingredients || []).map(ing => ({
                                    quantity: ing?.amount ?? "",
                                    unit: (ing?.unit?.["en"]),
                                    name: ing?.nameClean?.["en"]
                                          ?? ing?.ingrText?.["en"]
                                          ?? ""
                              })),
                              instructions: data.instructions.map((ins) => {
                                    return {
                                          step: ins.step.en,
                                          image: ins.image || { url: "", key: "" },
                                    };
                              }),
                              healthLabels: data.healthLabels.map((i) => i.en).join(", "),
                              dietLabels: data.dietLabels.map((i) => i.en).join(", "),
                              cuisine: data.cuisine.map((i) => i.en).join(", "),
                              category: data.category.map((i) => i.en).join(", "),
                        };

                        reset(formattedData);
                        setThumbnail(data?.thumbnail)
                        setOtherImages(data?.otherImages || []);
                  } catch (error) {
                        toast.error("Error fetching recipe data");
                  }
            };

            fetchRecipe();
      }, [id, isEditing, setValue, appendIngredient, appendInstruction]);


      const handleImageChange = async (location, file, action_type, location_index) => {
            console.log("Image change:", location, file, action_type);
            if (action_type === "upload") {
                  if (!file?.type.startsWith("image/")) {
                        return toast.error("Please upload a valid image file");
                  }

                  if (file?.size > 2 * 1024 * 1024) {
                        return toast.error("Image must be smaller than 2MB");
                  }

                  const imgFile = new FormData()
                  imgFile.append("image", file);


                  try {

                        const { data } = await handleApi(`image/upload`, "POST", imgFile);
                        console.log("Image uploaded:", data);
                        switch (location) {
                              case "thumbnail":
                                    setThumbnail(data);
                                    break;

                              case "otherImages":
                                    setOtherImages(prev => {
                                          const updated = [...prev];
                                          updated[location_index] = data;
                                          return updated;
                                    });

                                    break;
                              case "instruction":
                                    setValue(`instructions.${location_index}.image`, data);
                                    break;
                              default:
                                    break;



                        }
                  } catch (error) {
                        toast.error(
                              "Failed to upload image"
                        );
                        console.error("Image upload error:", error);
                        return;
                  }
            } else if (action_type === "remove") {
                  switch (location) {
                        case "thumbnail":
                              setToDeleteImages((prev) => {
                                    const newToDelete = [...prev];
                                    if (thumbnail?.key) {
                                          newToDelete.push(thumbnail.key);
                                    }
                                    return newToDelete;
                              });
                              setThumbnail(null);
                              break;

                        case "otherImages":
                              setToDeleteImages(prev => {
                                    const newToDelete = [...prev];
                                    newToDelete.push(otherImages[location_index]?.key);
                                    return newToDelete;
                              });
                              setOtherImages(prev => prev.filter((_, i) => i !== location_index));
                              break;

                        case "instruction":
                              setToDeleteImages(prev => {
                                    const newToDelete = [...prev];
                                    newToDelete.push(watchedInstructions[location_index]?.image?.key);
                                    return newToDelete;
                              });
                              // state update itself is asynchronous.
                              // so we use setTimeout to ensure the state is updated before the next action
                              setTimeout(() => {
                                    setValue(`instructions.${location_index}.image`, { url: "", key: "" });
                              }, 0);

                              break;

                        default:
                              break;
                  }

            } else {
                  // replace action type
                  handleImageChange(location, file, "remove", location_index);
                  handleImageChange(location, file, "upload", location_index);
            }


      };



      const handleRemoveInstruction = (index) => {
            removeInstruction(index);
            handleImageChange("instruction", null, "remove", index);
      };





      const onSubmit = async (data) => {
            const formattedIngredients = formatIngredients(data.ingredients);
            console.log("Formatted Ingredients:", formattedIngredients);
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("ingredients", JSON.stringify(formattedIngredients));
            formData.append("instructions", JSON.stringify(data.instructions));
            formData.append("time", data.time);
            formData.append("servings", data.servings);
            formData.append("videoUrl", data.videoUrl || "");
            formData.append("thumbnail", JSON.stringify(thumbnail));
            formData.append("otherImages", JSON.stringify(otherImages));
            formData.append("toDeleteImages", JSON.stringify(toDeleteImages));

            try {
                  let res;
                  if (isEditing) {
                        res = await handleApi(`recipe/edit/${id}`, "PUT", formData);
                        if (res.statusCode === 200) {
                              toast.success("Recipe updated successfully");
                        }
                        if (res.statusCode === 201) {
                              toast.success("Recipe created successfully");
                        }
                  } else {
                        res = await handleApi("recipe/create", "POST", formData);
                        if (res.statusCode === 201) {
                              toast.success("Recipe created successfully");
                        }
                  }
            } catch (error) {
                  toast.error("Error submitting recipe");
                  toast.error(error.message || error.response?.data?.message);
            }
      };

      return (
            <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="panel-body p-4">
                        {/* Thumbnail */}
                        <div className="row mb-3">
                              <label className="col-form-label col-lg-3">
                                    Thumbnail <span style={{ color: "red" }}>*</span>
                              </label>
                              <div className="col-lg-9">
                                    <div
                                          className="upload-box"
                                          onClick={() => fileRefInput.current.click()}
                                    >
                                          <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange("thumbnail", e.target.files[0], "upload")}
                                                hidden
                                                ref={fileRefInput}
                                          />
                                          {thumbnail ? (
                                                <img
                                                      src={thumbnail?.url}
                                                      alt="Preview"
                                                      className="img-preview"
                                                />
                                          ) : (
                                                <div className="upload-placeholder">
                                                      Click to upload
                                                </div>
                                          )}
                                    </div>
                              </div>
                        </div>
                        {/* Title */}
                        <div className="row mb-3">
                              <label htmlFor="title" className="col-form-label col-lg-3">
                                    Title <span style={{ color: "red" }}>*</span>
                              </label>
                              <div className="col-lg-9">
                                    <input
                                          type="text"
                                          id="title"
                                          className="form-control"
                                          placeholder="Recipe Title"
                                          {...register("title", {
                                                required: "Title is required",
                                          })}
                                    />
                                    {errors.title && (
                                          <p style={{ color: "red" }}>{errors.title.message}</p>
                                    )}
                              </div>
                        </div>
                        {/* Description */}
                        <div className="row mb-3">
                              <label htmlFor="description" className="col-form-label col-lg-3">
                                    Description
                              </label>
                              <div className="col-lg-9">
                                    <textarea
                                          id="description"
                                          rows={6}
                                          className="form-control"
                                          placeholder="Recipe Description"
                                          {...register("description")}
                                    />
                              </div>
                        </div>
                        {/* Ingredients */}
                        <div className="row mb-3">
                              <label className="col-form-label col-lg-3">Ingredients</label>
                              <div className="col-lg-9">
                                    {ingredientFields.map((item, index) => (
                                          <div key={item.id} className="row mb-2 g-2">
                                                {/* Quantity */}
                                                <div className="col-md-2">
                                                      <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Qty"
                                                            {...register(`ingredients.${index}.quantity`)}
                                                      />
                                                </div>

                                                {/* Unit */}
                                                <div className="col-md-3">
                                                      <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Unit"
                                                            {...register(`ingredients.${index}.unit`)}
                                                      />
                                                </div>

                                                {/* Name */}
                                                <div className="col-md-6">
                                                      <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Name"
                                                            {...register(`ingredients.${index}.name`)}
                                                      />
                                                </div>

                                                {/* Remove Button */}
                                                <div className="col-md-1">
                                                      <button
                                                            type="button"
                                                            className="btn btn-danger"
                                                            onClick={() => removeIngredient(index)}
                                                      >
                                                            X
                                                      </button>
                                                </div>
                                          </div>
                                    ))}
                                    <button
                                          type="button"
                                          className="btn btn-secondary mt-2"
                                          onClick={() => appendIngredient({
                                                quantity: "",
                                                unit: "",
                                                name: ""
                                          })}
                                    >
                                          Add Ingredient
                                    </button>
                              </div>
                        </div>
                        {/* Instructions */}
                        <div className="row mb-3">
                              <label className="col-form-label col-lg-3">Instructions</label>
                              <div className="col-lg-9">
                                    {watchedInstructions.map((item, index) => (
                                          <div
                                                key={item.id}
                                                className="row mb-3 align-items-center"
                                          >
                                                {" "}
                                                <div className="col-lg-7">
                                                      {" "}
                                                      {/* Slightly narrower for text */}
                                                      <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={`Step ${index + 1} Instruction`} // More specific placeholder
                                                            {...register(
                                                                  `instructions.${index}.step`,
                                                                  {
                                                                        required: "Instruction is required",
                                                                  }
                                                            )}
                                                      />
                                                      {/* You might want to display validation errors here */}
                                                </div>
                                                {/* Image Upload & Preview Area */}
                                                <div className="col-lg-4">
                                                      {" "}
                                                      {/* Wider for image controls */}
                                                      <div className="d-flex align-items-center instruction-image-upload">
                                                            {" "}
                                                            {/* Flex container */}
                                                            {/* Hidden File Input */}
                                                            <input
                                                                  type="file"
                                                                  accept="image/*"
                                                                  id={`instruction-image-${index}`} // Unique ID for the label
                                                                  style={{ display: "none" }} // Hide the default input
                                                                  onChange={(e) =>
                                                                        handleImageChange(
                                                                              "instruction",
                                                                              e.target.files[0],
                                                                              "upload",
                                                                              index
                                                                        )
                                                                  }
                                                            // Consider how to register this with react-hook-form if you need the File object itself,
                                                            // or how to clear its value programmatically if needed.
                                                            // {...register(`instructions.${index}.imageFile`)} // Example if registering
                                                            />
                                                            {/* Conditional Rendering: Show Upload Button OR Preview */}
                                                            {!item.image || item.image?.url === "" ? (
                                                                  // Custom Upload Button (using label)
                                                                  <label
                                                                        htmlFor={`instruction-image-${index}`}
                                                                        className="btn btn-outline-secondary btn-sm me-2"
                                                                        title="Add Image"
                                                                  >
                                                                        {/* Optional: Add an icon */}
                                                                        {/* <Image size={16} />  */}
                                                                        <span>Add Image</span>
                                                                  </label>
                                                            ) : (
                                                                  // Image Preview with Remove Button
                                                                  <div className="image-preview-container position-relative me-2">
                                                                        <img
                                                                              src={item?.image?.url}
                                                                              alt={`Preview Step ${index + 1}`}
                                                                              className="img-thumbnail instruction-preview-img" // Use img-thumbnail for border
                                                                        />
                                                                        <button
                                                                              type="button"
                                                                              className="btn btn-danger btn-sm position-absolute top-0 end-0 remove-preview-btn"
                                                                              title="Remove Image"
                                                                              onClick={() =>
                                                                                    handleImageChange(
                                                                                          "instruction",
                                                                                          null,
                                                                                          "remove",
                                                                                          index
                                                                                    )
                                                                              }
                                                                        // Style this button better with CSS
                                                                        >
                                                                              {/* Use a smaller 'X' or an icon */}
                                                                              &times;
                                                                              {/* <XCircleFill size={12} /> */}
                                                                        </button>
                                                                  </div>
                                                            )}
                                                            {/* Optional: Display the selected filename (requires state) */}
                                                            {/* <span className="text-muted small">{selectedFileName[index] || ''}</span> */}
                                                      </div>
                                                </div>
                                                {/* Remove Instruction Button */}
                                                <div className="col-lg-1">
                                                      <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm" // Make remove button small
                                                            title="Remove this step"
                                                            onClick={() =>
                                                                  handleRemoveInstruction(index)
                                                            }
                                                      >
                                                            X
                                                      </button>
                                                </div>
                                          </div>
                                    ))}

                                    {/* Add Instruction Button */}
                                    <button
                                          type="button"
                                          className="btn btn-secondary mt-2" // Add margin top
                                          onClick={() => appendInstruction({ step: "" })} // Pass default value if needed
                                    >
                                          Add Instruction
                                    </button>
                              </div>
                        </div>
                        {/* Servings */}
                        <div className="row mb-3">
                              <label htmlFor="servings" className="col-form-label col-lg-3">
                                    Servings
                              </label>
                              <div className="col-lg-9">
                                    <input
                                          type="number"
                                          id="servings"
                                          className="form-control"
                                          placeholder="Servings"
                                          {...register("servings", {
                                                required: "Servings is required",
                                          })}
                                    />
                                    {errors.servings && (
                                          <p style={{ color: "red" }}>{errors.servings.message}</p>
                                    )}
                              </div>
                        </div>
                        {/* Time */}
                        <div className="row mb-3">
                              <label htmlFor="time" className="col-form-label col-lg-3">
                                    Time (mins)
                              </label>
                              <div className="col-lg-9">
                                    <input
                                          type="number"
                                          id="time"
                                          className="form-control"
                                          placeholder="Time in minutes"
                                          {...register("time", {
                                                required: "Time is required",
                                          })}
                                    />
                                    {errors.time && (
                                          <p style={{ color: "red" }}>{errors.time.message}</p>
                                    )}
                              </div>
                        </div>
                        {/* Cuisine */}
                        <div className="row mb-3">
                              <label htmlFor="cuisine" className="col-form-label col-lg-3">
                                    Cuisine (comma separated)
                              </label>
                              <div className="col-lg-9">
                                    <input
                                          type="text"
                                          id="cuisine"
                                          className="form-control"
                                          placeholder="e.g., Italian, Chinese"
                                          {...register("cuisine")}
                                    />
                              </div>
                        </div>
                        {/* Category */}
                        <div className="row mb-3">
                              <label htmlFor="category" className="col-form-label col-lg-3">
                                    Category (comma separated)
                              </label>
                              <div className="col-lg-9">
                                    <input
                                          type="text"
                                          id="category"
                                          className="form-control"
                                          placeholder="e.g., Lunch, Dinner"
                                          {...register("category")}
                                    />
                              </div>
                        </div>
                        {/* Health Labels */}
                        <div className="row mb-3">
                              <label htmlFor="healthLabels" className="col-form-label col-lg-3">
                                    Health Labels (comma separated)
                              </label>
                              <div className="col-lg-9">
                                    <input
                                          type="text"
                                          id="healthLabels"
                                          className="form-control"
                                          placeholder="e.g., Gluten Free, Dairy Free"
                                          {...register("healthLabels")}
                                    />
                              </div>
                        </div>
                        {/* Diet Labels */}
                        <div className="row mb-3">
                              <label htmlFor="dietLabels" className="col-form-label col-lg-3">
                                    Diet Labels (comma separated)
                              </label>
                              <div className="col-lg-9">
                                    <input
                                          type="text"
                                          id="dietLabels"
                                          className="form-control"
                                          placeholder="e.g., Vegan, Keto"
                                          {...register("dietLabels")}
                                    />
                              </div>
                        </div>
                        {/* Other Images */}
                        <div className="row mb-3">
                              <label className="col-form-label col-lg-3">Other Images</label>
                              <div className="col-lg-9">
                                    <div className="multi-upload-box">
                                          <div className="d-flex gap-2 flex-wrap">
                                                {Array.from({ length: 5 }).map((_, i) =>
                                                      otherImages[i] ? (
                                                            <div key={i} className="position-relative border p-2 rounded shadow-sm">
                                                                  <img
                                                                        src={otherImages[i].url}
                                                                        alt={`Other Image ${i + 1}`}
                                                                        className="img-fluid rounded"
                                                                        style={{
                                                                              width: "120px",
                                                                              height: "120px",
                                                                              objectFit: "cover"
                                                                        }}
                                                                  />
                                                                  <input
                                                                        id={`otherImageInput-${i}`}
                                                                        type="file"
                                                                        className="d-none"
                                                                        ref={(el) => (otherImagesRefInput.current[i] = el)}
                                                                        onChange={(e) =>
                                                                              handleImageChange("otherImages", e.target.files[0], "replace", i)
                                                                        }
                                                                  />
                                                                  <div className="d-flex justify-content-between mt-2">
                                                                        <button
                                                                              type="button"
                                                                              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                                                                              onClick={() => otherImagesRefInput.current[i]?.click()}
                                                                        >
                                                                              <i className="bi bi-pencil"></i>
                                                                              Replace
                                                                        </button>
                                                                        <button
                                                                              type="button"
                                                                              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                                                              onClick={() => handleImageChange("otherImages", null, "remove", i)}
                                                                        >
                                                                              <i className="bi bi-trash"></i>
                                                                              Remove
                                                                        </button>
                                                                  </div>
                                                            </div>
                                                      ) : (
                                                            <div
                                                                  key={i}
                                                                  className="border border-secondary rounded d-flex align-items-center justify-content-center bg-light shadow-sm"
                                                                  style={{
                                                                        width: "120px",
                                                                        height: "120px",
                                                                        cursor: "pointer",
                                                                        flexDirection: "column",
                                                                        position: "relative"
                                                                  }}
                                                            >
                                                                  <label
                                                                        htmlFor={`otherImageInput-${i}`}
                                                                        className="w-100 h-100 d-flex align-items-center justify-content-center"
                                                                        style={{ cursor: "pointer" }}
                                                                  >
                                                                        <i className="bi bi-cloud-upload" style={{ fontSize: "28px", color: "#6c757d" }}></i>
                                                                  </label>
                                                                  <input
                                                                        id={`otherImageInput-${i}`}
                                                                        type="file"
                                                                        className="d-none"
                                                                        onChange={(e) =>
                                                                              handleImageChange("otherImages", e.target.files[0], "upload", i)
                                                                        }
                                                                  />
                                                            </div>
                                                      )
                                                )}
                                          </div>
                                    </div>
                              </div>
                        </div>


                        {/* Vieo Url */}
                        <div className="row mb-3">
                              <label htmlFor="videoUrl" className="col-form-label col-lg-3">
                                    Video URL
                              </label>
                              <div className="col-lg-9">
                                    <input
                                          type="text"
                                          id="videoUrl"
                                          className="form-control"
                                          placeholder="Video URL"
                                          {...register("videoUrl")}
                                    />
                              </div>
                        </div>
                        {/* Submit Button */}
                        <div className="row">
                              <div className="col-lg-9 offset-lg-3">
                                    <button
                                          type="submit"
                                          disabled={isSubmitting}
                                          className="btn btn-primary"
                                    >
                                          {isSubmitting
                                                ? isEditing
                                                      ? "Updating..."
                                                      : "Creating..."
                                                : isEditing
                                                      ? "Update Recipe"
                                                      : "Create Recipe"}
                                    </button>
                              </div>
                        </div>
                  </div>
            </form>
      );
};

export default RecipeForm;
