import Schema, { string, Type } from 'https://denoporter.sirjosh.workers.dev/v1/deno.land/x/computed_types/src/index.ts'
import { validator } from "./_base.validator.ts"

const reportValidationSchema = Schema({
    // userId
    // date
    message: string.trim().normalize().between(5, 255)
})

type ReportValidationType = Type<typeof reportValidationSchema>

export const reportValidator = async (report: ReportValidationType): Promise<ReportValidationType> =>
    await validator<typeof reportValidationSchema, ReportValidationType>(reportValidationSchema, report, 'Report not modified or created')

export type ReportValidatorType = typeof reportValidator
