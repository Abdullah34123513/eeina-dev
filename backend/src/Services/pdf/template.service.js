// src/services/pdf/templateService.js
import fs from "fs/promises";
import path from "path";
import Handlebars from "handlebars";
import { labels } from "../../Configs/translation.js";

const cache = {};

// register helpers once on import
Handlebars.registerHelper("eq", (a, b) => a === b);
Handlebars.registerHelper("t", (key, lang) => {
      const dict = labels[key] || {};
      return dict[lang] || dict.en || key;
});
Handlebars.registerHelper("lookup", (obj, prop) => (obj && obj[prop]) || "");

export async function loadTemplate(name) {
      if (!cache[name]) {
            const file = path.join(process.cwd(), "src", "templates", `${name}.hbs`);
            console.log("Loading template:", file);
            const content = await fs.readFile(file, "utf-8");
            cache[name] = Handlebars.compile(content);
      }
      return cache[name];
}
