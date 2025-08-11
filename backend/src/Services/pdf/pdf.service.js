import puppeteer from "puppeteer";
import { pdfConfig } from "../../Configs/pdf.config.js";

/**
 * Singleton PDF service to reuse one browser instance per process for performance.
 */
class PdfService {
      browser = null;

      async init() {
            try {
                  if (!this.browser) {
                        this.browser = await puppeteer.launch({
                              headless: true,
                              args: pdfConfig.puppeteerArgs,
                        });
                  }
            } catch (error) {
                  console.error("Error initializing Puppeteer:", error);
                  throw new Error("Failed to initialize PDF service.");
            }
      }

      /**
       * Generate a PDF Buffer from HTML.
       * @param {string} html - Precompiled HTML string
       * @param {object} options - puppeteer PDF options (header/footer, margins)
       */
      async generate(html, options = {}) {
            await this.init();
            const page = await this.browser.newPage();
            await page.setContent(html, { waitUntil: "networkidle0" });
            const buffer = await page.pdf({ ...pdfConfig.defaultPdfOptions, ...options });
            await page.close();
            return buffer;
      }

      async close() {
            if (this.browser) {
                  await this.browser.close();
                  this.browser = null;
            }
      }
}

export const pdfService = new PdfService();
