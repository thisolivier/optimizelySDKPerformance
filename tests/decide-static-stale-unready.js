// tests/decide-stale-unready.js
const fs = require('fs');
const decisionsFromColdStartHelper = require('./helper_decision');
const { staleDatafilePath, sdkKey } = require('../config');

const datafile = JSON.parse(fs.readFileSync(staleDatafilePath, 'utf-8'));
const outputFile = 'decisions-stale-unready.csv';
const RUNS = 50;

let runCount = 0;

function runNext() {
  runCount++;

  const isFirstRun = runCount === 1;
  decisionsFromColdStartHelper({
    clientConfig: {
      sdkKey,
      datafile,
      datafileOptions: { 
        urlTemplate: `https://cdn.optimizely.com/datafiles/${sdkKey}.json?nocache=${Date.now()}`,
        autoUpdate: true 
      }
    },
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
