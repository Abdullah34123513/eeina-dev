import { Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import ImageUploader from "../../Components/ImageUploader/ImageUploader";

const Instructions = ({
      instructionFields,
      handleAddStep,
      handleRemoveStep,
      register,
      errors,
      translations,
      currentLang,
      isArabic,
      dir = "ltr",
      setValue,
}) => {
      return (
            <div className="space-y-4" dir={dir}>
                  <h3 className="text-xl font-semibold">{translations.instructions[currentLang]}</h3>
                  {instructionFields.map((item, index) => (
                        <div key={item.id} className="space-y-2 border p-4 rounded">
                              <div className="flex justify-between items-center">
                                    <h4 className="font-medium">{isArabic ? `الخطوة ${index + 1}` : `Step ${index + 1}`}</h4>
                                    <button type="button" onClick={() => handleRemoveStep(index)} className="text-red-500 hover:text-red-700">
                                          <Trash2 size={18} />
                                    </button>
                              </div>

                              <div className="flex gap-4">
                                    <div className="w-1/3">
                                          <label className="block text-sm mb-2">{translations.stepImage[currentLang]}</label>
                                          <div className="border-2 border-dashed rounded-lg aspect-square flex items-center justify-center">
                                                <ImageUploader
                                                      initialImage={item?.image}
                                                      onImageUpload={(data) => setValue(`instructions.${index}.image`, data)}
                                                      onDelete={() => setValue(`instructions.${index}.image`, null)}
                                                />
                                          </div>
                                    </div>

                                    <div className="flex-1">
                                          <label className="block text-sm mb-2">{translations.stepDetails[currentLang]}</label>
                                          <textarea
                                                {...register(`instructions.${index}.step`, { required: translations.required[currentLang] })}
                                                placeholder={translations.describeStep[currentLang]}
                                                className="w-full p-2 border rounded h-32"
                                                dir={dir}
                                          />
                                          {errors.instructions?.[index]?.step && (
                                                <p className="text-red-500 text-sm">{errors.instructions[index].step.message}</p>
                                          )}
                                    </div>
                              </div>
                        </div>
                  ))}
                  <button
                        type="button"
                        onClick={handleAddStep}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                        {translations.addStep[currentLang]}
                  </button>
            </div>
      );
};

Instructions.propTypes = {
      instructionFields: PropTypes.array.isRequired,
      handleAddStep: PropTypes.func.isRequired,
      handleRemoveStep: PropTypes.func.isRequired,
      register: PropTypes.func.isRequired,
      errors: PropTypes.object.isRequired,
      translations: PropTypes.object.isRequired,
      currentLang: PropTypes.string.isRequired,
      isArabic: PropTypes.bool.isRequired,
      dir: PropTypes.string,
      setValue: PropTypes.func.isRequired,
      watchedInstructions: PropTypes.array.isRequired
};

export default Instructions;