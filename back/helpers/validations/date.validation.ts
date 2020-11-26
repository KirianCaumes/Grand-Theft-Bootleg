/** Check if valid date */
export default function dateValidation(input: string): Date {
    const dt = new Date(input)
    if (Object.prototype.toString.call(dt) !== '[object Date]' || isNaN(dt.getTime()))
        throw new TypeError(`Invalid date`)

    return dt
}