const fs = require('fs');
const path = require('path');
const resultsDir = './results';

function mean(arr) {
  return arr.reduce((sum, v) => sum + v, 0) / arr.length;
}

function stddev(arr) {
  const avg = mean(arr);
  const variance = arr.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

function summarize(name, values, summaryOut) {
  if (!values.length) {
    console.log(`📂 ${name}: No data`);
    summaryOut[name] = null;
    return;
  }
  const stats = {
    avg: mean(values),
    sd: stddev(values),
    min: Math.min(...values),
    max: Math.max(...values),
  };

  console.log(`📂 ${name}:`);
  console.log(`   ↳ avg: ${stats.avg.toFixed(3)} ms`);
  console.log(`   ↳ sd:  ${stats.sd.toFixed(3)} ms`);
  console.log(`   ↳ min: ${stats.min.toFixed(3)} ms`);
  console.log(`   ↳ max: ${stats.max.toFixed(3)} ms`);

  summaryOut[name] = stats;
}

function parseCSV(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.trim().split('\n').slice(1); // skip header
  return lines.map(line => line.split(','));
}

function analyzeFetchOrInit(fileName, summaryOut) {
  const rows = parseCSV(path.join(resultsDir, fileName));
  const times = rows.map(r => parseFloat(r[1]));
  summarize(fileName, times, summaryOut);
}

function analyzeDecisionFile(fileName, summaryOut) {
  const rows = parseCSV(path.join(resultsDir, fileName));
  const firstValidByRun = new Map();
  const validDurations = [];
  const invalidDurations = [];

  for (const [run, , timeSinceInit, duration, variation] of rows) {
    const runNumber = parseInt(run);
    const dur = parseFloat(duration);
    const time = parseFloat(timeSinceInit);

    if (variation !== 'null') {
      validDurations.push(dur);
      if (!firstValidByRun.has(runNumber)) {
        firstValidByRun.set(runNumber, time);
      }
    } else {
      invalidDurations.push(dur);
    }
  }

  summarize(`${fileName} → First valid decision time`, Array.from(firstValidByRun.values()), summaryOut);
  summarize(`${fileName} → Valid decision durations`, validDurations, summaryOut);
  summarize(`${fileName} → Invalid decision durations`, invalidDurations, summaryOut);
}

function main() {
  console.log(`📊 Analyzing results from: ${resultsDir}\n`);

  const files = fs.readdirSync(resultsDir);
  const summary = {};

  for (const file of files) {
    if (file.endsWith('.csv')) {
      if (/^datafile-fetch\.csv$/.test(file) || /^init-.*\.csv$/.test(file)) {
        analyzeFetchOrInit(file, summary);
      } else if (/^decisions-.*\.csv$/.test(file)) {
        analyzeDecisionFile(file, summary);
      } else if (/^decide-sync-static\.csv$/.test(file)) {
        const rows = parseCSV(path.join(resultsDir, file));
        const totalTimes = rows.map(r => parseFloat(r[1]));
        const decideTimes = rows.map(r => parseFloat(r[2]));
        const validOnly = rows.filter(r => r[3] !== 'null').map(r => parseFloat(r[2]));
        const invalidOnly = rows.filter(r => r[3] === 'null').map(r => parseFloat(r[2]));
      
        summarize(`${file} → Total time (init + decision)`, totalTimes, summary);
        summarize(`${file} → Decision-only time`, decideTimes, summary);
        summarize(`${file} → Valid decisions`, validOnly, summary);
        summarize(`${file} → Invalid decisions`, invalidOnly, summary);
      } else {
        console.log(`⚠️  Skipping unknown file: ${file}`);
      }
    }
  }

  const outputPath = path.join(resultsDir, 'summary.json');
  fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));
  console.log(`\n📝 Saved summary to ${outputPath}`);
  console.log(`\n✅ Analysis complete.`);
}

main();
