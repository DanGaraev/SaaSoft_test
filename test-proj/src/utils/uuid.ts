export function useRandomUuid() {
    return `${ Date.now() }-${ Math.random().toString().replace('.', '') }`;
}