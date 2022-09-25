import {Directory} from "./directory";
import path from "path";
import { promises as fsp } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class DirectoryManager {
    public rootDirectory: string;

    constructor(rootDirectory: string) {
        this.rootDirectory = rootDirectory;
    }

    async create(category: string = "default", name: string|null = null): Promise<Directory> {
        const directoryPath = path.join(
            this.rootDirectory,
            category,
            name ? `${name}-${uuidv4()}` : uuidv4()
        );
        await fsp.mkdir(directoryPath, {recursive: true});
        return new Directory(directoryPath);
    }
}
