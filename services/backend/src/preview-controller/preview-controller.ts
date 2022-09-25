import {Request, Response} from "express";
import {DirectoryManager} from "../directory/directory-manager";
import {ScriptExecutor} from "../script-executor";

export abstract class PreviewController {
    protected directoryManager: DirectoryManager;
    protected jobExecutor: ScriptExecutor;

    constructor(directoryManager: DirectoryManager, jobExecutor: ScriptExecutor) {
        this.directoryManager = directoryManager;
        this.jobExecutor = jobExecutor;
    }

    /**
     * Main method that is called to handle a request and create a response.
     */
    public abstract handle(request: Request, response: Response);
}
