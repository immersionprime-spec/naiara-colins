/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "var(--color-gold)",
        "gold-hover": "var(--color-gold-hover)",
        "bg-main": "var(--color-bg)",
        "bg-alt": "var(--color-bg-alt)",
        "bg-card": "var(--color-bg-card)",
        "text-main": "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        "text-inverse": "var(--color-text-inverse)",
        border: "var(--color-border)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "1280px",
      },
      fontSize: {
        display: "var(--text-display)",
        "hero-sub": "var(--text-hero-sub)",
        h1: "var(--text-h1)",
        h2: "var(--text-h2)",
        h3: "var(--text-h3)",
        "body-lg": "var(--text-body-lg)",
        body: "var(--text-body)",
        "body-sm": "var(--text-body-sm)",
      },
    },
  },
  plugins: [],
};
