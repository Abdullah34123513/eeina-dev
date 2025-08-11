export const pdfConfig = {
      puppeteerArgs: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
      ],
      defaultPdfOptions: {
            format: "A4",
            printBackground: true,
            margin: { top: "80px", bottom: "80px", left: "40px", right: "40px" },
      },
};
