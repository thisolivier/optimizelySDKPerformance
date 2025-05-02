// sdk-test.js
const fs = require('fs');
const { performance } = require('perf_hooks');
const optimizelySDK = require('@optimizely/optimizely-sdk');

const start = performance.now();
const datafile = JSON.parse(fs.readFileSync('datafile.json', 'utf-8'));

const optimizelyClient = optimizelySDK.createInstance({
  datafile: datafile,
});

optimizelyClient.onReady({ timeout: 5000 }).then(() => {
  const end = performance.now();
  const elapsedMs = end - start;
  console.log(`SDK ready in ${elapsedMs.toFixed(3)} ms`);
  process.exit(0);
}).catch(err => {
  console.error(`SDK init failed: ${err.message}`);
  process.exit(1);
});
