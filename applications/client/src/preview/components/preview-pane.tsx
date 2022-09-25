import {FC, useState} from "react";
import {Badge, Button, Card, Grid, Text} from "@nextui-org/react";
import {Div} from "../../utils/empty";
import {PdfViewer} from "../../components/pdf-viewer";
import * as React from "react";

export const PreviewPane: FC<{
    result: {
        file: ArrayBuffer | null,
        log: string | null,
    } | null
}> = ({result}) => {
    const [widthMultiplier, setWidthMultiplier] = useState(.8);
    const [viewMode, setViewMode] = useState<"pdf" | "log">("pdf");

    return <Grid xs={6} css={{pr: 0, pb: 0, backgroundColor: "$gray50", paddingTop: "$12", display: "flex", flexDirection: "column"}}>
        <Div css={{marginBottom: "$6", display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "0 $10"}}>
            <Div css={{display: "flex", flexDirection: "row"}}>
                <Button onPress={() => setViewMode("pdf")} auto css={{borderRadius: "$lg 0 0 $lg", backgroundColor: viewMode !== "pdf" ? "$accents5" : undefined}}>PDF</Button>
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
        {result?.file && viewMode === "pdf" && <PdfViewer pdf={result.file} widthMultiplier={widthMultiplier} />}
        {result?.log && viewMode === "log" && <Card variant="flat" css={{
            flexGrow: 1,
            display: "flex",
            height: 0
        }}>
            <Card.Body>
                <Text css={{whiteSpace: "pre", fontFamily: "monospace"}}>{result?.log}</Text>
            </Card.Body>
        </Card>}
    </Grid>;
};
