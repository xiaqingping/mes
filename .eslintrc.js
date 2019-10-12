const { strictEslint } = require('@umijs/fabric');
const _ = require('lodash');

const myEslint = _.merge({}, strictEslint, {
  rules: {
    'no-plusplus': 'off',
    'no-console': 'off',
  }
});

module.exports = {
  ...myEslint,
  globals: {
    BASE_API: true,
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
  },
};
