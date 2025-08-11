import { asyncHandler } from "../../Utils/asyncHandler.js";
import createError from "http-errors";
import { loadTemplate } from "../../Services/pdf/template.service.js";
import { pdfService } from "../../Services/pdf/pdf.service.js";
import fs from "fs/promises";

export const generateRecipePdf = asyncHandler(async (req, res) => {
      const { recipe, recipeLang = "en" } = req.body;
      if (!recipe?.title) throw createError(400, "Invalid recipe payload");

      const data = { recipe, lang: recipeLang };
      const [recipeTpl, headerTpl, footerTpl] = await Promise.all([
            loadTemplate("recipe"),
            loadTemplate("pdfHeader"),
            loadTemplate("pdfFooter"),
      ]);

      const html = recipeTpl(data);
      const header = headerTpl(data);
      const footer = footerTpl(data);

      try {
            const buffer = await pdfService.generate(html, {
                  displayHeaderFooter: true,
                  headerTemplate: header,
                  footerTemplate: footer,
            });

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                  "Content-Disposition",
                  `attachment; filename="${recipe.slug || "recipe"}_${recipeLang}.pdf"`
            );
            res.setHeader("Content-Length", buffer.length);
            res.end(buffer);
      } catch (error) {
            console.error("PDF generation error:", error);
            throw createError(500, "Failed to generate PDF");
      }
});
