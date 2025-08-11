// src/components/RecipeForm.jsx
import { useForm, useFieldArray } from "react-hook-form";
import handleGetApi from "../../API/Handler/getApi.handler";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import handlePostApi from "../../API/Handler/postApi.handler";
import { useNavigate, useParams } from "react-router-dom";
import handleEditApi from "../../API/Handler/editHandler.Api";
import { useLang } from "../../context/LangContext";
import detectLanguage from "../../Utils/langDetector";
import Ingredients from "./Ingredients";
import { useEffect } from "react";
import { AVAILABLE_UNITS, translations, unitMapAr, unitMapEn } from "../../Utils/unitParams";
import LoadingOverlay from "../../Components/LoadingOverlay/LoadingOverlay";
import Cropper from 'react-easy-crop';
import ImageUploader from "../../Components/ImageUploader/ImageUploader";
import Instructions from "./Instructions";

function normalizeUnit(raw = "", lang = "en") {
      console.log(lang)
      const key = raw.trim().toLowerCase();
      const map = lang === "ar" ? unitMapAr : unitMapEn;
      if (map[key]) return map[key];
      const singular = key.endsWith("s") ? key.slice(0, -1) : key;
      return map[singular] || raw;
}

const RecipeForm = () => {
      const navigate = useNavigate();
      const { id } = useParams();
      const { isArabic } = useLang();
      const currentLang = isArabic ? "ar" : "en";

      const {
            register,
            control,
            handleSubmit,
            watch,
            formState: { errors, isSubmitting },
            reset,
            setValue,
            setError
      } = useForm({
            defaultValues: {
                  title: "",
                  description: "",
                  ingredients: [{ name: "", quantity: "", unit: "" }],
                  instructions: [{ step: "", image: null }],
                  time: "",
                  videoUrl: "",
                  servings: 1,
                  category: [],
                  cuisine: [],
            }
      });

      const {
            fields: ingredientFields,
            append: addIngredient,
            remove: removeIngredient,
      } = useFieldArray({ control, name: "ingredients" });

      const {
            fields: instructionFields,
            append: addInstruction,
            remove: removeInstruction,
      } = useFieldArray({ control, name: "instructions" });

      const [otherImages, setOtherImages] = useState([]);
      const [toDeleteImages, setToDeleteImages] = useState([]);
      const [thumbnailImageLoading, setThumbnailImageLoading] = useState(false);
      const [instructionImageLoading, setInstructionImageLoading] = useState({});
      const [additionalImageLoading, setAdditionalImageLoading] = useState({
            0: false,
            1: false,
            2: false,
            3: false,
            4: false
      });
      const fileInputRefs = useRef([]);
      const [thumbnail, setThumbnail] = useState(null);
      const watchedInstructions = watch("instructions");

      // Crop modal state
      const [cropModal, setCropModal] = useState({
            open: false,
            image: null,
            location: null,
            locationIndex: null,
            actionType: null,
            crop: { x: 0, y: 0 },
            zoom: 1,
            croppedAreaPixels: null,
      });

      // Open crop modal with image
      const openCropModal = (file, location, actionType, locationIndex = null) => {
            const imageUrl = URL.createObjectURL(file);
            setCropModal({
                  open: true,
                  image: imageUrl,
                  location,
                  locationIndex,
                  actionType,
                  crop: { x: 0, y: 0 },
                  zoom: 1,
                  croppedAreaPixels: null
            });
      };

      // Handle crop completion
      const onCropComplete = (croppedArea, croppedAreaPixels) => {
            setCropModal(prev => ({
                  ...prev,
                  croppedAreaPixels  // This was previously set to croppedArea
            }));
      };

      // Confirm crop and process image
      const handleCropConfirm = async () => {
            try {
                  // Pass croppedAreaPixels to the cropper function
                  const croppedImageFile = await getCroppedImg(
                        cropModal.image,
                        cropModal.croppedAreaPixels
                  );

                  // Call existing image handler with cropped image
                  handleImageChange(
                        cropModal.location,
                        croppedImageFile,
                        cropModal.actionType,
                        cropModal.locationIndex
                  );

                  // Close modal
                  setCropModal({
                        ...cropModal,
                        open: false,
                        image: null
                  });
            } catch (error) {
                  toast.error(
                        isArabic ? "فشل معالجة الصورة" : "Failed to process image"
                  );
                  console.error("Image processing error:", error);
            }
      };

      // Prevent scroll when loading
      useEffect(() => {
            if (
                  isSubmitting ||
                  thumbnailImageLoading ||
                  Object.values(instructionImageLoading).some(Boolean) ||
                  Object.values(additionalImageLoading).some(Boolean) ||
                  cropModal.open
            ) {
                  document.body.style.overflow = "hidden";
            } else {
                  document.body.style.overflow = "auto";
            }

            return () => {
                  document.body.style.overflow = "auto";
            };
      }, [isSubmitting, thumbnailImageLoading, instructionImageLoading, additionalImageLoading, cropModal.open]);

      useEffect(() => {
            if (!id) return;
            (async () => {
                  try {
                        const { data } = await handleGetApi(`recipe/${id}`);
                        console.log(data);
                        const fv = {
                              title: data.title[currentLang] || "",
                              description: data.description[currentLang] || "",

                              ingredients: (data.ingredients || []).map(ing => ({
                                    quantity: ing.amount ?? "",
                                    unit: normalizeUnit(ing.unit?.[currentLang] ?? ing.unit ?? "", currentLang),
                                    name: ing.nameClean?.[currentLang]
                                          ?? ing.ingrText?.[currentLang]
                                          ?? ""
                              })),
                              instructions: (data.instructions || []).map(inst => ({
                                    step: inst.step[currentLang] || "",
                                    image: inst.image || { url: "", key: "" }
                              })),
                              time: data.time || "",
                              servings: data.servings || 1,
                              videoUrl: data.videoUrl || "",
                              category: data.category || [],
                              cuisine: data.cuisine || [],
                        };
                        console.log("Loaded recipe data:", fv);
                        reset(fv);
                        if (data.thumbnail) {
                              setThumbnail(data?.thumbnail);
                        }

                        if (data.otherImages && Array.isArray(data.otherImages)) {
                              setOtherImages(data.otherImages);
                        }

                        console.log("instructions:", data.instructions);

                  } catch (error) {
                        console.error("Error while loading recipe:", error);
                        toast.error(isArabic ? "فشل تحميل الوصفة" : "Failed to load recipe");
                  }
            })();
      }, [id, reset, isArabic, currentLang]);


      const handleImageChange = async (location, file, action_type, location_index) => {
            // For remove actions, skip validation
            if (action_type !== "remove") {
                  if (!file?.type.startsWith("image/")) {
                        return toast.error(
                              isArabic
                                    ? "الرجاء رفع ملف صورة صالح"
                                    : "Please upload a valid image file"
                        );
                  }

                  if (file?.size > 2 * 1024 * 1024) {
                        toast.error("Image must be smaller than 2MB");
                        return;
                  }
            }

            if (location === "instruction") {
                  setInstructionImageLoading(prev => ({
                        ...prev,
                        [location_index]: true
                  }));
            } else if (location === "thumbnail") {
                  setThumbnailImageLoading(true);
            } else if (location === "otherImages") {
                  setAdditionalImageLoading(prev => ({
                        ...prev,
                        [location_index]: true
                  }));
            }

            console.log("Image change:", location, file, action_type);
            if (action_type === "upload") {

                  const imgFile = new FormData()
                  imgFile.append("image", file);

                  try {
                        const { data } = await handlePostApi(`image/upload`, imgFile);
                        console.log("Image uploaded:", data);
                        switch (location) {
                              case "thumbnail":
                                    setThumbnail(data);
                                    setThumbnailImageLoading(false);
                                    break;

                              case "otherImages":
                                    setOtherImages(prev => {
                                          const updated = [...prev];
                                          updated[location_index] = data;
                                          return updated;
                                    });
                                    setAdditionalImageLoading(prev => ({
                                          ...prev,
                                          [location_index]: false
                                    }));
                                    break;
                              case "instruction":
                                    setValue(`instructions.${location_index}.image`, data);
                                    setInstructionImageLoading(prev => ({
                                          ...prev,
                                          [location_index]: false
                                    }));
                                    break;
                              default:
                                    break;
                        }
                  } catch (error) {
                        toast.error(
                              isArabic ? "فشل رفع الصورة" : "Failed to upload image"
                        );
                        setInstructionImageLoading(prev => ({
                              ...prev,
                              [location_index]: false
                        }));
                        setThumbnailImageLoading(false);
                        setAdditionalImageLoading(prev => ({
                              ...prev,
                              [location_index]: false
                        }));
                        console.error("Image upload error:", error);
                        return;
                  }
            } else if (action_type === "replace") {
                  // For replace action - don't remove first, just upload the new image
                  const imgFile = new FormData();
                  imgFile.append("image", file);

                  try {
                        const { data } = await handlePostApi(`image/upload`, imgFile);
                        switch (location) {
                              case "thumbnail":
                                    // Add old thumbnail to delete list
                                    if (thumbnail?.key) {
                                          setToDeleteImages(prev => [...prev, thumbnail.key]);
                                    }
                                    setThumbnail(data);
                                    setThumbnailImageLoading(false);
                                    break;

                              case "otherImages":
                                    // Add old image to delete list
                                    if (otherImages[location_index]?.key) {
                                          setToDeleteImages(prev => [...prev, otherImages[location_index].key]);
                                    }
                                    setOtherImages(prev => {
                                          const updated = [...prev];
                                          updated[location_index] = data;
                                          return updated;
                                    });
                                    setAdditionalImageLoading(prev => ({
                                          ...prev,
                                          [location_index]: false
                                    }));
                                    break;

                              case "instruction":
                                    // Add old image to delete list
                                    if (watchedInstructions[location_index]?.image?.key) {
                                          setToDeleteImages(prev => [
                                                ...prev,
                                                watchedInstructions[location_index].image.key
                                          ]);
                                    }
                                    setValue(`instructions.${location_index}.image`, data);
                                    setInstructionImageLoading(prev => ({
                                          ...prev,
                                          [location_index]: false
                                    }));
                                    break;

                              default:
                                    break;
                        }
                  } catch (error) {
                        console.log(error)
                        toast.error(
                              isArabic ? "فشل رفع الصورة" : "Failed to upload image"
                        );
                  }

            } else {
                  // replace action type
                  handleImageChange(location, file, "remove", location_index);
                  handleImageChange(location, file, "upload", location_index);
            }
      };

      console.log("imaged to delete", toDeleteImages);

      const handleAddStep = () => {
            addInstruction({ step: "", image: { url: "", key: "" } });
      };

      const handleRemoveStep = idx => {
            removeInstruction(idx);
            setToDeleteImages(prev => ([...prev, watchedInstructions[idx]?.image?.key]));
      };

      const validateLanguages = data => {
            if (detectLanguage(data.title) !== currentLang) {
                  setError("title", { type: "manual", message: isArabic ? "استخدم العربية فقط" : "Use only English" });
                  toast.error(isArabic ? "استخدم العربية فقط في العنوان" : "Please use only English in title");
                  return false;
            }
            if (detectLanguage(data.description) !== currentLang) {
                  setError("description", { type: "manual", message: isArabic ? "استخدم العربية فقط" : "Use only English" });
                  toast.error(isArabic ? "استخدم العربية فقط في الوصف" : "Please use only English in description");
                  return false;
            }
            for (let i = 0; i < data.ingredients.length; i++) {
                  const { name } = data.ingredients[i];

                  if (detectLanguage(name) !== currentLang) {
                        setError(
                              `ingredients.${i}.name`,
                              {
                                    type: "manual",
                                    message: isArabic
                                          ? `استخدم ${currentLang === "ar" ? "العربية" : "الإنجليزية"} فقط في المكون ${i + 1}`
                                          : `Use only ${currentLang === "ar" ? "Arabic" : "English"} in ingredient #${i + 1}`
                              }
                        );

                        toast.error(
                              isArabic
                                    ? `استخدم ${currentLang === "ar" ? "العربية" : "الإنجليزية"} فقط في المكون ${i + 1}`
                                    : `Use only ${currentLang === "ar" ? "Arabic" : "English"} in ingredient #${i + 1}`
                        );

                        return false;
                  }
            }

            for (let i = 0; i < data.instructions.length; i++) {
                  if (detectLanguage(data.instructions[i].step) !== currentLang) {
                        setError(`instructions.${i}.step`, { type: "manual", message: isArabic ? "استخدم العربية فقط" : "Use only English" });
                        toast.error(isArabic ? `استخدم العربية فقط في الخطوة ${i + 1}` : `Use only English in step #${i + 1}`);
                        return false;
                  }
            }
            return true;
      };

      const handleRecipeSubmission = async data => {
            console.log("Submitting recipe data:", data);
            if (!validateLanguages(data)) return;
            const formData = new FormData();
            const defErr = isArabic ? "حدث خطأ ما" : "Something went wrong";

            console.log("Submitting recipe data:", data);

            const formattedIngredients = data.ingredients.map(item => {
                  const code = normalizeUnit(item.unit, currentLang);
                  const entry = AVAILABLE_UNITS.find(u => u.value === code);
                  const label = entry
                        ? entry.label[currentLang]
                        : item.unit;

                  return `${item.quantity} ${label} ${item.name}`.trim();
            });

            try {
                  formData.append("title", data.title);
                  formData.append("description", data.description);
                  formData.append("ingredients", JSON.stringify(formattedIngredients));
                  formData.append("instructions", JSON.stringify(data.instructions));
                  formData.append("time", data.time);
                  formData.append("servings", data.servings);
                  formData.append("videoUrl", data.videoUrl || "");
                  formData.append("lang", currentLang);
                  formData.append("thumbnail", JSON.stringify(thumbnail));
                  formData.append("otherImages", JSON.stringify(otherImages));
                  formData.append("toDeleteImages", JSON.stringify(toDeleteImages));
                  formData.append("language", currentLang);

                  for (const [key, value] of formData.entries()) {
                        console.log(`Form data - ${key}:`, value);
                  }

                  const endpoint = id ? `recipe/edit/${id}` : "recipe/custom";
                  const res = await (id ? handleEditApi : handlePostApi)(endpoint, formData);

                  if ([200, 201].includes(res.statusCode)) {
                        toast.success(isArabic ? "تم حفظ الوصفة بنجاح" : "Recipe saved successfully");
                        navigate(id ? `/recipe/${id}` : "/user/profile");
                        reset();
                  }

            } catch (err) {
                  console.log(err);
                  const msg = err.response?.data?.errMessage;
                  if (msg) {
                        const ingM = msg.match(/ingredient.*?index (\\d+)/i);
                        if (ingM) {
                              const i = +ingM[1];
                              setError(`ingredients.${i}`, { type: "manual", message: msg });
                              return toast.error(msg);
                        }
                        const stepM = msg.match(/instruction step.*?index (\\d+)/i);
                        if (stepM) {
                              const i = +stepM[1];
                              setError(`instructions.${i}.step`, { type: "manual", message: msg });
                              return toast.error(msg);
                        }
                        if (/description/i.test(msg)) {
                              setError("description", { type: "manual", message: msg });
                              return toast.error(msg);
                        }
                        return toast.error(msg);
                  }
                  toast.error(defErr);
            }
      };

      const dir = isArabic ? "rtl" : "ltr";
      const align = isArabic ? "text-right" : "text-left";

      return (
            <div className={`relative max-w-3xl mx-auto p-4 ${dir} ${align}`}>
                  {/* Crop Modal */}
                  {cropModal.open && (
                        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
                              <div className="bg-white rounded-lg w-full max-w-md p-4">
                                    <h2 className="text-xl font-bold mb-4">
                                          {isArabic ? "قص الصورة" : "Crop Image"}
                                    </h2>

                                    <div className="relative h-64 w-full">
                                          <Cropper
                                                image={cropModal.image}
                                                crop={cropModal.crop}
                                                zoom={cropModal.zoom}
                                                aspect={4 / 3}  // Add aspect ratio constraint
                                                onCropChange={(crop) => setCropModal(prev => ({ ...prev, crop }))}
                                                onCropComplete={onCropComplete}
                                                onZoomChange={(zoom) => setCropModal(prev => ({ ...prev, zoom }))}
                                          />
                                    </div>

                                    <div className="mt-4">
                                          <label className="block mb-2">
                                                {isArabic ? "تكبير" : "Zoom"}:
                                          </label>
                                          <input
                                                type="range"
                                                value={cropModal.zoom}
                                                min={1}
                                                max={3}
                                                step={0.1}
                                                className="w-full"
                                                onChange={(e) => setCropModal(prev => ({
                                                      ...prev,
                                                      zoom: parseFloat(e.target.value)
                                                }))}
                                          />
                                    </div>

                                    <div className="flex justify-end space-x-2 mt-4">
                                          <button
                                                onClick={() => setCropModal(prev => ({ ...prev, open: false }))}
                                                className="px-4 py-2 border rounded"
                                          >
                                                {isArabic ? "إلغاء" : "Cancel"}
                                          </button>
                                          <button
                                                onClick={handleCropConfirm}
                                                className="px-4 py-2 bg-green-500 text-white rounded"
                                          >
                                                {isArabic ? "تأكيد" : "Confirm"}
                                          </button>
                                    </div>
                              </div>
                        </div>
                  )}

                  {/* Loading Overlay */}
                  {(isSubmitting || thumbnailImageLoading ||
                        Object.values(instructionImageLoading).some(Boolean) ||
                        Object.values(additionalImageLoading).some(Boolean)) &&
                        <LoadingOverlay />
                  }

                  <div className="flex flex-col items-center mb-6">
                        <h2 className="text-2xl font-bold">
                              {id
                                    ? isArabic ? "تعديل الوصفة" : "Edit Recipe"
                                    : isArabic ? "إنشاء وصفة جديدة" : "Create New Recipe"}
                        </h2>
                        <p className="text-xs text-gray-500">
                              {isArabic
                                    ? "يرجى ملء النموذج باللغة العربية وعدم استخدام لغة مختلطة"
                                    : "Please fill the form in English without mixing languages."}
                        </p>
                  </div>

                  <form onSubmit={handleSubmit(handleRecipeSubmission)} className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                              <label className="block font-medium">{translations.title[currentLang]}</label>
                              <input
                                    {...register("title", { required: translations.required[currentLang] })}
                                    placeholder={translations.title[currentLang]}
                                    className="w-full p-2 border rounded"
                                    dir={dir}
                              />
                              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                              <label className="block font-medium">{translations.description[currentLang]}</label>
                              <textarea
                                    {...register("description", { required: translations.required[currentLang] })}
                                    placeholder={translations.description[currentLang]}
                                    className="w-full p-2 border rounded h-32"
                                    dir={dir}
                              />
                              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>

                        {/* Ingredients */}
                        <Ingredients
                              ingredientFields={ingredientFields}
                              addIngredient={() => addIngredient({ name: "", quantity: "", unit: "" })}
                              removeIngredient={removeIngredient}
                              register={register}
                              translations={translations}
                              currentLang={currentLang}
                              dir={dir}
                              units={AVAILABLE_UNITS}
                        />

                        {/* Instructions */}
                        <Instructions
                              instructionFields={instructionFields}
                              handleAddStep={handleAddStep}
                              handleRemoveStep={handleRemoveStep}
                              watchedInstructions={watchedInstructions}
                              register={register}
                              errors={errors}
                              translations={translations}
                              currentLang={currentLang}
                              isArabic={isArabic}
                              dir={dir}
                              setValue={setValue}
                              // UploadCloud={UploadCloud}
                              imageLoading={instructionImageLoading}
                              openCropModal={openCropModal} // Add this prop
                        />

                        <div className="grid grid-cols-2 gap-4">
                              <div>
                                    <label className="block font-medium">{translations.prepTime[currentLang]}</label>
                                    <input
                                          {...register("time", { required: translations.required[currentLang] })}
                                          placeholder={isArabic ? "مثال: ٤٥ دقيقة" : "e.g. 45 minutes"}
                                          className="w-full p-2 border rounded"
                                          dir={dir}
                                    />
                                    {errors.time && <p className="text-red-500 text-sm">{errors.time.message}</p>}
                              </div>

                              <div>
                                    <label className="block font-medium">{translations.servings[currentLang]}</label>
                                    <input
                                          {...register("servings", {
                                                required: translations.required[currentLang],
                                                valueAsNumber: true
                                          })}
                                          type="number"
                                          min="1"
                                          inputMode="numeric"
                                          lang="en" // 👈 Forces Latin numerals
                                          placeholder={translations.servings[currentLang]}
                                          className="w-full p-2 border rounded"
                                          dir={dir}
                                          onInput={(e) => {
                                                // Prevent Arabic numerals manually
                                                e.target.value = e.target.value.replace(/[\u0660-\u0669]/g, (d) =>
                                                      String.fromCharCode(d.charCodeAt(0) - 0x0660 + 48)
                                                );
                                          }}
                                    />
                                    {errors.servings && <p className="text-red-500 text-sm">{errors.servings.message}</p>}
                              </div>

                        </div>

                        {/* Media Uploads */}
                        <div className="space-y-4">
                              <div>
                                    <ImageUploader
                                          initialImage={thumbnail}
                                          onImageUpload={(image) => setThumbnail(image)}
                                          onDelete={(img) => {
                                                setThumbnail(null);
                                                setToDeleteImages(prev => [...prev, img?.key]);
                                          }}
                                    />
                              </div>

                              {/* Other Images */}
                              <div>
                                    <label className="block font-medium mb-2">
                                          {translations.otherImages[currentLang]}
                                    </label>

                                    <div className="grid grid-cols-5 gap-4">
                                          {Array.from({ length: 5 }).map((_, i) => {
                                                const image = otherImages[i];
                                                return (
                                                      <div key={i} className="relative">
                                                            <ImageUploader
                                                                  initialImage={image}
                                                                  onImageUpload={(img) => {
                                                                        const newImages = [...otherImages];
                                                                        newImages[i] = img;
                                                                        setOtherImages(newImages);
                                                                  }}
                                                                  onDelete={(img) => {
                                                                        const newImages = [...otherImages];
                                                                        newImages[i] = null;
                                                                        setOtherImages(newImages);
                                                                        setToDeleteImages(prev => [...prev, img?.key]);
                                                                  }}
                                                            />
                                                      </div>
                                                )
                                          })}
                                    </div>
                              </div>
                        </div>

                        {/* Video URL */}
                        <div className="space-y-2">
                              <label className="block font-medium">Video Url</label>
                              <input
                                    {...register("videoUrl")}
                                    placeholder={isArabic ? "مثال: https://www.youtube.com/watch?v=..." : "e.g. https://www.youtube.com/watch?v=..."}
                                    className="w-full p-2 border rounded"
                                    dir={dir}
                              />
                        </div>

                        {/* Submit */}
                        <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 disabled:bg-gray-400"
                        >
                              {isSubmitting
                                    ? translations.saveRecipe[currentLang]
                                    : id
                                          ? translations.updateRecipe[currentLang]
                                          : translations.createRecipe[currentLang]}
                        </button>
                  </form>
            </div>
      );
};

export default RecipeForm;