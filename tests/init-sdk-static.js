const fs = require('fs');
const { performance } = require('perf_hooks');
const optimizelySDK = require('@optimizely/optimizely-sdk');
const { repeatCount, staticDatafilePath, resultsDir } = require('../config');

const datafile = JSON.parse(fs.readFileSync(staticDatafilePath, 'utf-8'));
const RUNS = repeatCount;
const outputFile = `${resultsDir}/init-static.csv`;

let run = 0;

if (fs.existsSync(outputFile)) {
  console.log(`🧹 Removing old results file: ${outputFile}`);
  fs.unlinkSync(outputFile);
}
fs.appendFileSync(outputFile, 'RunNumber,InitTime_ms\n');

function runOnce() {
  run++;

  const start = performance.now();
  const client = optimizelySDK.createInstance({ datafile });

  const timeout = setTimeout(() => {
    console.error(`⏱️ Timeout! SDK init took too long on run ${run}`);
    process.exit(1);
  }, 6000);

  client.onReady({ timeout: 5000 }).then(() => {
    clearTimeout(timeout);
    const end = performance.now();
    const elapsed = end - start;

    fs.appendFileSync(outputFile, `${run},${elapsed.toFixed(3)}\n`);
    console.log(`🚀 Run ${run} - SDK (static) ready in ${elapsed.toFixed(3)} ms`);

    if (run < RUNS) {
      runOnce();
    } else {
      console.log(`🎉 Completed ${RUNS} static init runs.`);
      process.exit(0);
    }
  }).catch(err => {
    clearTimeout(timeout);
    console.error(`❌ Init failed on run ${run}: ${err.message}`);
    process.exit(1);
  });
}

runOnce();
