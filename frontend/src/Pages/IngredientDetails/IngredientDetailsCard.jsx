import propTypes from "prop-types";


const IngredientDetailsCard = ({ ingredient, extraData }) => {
      if (!ingredient) return null;


      // If you have an actual image URL from your data, replace this placeholder
      const placeholderImage = "https://via.placeholder.com/300?text=Onion";

      // USDA API often returns nutrients under `foodNutrients`.
      // If your structure is different, adjust accordingly.
      const { description, foodNutrients = [] } = ingredient;

      // Filter out only the nutrients that have a value > 0
      const positiveNutrients = foodNutrients.filter(
            (nutrient) => nutrient.value > 0
      );

      return (
            <div className=" mx-auto my-8 p-4 ">
                  <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-20">
                        {/* Left Side: Image */}
                        <div className="w-full lg:w-2/5">
                              <img
                                    src={extraData?.image?.url || placeholderImage}
                                    alt={description}
                                    className="w-full object-cover rounded"
                              />
                        </div>

                        {/* Right Side: Content */}
                        <div className="w-full lg:w-3/5 flex flex-col justify-between items-center gap-10">
                              {/* Title */}
                              <div
                                    className="w-full flex flex-col items-center justify-center gap-4"
                              >
                                    <h2 className="text-3xl ">{description}</h2>

                                    {/* Nutrition Facts */}
                                    <h3 className="text-xl ">Nutrition Per 100g</h3>
                                    <div className="w-3/4 mx-auto border rounded-xl">
                                          <table className="min-w-full mt-2 border-collapse">
                                                <thead>
                                                      <tr>
                                                            <th className="border-b py-2 px-5 text-center font-medium w-1/2 border-r">Nutrient</th>
                                                            <th className="border-b py-2 px-5 text-center font-medium w-1/2">Amount</th>
                                                      </tr>
                                                </thead>
                                                <tbody>
                                                      {positiveNutrients.map((nutrient) => (
                                                            <tr key={nutrient.nutrientId}>
                                                                  <td className="py-2 px-5 text-center border-r">{nutrient.nutrientName}</td>
                                                                  <td className="py-2 px-5 text-center">{nutrient.value} {nutrient.unitName}</td>
                                                            </tr>
                                                      ))}
                                                </tbody>
                                          </table>

                                    </div>
                              </div>

                              {/* Tips & Tricks */}
                              {/* <div className="bg-gray-50 p-4 rounded">
                                    <h3 className="text-lg font-semibold">Tips & Tricks</h3>
                                    <ul className="list-disc pl-5 space-y-1 mt-2">
                                          <li>Store uncut onions in a cool, dry place away from direct sunlight.</li>
                                          <li>Refrigerate cut onions in an airtight container to contain odor.</li>
                                          <li>Chill onions for 30 minutes to reduce tearing when chopping.</li>
                                    </ul>
                              </div> */}
                        </div>
                  </div>
            </div>
      );
};

IngredientDetailsCard.propTypes = {
      ingredient: propTypes.object,
      extraData: propTypes.object,
};

export default IngredientDetailsCard;
