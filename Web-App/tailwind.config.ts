import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                neonBlue: "#00f0ff",
                neonGreen: "#00ff9d",
                neonRed: "#ff0055",
                glass: "rgba(255, 255, 255, 0.05)",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
            animation: {
                'spin-slow': 'spin 10s linear infinite',
            }
        },
    },
    plugins: [],
};
export default config;
