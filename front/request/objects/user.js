/**
 * User Object
 */
export class User {
    /**
     * @param {object} data 
     * @param {object=} data._id
     * @param {string=} data.username
     * @param {string=} data.password
     * @param {string=} data.mail
     * @param {number=} data.role
     * @param {string=} data.token 
     */
    constructor({
        _id = {},
        username = null,
        password = null,
        mail = null,
        role = null,
        token = null,
    } = {}) {
        this._id = _id?.$oid
        this.username = username
        this.password = password
        this.mail = mail
        this.role = role
        this.token = token
    }
}

/**
 * User Object used to bind error message
 */
export class ErrorUser {
    username
    password
    mail
    role
}
