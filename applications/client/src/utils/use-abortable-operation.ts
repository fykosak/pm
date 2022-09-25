import {DependencyList, useCallback, useRef, useState} from "react";

/**
 * Hook to run abortable operation.
 */
export const useAbortableOperation = <ResultType>(strategy: (setResult: (resul: ResultType) => void, abortSignal: AbortSignal) => Promise<void>, deps: DependencyList) => {
    const [result, setResult] = useState<ResultType | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const abort = useCallback(() => {
        abortControllerRef.current?.abort();
        setIsRunning(false);
    }, []);


    const run = useCallback(async () => {
        setIsRunning(true);
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        try {
            await strategy(setResult, abortController.signal);
        } catch (e) {
            if (e.name !== 'AbortError') {
                throw e;
            }
        } finally {
            setIsRunning(false);
        }
    }, deps);

    return {
        result,
        isRunning,
        abort,
        run,
    }
}
