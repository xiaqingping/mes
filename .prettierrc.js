const { prettier } = require('@umijs/fabric');
const _ = require('lodash');

const myPrettier = _.merge({}, prettier, {
  printWidth: 120,
});

module.exports = {
  ...myPrettier,
};
