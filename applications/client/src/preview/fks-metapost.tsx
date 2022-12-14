import {Card, Grid, Text} from "@nextui-org/react";
import * as React from "react";
import {useRef} from "react";
// @ts-ignore
import exampleSource from "bundle-text:./examples/default-metapost.txt";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {Editor} from "./components/editor";
import JSZip from "jszip";
import {Div} from "../utils/empty";
import {useCtrlS} from "../utils/use-ctrl-s";
import {useAbortableOperation} from "../utils/use-abortable-operation";
import {CompileButton} from "./components/compile-button";
import {PreviewPane} from "./components/preview-pane";
import useLocalStorage from "../utils/use-local-storage";

export const FksMetapost = () => {
    const editor = useRef<{editor: monaco.editor.IStandaloneCodeEditor}>();

    const [editorDefaultValue, setEditorDefaultValue] = useLocalStorage(
        "preview/metapost/source",
        exampleSource
    );

    const {result, run, abort, isRunning} = useAbortableOperation<{
        file: ArrayBuffer | null,
        log: string | null
    }>(async (setResult, abortSignal) => {
        setEditorDefaultValue(editor.current?.editor.getValue()!);
        const resource = await fetch(`${process.env.BACKEND}/preview/fks-metapost`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    metapostSource: editor.current?.editor.getValue()
                }),
                signal: abortSignal
            }
        );

        const zip = await (new JSZip().loadAsync(await resource.arrayBuffer()));

        setResult({
            file: await zip.file("result.pdf")?.async("arraybuffer") ?? null,
            log: await zip.file("metapost-log.txt")?.async("string") ?? null,
        });
    }, []);

    const ctrlS = useCtrlS();
    ctrlS.current = run;

    return <Grid.Container gap={2} css={{}}>
        <Grid xs={6} direction={"column"} css={{gap: "$10", paddingTop: "$12"}}>
            <Div css={{display: "flex", justifyContent: "space-between", padding: "0 $10"}}>
                <div>
                </div>
                <div>
                    <CompileButton isRunning={isRunning} run={run} abort={abort} />
                </div>
            </Div>
            <Editor
                refs={editor}
                defaultValue={editorDefaultValue}
            />
            <Card variant="flat" css={{overflow: "initial"}}>
                <Card.Body>
                    <Text color={"$neutral"}>V??sledn?? zdrojov?? k??d obr??zku ulo?? do slo??ky <code>graphics</code> pod n??zvem s p????ponou <code>.src.mp</code>.</Text>
                </Card.Body>
            </Card>
        </Grid>
        <PreviewPane result={result} />
    </Grid.Container>
}
