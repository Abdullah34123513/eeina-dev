import { model, Schema } from "mongoose";

const healthLabelSchema = new Schema({
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

// Check if the model already exists before creating a new one
const HealthLabels = model("HealthLabels", healthLabelSchema);

export default HealthLabels;
