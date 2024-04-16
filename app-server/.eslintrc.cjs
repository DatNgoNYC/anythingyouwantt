// .eslintrc.cjs
module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser for TypeScript
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended' // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    project: './tsconfig.json' // Points to your project's tsconfig.json
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // Example:
    // 'semi': ['error', 'always'],
  },
};
