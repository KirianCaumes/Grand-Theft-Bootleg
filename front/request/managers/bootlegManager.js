import { Bootleg, ErrorBootleg } from 'request/objects/bootleg'
import ApiManager from 'request/apiManager'

/**
 * BootlegManager
 * @extends {ApiManager<Bootleg, ErrorBootleg>}
 */
export default class BootlegManager extends ApiManager {
    constructor() {
        super({ type: Bootleg, errorType: ErrorBootleg, key: 'bootleg' })
    }
}