import { jsPDF } from "jspdf";
import fetch from "node-fetch";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { pdfService } from "../../Services/pdf/pdf.service.js";
import { loadTemplate } from "../../Services/pdf/template.service.js";

const generateListPDF = asyncHandler(async (req, res, next) => {
      const { list, lang } = req.body;
      console.log(list);

      if (!list || !Array.isArray(list) || list.length === 0) {
            return next(new apiErrorHandler(400, "Invalid list payload"));
      }

      const data = { ingredients: list, lang };
      const [listTpl, headerTpl, footerTpl] = await Promise.all([
            loadTemplate("list"),
            loadTemplate("pdfHeader"),
            loadTemplate("pdfFooter"),
      ]);

      console.log(listTpl, headerTpl, footerTpl);

      const html = listTpl(data);
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
                  `attachment; filename="shopping_list.pdf"`
            );
            res.setHeader("Content-Length", buffer.length);
            res.end(buffer);
      } catch (error) {
            console.error("PDF generation error:", error);
            throw createError(500, "Failed to generate PDF");
      }
});

export default generateListPDF;
