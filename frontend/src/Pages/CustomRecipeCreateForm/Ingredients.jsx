// src/components/Ingredients.jsx
import PropTypes from "prop-types";

const Ingredients = ({
      ingredientFields,
      addIngredient,
      removeIngredient,
      register,
      translations,
      currentLang,
      dir = "ltr",
      units = [],
}) => {
      return (
            <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                        {translations.ingredientName[currentLang]}
                  </h3>

                  {ingredientFields.map((item, index) => (
                        <div
                              key={item.id}
                              className="grid grid-cols-12 gap-2 items-end p-2"
                        >
                              {/* Quantity */}
                              <div className="col-span-2">
                                    <label className="block text-sm font-medium">
                                          {translations.quantity[currentLang]}
                                    </label>
                                    <input
                                          type="number"
                                          step="any"
                                          min="0.1"
                                          inputMode="decimal"
                                          lang="en" // 👈 Forces Latin/English numerals
                                          placeholder={translations.quantity[currentLang]}
                                          {...register(`ingredients.${index}.quantity`, {
                                                required: translations.required[currentLang],
                                                valueAsNumber: true,
                                          })}
                                          className="w-full p-2 border rounded"
                                          dir={dir}
                                          onInput={(e) => {
                                                // Convert Arabic digits to English
                                                e.target.value = e.target.value.replace(/[\u0660-\u0669]/g, (d) =>
                                                      String.fromCharCode(d.charCodeAt(0) - 0x0660 + 48)
                                                );
                                          }}
                                          onPaste={(e) => {
                                                e.preventDefault();
                                                const text = e.clipboardData.getData("text");
                                                const normalized = text.replace(/[\u0660-\u0669]/g, (d) =>
                                                      String.fromCharCode(d.charCodeAt(0) - 0x0660 + 48)
                                                );
                                                document.execCommand("insertText", false, normalized);
                                          }}
                                    />
                              </div>


                              {/* Unit */}
                              <div className="col-span-3">
                                    <label className="block text-sm font-medium">
                                          {translations.unit[currentLang]}
                                    </label>
                                    <select
                                          {...register(`ingredients.${index}.unit`, {
                                                required: translations.required[currentLang],
                                          })}
                                          className="w-full p-2 border rounded"
                                          dir={dir}
                                    >
                                          <option value="">
                                                {translations.unit[currentLang]}
                                          </option>
                                          {units.map(u => {
                                                return (
                                                      <option key={u.value} value={u.value}>
                                                            {u.label[currentLang]}
                                                      </option>
                                                );
                                          })}
                                    </select>
                              </div>

                              {/* Ingredient Name */}
                              <div className="col-span-6">
                                    <label className="block text-sm font-medium">
                                          {translations.ingredientName[currentLang]}
                                    </label>
                                    <input
                                          {...register(`ingredients.${index}.name`, {
                                                required: translations.required[currentLang],
                                          })}
                                          placeholder={translations.ingredientName[currentLang]}
                                          className="w-full p-2 border rounded"
                                          dir={dir}
                                    />
                              </div>

                              {/* Remove Button */}
                              <button
                                    type="button"
                                    onClick={() => removeIngredient(index)}
                                    className="col-span-1 text-red-500 hover:text-red-700 text-xl leading-none"
                                    aria-label={translations.removeIngredient[currentLang]}
                              >
                                    &times;
                              </button>
                        </div>
                  ))}

                  <button
                        type="button"
                        onClick={() => addIngredient({ name: "", quantity: "", unit: "" })}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                        {translations.addIngredient[currentLang]}
                  </button>
            </div>
      );
};

Ingredients.propTypes = {
      ingredientFields: PropTypes.array.isRequired,
      addIngredient: PropTypes.func.isRequired,
      removeIngredient: PropTypes.func.isRequired,
      register: PropTypes.func.isRequired,
      translations: PropTypes.object.isRequired,
      currentLang: PropTypes.string.isRequired,
      dir: PropTypes.string,
      units: PropTypes.array,
};

export default Ingredients;
