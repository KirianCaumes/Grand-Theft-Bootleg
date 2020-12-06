import Base from "./_base"

/**
 * Report Object
 */
export default class Report extends Base {
    /**
     * @param {object} data 
     * @param {object | number=} data.userId
     * @param {string | Date=} data.date
     * @param {string=} data.message
     */
    constructor({
        userId = null,
        date = null,
        message = null,
    } = {}) {
        super()
        this.userId = userId?.$oid ?? userId
        this.date = date
        this.message = message
    }
}

/**
 * Report Object used to bind error message
 */
export class ErrorReport {
    userId
    date
    message
}
