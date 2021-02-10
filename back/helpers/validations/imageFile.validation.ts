import { FormDataFile } from "https://deno.land/x/oak@v6.3.2/multipart.ts"

/** Check if valid fail image */
export default function imageFileValidation(input: unknown): FormDataFile {
    const file = input as FormDataFile

    if (!file)
        throw new TypeError(`No file found.`)

    if (!file.content)
        throw new TypeError(`File is too big. It should be lower than 3mb.`)

    if (!file.originalName)
        throw new TypeError(`File does not have a valid name.`)

    const validFormat = ['image/png', 'image/jpeg']
    if (!validFormat.includes(file.contentType))
        throw new TypeError(`Format '${file.contentType}' is invalid. Select one between ${validFormat.map(x => `'${x}'`).join(', ')}`)

    return file
}