import * as React from "react";
import {FC} from "react";
import MonacoEditor from "@monaco-editor/react";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import * as styles from "./editor.module.css";
import { Div } from "../../utils/empty";

function handleEditorWillMount(monaco) {
    monaco.editor.defineTheme('myCustomTheme', {
        base: 'vs', // can also be vs-dark or hc-black
        inherit: false, // can also be false to completely replace the builtin rules
        rules: [
            { token: 'comment', foreground: '00a500', fontStyle: 'italic underline' },
            { token: 'comment.js', foreground: '008800', fontStyle: 'bold' },
            { token: 'comment.css', foreground: '0000ff' } // will inherit fontStyle from `comment` above
        ],
        colors: {
            // 'editor.background': '#f1f3f5',
        }
    });

}

monaco.editor.defineTheme('myCustomTheme', {
    base: 'vs', // can also be vs-dark or hc-black
    inherit: true, // can also be false to completely replace the builtin rules
    rules: [
        { token: 'comment', foreground: '00a500', fontStyle: 'italic underline' },
        { token: 'comment.js', foreground: '008800', fontStyle: 'bold' },
        { token: 'comment.css', foreground: '0000ff' } // will inherit fontStyle from `comment` above
    ],
    colors: {
        'editor.background': '#000000',
    }
});

export const Editor: FC<{
    refs: React.MutableRefObject<{ editor: monaco.editor.IStandaloneCodeEditor } | undefined>,
    defaultValue: string,
}> = (props) => {
    return <Div css={{flexGrow: 1, height: 0, display: "flex"}}>
        <MonacoEditor
            onMount={editor => props.refs.current = {editor}}
            className={styles.editor}
            defaultLanguage="tex"
            theme={"myCustomTheme"}
            defaultValue={props.defaultValue}
            beforeMount={handleEditorWillMount}
            options={{
                wordWrap: "on",
                minimap: {
                    enabled: false
                },
                insertSpaces: false,
            }}
        />
    </Div>;
}
