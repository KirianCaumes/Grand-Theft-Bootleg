/**
 * AuthentificationError Error when 401 JWT expired or so
 */
export class AuthentificationError extends Error {
    /**
     * @param {string} description 
     */
    constructor(description) {
        super(description)
        this.name = this.constructor.name
    }
}