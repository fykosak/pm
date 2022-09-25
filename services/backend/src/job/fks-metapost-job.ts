import fs, {promises as fsp} from 'fs';
import {SimpleJob} from "./simple-job";
import {Script} from "../script-executor";
import path from "path";
import {getLogHelper} from "./helpers";

export class FksMetapostJob extends SimpleJob {
    protected data: string | null = null;

    public setData(data: string) {
        this.data = data;
    }

    async prepare() {
        await fsp.writeFile(path.join(this.directory.path, "main.mp"), this.data ?? "");
    }

    getExecutionInfo(): Script {
        return {
            directory: this.directory,
            commands: [
                "mpost -interaction nonstopmode -s 'outputtemplate=\"%j.%o\"' main.mp",
                "epstopdf main.eps --outfile=main.pdf"
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

    getMetapostLog(): Promise<string | null> {
        return getLogHelper(this.directory);
    }
}
