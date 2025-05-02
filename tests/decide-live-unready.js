// tests/decide-live-unready.js
const decisionsFromColdStartHelper = require('./helper_decision');
const { sdkKey } = require('../config');

decisionsFromColdStartHelper({
  clientConfig: { sdkKey },
  outputFilename: 'decisions-live-unready.csv'
});
