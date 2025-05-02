const decisionsFromColdStartHelper = require('./helper_decision');
const { sdkKey } = require('../config');

const outputFile = 'decisions-live-unready.csv';
const RUNS = 50;

let runCount = 0;

function runNext() {
  runCount++;

  const isFirstRun = runCount === 1;
  decisionsFromColdStartHelper({
    clientConfig: { 
      sdkKey,
      datafileOptions: {
        urlTemplate: `https://cdn.optimizely.com/datafiles/${sdkKey}.json?nocache=${Date.now()}`
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
