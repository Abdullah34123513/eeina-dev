import fs from "fs";
import path from "path";

const fontPath = path.resolve("src/fonts/Amiri-Regular.ttf");
const fontBuffer = fs.readFileSync(fontPath);

// Export as base64 encoded string
export const AmiriRegular = fontBuffer.toString("base64");