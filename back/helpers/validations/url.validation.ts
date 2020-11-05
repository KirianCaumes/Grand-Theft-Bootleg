/** Check if valid date */
export default function urlValidation(input: unknown): string {
    try {
        const url = new URL(input as string)
        if (url.protocol !== "http:" && url.protocol !== "https:")
            throw new TypeError(`Invalid URL"`)
        return input as string
    } catch (error) {
        throw new TypeError(`Invalid URL`)
    }
}