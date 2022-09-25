import {PreviewController} from "./preview-controller";
import {Request, Response} from "express";
import {FksEmptyJob} from "../job/fks-empty-job";
import JSZip from "jszip";

export class FksEmptyPreviewController extends PreviewController {
    async handle(request: Request, response: Response) {
        const directory = await this.directoryManager.create("preview", "fks-empty");
        const job = new FksEmptyJob(directory);
        job.setJobExecutor(this.jobExecutor);
        job.setTex(request.body.texSource as string);
        job.setLanguage(request.body.language as string ?? "cs");
        await job.execute();

        const zip = new JSZip();

        if (job.isSucceeded()) {
            zip.file("result.pdf", job.getPdf()!);
        }

        zip.file("tex-log.txt", await job.getLog() ?? "");

        const result = await zip.generateAsync({type: "nodebuffer"});
        response.status(job.isSucceeded() ? 200 : 400).end(result);

        await directory.destroy();
    }
}
