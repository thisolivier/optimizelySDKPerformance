const fs = require('fs');
const { performance } = require('perf_hooks');
const optimizelySDK = require('@optimizely/optimizely-sdk');
const { staticDatafilePath, resultsDir } = require('../config');

const datafile = JSON.parse(fs.readFileSync(staticDatafilePath, 'utf-8'));

const start = performance.now();
const client = optimizelySDK.createInstance({ datafile });

client.onReady({ timeout: 5000 }).then(() => {
  const end = performance.now();
  const elapsed = end - start;
  console.log(`SDK (static) ready in ${elapsed.toFixed(3)} ms`);

  fs.writeFileSync(`${resultsDir}/init-static.csv`, `Time_ms\n${elapsed.toFixed(3)}\n`);
  process.exit(0);
}).catch(err => {
  console.error(`SDK failed to initialize: ${err.message}`);
  process.exit(1);
});