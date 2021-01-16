import Schema, { Type, unknown } from 'https://denoporter.sirjosh.workers.dev/v1/deno.land/x/computed_types/src/index.ts'
import { validator } from "./_base.validator.ts"
import imageFileValidation from "../helpers/validations/imageFile.validation.ts"

/**
 * Issue {@link https://github.com/neuledge/computed-types/issues/76}
 */
const fileValidationSchema = Schema({
    picture: unknown.transform(imageFileValidation)
})

type FileValidationType = Type<typeof fileValidationSchema>

export const fileValidator = async (file: FileValidationType): Promise<FileValidationType> =>
    await validator<typeof fileValidationSchema, FileValidationType>(fileValidationSchema, file, 'File not modified or created')

export type FileValidatorType = typeof fileValidator
