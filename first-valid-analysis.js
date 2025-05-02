const fs = require('fs');
const path = require('path');

// 🔧 Change this to your actual file path if needed
let inputFiles = [
  path.join('./results', 'decisions-live-unready.csv'),
  path.join('./results', 'decisions-stale-unready.csv'),
  path.join('./results_2', 'decisions-live-unready.csv'),
  path.join('./results_2', 'decisions-stale-unready.csv'),
  path.join('./results_3', 'decisions-live-unready.csv'),
  path.join('./results_3', 'decisions-stale-unready.csv')
]

for (index in inputFiles) {
  let inputFile = inputFiles[index]
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ File not found: ${inputFile}`);
    process.exit(1);
  }
  
  const raw = fs.readFileSync(inputFile, 'utf-8');
  const lines = raw.trim().split('\n').slice(1); // skip header
  
  const seenRuns = new Set();
  
  console.log('RunNumber,Duration_ms');
  
  for (const line of lines) {
    const [runStr, , , timeStr , variation] = line.split(',');
    const run = parseInt(runStr);
    const time = parseFloat(timeStr);
  
    if (!seenRuns.has(run) && variation !== 'null') {
      console.log(`${run},${time.toFixed(3)}`);
      seenRuns.add(run);
    }
  }
}


