import { type Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: ["./src/**/*.tsx"],
  plugins: [daisyui],
  daisyui: {
    themes: ["nord"],
  },
} satisfies Config;
