const fs = require('fs');
const { performance } = require('perf_hooks');
const https = require('https');
const { liveDatafileUrl, resultsDir } = require('../config');

const start = performance.now();

https.get(liveDatafileUrl, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const end = performance.now();
    const elapsed = end - start;
    console.log(`Fetched datafile in ${elapsed.toFixed(3)} ms`);

    fs.writeFileSync(`${resultsDir}/datafile-fetch.csv`, `Time_ms\n${elapsed.toFixed(3)}\n`);
    process.exit(0);
  });
}).on('error', err => {
  console.error(`Error fetching datafile: ${err.message}`);
  process.exit(1);
});
