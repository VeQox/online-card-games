/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			colors: {
				text: "#abb2bf",
				background: "#282c34",
				primary: "#c678dd",
				"primary-dark": "#a35db3",
				"primary-darker": "#8b4f9e",
				secondary: "#32363e",
				accent: "#5c6370"
			}
		}
	},
	plugins: []
};
