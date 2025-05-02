const fs = require('fs');
const { performance } = require('perf_hooks');
const optimizelySDK = require('@optimizely/optimizely-sdk');
const { sdkKey, resultsDir } = require('../config');

const start = performance.now();

const client = optimizelySDK.createInstance({ sdkKey });

client.onReady({ timeout: 5000 }).then(() => {
  const end = performance.now();
  const elapsed = end - start;
  console.log(`SDK (live) ready in ${elapsed.toFixed(3)} ms`);

  fs.writeFileSync(`${resultsDir}/init-live.csv`, `Time_ms\n${elapsed.toFixed(3)}\n`);
  process.exit(0);
}).catch(err => {
  console.error(`SDK failed to initialize: ${err.message}`);
  process.exit(1);
});