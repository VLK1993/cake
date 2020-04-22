module.exports = {
  root: true,

  env: {
    node: true,
    browser: true
  },

  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "vue/no-unused-components": "warn",
    "vue/no-unused-vars": "warn",
    "no-unused-vars": "warn"
  },

  parserOptions: {
    parser: "babel-eslint"
  },

  extends: ["plugin:vue/essential"]//, "@vue/prettier"]
};
