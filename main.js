const { execSync } = require('child_process');
const fs = require('fs');
const { resultsDir } = require('./config');

const TESTS = [
  { name: 'Fetch Datafile', file: 'fetch-datafile.js' },
  { name: 'Init SDK (Live)', file: 'init-sdk-live.js' },
  { name: 'Init SDK (Static)', file: 'init-sdk-static.js' },
  { name: 'Decide (Live, looped requests)', file: 'decide-loop-sync-live.js' },
  { name: 'Decide (Stale, looped requests)', file: 'decide-loop-sync-stale.js' },
  { name: 'Decide (Static, looped requests)', file: 'decide-loop-sync-static.js' },
  { name: 'Decide (Static, first request)', file: 'decide-sync-static.js' }, // Eliminates 5ms loop time in other decide tests
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
