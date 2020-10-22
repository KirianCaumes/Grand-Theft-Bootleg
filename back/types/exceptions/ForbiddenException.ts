export default class ForbiddenException {
    message?: string

    constructor(message?: string) {
        this.message = message
    }
}