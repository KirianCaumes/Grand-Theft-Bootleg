import { ECountries } from 'static/searchFilters/countries'
import { ESort } from 'static/searchFilters/sort'
import { EStates } from 'static/searchFilters/states'

export default class SearchFilters {
    /**
     * @param {object} data
     * @param {string=} data.string Title, description, songs, bands
     * @param {number=} data.year Nombre
     * @param {ESort=} data.orderBy Order by
     * @param {string=} data.band Band
     * @param {string=} data.song Song
     * @param {ECountries=} data.country Country
     * @param {number=} data.isCompleteShow Is Complete Show
     * @param {number=} data.isAudioOnly Is Audio Only
     * @param {number=} data.isProRecord Is Pro Record
     * @param {number=} data.startAt StartAt
     * @param {number=} data.limit Limit
     * @param {EStates=} data.state State
     * @param {number=} data.isRandom IsRandom
     * @param {string=} data.authorId AuthorId
     */
    constructor({
        string = null,
        year = null,
        orderBy = null,
        band = null,
        song = null,
        country = null,
        isCompleteShow = null,
        isAudioOnly = null,
        isProRecord = null,
        startAt = null,
        limit = null,
        state = null,
        isRandom = null,
        authorId = null
    } = {}) {
        /** @type {string} string Title, description, songs, bands */
        this.string = string
        /** @type {number} Nombre */
        this.year = year
        /** @type {ESort} Order by */
        this.orderBy = orderBy
        /** @type {string} Band */
        this.band = band
        /** @type {string} Song */
        this.song = song
        /** @type {ECountries} Country */
        this.country = country
        /** @type {number} Is Complete Show */
        this.isCompleteShow = isCompleteShow
        /** @type {number} Is Audio Only */
        this.isAudioOnly = isAudioOnly
        /** @type {number} Is Pro Record */
        this.isProRecord = isProRecord
        /** @type {number} StartAt */
        this.startAt = startAt
        /** @type {number} Limit */
        this.limit = limit
        /** @type {EStates} State */
        this.state = state
        /** @type {number} IsRandom */
        this.isRandom = isRandom
        /** @type {string} AuthorId*/
        this.authorId = authorId
    }
}