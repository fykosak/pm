import {Grid, Radio} from "@nextui-org/react";
import * as React from "react";
import {useRef} from "react";
// @ts-ignore
import exampleSource from "bundle-text:./examples/default-tex.txt";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {Editor} from "./components/editor";
import {useAbortableOperation} from "../utils/use-abortable-operation";
import JSZip from "jszip";
import {useCtrlS} from "../utils/use-ctrl-s";
import {Div} from "../utils/empty";
import {CompileButton} from "./components/compile-button";
import {PreviewPane} from "./components/preview-pane";

export const FksEmpty = () => {
    const editor = useRef<{editor: monaco.editor.IStandaloneCodeEditor}>();

    const [configurationMatrix, setConfigurationMatrix] = React.useState({
        language: "cs",
    });

    const {result, run, abort, isRunning} = useAbortableOperation<{
        file: ArrayBuffer | null,
        log: string | null
    }>(async (setResult, abortSignal) => {
        const resource = await fetch(`${process.env.BACKEND}/preview/fks-empty`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    texSource: editor.current?.editor.getValue(),
                    ...configurationMatrix
                }),
                signal: abortSignal
            }
        );

        const zip = await (new JSZip().loadAsync(await resource.arrayBuffer()));

        setResult({
            file: await zip.file("result.pdf")?.async("arraybuffer") ?? null,
            log: await zip.file("tex-log.txt")?.async("string") ?? null,
        });
    }, [configurationMatrix]);

    const ctrlS = useCtrlS();
    ctrlS.current = run;

    return <Grid.Container gap={2} css={{}}>
        <Grid xs={6} direction={"column"} css={{gap: "$10", paddingTop: "$12"}}>
            <Div css={{display: "flex", justifyContent: "space-between", padding: "0 $10"}}>
                <div>
                    <Radio.Group
                        orientation="horizontal"
                        label="Jazyk dokumentu"
                        value={configurationMatrix.language}
                        onChange={value => setConfigurationMatrix({...configurationMatrix, language: value})}
                    >
                        <Radio value="cs">český</Radio>
                        <Radio value="en">anglický</Radio>
                    </Radio.Group>
                </div>
                <div>
                    <CompileButton isRunning={isRunning} run={run} abort={abort} />
                </div>
            </Div>
            <Editor
                refs={editor}
                defaultValue={exampleSource}
            />
        </Grid>
        <PreviewPane result={result} />
    </Grid.Container>
}
