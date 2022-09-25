import {FC} from "react";
import {Button, Loading} from "@nextui-org/react";
import * as React from "react";

export const CompileButton: FC<{
    isRunning: boolean,
    run: () => void,
    abort: () => void,
}> = ({isRunning, run, abort}) => {
    return <Button onPress={isRunning ? abort : run} color={isRunning ? "error" : "default"}>
        {isRunning ? <>
            <Loading type="points" color="currentColor" size="sm" css={{mr: "$5 !important"}} />
            Zastavit
        </> : "Zkompilovat (ctrl+s)"}
    </Button>
}
