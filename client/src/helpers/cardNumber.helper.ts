export function splitIntoChunks(value: string, chunkSize = 4): string[] {
    return value.match(new RegExp(`.{1,${chunkSize}}`, 'g')) ?? [];
};

export function maskNumber(value: string, show: boolean): string[] {
    const chunks = splitIntoChunks(value, 4);

    if (show) {
        return chunks;
    }

    return chunks.map((chunk, index) => {
        if (index === 0 || index === chunks.length - 1) {
            return chunk;
        }

        return '••••';
    });
};