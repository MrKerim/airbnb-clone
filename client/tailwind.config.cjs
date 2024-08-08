/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#F5385D",
				hoverPrimary: "#BD1E59",
			},
		},
	},
	plugins: [],
};
