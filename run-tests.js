// run-tests.js
const { exec } = require('child_process');
const fs = require('fs');

const RUNS = 10;
const TEST_COMMAND = 'node sdk-test.js';
const results = [];

function runTest(i) {
  return new Promise((resolve) => {
    console.log(`\n🔄 Starting test run ${i + 1}...`);

    const child = exec(TEST_COMMAND, (error, stdout, stderr) => {
      if (stderr) {
        console.error(`→ stderr: ${stderr.trim()}`);
      }

      if (error) {
        console.error(`❌ Run ${i + 1} failed with error: ${error.message}`);
        resolve(null);
        return;
      }

      const output = stdout.trim();
      console.log(`→ stdout: ${output}`);

      const match = output.match(/([\d.]+)\s*ms?/i);
      if (!match) {
        console.warn(`⚠️ Could not parse timing from: "${output}"`);
        resolve(null);
        return;
      }

      const ms = parseFloat(match[1]);
      if (isNaN(ms)) {
        console.warn(`⚠️ Parsed value was NaN`);
        resolve(null);
        return;
      }

      console.log(`✅ Run ${i + 1} complete: ${ms.toFixed(3)} ms`);
      results.push(ms);
      resolve();
    });
  });
}

(async () => {
  console.log(`📊 Starting ${RUNS} SDK readiness tests...`);

  for (let i = 0; i < RUNS; i++) {
    await runTest(i);
  }

  const successfulRuns = results.length;
  const failedRuns = RUNS - successfulRuns;

  console.log(`\n🎉 Completed all test runs.`);
  console.log(`✅ Successful: ${successfulRuns}`);
  console.log(`❌ Failed: ${failedRuns}`);

  if (successfulRuns > 0) {
    const csv = results.map((ms, i) => `${i + 1},${ms.toFixed(3)}`).join('\n');
    fs.writeFileSync('results.csv', `Run,Time_ms\n${csv}`);
    console.log(`📁 Saved results to results.csv`);
  } else {
    console.warn(`⚠️ No successful runs to write to file.`);
  }
})();
