module.exports = {
  root: true,

  env: {
    node: true,
    browser: true
  },

  extends: ["plugin:vue/essential", "@vue/prettier"],

  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "vue/no-unused-components": "warn",
    "vue/no-unused-vars": "warn"
  },

  parserOptions: {
    parser: "babel-eslint"
  }
};
