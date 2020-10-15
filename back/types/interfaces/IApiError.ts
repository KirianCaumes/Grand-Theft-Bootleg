import { ValidationRow } from "../exceptions/ValidationException.ts";

export default interface IApiError {
    code?: string
    validationResults?: ValidationRow[]
}