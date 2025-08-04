import {createRoot} from 'react-dom/client';
import {Navbar, NextUIProvider, styled, Text} from '@nextui-org/react';
import {FksEmpty} from './preview/fks-empty';
import {FksMetapost} from './preview/fks-metapost';
import * as React from "react";
import {Span} from "./utils/empty";
import {FksGnuplot} from "./preview/fks-gnuplot";

export const Box = styled("div", {
    boxSizing: "border-box",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
});

export const PageContent = styled("div", {
    flexGrow: 1,
    height: 0,
    display: "flex",
});

const App = () => {
    const [state, setState] = React.useState('tex');
    return (
        <NextUIProvider>
            <Box>
                <Navbar variant={"sticky"}>
                    <Navbar.Brand>
                        <Text b color="inherit" hideIn="xs">
                            <Span css={{color: "$primary"}}>tex</Span>.fykos.cz
                        </Text>
                    </Navbar.Brand>
                    <Navbar.Content variant={"highlight"}>
                        <Navbar.Link isActive={state === "tex"} onClick={() => setState("tex")}>TeX</Navbar.Link>
                        <Navbar.Link isActive={state === "metapost"} onClick={() => setState("metapost")}>Metapost</Navbar.Link>
                        <Navbar.Link isActive={state === "fks-gnuplot"} onClick={() => setState("fks-gnuplot")}>Gnuplot</Navbar.Link>
                    </Navbar.Content>
                    <Navbar.Content>
                    </Navbar.Content>
                </Navbar>
                <PageContent>
                    {state === "tex" && <FksEmpty />}
                    {state === "metapost" && <FksMetapost />}
                    {state === "fks-gnuplot" && <FksGnuplot />}
                </PageContent>
            </Box>
        </NextUIProvider>
    );
}

const app = document.getElementById("app");
createRoot(app!).render(<App />);
