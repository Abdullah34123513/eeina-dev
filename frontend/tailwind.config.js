/** @type {import('tailwindcss').Config} */
const config = {
      content: [
            "./src/**/*.{js,jsx,ts,tsx}",
            "./public/index.html",
      ],
      theme: {
            extend: {
                  colors: {
                        primary: {
                              50: "#f0fdf4",
                              100: "#dcfce7",
                              200: "#bbf7d0",
                              300: "#86efac",
                              400: "#4ade80",
                              500: "#018558",
                              600: "#016a46",
                              700: "#015a3a",
                              800: "#014a2f",
                              900: "#013d27",
                        },
                        secondary: {
                              50: "#fefce8",
                              100: "#fef9c3",
                              200: "#fef08a",
                              300: "#fde047",
                              400: "#facc15",
                              500: "#EF8F21",
                              600: "#ca8a04",
                              700: "#a16207",
                              800: "#854d0e",
                              900: "#713f12",
                        },
                        accent: {
                              50: "#f7fee7",
                              100: "#ecfccb",
                              200: "#d9f99d",
                              300: "#bef264",
                              400: "#a3e635",
                              500: "#7bc144",
                              600: "#65a30d",
                              700: "#4d7c0f",
                              800: "#3f6212",
                              900: "#365314",
                        },
                        neutral: {
                              50: "#fafafa",
                              100: "#f5f5f5",
                              200: "#e5e5e5",
                              300: "#d4d4d4",
                              400: "#a3a3a3",
                              500: "#737373",
                              600: "#525252",
                              700: "#404040",
                              800: "#262626",
                              900: "#171717",
                        },
                        success: "#10b981",
                        warning: "#f59e0b",
                        error: "#ef4444",
                        info: "#3b82f6",
                  },
                  fontFamily: {
                        sans: ["Inter", "system-ui", "sans-serif"],
                        display: ["Oswald", "system-ui", "sans-serif"],
                        body: ["Inter", "system-ui", "sans-serif"],
                        nirwana: ["Nirwana", "sans-serif"],
                        oswald: ["Oswald", "sans-serif"],
                  },
                  fontSize: {
                        xs: ["0.75rem", { lineHeight: "1rem" }],
                        sm: ["0.875rem", { lineHeight: "1.25rem" }],
                        base: ["1rem", { lineHeight: "1.5rem" }],
                        lg: ["1.125rem", { lineHeight: "1.75rem" }],
                        xl: ["1.25rem", { lineHeight: "1.75rem" }],
                        "2xl": ["1.5rem", { lineHeight: "2rem" }],
                        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
                        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
                        "5xl": ["3rem", { lineHeight: "1" }],
                        "6xl": ["3.75rem", { lineHeight: "1" }],
                  },
                  spacing: {
                        18: "4.5rem",
                        88: "22rem",
                        128: "32rem",
                  },
                  maxWidth: {
                        defaultContainer: "1280px",
                        "8xl": "88rem",
                        "9xl": "96rem",
                  },
                  boxShadow: {
                        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
                        medium: "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.05)",
                        large: "0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 50px -10px rgba(0, 0, 0, 0.1)",
                        glow: "0 0 20px rgba(1, 133, 88, 0.3)",
                  },
                  borderRadius: {
                        "4xl": "2rem",
                  },
                  backdropBlur: {
                        xs: "2px",
                  },
                  animation: {
                        "fade-in": "fadeIn 0.5s ease-in-out",
                        "slide-up": "slideUp 0.3s ease-out",
                        "scale-in": "scaleIn 0.2s ease-out",
                        "bounce-gentle": "bounceGentle 0.6s ease-in-out",
                  },
                  keyframes: {
                        fadeIn: {
                              "0%": { opacity: "0" },
                              "100%": { opacity: "1" },
                        },
                        slideUp: {
                              "0%": { transform: "translateY(10px)", opacity: "0" },
                              "100%": { transform: "translateY(0)", opacity: "1" },
                        },
                        scaleIn: {
                              "0%": { transform: "scale(0.95)", opacity: "0" },
                              "100%": { transform: "scale(1)", opacity: "1" },
                        },
                        bounceGentle: {
                              "0%, 100%": { transform: "translateY(0)" },
                              "50%": { transform: "translateY(-5px)" },
                        },
                  },
            },
      },
      plugins: [
            import("tailwindcss-rtl"),
      ],
};

export default config;
