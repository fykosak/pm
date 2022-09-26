import React, {FC} from "react";
import {Table, Text} from "@nextui-org/react";
import {Div} from "../utils/empty";

export interface Log {
    line: number;
    message: string;
    level: "error" | "warning";
}

const StatusBadge: FC<{type: string}> = ({type}) => {
    if (type === "error") {
        return <Text b color="error">error</Text>;
    }
    if (type === "warning") {
        return <Text b color="warning">warning</Text>;
    }
    return <Text b>{type}</Text>;
}

export const LogDetail: FC<{
    log: Log[]
}> = ({log}) => {
    return <Div>
        <Table
            css={{
                height: "auto",
                minWidth: "100%",
            }}
            aria-label={"Detail"}
        >
            <Table.Header>
                <Table.Column>Level</Table.Column>
                <Table.Column>Řádek</Table.Column>
                <Table.Column>Zpráva</Table.Column>
            </Table.Header>
            <Table.Body>
                {log.map((value, index) => <Table.Row key={index}>
                    <Table.Cell><StatusBadge type={value.level} /></Table.Cell>
                    <Table.Cell>{value.line}</Table.Cell>
                    <Table.Cell>{value.message}</Table.Cell>
                </Table.Row>)}
            </Table.Body>
        </Table>
    </Div>
}
