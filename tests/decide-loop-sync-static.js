// tests/decide-stale-unready.js
const fs = require('fs');
const decisionsFromColdStartHelper = require('./helper_decision');
const { staticDatafilePath } = require('../config');

const datafile = JSON.parse(fs.readFileSync(staticDatafilePath, 'utf-8'));
const outputFile = 'decisions-static-unready.csv';
const RUNS = 50;

let runCount = 0;

function runNext() {
  runCount++;

  const isFirstRun = runCount === 1;
  decisionsFromColdStartHelper({
    clientConfig: { datafile },
    outputFilename: outputFile,
    runNumber: runCount,
    clearFile: isFirstRun,
    append: !isFirstRun,
    onComplete: () => {
      if (runCount < RUNS) {
        runNext(); // schedule next run
      } else {
        console.log(`🎉 Completed ${RUNS} runs.`);
        process.exit(0);
      }
    }
  });
}

runNext();
