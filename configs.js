const local = require('./env/local');
const development = require('./env/development');
const stage = require('./env/stage');
const production = require('./env/production');
const cls = require('./env/cls');

module.exports = {
  local,
  development,
  stage,
  production,
  cls,
};
