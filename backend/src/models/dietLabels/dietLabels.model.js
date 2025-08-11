import { model, Schema } from "mongoose";

const dietLabels = new Schema({
      name: {
            en: {
                  type: String,
            },
            ar: {
                  type: String,
            },
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


const DietLabels = model("DietLabels", dietLabels);

export default DietLabels;