import { EStates } from "types/searchFilters/states"
import Report, { ErrorReport } from "./report"
import Base from "./_base"

/**
 * Bootleg Object
 */
export default class Bootleg extends Base {
    /**
     * @param {object} data
     * @param {object | number=} data._id
     * @param {string=} data.title
     * @param {string=} data.description
     * @param {string | Date=} data.date
     * @param {string=} data.picture
     * @param {string[]=} data.links
     * @param {string[]=} data.bands
     * @param {string[]=} data.songs
     * @param {string[]=} data.countries
     * @param {string[]=} data.cities
     * @param {boolean=} data.isCompleteShow
     * @param {boolean=} data.isAudioOnly
     * @param {boolean=} data.isProRecord
     * @param {number=} data.soundQuality
     * @param {number=} data.videoQuality
     * @param {number=} data.state
     * @param {object=} data.createdById
     * @param {object=} data.createdBy
     * @param {string | Date=} data.createdOn
     * @param {object=} data.modifiedById
     * @param {object=} data.modifiedBy
     * @param {string | Date=} data.modifiedOn
     * @param {object[]=} data.clicked
     * @param {number=} data.clickedCount
     * @param {object[]=} data.report
     */
    constructor({
        _id = null,
        title = null,
        description = null,
        date = null,
        picture = null,
        links = [],
        bands = [],
        songs = [],
        countries = [],
        cities = [],
        isCompleteShow = false,
        isAudioOnly = false,
        isProRecord = false,
        soundQuality = 0,
        videoQuality = null,
        state = EStates.DRAFT,
        createdById = null,
        createdBy = {},
        createdOn = null,
        modifiedById = null,
        modifiedBy = {},
        modifiedOn = null,
        clicked = [],
        clickedCount = 0,
        report = []
    } = {}) {
        super()
        this._id = _id?.$oid ?? _id
        this.title = title
        this.description = description
        this.date = date ? new Date(date) : null
        this.picture = picture
        this.links = links
        this.bands = bands
        this.songs = songs
        this.countries = countries
        this.cities = cities
        this.isCompleteShow = isCompleteShow
        this.isAudioOnly = isAudioOnly
        this.isProRecord = isProRecord
        this.soundQuality = soundQuality
        this.videoQuality = videoQuality
        this.state = state
        this.createdById = createdById?.$oid || createdById
        this.createdBy = createdBy
        this.createdOn = createdOn ? new Date(createdOn) : createdOn
        this.modifiedById = modifiedById?.$oid || modifiedById
        this.modifiedBy = modifiedBy
        this.modifiedOn = modifiedOn ? new Date(modifiedOn) : modifiedOn
        // this.clicked = clicked
        this.clickedCount = clickedCount
        this.report = report?.map(x => new Report(x))

        this.stateName = Object.keys(EStates).map(state => `${state.charAt(0).toUpperCase()}${state.toLowerCase().slice(1)}`)[this.state || 0]

        this.timeAgo = (() => {
            if (!createdOn)
                return ''

            const msPerMinute = 60 * 1000
            const msPerHour = msPerMinute * 60
            const msPerDay = msPerHour * 24
            const msPerMonth = msPerDay * 30
            const msPerYear = msPerDay * 365

            const elapsed = new Date().getTime() - new Date(createdOn)?.getTime()

            if (elapsed < msPerMinute) {
                const res = Math.round(elapsed / 1000)
                return `${res} second${res > 1 ? 's' : ''} ago`
            } else if (elapsed < msPerHour) {
                const res = Math.round(elapsed / msPerMinute)
                return `${res} minute${res > 1 ? 's' : ''} ago`
            } else if (elapsed < msPerDay) {
                const res = Math.round(elapsed / msPerHour)
                return `${res} hour${res > 1 ? 's' : ''} ago`
            } else if (elapsed < msPerMonth) {
                const res = Math.round(elapsed / msPerDay)
                return `${res} day${res > 1 ? 's' : ''} ago`
            } else if (elapsed < msPerYear) {
                const res = Math.round(elapsed / msPerMonth)
                return `${res} month${res > 1 ? 's' : ''} ago`
            } else {
                const res = Math.round(elapsed / msPerYear)
                return `${res} year${res > 1 ? 's' : ''} ago`
            }
        })()
    }
}


/**
 * Bootleg Object used to bind error message
 */
export class ErrorBootleg {
    _id
    title
    description
    date
    picture
    links
    bands
    songs
    countries
    cities
    isCompleteShow
    isAudioOnly
    isProRecord
    soundQuality
    videoQuality
    state
    createdById
    createdOn
    modifiedById
    modifiedOn
    clicked
    clickedCount
    report
}