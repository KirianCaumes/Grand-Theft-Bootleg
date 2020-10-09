/**
 * User Object
 */
export class User {
    /**
     * @param {object} data 
     * @param {number=} data.id
     * @param {string=} data.name
     * @param {string=} data.firstname
     * @param {string=} data.email
     * @param {string=} data.workPlace
     * @param {number=} data.managerId
     * @param {object=} data.manager
     * @param {string=} data.job
     * @param {Date=} data.hiredDate
     * @param {boolean=} data.isAdmin
     * @param {boolean=} data.isManager
     * @param {string=} data.token //User JWT token
     */
    constructor({
        id = 0,
        firstname = null,
        name = null,
        email = null,
        workPlace = null,
        hiredDate = null,
        managerId = null,
        job = null,
        isAdmin = null,
        isManager = null,
        manager = null,
        token = null,
    } = {}) {
        this.id = id
        this.firstname = firstname
        this.name = name
        this.email = email
        this.workPlace = workPlace
        this.hiredDate = hiredDate
        this.managerId = managerId
        this.job = job
        this.isAdmin = isAdmin
        this.isManager = isManager
        this.manager = manager ? new User(manager) : null
        this.token = token
    }
}

/**
 * User Object used to bind error message
 */
export class ErrorUser {
    id
    firstname
    name
    email
    workPlace
    hiredDate
    managerId
    job
    isAdmin
    isManager
}
