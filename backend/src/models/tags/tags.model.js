import { Schema, model } from "mongoose";

const tagsSchema = new Schema({
      location: { type: String, required: [true, "Location is required"] },
      script: { type: String, required: [true, "Script is required"] },
      status: {
            type: String,
            default: "active",
            enum: ["active", "inactive"],
      },
});

const Tags = model("Tags", tagsSchema);
export default Tags;
