const fs = require('fs');
const https = require('https');
const { performance } = require('perf_hooks');
const { liveDatafileUrl, resultsDir, repeatCount } = require('../config');

const RUNS = repeatCount;
const outputFile = `${resultsDir}/datafile-fetch.csv`;

let run = 0;

// Clean up old results
if (fs.existsSync(outputFile)) {
  console.log(`🧹 Removing old results file: ${outputFile}`);
  fs.unlinkSync(outputFile);
}
fs.appendFileSync(outputFile, 'RunNumber,Time_ms\n');

// Recursive batch runner
function beginRuns() {
  run++;
  const start = performance.now();
  const timestamp = Date.now();
  https.get(`${liveDatafileUrl}?nocache=${timestamp}`, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const end = performance.now();
      const elapsed = end - start;

      fs.appendFileSync(outputFile, `${run},${elapsed.toFixed(3)}\n`);
      console.log(`📦 Run ${run} - Downloaded datafile in ${elapsed.toFixed(3)} ms`);

      if (run < RUNS) {
        beginRuns();
      } else {
        console.log(`🎉 Completed ${RUNS} datafile fetch runs.`);
      }
    });
  }).on('error', err => {
    console.error(`❌ Fetch failed: ${err.message}`);
    process.exit(1);
  });
}

beginRuns();
