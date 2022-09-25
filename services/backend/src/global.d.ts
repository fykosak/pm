declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            DIRECTORY_ROOT: string;
        }
    }
}

export {}
