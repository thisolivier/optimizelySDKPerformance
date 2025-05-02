// tests/decide-stale-unready.js
const fs = require('fs');
const decisionsFromColdStartHelper = require('./helper_decision');
const { staleDatafilePath, sdkKey } = require('../config');

const datafile = JSON.parse(fs.readFileSync(staleDatafilePath, 'utf-8'));

decisionsFromColdStartHelper({
  clientConfig: {
    sdkKey,
    datafile,
    datafileOptions: { autoUpdate: true }
  },
  outputFilename: 'decisions-stale-unready.csv'
});
