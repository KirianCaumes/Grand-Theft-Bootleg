import React, { useEffect, useCallback } from "react"
import Head from "next/head"
import { GetServerSidePropsContext } from 'next'
// @ts-ignore
import styles from "styles/pages/search.module.scss"
import { GlobalProps } from "pages/_app"
// @ts-ignore
import { Section, Columns, Container } from 'react-bulma-components'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCompactDisc, faFilter, faGlobeEurope, faHeadphonesAlt, faMapMarker, faSearch, faSort, faVolumeUp } from "@fortawesome/free-solid-svg-icons"
import classNames from 'classnames'
import SearchFilters from "static/searchFilters/serarchFilters"
import { ECountries } from 'static/searchFilters/countries'
import { ESort, ESortLabel } from 'static/searchFilters/sort'
import { EStates } from 'static/searchFilters/states'
import { useRouter } from "next/router"
import withManagers, { ManagersProps } from 'helpers/hoc/withManagers'
import { CancelRequestError } from "request/errors/cancelRequestError"
import { UnauthorizedError } from "request/errors/unauthorizedError"
import { InvalidEntityError } from "request/errors/invalidEntityError"
import { NotImplementedError } from "request/errors/notImplementedError"
import { Bootleg } from "request/objects/bootleg"
import BootlegCard from "components/bootlegCard"
import { Status } from "static/status"
import BootlegManager from "request/managers/bootlegManager"
import Loader from "components/loader"
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons"


/**
 * @typedef {object} SearchProps
 * @property {Bootleg[]} bootlegsProps
 */

/**
 * Search page
 * @param {GlobalProps & SearchProps & ManagersProps} props 
 */
