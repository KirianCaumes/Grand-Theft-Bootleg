/**
 * Bootleg Object
 */
export class Bootleg {
    /**
     * @param {object} data
     * @param {object=} data._id
     * @param {string=} data.title
     * @param {string=} data.description
     * @param {string=} data.date
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
     * @param {string=} data.createdOn
     * @param {object=} data.modifiedById
     * @param {object=} data.modifiedBy
     * @param {string=} data.modifiedOn
     * @param {string=} data.clicked
     * @param {number=} data.clickedCount
     * @param {string=} data.report
     */
    constructor({
        _id = {},
        title = null,
        description = null,
        date = null,
        picture = null,
        links = null,
        bands = null,
        songs = null,
        countries = null,
        cities = null,
        isCompleteShow = null,
        isAudioOnly = null,
        isProRecord = null,
        soundQuality = null,
        videoQuality = null,
        state = null,
        createdById = null,
        createdBy = {},
        createdOn = null,
        modifiedById = null,
        modifiedBy = {},
        modifiedOn = null,
        clicked = null,
        clickedCount = 0,
        report = null
    } = {}) {

        this._id = _id?.$oid
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
        this.createdById = createdById?.$oid
        this.createdBy = createdBy
        this.createdOn = createdOn ? new Date(createdOn) : createdOn
        this.modifiedById = modifiedById?.$oid
        this.modifiedBy = modifiedBy
        this.modifiedOn = modifiedOn ? new Date(modifiedOn) : modifiedOn
        // this.clicked = clicked
        this.clickedCount = clickedCount
        // this.report = report
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