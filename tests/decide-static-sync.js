const fs = require('fs');
const { performance } = require('perf_hooks');
const optimizelySDK = require('@optimizely/optimizely-sdk');
const { staticDatafilePath, flagKey, userId, resultsDir, repeatCount } = require('../config');

const datafile = JSON.parse(fs.readFileSync(staticDatafilePath, 'utf-8'));
const outputFile = `${resultsDir}/decide-sync-static.csv`;
const RUNS = repeatCount;

console.log(`🔁 Running ${RUNS} sync decision tests from static datafile...`);

if (fs.existsSync(outputFile)) {
  fs.unlinkSync(outputFile);
}
fs.appendFileSync(outputFile, 'RunNumber,TotalElapsed_ms,DecideOnly_ms,Variation\n');

for (let run = 1; run <= RUNS; run++) {
  const start = performance.now();
  const client = optimizelySDK.createInstance({ datafile });

  const decideStart = performance.now();
  const user = client.createUserContext(userId, {});
  const decision = user.decide(flagKey);
  const decideEnd = performance.now();
  const end = decideEnd;

  const totalElapsed = end - start;
  const decideOnly = decideEnd - decideStart;
  const variation = decision?.variationKey || 'null';

  fs.appendFileSync(
    outputFile,
    `${run},${totalElapsed.toFixed(3)},${decideOnly.toFixed(3)},${variation}\n`
  );

  console.log(
    `Run ${run}: total=${totalElapsed.toFixed(3)}ms, decision=${decideOnly.toFixed(3)}ms, variation=${variation}`
  );
}

console.log(`\n✅ Completed ${RUNS} sync decision runs. Results saved to ${outputFile}`);
