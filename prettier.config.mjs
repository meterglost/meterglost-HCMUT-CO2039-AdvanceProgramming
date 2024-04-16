/** @type {import("prettier").Config} */
export default {
	useTabs: true,
	tabWidth: 4,
	printWidth: 120,
	trailingComma: "es5",

	overrides: [
		{
			files: "*.{yml,yaml}",
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
};
