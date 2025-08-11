/** @type {import('tailwindcss').Config} */
const config = {
      content: [
            "./src/**/*.{js,jsx,ts,tsx}",
            "./public/index.html",
      ],
      theme: {
            extend: {
                  colors: {
                        primary: "#018558",
                        secondary: "rgb(123,193,68)",
                        btnPrimary: "rgb(0, 133, 88)",
                        btnSecondary: "#EF8F21",
                        text: "rgb(0,0,0)",
                        background: "rgb(255,255,255)",
                        danger: "rgb(152,0,0)",
                        warning: "rgb(255,255,0)",
                  },
                  maxWidth: {
                        defaultContainer: "1280px",
                  },
                  fontFamily: {
                        nirwana: ["Nirwana", "sans-serif"],
                        oswald: ["Oswald", "sans-serif"],
                  },
                  boxShadow: {
                        custom: "5px 10px 30px rgba(98, 98, 119, 0.1)",
                  },
            },
      },
      plugins: [
            import("tailwindcss-rtl"),
      ],
};

export default config;
