/**
 * Base object
 * @abstract
 */
export default class Base {
    toJson() {
        return JSON.parse(JSON.stringify(this))
    }
}