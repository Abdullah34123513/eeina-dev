import { Schema, model } from "mongoose";

const ingredientSchema = new Schema({
    name: {
        en: {
            type: String
        },
        ar: {
            type: String
        }
    },
    unit: {
        type: String,
    },
    image: {
        url: {
            type: String,
            default: "/ingredient-default.png",
        },
        key: {
            type: String,
            default: "default",
        }
    }
});

// Pre-save hook to ensure the real name is always present in altName
ingredientSchema.pre("save", function (next) {
    // Ensure altName is an array
    if (!this.altName || !Array.isArray(this.altName)) {
        this.altName = [this.name];
    }
    // If the actual name isn't already included, add it
    if (!this.altName.includes(this.name)) {
        this.altName.push(this.name);
    }
    next();
});

const Ingredient = model("Ingredient", ingredientSchema);

export default Ingredient;
