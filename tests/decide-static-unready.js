// tests/decide-static-unready.js
const fs = require('fs');
const decisionsFromColdStartHelper = require('./helper_decision');
const { staticDatafilePath } = require('../config');

const datafile = JSON.parse(fs.readFileSync(staticDatafilePath, 'utf-8'));

decisionsFromColdStartHelper({
  clientConfig: { datafile },
  outputFilename: 'decisions-static-unready.csv'
});
