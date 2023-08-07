import formsPlugin from "@tailwindcss/forms"
import typographyPlugin from "@tailwindcss/typography"

/** @type {import('tailwindcss').Config} */
export default {
   content: ["./app/**/*.{js,ts,jsx,tsx}", "./app/root.tsx"],
   theme:{
      extend: {
         colors: {
            primary: "rgba(var(--primary) / <alpha-value>)",
            accent: "rgba(var(--accent) / <alpha-value>)"
         }
      }
   },
   plugins: [formsPlugin, typographyPlugin],
}
