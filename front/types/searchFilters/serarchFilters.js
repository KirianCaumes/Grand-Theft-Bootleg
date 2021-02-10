import { ECountries } from 'types/searchFilters/countries'
import { ESort } from 'types/searchFilters/sort'
import { ESearch } from 'types/searchFilters/search'
import { EStates } from 'types/searchFilters/states'

export default class SearchFilters {
    /**
     * @param {object} data
     * @param {string=} data.string Title, description, songs, bands
     * @param {number=} data.year Nombre
     * @param {ESort=} data.orderBy Order by
     * @param {string=} data.searchBy Search by
     * @param {ECountries=} data.country Country
     * @param {number=} data.isCompleteShow Is Complete Show
     * @param {number=} data.isAudioOnly Is Audio Only
     * @param {number=} data.isProRecord Is Pro Record
     * @param {number=} data.page Page
     * @param {number=} data.limit Limit
     * @param {EStates=} data.state State
     * @param {number=} data.isRandom IsRandom
     * @param {string=} data.authorId AuthorId
     * @param {number=} data.isWithReport IsWithReport
     */
    constructor({
        string = null,
        year = null,
        orderBy = null,
        searchBy = null,
        country = null,
        isCompleteShow = null,
        isAudioOnly = null,
        isProRecord = null,
        page = null,
        limit = null,
        state = null,
        isRandom = null,
        authorId = null,
        isWithReport = null
    } = {}) {
        /** @type {string} string Title, description, songs, bands */
        this.string = string
        /** @type {number} Nombre */
        this.year = year
        /** @type {ESort} Order by */
        this.orderBy = orderBy
        /** @type {ESearch} Band */
        this.searchBy = searchBy
        /** @type {ECountries} Country */
        this.country = country
        /** @type {number} Is Complete Show */
        this.isCompleteShow = isCompleteShow
        /** @type {number} Is Audio Only */
        this.isAudioOnly = isAudioOnly
        /** @type {number} Is Pro Record */
        this.isProRecord = isProRecord
        /** @type {number} Page */
        this.page = page
        /** @type {number} Limit */
        this.limit = limit
        /** @type {EStates} State */
        this.state = state
        /** @type {number} IsRandom */
        this.isRandom = isRandom
        /** @type {string} AuthorId*/
        this.authorId = authorId
        /** @type {number} IsWithReport*/
        this.isWithReport = isWithReport
    }
}