export default class NotFoundException {
    errorMessage?: string
    constructor(errorMessage?: string) {
        this.errorMessage = errorMessage
    }
}