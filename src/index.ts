import * as readline from 'readline';
import * as util from './lib';

type GulpLike = util.GulpLike;
type ReplInstance = util.ReplInstance;

let repl: readline.Interface | null = null;
let instances: ReplInstance[] = [];

export interface GulpReplApi {
  get: (gulp?: GulpLike) => ReplInstance[] | ReplInstance | null;
  add: (_gulp_: GulpLike | null | undefined) => GulpReplApi;
  reset: () => GulpReplApi;
  remove: (_gulp_: GulpLike) => GulpReplApi;
  start: (_gulp_?: GulpLike) => readline.Interface;
}

const api: GulpReplApi = {
  // get the instance properties used by the REPL
  get(gulp?: GulpLike): ReplInstance[] | ReplInstance | null {
    if (!arguments.length || gulp === undefined) {
      return instances.concat();
    }

    const length = instances.length;

    for (let index = 0; index < length; ++index) {
      const instance = instances[index] || ({} as ReplInstance);
      if (instance.gulp === gulp) {
        return instance;
      }
    }

    return null;
  },

  // add the given instance to the REPL lookup
  add(_gulp_: GulpLike | null | undefined): GulpReplApi {
    if (_gulp_ && !api.get(_gulp_)) {
      const gulp = util.getGulp(_gulp_);

      instances.push({
        gulp,
        index: instances.length,
        tasks: util.getTasks(gulp),
        runner: (gulp.start || gulp.parallel) as (...tasks: string[]) => (() => void) | void,
      });
    }
    return api;
  },

  // reset the instances array
  reset(): GulpReplApi {
    instances = [];
    return api;
  },

  // remove the instance from the instances array
  remove(_gulp_: GulpLike): GulpReplApi {
    const instance = api.get(_gulp_);
    if (instance && !Array.isArray(instance)) {
      instances.splice(instance.index, 1);
    }
    return api;
  },

  // create a readline instance if there is none
  start(_gulp_?: GulpLike): readline.Interface {
    api.add(_gulp_);

    // only create one repl listening on stdin
    if (repl) {
      return repl;
    }

    repl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      completer(line: string) {
        return util.completer(line, instances);
      },
    });

    // queue tasks when line is not empty
    repl.on('line', (input: string) => {
      const line = input.trim();
      if (!line) {
        repl!.prompt();
        return;
      }

      const queue: { found: Array<{ inst: ReplInstance; tasks: string[] }>; notFound: string[] } = {
        found: [],
        notFound: line.split(/[ ]+/),
      };

      instances.forEach((inst) => {
        const tasks = util.getQueue(queue.notFound.join(' '), inst.tasks);
        if (tasks.found.length) {
          queue.found.push({ inst, tasks: tasks.found });
        }
        queue.notFound = tasks.notFound;
      });

      if (queue.notFound.length) {
        console.log(' `%s` not found', queue.notFound.join(' '));
        repl!.prompt();
        return;
      }

      queue.found.forEach((found) => {
        const result = found.inst.runner.apply(
          found.inst.gulp,
          found.tasks
        ) as (() => void) | void;
        if (typeof result === 'function') {
          result(); // gulp#4.0
        }
      });
    });

    // exit on SIGINT
    repl.on('SIGINT', () => {
      process.stdout.write('\n');
      process.exit(0);
    });

    return repl;
  },
};

export default api;
