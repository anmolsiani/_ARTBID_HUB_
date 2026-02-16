/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
        './app/**/*.{js,jsx,ts,tsx}',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#7c3aed", // Vivid Purple
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "#ec4899", // Vivid Pink
                    foreground: "hsl(var(--secondary-foreground))",
                },
                accent: {
                    DEFAULT: "#3b82f6", // Vivid Blue
                    hover: "#2563eb",
                },
                dark: {
                    DEFAULT: "#0f172a",
                    lighter: "#1e293b",
                    card: "#1e293b",
                }
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                xl: "1rem",
                '2xl': "1.5rem",
                '3xl': "2rem",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "float": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                "pulse-slow": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.7" },
                },
                "gradient-x": {
                    "0%, 100%": { "background-position": "0% 50%" },
                    "50%": { "background-position": "100% 50%" },
                }
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "float": "float 3s ease-in-out infinite",
                "pulse-slow": "pulse-slow 4s ease-in-out infinite",
                "gradient-x": "gradient-x 15s ease infinite",
            },
            backgroundImage: {
                'pixlr-gradient': 'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #3b82f6 100%)',
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            }
        },
    },
    plugins: [require("tailwindcss-animate")],
}
