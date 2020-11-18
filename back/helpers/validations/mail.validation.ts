/** Check if valid mail */
export default function mailValidation(input: unknown): string {
    if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            .test((input as string)?.toLowerCase() ?? '')
    )
        throw new TypeError(`Invalid email`)

    return input as string
}