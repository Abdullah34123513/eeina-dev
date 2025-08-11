import { model, Schema } from "mongoose";

const cuisineSchema = new Schema({
      name: {
            en: {
                  type: String,
            },
            ar: {
                  type: String,
            }
      },
      image: {
            key: {
                  type: String,
                  default: "default-image",
            },
            url: {
                  type: String,
                  default: "/default-category.jpg",
            },
      },
});


const Cuisine = model("Cuisine", cuisineSchema);

export default Cuisine;
