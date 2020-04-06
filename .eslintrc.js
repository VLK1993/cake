module.exports = {
  root: true,

  env: {
    node: true,
    browser: true
  },

  extends: ["plugin:vue/essential", "@vue/prettier"],

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/no-unused-components': 'warning',
    'vue/no-unused-vars': 'warning'
  },

  parserOptions: {
    parser: 'babel-eslint'
  },

  'extends': [
    'plugin:vue/essential',
    '@vue/prettier'
  ]
};
