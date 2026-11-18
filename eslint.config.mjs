import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const eslintConfig = [
	...nextVitals,
	...nextTypescript,
	prettier,
	{
		// shortcut: existing React Compiler findings stay visible as warnings until dashboard QA.
		rules: {
			'react-hooks/set-state-in-effect': 'warn',
			'react-hooks/refs': 'warn',
			'react-hooks/purity': 'warn',
		},
	},
];

export default eslintConfig;
