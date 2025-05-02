const fs = require('fs');
const { performance } = require('perf_hooks');
const optimizelySDK = require('@optimizely/optimizely-sdk');
const { repeatCount, sdkKey, resultsDir } = require('../config');

const RUNS = repeatCount;
const outputFile = `${resultsDir}/init-live.csv`;
let run = 0;

// Clean previous results
if (fs.existsSync(outputFile)) {
  console.log(`🧹 Removing old results file: ${outputFile}`);
  fs.unlinkSync(outputFile);
}
fs.appendFileSync(outputFile, 'RunNumber,InitTime_ms\n');

function runOnce() {
  run++;
  const start = performance.now();
  const client = optimizelySDK.createInstance({ 
    sdkKey,
    datafileOptions: {
      urlTemplate: `https://cdn.optimizely.com/datafiles/${sdkKey}.json?nocache=${Date.now()}`
    } 
  });

  client.onReady({ timeout: 5000 }).then(() => {
    const end = performance.now();
    const elapsed = end - start;

    fs.appendFileSync(outputFile, `${run},${elapsed.toFixed(3)}\n`);
    console.log(`🚀 Run ${run} - SDK (live) ready in ${elapsed.toFixed(3)} ms`);

    if (run < RUNS) {
      runOnce();
    } else {
      console.log(`🎉 Completed ${RUNS} live init runs.`);
      process.exit(0);
    }
  }).catch(err => {
    console.error(`❌ Init failed on run ${run}: ${err.message}`);
    process.exit(1);
  });
}

runOnce();
