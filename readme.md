# About
This is a project designed to evaluate the performance of the Optimizely Web SDK. It was made quickly and as a one-off, so the architecture is piecemeal. Using this you can measure SDK initialisation speeds with and without preloaded datafiles, and you can test decision speeds.

## How to use
1. Clone this repo, navigate to its directory
2. Setup the config.js file and dowload your datafiles (you can use the samples included, but why would you).
3. Install optimizely with `$ npm install`
4. Run all the tests with `$ node main.js`
Tests take about 2mins to run. Results are stored in the results directory. 
5. Generate a summary by running `$ node result-analysis.js`

## Description of tests

**fetch-datafile.js** - Tests loading a datafile via a fetch request

**init-sdk-live.js** - Test SDK readiness speed with no preloaded datafile

**init-sdk-static.js** - Tests SDK readiness speed with a preloaded datafile

**decide-sync-static.js** - Tests end to end decision time including SDK initialisation when using a preloaded datafile (only first decision measured)

### Rapid looping tests
The following tests measure the time until a valid decision can be made by rapidly looping decide requests for 1s. Various secondary performance metrics gathered that can be used to evaluate average decision time.

**decide-loop-sync-live.js** - With no datafile provided.

**decide-loop-sync-stale.js** - With a stale datafile provided.

**decide-loop-sync-static.js** - With a up-to-date datafile provided.