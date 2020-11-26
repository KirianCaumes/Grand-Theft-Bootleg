/** Check if valid date */
export default function urlValidation(input: string): string {
    try {
        const url = new URL(input)
        if (url.protocol !== "http:" && url.protocol !== "https:")
            throw new TypeError(`Invalid URL"`)
        return input
    } catch (error) {
        throw new TypeError(`Invalid URL`)
    }
}