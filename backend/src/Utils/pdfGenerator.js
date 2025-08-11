// Utils/pdfGenerator.js
import puppeteer from "puppeteer-core";
import path from "path";

// Resolve project root and determine Chrome binary based on OS
const __dirname = path.resolve();
const getChromeExecutable = () => {
      const platform = process.platform;
      const base = path.join(__dirname, "chromium");
      if (platform === "win32") return path.join(base, "win", "chrome.exe");
      if (platform === "darwin")
            return path.join(base, "mac", "Chromium.app", "Contents", "MacOS", "Chromium");
      // default to linux
      return path.join(base, "linux", "chrome");
};

/**
 * Generate a PDF buffer from given HTML and PDF options.
 * @param {string} html - Full HTML document string
 * @param {object} options - Puppeteer PDF options
 * @param {object} [launchOptions] - Puppeteer launch options override
 * @returns {Promise<Buffer>}
 */
export async function generatePDF(html, options = {}, launchOptions = {}) {
      const executablePath = getChromeExecutable();
      const defaultLaunch = {
            headless: true,
            executablePath,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
      };
      const browser = await puppeteer.launch({ ...defaultLaunch, ...launchOptions });
      try {
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: "networkidle0" });
            const pdfBuffer = await page.pdf({
                  format: "A4",
                  printBackground: true,
                  ...options,
            });
            return pdfBuffer;
      } finally {
            await browser.close();
      }
}
