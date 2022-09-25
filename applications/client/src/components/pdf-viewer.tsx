import * as React from "react";
import {FC, useCallback, useEffect, useRef, useState} from "react";
import {Document, Page} from "react-pdf/dist/esm/entry.parcel2";
import {Container} from "@nextui-org/react";
import * as styles from "./pdf-viewer.module.scss";

const InnerPdf: FC<{
    pdf: any,
    width: number,
    onLoadFully?: () => void,
    hidden?: boolean,
}> = ({pdf, width, onLoadFully, hidden}) => {
    const [numPages, setNumPages] = useState(0);
    const pagesOk = useRef(0);

    const onDocumentLoadSuccess = useCallback(({ numPages: nextNumPages }) => {
        setNumPages(nextNumPages);
        pagesOk.current = 0;
    }, []);

    const incrementPagesOk = () => {
        pagesOk.current++;
        if (pagesOk.current === numPages) {
            onLoadFully?.();
        }
    }

    return <Document
        file={pdf}
        onLoadError={console.error}
        onLoadSuccess={onDocumentLoadSuccess}
        className={hidden ? styles.hidden : undefined}
    >
        {new Array(numPages).fill(0).map((_, index) =>
            <Container key={index} css={{margin: `${width/40}px`}}>
                <Page
                    pageNumber={index + 1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    renderInteractiveForms={false}
                    width={width}
                    onLoadSuccess={incrementPagesOk}
                />
            </Container>
        )}
    </Document>
}

export const PdfViewer: FC<{
    pdf: any,
    widthMultiplier: number,
}> = ({pdf, widthMultiplier}) => {
    const container = useRef(null);
    const [containerWidth, setContainerWidth] = useState(400);

    const pos = useRef({ top: 0, left: 0, x: 0, y: 0 });

    const [isGrabbing, setIsGrabbing] = useState(false);

    const [pdfCache, setPdfCache] = useState({
        pdf: pdf,
        isLoadedSecond: false,
    });

    const mouseMoveHandler = useCallback((e) => {
        // How far the mouse has been moved
        const dx = e.clientX - pos.current.x;
        const dy = e.clientY - pos.current.y;

        // Scroll the element
        container.current.scrollTop = pos.current.top - dy;
        container.current.scrollLeft = pos.current.left - dx;
    }, []);

    const mouseUpHandler = useCallback(() => {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);

        setIsGrabbing(false);
        container.current.style.removeProperty('user-select');
    }, []);

    const mouseDownHandler = useCallback((e) => {
        setIsGrabbing(true);

        pos.current = {
            // The current scroll
            left: container.current.scrollLeft,
            top: container.current.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    }, []);

    useEffect(() => {
        const ro = new ResizeObserver(entries => {
            for (let entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });

        ro.observe(container.current)
    });

    return <Container css={{display: "flex", flex: "1 1 auto", flexDirection: "column", p: 0}}>
        <Container
            ref={container}
            onMouseDown={mouseDownHandler}
            css={{
                cursor: isGrabbing ? "grabbing" : "grab",
                overflow: "auto",
                scrollbarGutter: "stable",
                alignItems: "center",
                flexGrow: 1,
                display: "flex",
                height: 0,
                ".react-pdf__Document" : {
                    margin: "auto",
                }
            }}
        >
            {(pdf !== pdfCache.pdf || !pdfCache.isLoadedSecond) &&
                <InnerPdf pdf={pdfCache.isLoadedSecond ? pdf : pdfCache.pdf} width={containerWidth * widthMultiplier} onLoadFully={() => setPdfCache({pdf, isLoadedSecond: false})} hidden={pdfCache.isLoadedSecond} />
            }
            {(pdf !== pdfCache.pdf || pdfCache.isLoadedSecond) &&
                <InnerPdf pdf={pdfCache.isLoadedSecond ? pdfCache.pdf : pdf} width={containerWidth * widthMultiplier} onLoadFully={() => setPdfCache({pdf, isLoadedSecond: true})} hidden={!pdfCache.isLoadedSecond}/>
            }
        </Container>
    </Container>
    ;
}
