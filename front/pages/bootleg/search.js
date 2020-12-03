import React, { useEffect, useCallback } from "react"
import Head from "next/head"
import { GetServerSidePropsContext } from 'next'
// @ts-ignore
import styles from "styles/pages/bootleg/search.module.scss"
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
import BootlegCard from "components/general/bootlegCard"
import { Status } from "static/status"
import BootlegManager from "request/managers/bootlegManager"
import Loader from "components/general/loader"
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons"
import Select from "components/form/select"
import Input from "components/form/input"
import Toggle from "components/form/toggle"
import { wrapper } from "redux/store"
import getConfig from 'next/config'
import { AnyAction, Store } from 'redux'
import { MainState } from "redux/slices/main"
import { connect } from "react-redux"
import { ReduxProps } from 'redux/store'

/**
 * @typedef {object} SearchProps
 * @property {Bootleg[]} bootlegsProps
 */

/**
 * Search page
 * @param {SearchProps & ManagersProps & ReduxProps} props 
 */
function Search({ bootlegManager, bootlegsProps, main: { me }, ...props }) {
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
    const { publicRuntimeConfig } = getConfig()

    const boolOpts = [
        { key: null, text: 'Any' },
        { key: 1, text: 'Yes' },
        { key: 0, text: 'No' }
    ]

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
                <title>Search - {publicRuntimeConfig.appName}</title>
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
                                    <Select
                                        label="Order by"
                                        isDisabled={status === Status.PENDING}
                                        iconLeft={faSort}
                                        onChange={(ev, option) => setSearchFilters({
                                            ...searchFilters,
                                            orderBy: /** @type {string} */(option.key)
                                        })}
                                        value={searchFilters.orderBy}
                                        options={Object.keys(ESort).map(sort => ({
                                            key: sort, text: ESortLabel[sort]
                                        }))}
                                        styles={{
                                            control: styles.select
                                        }}
                                    />
                                    <Select
                                        label="Country"
                                        isDisabled={status === Status.PENDING}
                                        iconLeft={faGlobeEurope}
                                        onChange={(ev, option) => setSearchFilters({
                                            ...searchFilters,
                                            country: /** @type {string} */(option.key)
                                        })}
                                        value={searchFilters.country}
                                        options={[
                                            { key: null, text: 'Any' },
                                            ...Object.keys(ECountries).map(country => ({
                                                key: country, text: ECountries[country]
                                            }))
                                        ]}
                                        styles={{
                                            control: styles.select
                                        }}
                                    />
                                    {me?.role > 1 &&
                                        <Select
                                            label="State"
                                            isDisabled={status === Status.PENDING}
                                            iconLeft={faMapMarker}
                                            onChange={(ev, option) => setSearchFilters({
                                                ...searchFilters,
                                                state: /** @type {number} */(option.key)
                                            })}
                                            value={searchFilters.state?.toString()}
                                            options={[
                                                { key: null, text: 'Any' },
                                                ...Object.keys(EStates).map(state => ({
                                                    key: EStates[state], text: `${state.charAt(0).toUpperCase()}${state.toLowerCase().slice(1)}`
                                                }))
                                            ]}
                                            styles={{
                                                control: styles.select
                                            }}
                                        />
                                    }
                                    <Select
                                        label="Complete show"
                                        isDisabled={status === Status.PENDING}
                                        iconLeft={faHeadphonesAlt}
                                        onChange={(ev, option) => setSearchFilters({
                                            ...searchFilters,
                                            isCompleteShow: /** @type {Number} */(option.key)
                                        })}
                                        value={searchFilters.isCompleteShow?.toString()}
                                        options={boolOpts}
                                        styles={{
                                            control: styles.select
                                        }}
                                    />
                                    <Select
                                        label="Audio only"
                                        isDisabled={status === Status.PENDING}
                                        iconLeft={faVolumeUp}
                                        onChange={(ev, option) => setSearchFilters({
                                            ...searchFilters,
                                            isAudioOnly: /** @type {Number} */(option.key)
                                        })}
                                        value={searchFilters.isAudioOnly?.toString()}
                                        options={boolOpts}
                                        styles={{
                                            control: styles.select
                                        }}
                                    />
                                    <Select
                                        label="Pro record"
                                        isDisabled={status === Status.PENDING}
                                        iconLeft={faCompactDisc}
                                        onChange={(ev, option) => setSearchFilters({
                                            ...searchFilters,
                                            isProRecord: /** @type {Number} */(option.key)
                                        })}
                                        value={searchFilters.isProRecord?.toString()}
                                        options={boolOpts}
                                        styles={{
                                            control: styles.select
                                        }}
                                    />
                                    <Input
                                        label="Year"
                                        placeholder="Year"
                                        type="number"
                                        min={1900}
                                        max={2050}
                                        step={1}
                                        iconLeft={faCalendarAlt}
                                        onChange={ev => {
                                            const val = parseInt(ev.target.value)
                                            setSearchFilters({
                                                ...searchFilters,
                                                year: !isNaN(val) ? val : null
                                            })
                                        }}
                                        value={searchFilters.year?.toString()}
                                        styles={{
                                            control: styles.input
                                        }}
                                    />
                                    <Toggle
                                        label="Random"
                                        checked={!!searchFilters.isRandom}
                                        isDisabled={status === Status.PENDING}
                                        onChange={ev => setSearchFilters({
                                            ...searchFilters,
                                            isRandom: ev.target.checked ? 1 : null
                                        })}
                                    />
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

/** Get server side props */
export const getServerSideProps = wrapper.getServerSideProps(
    /**
     * Get server side props
     * @param {GetServerSidePropsContext & {store: Store<{ main: MainState; }, AnyAction>;}} ctx
     */
    async ({ req, query }) => {
        try {
            const bootlegManager = new BootlegManager({ req })
            const bootlegs = await bootlegManager.getAll({
                ...query,
                orderBy: /** @type {string=} */ (query?.orderBy) || ESort.DATE_ASC
            })

            return { props: { bootlegsProps: bootlegs.map(x => x.toJson()) } }
        } catch (error) {
            console.log(error)
            // return {notFound: true }
            return { props: { bootlegsProps: {} } }
        }
    }
)

export default connect((state) => state)(withManagers(Search))