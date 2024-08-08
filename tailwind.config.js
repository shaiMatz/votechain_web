/** @type {import('tailwindcss').Config} */
export default {
  content: [
     "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A1C40", // Dark background color
        secondary: {
          DEFAULT: "#A238F4", // Highlight color from the logo
          100: "#C466F9", // Lighter shade of secondary
          200: "#B94DF7", // Medium shade of secondary
          300: "#A238F4", // Default shade of secondary
          400: "#8C2BEF", // Darker shade of secondary
          500: "#7620EA", // Even darker shade of secondary
        },
        black: {
          DEFAULT: "#000000",
          100: "#1E1E2D", // Lighter black
          200: "#232533", // Slightly lighter black
        },
        gray: {
          100: "#CDCDE0", // Light gray color
          200: "#B3B3C9", // Medium gray color
          300: "#9999B2", // Darker gray color
        },
        accent: {
          blue: {
            DEFAULT: "#09ACFE", // Light blue color
            100: "#7BD2FF", // Very light blue
            200: "#42C2FF", // Lighter blue
            300: "#09ACFE", // Default blue
            400: "#088AD0", // Darker blue
            500: "#066DA5", // Even darker blue
          },
          green: {
            DEFAULT: "#0CE0BD", // Green color
            100: "#80F5DD", // Very light green
            200: "#4DEACA", // Lighter green
            300: "#0CE0BD", // Default green
            400: "#0AC0A4", // Darker green
            500: "#089987", // Even darker green
          },
          pink: {
            DEFAULT: "#FF8BB3", // Pink color
            100: "#FFC0D5", // Very light pink
            200: "#FF9EC2", // Lighter pink
            300: "#FF8BB3", // Default pink
            400: "#E675A0", // Darker pink
            500: "#CC5F8D", // Even darker pink
          },
          white:{
            DEFAULT: "#FFFFFF",
            100: "#F7F7F7",
            200: "#F2F2F2",
          }
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
      backgroundImage: {
        'custom-radial': 'radial-gradient(circle, #FFFBFF 0%, #E6E6E6 100%)',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1.1' }],
        '9xl': ['8rem', { lineHeight: '1.1' }],
      },
    },
    
  },
  plugins: [],
}
