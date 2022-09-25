import {FksEmptyPreviewController} from "./fks-empty-preview-controller";
import {FksMetapostPreviewController} from "./fks-metapost-preview-controller";
import {PreviewController} from "./preview-controller";
import {DirectoryManager} from "../directory/directory-manager";
import {ScriptExecutor} from "../script-executor";
import {FksGnuplotPreviewController} from "./fks-gnuplot-preview-controller";

export const previewControllers = {
    "fks-empty": FksEmptyPreviewController,
    "fks-metapost": FksMetapostPreviewController,
    "fks-gnuplot": FksGnuplotPreviewController,
} as Record<string, { new(directoryManager: DirectoryManager, jobExecutor: ScriptExecutor): PreviewController }>;
