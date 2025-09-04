/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        // Wipe reveal vertical
        reveal: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "60%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        // Pop check
        pop: {
          "0%": { transform: "scale(0.9)" },
          "60%": { transform: "scale(1.06)" },
          "100%": { transform: "scale(1)" },
        },
        // Fade up text
        rise: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "60%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Sheen effect for wordmark
        sheen: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        reveal: "reveal 0.7s cubic-bezier(0.4,0,0.2,1) both",
        pop: "pop 0.5s cubic-bezier(0.4,0,0.2,1) both",
        rise: "rise 0.7s cubic-bezier(0.4,0,0.2,1) both",
        sheen: "sheen 1.2s linear both",
      },
      width: {
        "chatbot-panel": "370px",
      },
      maxWidth: {
        "chatbot-panel": "100vw",
      },
      backgroundColor: {
        "chatbot-panel": "rgba(255,255,255,0.55)",
      },
      boxShadow: {
        "chatbot-panel": "-4px 0 24px 0 rgba(0,0,0,0.1)",
      },
      zIndex: {
        "chatbot-panel": "99999",
      },
      backdropBlur: {
        "chatbot-panel": "8px",
      },
    },
  },
  plugins: [],
};
