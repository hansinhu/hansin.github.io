const _ = require('lodash')

const presets = [
  "@babel/preset-react",
  [
    "@babel/preset-env",
    {
      "modules": false,
      "shippedProposals": true,
      "loose": false,
      "useBuiltIns": "usage",
      "corejs": 3,
      "debug": false,
    }
  ],
  "@babel/typescript",
  "@babel/preset-flow",
]

const plugins = _.compact([
  "lodash",
  "macros",
  "react-hot-loader/babel",
  ["import", {
    "libraryName": "cf-ui-mobile",
    "libraryDirectory": "es",   // default: lib
    "style": true, // `style: true` 会加载 less 文件
  }, "cf-ui-mobile"],
  ["import", {
    "libraryName": "front-components",
    "libraryDirectory": "es",   // default: lib
    "style": true, // `style: true` 会加载 less 文件
  }, "front-components"],
  ["transform-inline-environment-variables", {
    "include": [
      "NODE_ENV",
      "CLUB_ENV",
      "RELEASE_VERSION",
      "SSR",
    ]
  }],
  [
    "@babel/plugin-proposal-decorators",
    {
      "legacy": true
    }
  ],
  process.env.CLUB_ENV == 'test' && "istanbul",
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-syntax-import-meta",
  ["@babel/plugin-proposal-class-properties", {
    "loose": true,
  }],
  "@babel/proposal-object-rest-spread",
  "@babel/plugin-proposal-json-strings",
  "@babel/plugin-proposal-function-sent",
  "@babel/plugin-proposal-function-bind",
  "@babel/plugin-proposal-export-namespace",
  "@babel/plugin-proposal-export-namespace-from",
  "@babel/plugin-proposal-numeric-separator",
  "@babel/plugin-proposal-throw-expressions",
  "@babel/plugin-proposal-do-expressions",
  "@babel/plugin-proposal-optional-chaining",
  [
    "@babel/plugin-proposal-pipeline-operator",
    {
      "proposal": "minimal"
    }
  ],
  "@babel/plugin-proposal-optional-catch-binding",
  "@babel/plugin-transform-literals",
  "@babel/plugin-proposal-nullish-coalescing-operator",
])

module.exports = {
  presets,
  plugins,
}
