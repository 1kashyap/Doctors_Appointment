/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: "#7FABB4",
        btnColor: "#F7FEFF",
        btnBorderColor: "#C1F1FB",
        yellowColor: "#FEB60D",
        purpleColor: "#9771FF",
        irisBlueColor: "#01B5C5",
        headingColor: "#181A1E",
        textColor: "#8C807C"
      },

      boxShadow: {
        panelShadow: "rbga(17, 12, 46, 0.15) 0px 48px 100px 0px;",
      }
    },
  },
  plugins: [],
}

// primaryColor: "#0067FF" ,
        // yellowColor: "#FEB60D" ,
        // purpleColor: "#9771FF" ,
        // irisBlueColor: "#01B5C5" ,
        // headingColor: "#181A1E" ,
        // textColor: "#8C807C" ,