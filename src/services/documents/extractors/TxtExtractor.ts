export default class TxtExtractor {
    static extract(buffer: Buffer): string {
        let text: string;

        if (
            buffer.length >= 2 &&
            buffer[0] === 0xff &&
            buffer[1] === 0xfe
        ) {
            text = new TextDecoder("utf-16le", { fatal: true })
                .decode(buffer.subarray(2));
        } else if (
            buffer.length >= 2 &&
            buffer[0] === 0xfe &&
            buffer[1] === 0xff
        ) {
            text = new TextDecoder("utf-16be", { fatal: true })
                .decode(buffer.subarray(2));
        } else {
            text = new TextDecoder("utf-8", { fatal: true })
                .decode(buffer);
        }

        if (text.includes("\0")) {
            throw new Error("Invalid text file.");
        }

        return text.trim();
    }
}