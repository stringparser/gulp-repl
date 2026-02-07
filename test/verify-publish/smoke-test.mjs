import replPkg from 'gulp-repl';
import gulp from 'gulp';

const repl = replPkg.default ?? replPkg;

// Create gulp instance and register a task
const gulpInst = gulp;
gulpInst.task('smoke-task', (cb) => {
  cb();
});

// Add gulp to repl
repl.add(gulpInst);

// Verify get returns the instance
const instance = repl.get(gulpInst);
if (!instance) throw new Error('Expected instance from get(gulp)');
if (instance.gulp !== gulpInst) throw new Error('Expected instance.gulp to match');

// Verify start returns readline interface
const rl = repl.start(gulpInst);
if (typeof rl.prompt !== 'function') throw new Error('Expected readline Interface with prompt');

// Verify reset
repl.reset();
if (repl.get().length !== 0) throw new Error('Expected empty instances after reset');

console.log('Smoke test passed');
