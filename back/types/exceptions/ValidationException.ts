export default class ValidationException {
    message?: string
    validationRows?: any

    constructor(message?: string, validationRows?: object) {
        this.message = message
        this.validationRows = validationRows
    }
}