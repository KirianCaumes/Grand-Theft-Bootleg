import Base from "../_base"

/**
 * Bootleg Metadata
 */
export default class BootlegMeta extends Base {
    /**
     * @typedef {object} TotalType
     * @property {number=} global
     * @property {number=} band
     * @property {number=} song
     * 
     * @typedef {object} PageType
     * @property {number=} current
     * @property {number=} last
     * 
     * @param {object} data 
     * @param {TotalType=} data.total
     * @param {PageType=} data.page
     */
    constructor({
        total = null,
        page = {}
    } = {}) {
        super()
        this.total = total
        this.page = page
    }
}