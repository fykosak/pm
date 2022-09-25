import {SimpleJob} from "./simple-job";
import {Script} from "../script-executor";
import fs from "fs";
import {getLogHelper} from "./helpers";

export abstract class TexJob extends SimpleJob {
    protected succeeded: boolean = false;

    getExecutionInfo(): Script {
        return {
            directory: this.directory,
            commands: [
                "xelatex main.tex",
                "xelatex main.tex"
            ],
            mountPoint: "/usr/src/local",
            container: "fykosak/buildtools",
        }
    }

    getPdf(): fs.ReadStream | null {
        if (this.succeeded) {
            return fs.createReadStream(this.directory.getPath("main.pdf"));
        } else {
            return null;
        }
    }

    getLog(): Promise<string | null> {
        return getLogHelper(this.directory);
    }
}
