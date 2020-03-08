module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:json/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/react',
  ],
  overrides: [
    {
      env: {
        jest: true,
      },
      files: [
        '**/*.{spec,test}.{js,jsx,ts,tsx}',
        '**/__mocks__/**',
        '**/{test,tests,spec,specs,__mocks__}/**',
      ],
    },
    {
      env:{
        browser: true
      },
      files: ['src/index.js', 'src/components/**/*.js', 'src/ui/**/*.js']
    },
    {
      files: ['prettier.config.js'],
      rules: {
        'global-require': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  plugins: [
    'json',
    'react',
    'react-hooks',
  ],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off'
  },
};
