// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    typescript: true,
  },
  env: {
    browser: true,
    es6: true,
    commonjs: true,
    amd: true,
    worker: true,
    serviceworker: true,
  },
  // 全局变量：
  // 1. Cookies - js-cookie
  globals: {
    Cookies: true,
    WebViewJavascriptBridge: true,
    // common/ga.html
    ga: true,
    isMidEast: true,
    // google workbox
    workbox: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: [
    'standard',
    'plugin:react/recommended',
    'plugin:flowtype-errors/recommended',
  ],
  plugins: [
    'standard',
    'promise',
    'react',
    'react-hooks',
  ],
  settings: {
    react: {
      version: '16.0',
    },
    "flowtype-errors": {
      stopOnExit: true,
    },
  },
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-eval': 'off',
    // 结尾分号，建议全加上，暂时去掉规则，有时间 --fix 一下
    'semi': 0,
    // object结尾逗号
    'comma-dangle': ["error", "always-multiline"],
    'camelcase': 0,
    // eol-last
    'eol-last': 2,
    'no-multiple-empty-lines': ["error", { "max": 2, "maxEOF": 1 }],
    'no-return-await': 2,
    // do expression in jsx
    'no-unused-expressions': 0,
    // no-unused-vars
    'no-unused-vars': [0, {
      'args': 'all',
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_|^React$',
    }],
    'import/no-webpack-loader-syntax': 0,
    'react/display-name': [0],
    'prefer-promise-reject-errors': ["error", {'allowEmptyReject': true}],
    'react-hooks/rules-of-hooks': "error",
    'react-hooks/exhaustive-deps': "warn",
  }
}
