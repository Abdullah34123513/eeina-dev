import helmet from "helmet";

const helmetConfig = helmet({
      contentSecurityPolicy: {
            directives: {
                  defaultSrc: ["'self'"],
                  scriptSrc: [
                        "'self'",
                        "'unsafe-inline'",
                        "'unsafe-eval'",
                        "https://kit.fontawesome.com",
                        "https://unpkg.com",
                        "https://static.cloudflareinsights.com",
                  ],
                  scriptSrcElem: [
                        "'self'",
                        "'unsafe-inline'",
                        "https://kit.fontawesome.com",
                        "https://unpkg.com",
                        "https://static.cloudflareinsights.com",
                  ],
                  styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                  fontSrc: [
                        "'self'",
                        "data:",
                        "https://fonts.gstatic.com",
                        "https://ka-f.fontawesome.com",
                  ],
                  imgSrc: [
                        "'self'",
                        "data:",
                        "blob:",
                        "https://img.spoonacular.com",
                        "https://lh3.googleusercontent.com",
                        "https://eeina-main.s3.eu-north-1.amazonaws.com",
                        "https://eeina.s3.ap-south-1.amazonaws.com",
                        "https://recipes-scrapper-4e9x.onrender.com",
                        "https://img.youtube.com",
                  ],
                  connectSrc: [
                        "'self'",
                        "https://img.spoonacular.com",
                        "https://ka-f.fontawesome.com",
                        "https://unpkg.com",
                        "https://tinyurl.com",
                        "https://api.nal.usda.gov",
                        "https://www.tiktok.com",
                  ],
                  frameSrc: ["'self'", "https://www.youtube.com"],
            },
      },
});

export default helmetConfig;
