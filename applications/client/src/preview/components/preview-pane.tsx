import * as React from "react";
import {FC, useMemo, useState} from "react";
import {Badge, Button, Card, Grid, Text} from "@nextui-org/react";
import {Div} from "../../utils/empty";
import {PdfViewer} from "../../components/pdf-viewer";
import {Log, LogDetail} from "../../components/log-detail";

export const PreviewPane: FC<{
    result: {
        file: ArrayBuffer | null,
        log: string | null,
        parsedLog?: Log | null,
    } | null,
    hasParsedLog?: boolean,
}> = ({result, hasParsedLog}) => {
    const [widthMultiplier, setWidthMultiplier] = useState(.8);

    const [intendedViewMode, setViewMode] = useState<"pdf" | "log" | "parsed-log">("pdf");
    const viewMode = useMemo(() => (intendedViewMode === "pdf" && result?.file === null) ? (hasParsedLog ? "parsed-log" : "log") : intendedViewMode, [result, intendedViewMode]);

    return <Grid xs={6} css={{pr: 0, pb: 0, backgroundColor: viewMode === "pdf" ? "$gray50" : undefined, paddingTop: "$12", display: "flex", flexDirection: "column"}}>
        <Div css={{marginBottom: "$6", display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "0 $10"}}>
            <Div css={{display: "flex", flexDirection: "row"}}>
                <Button onPress={() => setViewMode("pdf")} auto css={{borderRadius: "$lg 0 0 $lg", backgroundColor: viewMode !== "pdf" ? "$accents5" : undefined}} disabled={result?.file === null}>PDF</Button>
                {hasParsedLog && <Button onPress={() => setViewMode("parsed-log")} auto css={{borderRadius: "0", backgroundColor: viewMode !== "parsed-log" ? "$accents5" : undefined}}>Zprávy</Button>}
                <Button onPress={() => setViewMode("log")} auto css={{borderRadius: "0 $lg $lg 0", backgroundColor: viewMode !== "log" ? "$accents5" : undefined}}>Log</Button>

                {result && !result.file &&
                    <Div css={{display: "flex", marginLeft: "$12", alignItems: "center"}}>
                        <Badge color="error" disableOutline isInvisible={false}>Chyba, podívej se do logů</Badge>
                    </Div>
                }
            </Div>
            {viewMode === "pdf" &&
                <Button.Group css={{m: 0}}>
                    <Button onPress={() => setWidthMultiplier(widthMultiplier * 1.2)}>+</Button>
                    <Button onPress={() => setWidthMultiplier(widthMultiplier / 1.2)}>-</Button>
                </Button.Group>
            }
        </Div>
        {result?.parsedLog && viewMode === "parsed-log" &&
            <Div css={{mr: "$10"}}>
                <LogDetail log={result.parsedLog} />
            </Div>
        }
        {result?.file && viewMode === "pdf" && <PdfViewer pdf={result.file} widthMultiplier={widthMultiplier} />}
        {result?.log && viewMode === "log" && <Div css={{
            flexGrow: 1,
            display: "flex",
            height: 0,
        }}>
            <Card.Body>
                <Text css={{whiteSpace: "break-spaces", fontFamily: "monospace"}}>{result?.log}</Text>
            </Card.Body>
        </Div>}
    </Grid>;
};
