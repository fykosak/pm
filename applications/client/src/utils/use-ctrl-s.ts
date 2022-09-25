import {useRef} from "react";
import * as React from "react";

/**
 * Hook to handle Ctrl+S
 */
export const useCtrlS = () => {
    const ref = useRef<() => void>(() => null);
    React.useEffect(() => {
        function handleKeyDown(e) {
            if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                ref.current?.();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    return ref;
}
