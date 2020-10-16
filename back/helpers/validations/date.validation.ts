/** Check if valid date */
export default function dateValidation(input: unknown): Date {
    const dt = new Date(input as string)
    if (Object.prototype.toString.call(dt) !== '[object Date]')
        throw new TypeError(`Invalid date: "${input}"`)
    return dt
}