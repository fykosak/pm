import {Directory} from "../directory/directory";
import {AbortPauseController} from "../abort-pause-controller";
import {DoneContext, RunContext, Script, ScriptExecutor} from "../script-executor";

/**
 * SimpleJob represents a build process that produces PDFs and other artifacts
 * from raw data.
 */
export abstract class SimpleJob {
    public readonly directory: Directory;
    private jobExecutor!: ScriptExecutor;
    protected succeeded: boolean = false;

    constructor(directory: Directory) {
        this.directory = directory;
    }

    setJobExecutor(jobExecutor: ScriptExecutor) {
        this.jobExecutor = jobExecutor;
    }

    /**
     * Method that prepares the directory and runs the job.
     * @param abortPauseController
     */
    public async execute(abortPauseController?: AbortPauseController) {
        await this.prepare(abortPauseController);
        const execution = this.jobExecutor.schedule(this.getExecutionInfo());
        const runContext = await execution.untilRun();
        await this.onRunning(runContext);
        const doneContext = await execution.untilDone();
        await this.onDone(doneContext);
    }

    protected async prepare(abortPauseController?: AbortPauseController) {}

    /**
     * Called when the execution started
     * @protected
     */
    protected async onRunning(runContext: RunContext): Promise<void> {
        // Discard terminal output by default

        runContext.output.on("data", () => null);
        runContext.error.on("data", () => null);
    };

    protected async onDone(doneContext: DoneContext): Promise<void> {
        if (doneContext.exitCode === 0) {
            this.succeeded = true;
        }
    }

    public isSucceeded(): boolean {
        return this.succeeded;
    }

    public abstract getExecutionInfo(): Script;
}
