/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortController
 */
export class AbortPauseController {
    public readonly signal: AbortPauseSignal;

    constructor() {
        // Composition
        this.signal = new AbortPauseSignal();
    }

    public pause() {

    }

    public resume() {

    }

    public abort() {

    }
}

export class AbortPauseSignal {
    public aborted: boolean = false;
    public paused: boolean = false;

    public async throwOrWaitIfSignal() {

    }
}
