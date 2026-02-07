export interface GulpLike {
  task?: (name: string, fn?: (cb?: () => void) => void) => void;
  start?: (...tasks: string[]) => (() => void) | void;
  parallel?: (...tasks: string[]) => (() => void) | void;
  _registry?: {
    _tasks?: Record<string, unknown>;
  };
  tasks?:
    | Record<string, unknown>
    | {
        store?: Record<string, unknown>;
        get?: (line: string, name?: string) => { match: string } | null;
      };
}

export interface TasksObject {
  obj: Record<string, unknown>;
  get: (line: string, name?: string) => { match: string } | null;
}

export interface QueueResult {
  found: string[];
  notFound: string[];
}

export interface ReplInstance {
  gulp: GulpLike;
  index: number;
  tasks: TasksObject;
  runner: (...tasks: string[]) => (() => void) | void;
}

// return a gulp-like instance, require gulp if not given
export function getGulp(gulp?: GulpLike | null): GulpLike {
  if (!gulp || typeof gulp.task !== 'function') {
    try {
      gulp = require('gulp') as GulpLike;
    } catch {
      console.log('gulp is not installed locally');
      console.log('try `npm install gulp`');
      process.exit(1);
    }
  }
  return gulp;
}

// get the tasks for the given instance
export function getTasks(gulp: GulpLike): TasksObject {
  const obj = (
    (gulp._registry && gulp._registry._tasks) ||
    (gulp.tasks && (gulp.tasks as { store?: Record<string, unknown> }).store) ||
    (gulp.tasks as Record<string, unknown>)
  ) as Record<string, unknown> ?? {};

  const tasksObj = gulp.tasks as { get?: (line: string) => { match: string } | null } | undefined;
  const get =
    typeof tasksObj?.get === 'function'
      ? (line: string) => tasksObj!.get!(line)
      : (line: string, name?: string) => {
          const o = obj as Record<string, { match?: string }>;
          return (
            (o[line] && { match: line }) ||
            (name && o[name] && { match: name }) ||
            null
          );
        };

  return { obj, get };
}

// get an object with of found/not found tasks to run
export function getQueue(line: string, tasks: TasksObject): QueueResult {
  const queue: QueueResult = { found: [], notFound: [] };

  while (line.length) {
    const match = /(^\S+)/.exec(line);
    const name = match ? match[1] : '';
    const task = tasks.get(line, name);

    if (task && task.match) {
      queue.found.push(task.match);
      line = line.slice(task.match.length).trim();
    } else {
      queue.notFound.push(name);
      line = line.slice(name.length).trim();
    }
  }

  return queue;
}

// return all instances completion for the given line
export function completer(
  line: string,
  instances: ReplInstance[]
): [string[], string] {
  const match = line.match(/([\s]+|^)\S+$/);

  if (match) {
    line = line.slice(match.index ?? 0, line.length).trim();
  }

  const completion: string[] = [];

  instances.forEach((instance) => {
    const matches = getQueue(line, instance.tasks);
    if (!matches.found.length) {
      Object.keys(instance.tasks.obj).forEach((name) => {
        const altMatch = name.match(/\(([^(]+)\)/) || [name];
        const alts = altMatch[altMatch.length - 1].split('|');
        matches.found.push(...alts);
      });
    }
    completion.push(...matches.found);
  });

  const hits = Array.from(new Set(completion)).filter((elem) => !elem.indexOf(line));

  return [hits.length ? hits : completion, line];
}
