export default class ValidationException {
    validationRows?: ValidationRow[]

    constructor(validationRows?: ValidationRow[]) {
        this.validationRows = validationRows
    }
}

export class ValidationRow {
    errorMessage: string
    memberName: string[]

    constructor(errorMessage: string, memberName: string[]) {
        this.errorMessage = errorMessage
        this.memberName = memberName
    }
}