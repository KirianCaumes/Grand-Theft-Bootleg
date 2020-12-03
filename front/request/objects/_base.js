/**
 * Base object
 * @abstract
 */
export class Base {
    toJson() {
        return JSON.parse(JSON.stringify(this))
    }
}