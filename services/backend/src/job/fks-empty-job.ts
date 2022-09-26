import {promises as fsp} from 'fs';
import path from "path";
import {TexJob} from "./tex-job";

export type FksEmptyJobSupportedTypes = "empty" | "serial";

export class FksEmptyJob extends TexJob {
    private tex: string;
    private language: string = "cs";
    private type: FksEmptyJobSupportedTypes = "empty";

    setTex(tex: string) {
        this.tex = tex;
    }

    setLanguage(language: string) {
        this.language = language;
    }

    setType(type: FksEmptyJobSupportedTypes) {
        this.type = type;
    }

    async prepare() {
        let contents: string = "";
        if (this.type === "empty") {
            contents = `\\documentclass[${this.language !== "cs" ? "english" : "czech"}]{fksempty}\n` +
                "\\usepackage[utf8]{inputenc}\n" +
                "\\begin{document}\n" +
                "\\input{source}\n" +
                "\\end{document}"
        } else if (this.type === "serial") {
            if (this.language === "cs") {
                contents= "\\documentclass[fykos]{fksseries}\n" +
                    "\\setcounter{year}{36}\n" +
                    "\\setcounter{batch}{1}\n" +
                    "\\begin{document}\n" +
                    "\\input{source}\n" +
                    "\\par\\makefooter\n" +
                    "\\end{document}";
            } else {
                contents = "\\documentclass[fykos,english]{fksseries}\n" +
                    "\\setcounter{year}{36}\n" +
                    "\\setcounter{batch}{1}\n" +
                    "\\makeatletter\\renewcommand\\met@headerseries[1]{\\centering \\includegraphics{logo3.eps}\\hspace{10pt}\\raisebox{0.6cm}{Serial: #1}}\\renewcommand\\seriesheading[1]{\\hypersetup{pdftitle={Serial \\Roman{year}.\\Roman{batch} #1, \\met@shortname}}\\fancyhead[R]{\\bfseries\\small Serial \\Roman{year}.\\Roman{batch} #1}\\section[#1]{\\met@headerseries{#1}}}\\makeatother\n" +
                    "\\begin{document}\n" +
                    "\\input{source}\n" +
                    "\\par\\makefooter\n" +
                    "\\end{document}";
            }
        }

        await fsp.writeFile(path.join(this.directory.path, "main.tex"), contents);
        await fsp.writeFile(this.directory.getPath("source.tex"), this.tex);
    }
}
