const { prettier } = require('@umijs/fabric');
const _ = require('lodash');

const myPrettier = _.merge({}, prettier, {
  printWidth: 100,
});

module.exports = {
  ...myPrettier,
};
