import fsp from "fs/promises";
import {Directory} from "../directory/directory";

export async function getLogHelper(directory: Directory) {
    try {
        const buffer = await fsp.readFile(directory.getPath("main.log"), {encoding: 'utf8'});
        return buffer.toString();
    } catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        } else {
            throw error;
        }
    }
}
