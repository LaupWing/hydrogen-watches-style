import formsPlugin from "@tailwindcss/forms"
import typographyPlugin from "@tailwindcss/typography"

/** @type {import('tailwindcss').Config} */
export default {
   content: ["./app/**/*.{js,ts,jsx,tsx}"],
   theme:{
      extend: {
         colors: {
            background: "rgb(var(--background) / <alpha-value>)"
         }
      }
   },
   plugins: [formsPlugin, typographyPlugin],
}
