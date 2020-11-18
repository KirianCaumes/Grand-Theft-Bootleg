import { User } from "request/objects/user"

/**
 * Bootleg Object
 */
export class Bootleg {
    /**
     * @param {object} data
     * @param {number=} data.id
     * @param {number=} data.title
     * @param {boolean=} data.description
     */
    constructor({
        id = 0,
        title = null,
        description = null
    } = {}) {
        this.id = id
        this.title = title
        this.description = description
    }
}

/**
 * Bootleg Object used to bind error message
 */
export class ErrorBootleg {
    id
    title
    description
}