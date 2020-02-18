// module.exports = {
//   extends: [require.resolve('@umijs/fabric/dist/eslint')],
//   globals: {
//     ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
//     page: true,
//     REACT_APP_ENV: true,
//   },
// };
const { strictEslint } = require('@umijs/fabric');
const _ = require('lodash');

const myEslint = _.merge({}, strictEslint, {
  rules: {
    'no-plusplus': 'off',
    'no-console': 'off',
    'max-len': ['error', { code: 100 }],
  },
});

module.exports = {
  ...myEslint,
  globals: {
    BASE_API: true,
    page: true,
  },
};
