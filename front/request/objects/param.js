/**
 * All param
 */
export class Param {
    /**
     * @param {object} data 
     */
    constructor(data = []) {
        /** @type {ParamElement[]} Def */
        this.workflows = []
        /** @type {ParamElement[]} Def */
        this.managers = []

        for (const param in data) {
            this[param] = data[param].map(x => new ParamElement(x))
        }
    }
}

/**
 * One Param Element
 */
export class ParamElement {
    /**
     * @param {object} data
     * @param {(string | number)=} data.key
     * @param {(string | number)=} data.text
     * @param {(string | number)=} data.color Used for WF
     */
    constructor({ key = 0, text = 0, color = undefined } = {}) {
        this.key = key
        this.text = text
        this.color = color
    }
}