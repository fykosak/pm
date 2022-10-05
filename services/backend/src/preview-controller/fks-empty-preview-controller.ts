import {PreviewController} from "./preview-controller";
import {Request, Response} from "express";
import {FksEmptyJob, FksEmptyJobSupportedTypes} from "../job/fks-empty-job";
import JSZip from "jszip";

export class FksEmptyPreviewController extends PreviewController {
    async handle(request: Request, response: Response) {
        const abortController = new AbortController();
        response.on("close", () => abortController.abort());

        const directory = await this.directoryManager.create("preview", "fks-empty");

        try {
            const job = new FksEmptyJob(directory);
            job.setJobExecutor(this.jobExecutor);
            job.setTex(request.body.texSource as string);
            job.setLanguage(request.body.language as string ?? "cs");
            if (request.body.type) {
                job.setType(request.body.type as FksEmptyJobSupportedTypes);
            }


            await job.execute(abortController.signal);

            const zip = new JSZip();

            if (job.isSucceeded()) {
                zip.file("result.pdf", job.getPdf()!);
            }

            zip.file("tex-log.txt", await job.getLog() ?? "");

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
