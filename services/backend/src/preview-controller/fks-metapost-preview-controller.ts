import {PreviewController} from "./preview-controller";
import {Request, Response} from "express";
import {FksMetapostJob} from "../job/fks-metapost-job";
import JSZip from "jszip";

export class FksMetapostPreviewController extends PreviewController {
    async handle(request: Request, response: Response) {
        const abortController = new AbortController();
        response.on("close", () => abortController.abort());

        const directory = await this.directoryManager.create("preview", "fks-metapost");

        try {
            const job = new FksMetapostJob(directory);
            job.setJobExecutor(this.jobExecutor);
            job.setData(request.body.metapostSource as string);
            await job.execute();

            const zip = new JSZip();

            if (job.isSucceeded()) {
                zip.file("result.pdf", job.getPdf()!);
            }

            zip.file("metapost-log.txt", await job.getMetapostLog() ?? "");

            const result = await zip.generateAsync({type: "nodebuffer"});
            response.status(job.isSucceeded() ? 200 : 400).end(result);
        } catch (e) {
            if (e.code === 'ABORT_ERR') {
                // operation aborted
            } else {
                throw e;
            }
        } finally {
            await directory.destroy();
        }
    }
}
