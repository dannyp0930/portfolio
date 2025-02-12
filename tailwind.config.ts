import type { Config } from 'tailwindcss';

export default {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				kbo: ['KBO Dia Gothic', 'serif', 'sans-serif'],
				parisienne: ['Parisienne', 'serif', 'sans-serif'],
			},
			colors: {
				theme: '#ffdab9',
				'theme-sub': '#522a28',
				'peach-fuzz': '#ffdab9',
				'pale-beige': '#f5f5dc',
				linen: '#faf0e6',
			},
			height: {
				header: '6.25rem',
				footer: '12.5rem',
			},
			spacing: {
				header: '6.25rem',
				footer: '12.5rem',
			},
		},
	},
	plugins: [],
} satisfies Config;
