import { EAuthStrategies } from "types/authStrategies"
import Base from "./_base"

/**
 * User Object
 */
export default class User extends Base {
    /**
     * @param {object} data 
     * @param {object=} data._id
     * @param {string=} data.username
     * @param {string=} data.password
     * @param {string=} data.mail
     * @param {number=} data.role
     * 
     * @param {string=} data.token 
     * 
     * @param {number=} data.strategy 
     * @param {any=} data.strategyData 
     */
    constructor({
        _id = null,
        username = null,
        password = null,
        mail = null,
        role = null,

        token = null,

        strategy = EAuthStrategies.CLASSIC,
        strategyData = null,
    } = {}) {
        super()
        this._id = _id?.$oid || _id
        this.username = username
        this.password = password
        this.mail = mail
        this.role = role

        this.token = token

        this.strategy = strategy
        this.strategyData = strategyData
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
