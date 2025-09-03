import typography from '@tailwindcss/typography';
import containerQuries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// Cores principais
				primary: '#1EACA4',
				secondary: '#FFFFFF',
				tertiary: '#2F3342',
				// Sistema de cores
				blue: '#1761FD',
				indigo: '#00beb2',
				purple: '#78DBBA',
				'purple-36': '#A0E8CF',
				pink: '#FD3C97',
				red: '#E36065',
				'red-light': '#FF9D9D',
				orange: '#FCB37C',
				yellow: '#FCE07C',
				green: '#03DABA',
				teal: '#03D87F',
				cyan: '#60C5FE',
				gray: {
					50: 'var(--color-gray-50, #ebedf0)',
					100: 'var(--color-gray-100, #d8dbe0)',
					200: 'var(--color-gray-200, #c5c9d0)',
					300: 'var(--color-gray-300, #a2a8b2)',
					400: 'var(--color-gray-400, #26292d)',
					500: 'var(--color-gray-500, #141923)',
					600: 'var(--color-gray-600, #394558)',
					700: 'var(--color-gray-700, #262e3d)',
					800: 'var(--color-gray-800, #1d2330)',
					850: 'var(--color-gray-850, #262626)',
					900: 'var(--color-gray-900, #141923)',
					950: 'var(--color-gray-950, #0b0e16)'
				},
				dark: "#21242E",
				// Base green scale
				'green-50': '#ccf5f2',
				'green-100': '#99ece5',
				'green-200': '#66e2d9',
				'green-300': '#33d9cc',
				'green-400': '#00cfbf',
				'green-500': '#00beb2',
				'green-600': '#00948d',
				'green-700': '#006a68',
				'green-800': '#004143',
				'green-900': '#0e4b4e'
			},
			typography: {
				DEFAULT: {
					css: {
						pre: false,
						code: false,
						'pre code': false,
						'code::before': false,
						'code::after': false
					}
				}
			},
			padding: {
				'safe-bottom': 'env(safe-area-inset-bottom)'
			},
			transitionProperty: {
				width: 'width'
			}
		}
	},
	plugins: [typography, containerQuries]
};
