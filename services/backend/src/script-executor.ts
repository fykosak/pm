import {spawn} from "child_process";
import {Directory} from "./directory/directory";
import {AbortPauseController} from "./abort-pause-controller";

/**
 * Description on how to create a container for the script execution
 */
export interface Script {
    directory: Directory,
    mountPoint: string,
    container: string,
    commands: string[],
}

export interface RunContext {
    output: NodeJS.ReadableStream;
    error: NodeJS.ReadableStream;
}

export interface DoneContext {
    exitCode: number;
}

// Vystup
export class ScriptExecution {
    private readonly runPromise: Promise<RunContext>;
    private readonly donePromise: Promise<DoneContext>;


    constructor(
        runPromise: Promise<RunContext>,
        donePromise: Promise<DoneContext>
    ) {
        this.runPromise = runPromise;
        this.donePromise = donePromise;
    }

    public untilRun = () => this.runPromise;
    public untilDone = () => this.donePromise;
}

/**
 * Executes script in a Docker container.
 */
export class ScriptExecutor {
    /**
     * Schedules and later executes the script.
     */
    public schedule(script: Script, abortPauseController?: AbortPauseController): ScriptExecution {
        let run: Promise<RunContext>;
        const done = new Promise<DoneContext>((resolveDone, errorDone) => {
            run = new Promise(resolveRun => {
                const child = spawn(
                    "docker",
                    [
                        "run",
                        "-i",
                        "--rm",
                        "-v", script.directory.path + ":" + script.mountPoint,
                        script.container,
                    ]
                );

                resolveRun({
                    output: child.stdout,
                    error: child.stderr,
                });

                child.stdin.write(script.commands.join("\n") + "\n");
                child.stdin.end();

                child.on('exit', (statusCode: number) => {
                    resolveDone({exitCode: statusCode});
                });
                child.on('error', (error: Error) => {
                    errorDone(error);
                });
            });
        });
        return new ScriptExecution(run!, done);
    }
}
