/**
 * Text Splitter Utility ported from LangChain's RecursiveCharacterTextSplitter.
 * Essential for RAG-based AI Agent workflows.
 */

export class RecursiveCharacterTextSplitter {
    constructor({ chunkSize = 1000, chunkOverlap = 200, separators = ["\n\n", "\n", " ", ""] } = {}) {
        this.chunkSize = chunkSize;
        this.chunkOverlap = chunkOverlap;
        this.separators = separators;
    }

    splitText(text) {
        const finalChunks = [];
        const splits = this._split(text, this.separators);

        let currentChunk = "";
        for (const split of splits) {
            if (currentChunk.length + split.length > this.chunkSize) {
                if (currentChunk) finalChunks.push(currentChunk.trim());

                // Handle overlap
                const overlapStart = Math.max(0, currentChunk.length - this.chunkOverlap);
                currentChunk = currentChunk.substring(overlapStart) + split;
            } else {
                currentChunk += split;
            }
        }

        if (currentChunk) finalChunks.push(currentChunk.trim());
        return finalChunks;
    }

    _split(text, separators) {
        if (separators.length === 0) return [text];

        const separator = separators[0];
        const nextSeparators = separators.slice(1);
        const parts = text.split(separator);

        const finalParts = [];
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLast = i === parts.length - 1;

            if (part.length > this.chunkSize && nextSeparators.length > 0) {
                finalParts.push(...this._split(part, nextSeparators));
            } else {
                finalParts.push(part + (isLast ? "" : separator));
            }
        }
        return finalParts;
    }

    splitDocuments(documents) {
        const chunks = [];
        for (const doc of documents) {
            const textChunks = this.splitText(doc.pageContent || doc.text || "");
            textChunks.forEach((chunk, i) => {
                chunks.push({
                    pageContent: chunk,
                    metadata: { ...doc.metadata, chunkIndex: i }
                });
            });
        }
        return chunks;
    }
}
