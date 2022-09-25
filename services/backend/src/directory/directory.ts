import { promises as fsp } from 'fs';
import path from "path";

/**
 * Filesystem directory adapter
 */
export class Directory {
    public path: string;

    constructor(path: string) {
        this.path = path;
    }

    getPath(...parts: string[]) {
        return path.join(this.path, ...parts);
    }

    async destroy() {
        await fsp.rm(this.path, {recursive: true});
    }
}
