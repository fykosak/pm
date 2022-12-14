import {Card, Grid, Input, Radio, Text} from "@nextui-org/react";
import * as React from "react";
import {useRef} from "react";
// @ts-ignore
import exampleSource from "bundle-text:./examples/default-gnuplot.txt";
// @ts-ignore
import exampleSourceData from "bundle-text:./examples/default-gnuplot-data.txt";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {Editor} from "./components/editor";
import JSZip from "jszip";
import {Div} from "../utils/empty";
import {useCtrlS} from "../utils/use-ctrl-s";
import {useAbortableOperation} from "../utils/use-abortable-operation";
import {CompileButton} from "./components/compile-button";
import {PreviewPane} from "./components/preview-pane";
import useLocalStorage from "../utils/use-local-storage";

export const FksGnuplot = () => {
    const editor = useRef<{editor: monaco.editor.IStandaloneCodeEditor}>();
    const dataEditor = useRef<{editor: monaco.editor.IStandaloneCodeEditor}>();

    const [editorDefaultValue, setEditorDefaultValue] = useLocalStorage(
        "preview/gnuplot/source",
        exampleSource
    );

    const [dataEditorDefaultValue, setDataEditorDefaultValue] = useLocalStorage(
        "preview/gnuplot/data-source",
        exampleSourceData
    );

    const [configurationMatrix, setConfigurationMatrix] = useLocalStorage(
        "preview/gnuplot/configuration-matrix",
        {
            isColored: false,
            dataFileName: "data.src.dat",
        });

    const {result, run, abort, isRunning} = useAbortableOperation<{
        file: ArrayBuffer | null,
        log: string | null
    }>(async (setResult, abortSignal) => {
        setEditorDefaultValue(editor.current?.editor.getValue()!);
        setDataEditorDefaultValue(dataEditor.current?.editor.getValue()!);
        const resource = await fetch(`${process.env.BACKEND}/preview/fks-gnuplot`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gnuplotSource: editor.current?.editor.getValue(),
                    dataSource: dataEditor.current?.editor.getValue(),
                    ...configurationMatrix
                }),
                signal: abortSignal
            }
        );

        const zip = await (new JSZip().loadAsync(await resource.arrayBuffer()));

        setResult({
            file: await zip.file("result.pdf")?.async("arraybuffer") ?? null,
            log: await zip.file("full-log.txt")?.async("string") ?? null,
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
                        label="Barvy"
                        value={configurationMatrix.isColored ? "yes" : "no"}
                        onChange={value => setConfigurationMatrix({...configurationMatrix, isColored: value === "yes"})}
                    >
                        <Radio value={"no"}>monochromatick??</Radio>
                        <Radio value={"yes"}>barevn??</Radio>
                    </Radio.Group>
                </div>
                <div>
                    <CompileButton isRunning={isRunning} run={run} abort={abort} />
                </div>
            </Div>
            <Editor
                refs={editor}
                defaultValue={editorDefaultValue}
            />
            <Div css={{display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "0 $10"}}>
                <Text h3>Soubor s daty</Text>
                <Input
                    aria-label={"N??zev datov??ho souboru"}
                    value={configurationMatrix.dataFileName}
                    onChange={e => setConfigurationMatrix({...configurationMatrix, dataFileName: e.target.value})}
                />
            </Div>
            <Editor
                refs={dataEditor}
                defaultValue={dataEditorDefaultValue}
            />
            <Card variant="flat" css={{overflow: "initial"}}>
                <Card.Body>
                    <Text color={"$neutral"}>V??sledn?? soubory ulo?? do slo??ky <code>graphics</code> pod n??zvem s p????ponou <code>.src.plt</code> a <code>.src.dat</code>. Nap????klad jako <code>problem1-6_vprofil.src.plt</code>. Na graf se pak odk????e?? pomoc?? <code>{"\\plotfig{problem1-6_vprofil.tex}{Popisek}{REFERENCE}\n"}</code></Text>
                </Card.Body>
            </Card>
        </Grid>
        <PreviewPane result={result} />
    </Grid.Container>
}
