import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#EEF1EA",
        ink: "#16231F",
        line: "#C7CDBB",
        teal: {
          DEFAULT: "#d20023",
          dark: "#0B4739",
          light: "#E4EEE9",
        },
        brick: {
          DEFAULT: "#B5451B",
          light: "#F4E3D8",
        },
        brass: "#d20023", // dividers, small accents — evokes ironwork/fittings
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "3px",
      },
    },
  },
  plugins: [],
};

export default config;
