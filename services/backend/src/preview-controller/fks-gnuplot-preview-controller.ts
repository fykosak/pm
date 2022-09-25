import {PreviewController} from "./preview-controller";
import {Request, Response} from "express";
import JSZip from "jszip";
import {FksGnuplotJob} from "../job/fks-gnuplot-job";

export class FksGnuplotPreviewController extends PreviewController {
    async handle(request: Request, response: Response) {
        const directory = await this.directoryManager.create("preview", "fks-gnuplot");
        const job = new FksGnuplotJob(directory);
        job.setJobExecutor(this.jobExecutor);
        job.setSource(request.body.gnuplotSource as string);
        job.setColored(request.body.isColored as boolean ?? false);
        job.setData(request.body.dataSource as string);
        job.setDataFileName(request.body.dataFileName as string);
        await job.execute();

        const zip = new JSZip();

        if (job.isSucceeded()) {
            zip.file("result.pdf", job.getPdf()!);
        }

        zip.file("full-log.txt", await job.getFullLog() ?? "");

        const result = await zip.generateAsync({type: "nodebuffer"});
        response.status(job.isSucceeded() ? 200 : 400).end(result);

        await directory.destroy();
    }
}