function Search({ bootlegManager, bootlegsProps, ...props }) {
    /** @type {[SearchFilters, function(SearchFilters):any]} Status */
    const [searchFilters, setSearchFilters] = React.useState(new SearchFilters())
    /** @type {['string' | 'band' | 'song' | string, function('global' | 'band' | 'song' | string):any]} Type of search */
    const [searchType, setSearchType] = React.useState('string')
    /** @type {[Bootleg[], function(Bootleg[]):any]} Bootlegs */
    const [bootlegs, setBootlegs] = React.useState(bootlegsProps)
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = React.useState(Status.RESOLVED)
    /** @type {[boolean, function(boolean):any]} Is filter display */
    const [isFilterDisplay, setIsFilterDisplay] = React.useState(!!false)

    const router = useRouter()

    useEffect(
        () => {
            setSearchFilters({
                ...searchFilters,
                ...router.query,
                orderBy: /** @type {string=} */ (router.query?.orderBy) || ESort.DATE_ASC
            })
            if (router.query?.string) {
                setSearchType('string')
            } else if (router.query?.band) {
                setSearchType('band')
            } else if (router.query?.song) {
                setSearchType('song')
            }
        },
        [router]
    )

    useEffect(
        () => {
            history.replaceState(null, null, "?")

            const queryParams = new URLSearchParams(window.location.search)
            for (const key in searchFilters) {
                if (searchFilters[key] !== null)
                    queryParams.set(key, searchFilters[key])
            }

            history.replaceState(null, null, "?" + queryParams.toString())
        },
        [searchFilters]
    )

    const getBootlegs = useCallback(
        async () => {
            try {
                setStatus(Status.PENDING)
                const bootlegs = await bootlegManager.getAll(searchFilters)
                setBootlegs(bootlegs)
                setStatus(Status.RESOLVED)
            } catch (error) {
                switch (error?.constructor) {
                    case CancelRequestError:
                    case UnauthorizedError:
                    case InvalidEntityError:
                    case NotImplementedError:
                        console.error(error)
                        break
                    default:
                        setStatus(Status.REJECTED)
                        console.error(error)
                        break
                }
            }
        },
        [searchFilters]
    )

    return (
        <>
            <Head>
                <title>Search - {props.appname}</title>
            </Head>

            <main className={styles.search}>
                <Section>
                    <Container>
                        <h1
                            className="title is-3 is-title-underline"
                        >
                            Search on <b>G</b>rand <b>T</b>heft <b>B</b>ootleg database
                        </h1>
                        <br />
                        <div className="is-hidden-desktop">
                            <button
                                className="button is-pink"
                                onClick={ev => setIsFilterDisplay(!isFilterDisplay)}
                            >
                                <span className="icon">
                                    <FontAwesomeIcon icon={faFilter} />
                                </span>
                                <span>{isFilterDisplay ? 'Hide' : 'Show'}</span>
                            </button>
                            <br />
                            <br />
                        </div>
                        <form
                            onSubmit={ev => {
                                ev.preventDefault()
                                getBootlegs()
                            }}
                        >
                            <Columns className="is-variable is-8-widescreen is-desktop">
                                <Columns.Column className={classNames("is-one-fifth-desktop", { 'is-hidden-touch': !isFilterDisplay })}>
                                    <div className="field">
                                        <label className="label" htmlFor="orderBy">Order by</label>
                                        <div className={classNames("control has-icons-left", styles.select)}>
                                            <div className="select is-pink">
                                                <select
                                                    id="orderBy"
                                                    onChange={ev => setSearchFilters({
                                                        ...searchFilters,
                                                        orderBy: ev.target.value?.length ? ev.target.value : null
                                                    })}
                                                    value={searchFilters.orderBy || ""}
                                                    disabled={status === Status.PENDING}
                                                >
                                                    {Object.keys(ESort).map((sort, i) =>
                                                        <option value={sort} key={i}>{ESortLabel[sort]}</option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="icon is-small is-left">
                                                <FontAwesomeIcon icon={faSort} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label" htmlFor="country">Country</label>
                                        <div className={classNames("control has-icons-left", styles.select)}>
                                            <div className="select is-pink">
                                                <select
                                                    id="country"
                                                    onChange={ev => setSearchFilters({
                                                        ...searchFilters,
                                                        country: ev.target.value?.length ? ev.target.value : null
                                                    })}
                                                    value={searchFilters.country || ""}
                                                    disabled={status === Status.PENDING}
                                                >
                                                    <option value="">Any</option>
                                                    {Object.keys(ECountries).map((country, i) =>
                                                        <option value={country} key={i}>{ECountries[country]}</option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="icon is-small is-left">
                                                <FontAwesomeIcon icon={faGlobeEurope} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label" htmlFor="state">State</label>
                                        <div className={classNames("control has-icons-left", styles.select)}>
                                            <div className="select is-pink">
                                                <select
                                                    id="state"
                                                    onChange={ev => setSearchFilters({
                                                        ...searchFilters,
                                                        state: ev.target.value?.length ? ev.target.value : null
                                                    })}
                                                    value={searchFilters.state || ""}
                                                    disabled={status === Status.PENDING}
                                                >
                                                    <option value="">Any</option>
                                                    {Object.keys(EStates).map((state, i) =>
                                                        <option value={state} key={i}>{EStates[state].charAt(0).toUpperCase()}{EStates[state].toLowerCase().slice(1)}</option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="icon is-small is-left">
                                                <FontAwesomeIcon icon={faMapMarker} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label" htmlFor="isCompleteShow">Complete show</label>
                                        <div className={classNames("control has-icons-left", styles.select)}>
                                            <div className="select is-pink">
                                                <select
                                                    id="isCompleteShow"
                                                    onChange={ev => {
                                                        const val = parseInt(ev.target.value)
                                                        setSearchFilters({
                                                            ...searchFilters,
                                                            isCompleteShow: !isNaN(val) && val > -1 ? val : null
                                                        })
                                                    }}
                                                    value={searchFilters.isCompleteShow?.toString() || ""}
                                                    disabled={status === Status.PENDING}
                                                >
                                                    <option value={-1}>Any</option>
                                                    <option value={1}>Yes</option>
                                                    <option value={0}>No</option>
                                                </select>
                                            </div>
                                            <div className="icon is-small is-left">
                                                <FontAwesomeIcon icon={faHeadphonesAlt} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label" htmlFor="isAudioOnly">Audio only</label>
                                        <div className={classNames("control has-icons-left", styles.select)}>
                                            <div className="select is-pink">
                                                <select
                                                    id="isAudioOnly"
                                                    onChange={ev => {
                                                        const val = parseInt(ev.target.value)
                                                        setSearchFilters({
                                                            ...searchFilters,
                                                            isAudioOnly: !isNaN(val) && val > -1 ? val : null
                                                        })
                                                    }}
                                                    value={searchFilters.isAudioOnly?.toString() || ""}
                                                    disabled={status === Status.PENDING}
                                                >
                                                    <option value={-1}>Any</option>
                                                    <option value={1}>Yes</option>
                                                    <option value={0}>No</option>
                                                </select>
                                            </div>
                                            <div className="icon is-small is-left">
                                                <FontAwesomeIcon icon={faVolumeUp} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label" htmlFor="isProRecord">Pro record</label>
                                        <div className={classNames("control has-icons-left", styles.select)}>
                                            <div className="select is-pink">
                                                <select
                                                    id="isProRecord"
                                                    onChange={ev => {
                                                        const val = parseInt(ev.target.value)
                                                        setSearchFilters({
                                                            ...searchFilters,
                                                            isProRecord: !isNaN(val) && val > -1 ? val : null
                                                        })
                                                    }}
                                                    value={searchFilters.isProRecord?.toString() || ""}
                                                    disabled={status === Status.PENDING}
                                                >
                                                    <option value={-1}>Any</option>
                                                    <option value={1}>Yes</option>
                                                    <option value={0}>No</option>
                                                </select>
                                            </div>
                                            <div className="icon is-small is-left">
                                                <FontAwesomeIcon icon={faCompactDisc} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Year</label>
                                        <div className={classNames("control has-icons-left", styles.input)}>
                                            <input
                                                className="input is-pink"
                                                type="number"
                                                placeholder="Year"
                                                min="1900"
                                                max="2050"
                                                step="1"
                                                value={searchFilters.year || ''}
                                                onChange={ev => {
                                                    const val = parseInt(ev.target.value)
                                                    setSearchFilters({
                                                        ...searchFilters,
                                                        year: !isNaN(val) ? val : null
                                                    })
                                                }}
                                                disabled={status === Status.PENDING}
                                            /><span className="icon is-small is-left">
                                                <FontAwesomeIcon icon={faCalendarAlt} />
                                            </span>
                                        </div>
                                    </div>
                                    <label className="label" htmlFor="isRandom">Random</label>
                                    <div className="field">
                                        <input
                                            id="isRandom"
                                            type="checkbox"
                                            className="switch is-rounded is-pink"
                                            checked={!!searchFilters.isRandom}
                                            onChange={ev => setSearchFilters({
                                                ...searchFilters,
                                                isRandom: ev.target.checked ? 1 : null
                                            })}
                                            disabled={status === Status.PENDING}
                                        />
                                        <label htmlFor="isRandom">{!!searchFilters.isRandom ? 'Yes' : 'No'}</label>
                                    </div>
                                </Columns.Column>
                                <Columns.Column className="is-four-fifths-desktop">
                                    <label className="label is-hidden-touch">&nbsp;</label>
                                    <div className="field has-addons">
                                        <p className={classNames("control", { 'is-hidden-touch': !isFilterDisplay })}>
                                            <span className="select is-pink">
                                                <select
                                                    onChange={ev => {
                                                        setSearchType(ev.target.value)
                                                        setSearchFilters({
                                                            ...searchFilters,
                                                            string: null,
                                                            band: null,
                                                            song: null
                                                        })
                                                    }}
                                                    value={searchType || ""}
                                                    disabled={status === Status.PENDING}
                                                >
                                                    <option value="string">Global</option>
                                                    <option value="band">Band</option>
                                                    <option value="song">Song</option>
                                                </select>
                                            </span>
                                        </p>
                                        <p className="control is-expanded">
                                            <input
                                                type="text"
                                                placeholder="What are you looking for?"
                                                value={searchFilters[searchType] || ''}
                                                className="input is-pink"
                                                disabled={status === Status.PENDING}
                                                onChange={ev => setSearchFilters({
                                                    ...searchFilters,
                                                    [searchType]: ev.target.value?.length ? ev.target.value : null
                                                })}
                                                minLength={3}
                                            />
                                        </p>
                                        <p className="control">
                                            <button
                                                className={classNames("button is-pink", { 'is-loading': status === Status.PENDING })}
                                                type="submit"
                                            >
                                                <FontAwesomeIcon icon={faSearch} />
                                            </button>
                                        </p>
                                    </div>
                                    <br />
                                    {[Status.IDLE, Status.RESOLVED, Status.REJECTED].includes(status) ?
                                        <>
                                            {bootlegs?.length ?
                                                <Columns
                                                    className="is-variable is-3"
                                                >
                                                    {bootlegs?.map((bootleg, i) => (
                                                        <Columns.Column
                                                            size="one-quarter"
                                                            key={`random-${i}`}
                                                        >
                                                            <BootlegCard
                                                                bootleg={bootleg}
                                                            />
                                                        </Columns.Column>
                                                    ))}
                                                </Columns>
                                                :
                                                'No result'
                                            }
                                        </> :
                                        <Loader />
                                    }
                                </Columns.Column>
                            </Columns>
                        </form>
                    </Container>
                </Section>
            </main>
        </>
    )
}
/**
 *
 * @param {GetServerSidePropsContext} ctx
 */
export async function getServerSideProps(ctx) {
    try {
        const bootlegManager = new BootlegManager()
        const bootlegs = await bootlegManager.getAll({
            ...ctx.query,
            orderBy: /** @type {string=} */ (ctx.query?.orderBy) || ESort.DATE_ASC
        })

        return { props: { bootlegsProps: JSON.parse(JSON.stringify(bootlegs)) } }
    } catch (error) {
        console.log(error)
        // return {notFound: true }
        return { props: { bootlegsProps: {} } }
    }
}

export default withManagers(Search)