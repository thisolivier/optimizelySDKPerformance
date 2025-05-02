const { execSync } = require('child_process');
const fs = require('fs');
const { resultsDir } = require('./config');

const TESTS = [
  { name: 'Fetch Datafile', file: 'fetch-datafile.js' },
  { name: 'Init SDK (Live)', file: 'init-sdk-live.js' },
  { name: 'Init SDK (Static)', file: 'init-sdk-static.js' },
  { name: 'Decide (Live, unready)', file: 'decide-live-unready.js' },
  { name: 'Decide (Static, unready)', file: 'decide-static-unready.js' },
  { name: 'Decide (Polling, unready)', file: 'decide-static-stale-unready.js' },
];

if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir);
}

for (const test of TESTS) {
  console.log(`\n🧪 Running: ${test.name}`);
  try {
    execSync(`node tests/${test.file}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`❌ Test "${test.name}" failed.\n`);
  }
  console.log('--DONE--')
}
