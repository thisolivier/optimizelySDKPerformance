const fs = require('fs');
const { performance } = require('perf_hooks');
const optimizelySDK = require('@optimizely/optimizely-sdk');
const { resultsDir, flagKey, userId } = require('../config');

function runDecisionWarmupTest({
  clientConfig,
  outputFilename,
  durationMs = 1000,
  intervalMs = 5,
  runNumber = 1,
  clearFile = false,
  append = false,
  onComplete = null
}) {
  const sdkInitStart = performance.now();
  const client = optimizelySDK.createInstance(clientConfig);
  const sdkInitEnd = performance.now();
  const sdkInitSpeed = sdkInitEnd - sdkInitStart;

  console.log(`🧪 SDK initialized in ${sdkInitSpeed.toFixed(3)} ms`);

  const results = [];
  let firstValid = null;

  const interval = setInterval(() => {
    const now = performance.now();
    const timeSinceInit = now - sdkInitEnd;

    if (timeSinceInit > durationMs) {
      clearInterval(interval);
      writeResults(outputFilename, results, firstValid, runNumber, clearFile, append, onComplete);
      return;
    }

    const callStart = performance.now();
    const user = client.createUserContext(userId, {});
    const decision = user.decide(flagKey);
    const callEnd = performance.now();

    const duration = callEnd - callStart;
    const variation = decision?.variationKey || 'null';

    if (variation !== 'null' && !firstValid) {
      firstValid = { timeSinceInit, duration, variation };
    }

    results.push({ sdkInitSpeed, timeSinceInit, duration, variation });
  }, intervalMs);
}

function writeResults(filename, results, firstValid, runNumber, clearFile, append, onComplete) {
  const header = 'RunNumber,SDKInitSpeed_ms,TimeSinceInit_ms,Duration_ms,Variation\n';
  const lines = results.map(r =>
    `${runNumber},${r.sdkInitSpeed.toFixed(3)},${r.timeSinceInit.toFixed(3)},${r.duration.toFixed(3)},${r.variation}`
  ).join('\n') + '\n';

  const filePath = `${resultsDir}/${filename}`;

  if (clearFile && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  fs.appendFileSync(filePath, append ? lines : header + lines);
  console.log(`📁 Appended results for run ${runNumber} to ${filename}`);

  if (firstValid) {
    console.log(`✅ First valid decision (Run ${runNumber}):`);
    console.log(`   ⏱  Time since init: ${firstValid.timeSinceInit.toFixed(3)} ms`);
    console.log(`   🚀 Decision time:   ${firstValid.duration.toFixed(3)} ms`);
    console.log(`   🧪 Variation:       ${firstValid.variation}`);
  } else {
    console.log(`⚠️  No valid decision returned within test window.`);
  }

  if (typeof onComplete === 'function') {
    onComplete();
  } else {
    process.exit(0);
  }
}

module.exports = runDecisionWarmupTest;
