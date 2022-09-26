import {promises as fsp} from 'fs';
import path from "path";
import {TexJob} from "./tex-job";

export class FksEmptyJob extends TexJob {
    private tex: string;
    private language: string;

    setTex(tex: string) {
        this.tex = tex;
    }

    setLanguage(language: string) {
        this.language = language;
    }

    async prepare() {
        let contents = `\\documentclass[${this.language !== "cs" ? "english" : "czech"}]{fksempty}\n` +
            "\\usepackage[utf8]{inputenc}\n" +
            "\\begin{document}\n" +
            "\\input{source}\n" +
            "\\end{document}"
        await fsp.writeFile(path.join(this.directory.path, "main.tex"), contents);
        await fsp.writeFile(this.directory.getPath("source.tex"), this.tex);
    }
}
