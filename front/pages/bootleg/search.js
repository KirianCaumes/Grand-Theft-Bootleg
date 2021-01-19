import React, { useEffect, useCallback, useMemo, useRef, MutableRefObject } from "react"
import Head from "next/head"
import { GetServerSidePropsContext } from 'next'
// @ts-ignore
import styles from "styles/pages/bootleg/search.module.scss"
// @ts-ignore
import { Section, Columns, Container, Tabs } from 'react-bulma-components'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCompactDisc, faFilter, faGlobe, faGlobeEurope, faHeadphonesAlt, faMapMarker, faMusic, faSearch, faSort, faUsers, faVolumeUp } from "@fortawesome/free-solid-svg-icons"
import classNames from 'classnames'
import SearchFilters from "types/searchFilters/serarchFilters"
import { ECountries } from 'types/searchFilters/countries'
import { ESort, ESortLabel } from 'types/searchFilters/sort'
import { EStates } from 'types/searchFilters/states'
import { useRouter } from "next/router"
import withHandlers, { HandlersProps } from 'helpers/hoc/withHandlers'
import { CancelRequestError } from "request/errors/cancelRequestError"
import { UnauthorizedError } from "request/errors/unauthorizedError"
import { InvalidEntityError } from "request/errors/invalidEntityError"
import { NotImplementedError } from "request/errors/notImplementedError"
import Bootleg from "request/objects/bootleg"
import BootlegMeta from "request/objects/meta/bootlegMeta"
import BootlegCard from "components/general/bootlegCard"
import { Status } from "types/status"
import BootlegHandler from "request/handlers/bootlegHandler"
import Loader from "components/general/loader"
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons"
import Select from "components/form/select"
import Input from "components/form/input"
import Toggle from "components/form/toggle"
import { wrapper } from "redux/store"
import getConfig from 'next/config'
import { AnyAction, Store } from 'redux'
import { MainState, removeToken, setMessage } from "redux/slices/main"
import { connect, useDispatch } from "react-redux"
import { ReduxProps } from 'redux/store'
import { NotificationState } from 'redux/slices/notification'
import Pagination from "components/general/pagination"
import { AuthentificationError } from "request/errors/authentificationError"
import { NotFoundError } from "request/errors/notFoundError"
import { ESearch } from "types/searchFilters/search"
import Button from "components/form/button"
import usePrevious from "helpers/hooks/usePrevious"
import Link from "next/link"
import { RequestApi } from 'request/apiHandler'

/**
 * @typedef {object} SearchProps
 * @property {Bootleg[]} bootlegsProps
 * @property {BootlegMeta} metaProps
 */

/**
 * Search page
 * @param {SearchProps & HandlersProps & ReduxProps} props 
 */
function SearchBootleg({ bootlegHandler, bootlegsProps, metaProps, main: { me }, ...props }) {
    /** @type {[SearchFilters, function(SearchFilters):any]} Status */
    const [searchFilters, setSearchFilters] = React.useState(new SearchFilters())
    /** @type {[Bootleg[], function(Bootleg[]):any]} Bootlegs */
    const [bootlegs, setBootlegs] = React.useState(bootlegsProps)
    /** @type {[BootlegMeta, function(BootlegMeta):any]} Meta */
    const [meta, setMeta] = React.useState(metaProps)
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = React.useState(Status.RESOLVED)
    /** @type {[boolean, function(boolean):any]} Is filter display */
    const [isFilterDisplay, setIsFilterDisplay] = React.useState(!!false)

    /** @type {MutableRefObject<RequestApi<[Bootleg[], BootlegMeta]>>} */
    const bootlegHandlerGetAll = useRef()

    /** @type {SearchFilters} Previous state searchFilters */
    const prevSearchFilters = usePrevious(searchFilters)

    const router = useRouter()
    const dispatch = useDispatch()
    const { publicRuntimeConfig } = getConfig()

    const boolOpts = useMemo(() => [
        { key: null, text: 'Any' },
        { key: 1, text: 'Yes' },
        { key: 0, text: 'No' }
    ], [])

    const tabs = useMemo(() => [
        {
            search: ESearch.GLOBAL,
            title: `Global (${meta?.total?.global || 0})`,
            icon: faGlobe,
        },
        {
            search: ESearch.BAND,
            title: `Band (${meta?.total?.band || 0})`,
            icon: faUsers,
        },
        {
            search: ESearch.SONG,
            title: `Song (${meta?.total?.song || 0})`,
            icon: faMusic,
        },
    ], [meta?.total])

    useEffect(
        () => {
            setSearchFilters({
                ...searchFilters,
                ...router.query,
                orderBy: /** @type {string=} */ (router.query?.orderBy) || ESort.DATE_ASC,
                page: parseInt(/** @type {string=} */(router.query?.page)) || 1,
                searchBy: /** @type {string=} */ (router.query?.searchBy) || ESearch.GLOBAL,
            })
        },
        [router]
    )

    useEffect(
        () => {
            history.replaceState(null, null, "?")

            const queryParams = new URLSearchParams(window.location.search)
            console.log(searchFilters)
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
                bootlegHandlerGetAll.current = bootlegHandler.getAll(searchFilters)
                const [bootlegs, meta] = await bootlegHandlerGetAll.current.fetch()
                setBootlegs(bootlegs)
                setMeta(meta)
                setStatus(Status.RESOLVED)
            } catch (error) {
                switch (error?.constructor) {
                    case CancelRequestError: break
                    case UnauthorizedError:
                    case AuthentificationError:
                        router.push('/login')
                        dispatch(removeToken(undefined))
                        dispatch(setMessage({ message: { isDisplay: true, content: /** @type {Error} */(error).message, type: 'warning' } }))
                        break
                    case InvalidEntityError:
                    case NotFoundError:
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

    useEffect(
        () => {
            if (
                (!!searchFilters.page && !!prevSearchFilters?.page && prevSearchFilters?.page !== searchFilters.page) ||
                (!!searchFilters.searchBy && !!prevSearchFilters?.searchBy && prevSearchFilters?.searchBy !== searchFilters.searchBy)
            )
                getBootlegs()
        },
        [searchFilters.page, prevSearchFilters?.page, searchFilters.searchBy, prevSearchFilters?.searchBy]
    )

    useEffect(() => () => {
        bootlegHandlerGetAll.current?.cancel()
    }, [])

    return (
        <>
            <Head>
                <title>Search - {publicRuntimeConfig.appName}</title>
            </Head>

            <main className={styles['search-bootleg']}>
                <Section className="flex">
                    <Container className="flex-one">
                        <form
                            onSubmit={ev => {
                                ev.preventDefault()
                                getBootlegs()
                            }}
                        >
                            <Columns className={classNames("is-variable is-8-widescreen is-desktop", styles.searchrow)}>
                                <Columns.Column className="is-one-fifth-desktop" />
                                <Columns.Column className="is-four-fifths-desktop">
                                    <div className="field has-addons">
                                        <div className="control is-expanded">
                                            <input
                                                type="text"
                                                placeholder="What are you looking for?"
                                                value={searchFilters.string || ''}
                                                className="input is-pink"
                                                disabled={status === Status.PENDING}
                                                onChange={ev => setSearchFilters({
                                                    ...searchFilters,
                                                    string: ev.target.value?.length ? ev.target.value : null
                                                })}
                                                minLength={3}
                                            />
                                            <h1 className="help" >
                                                <i>
                                                    Bootlegs found for {searchFilters.string || 'your search'} ({(() => {
                                                        switch (searchFilters.searchBy) {
                                                            case ESearch.BAND:
                                                                return meta?.total?.band || 0
                                                            case ESearch.SONG:
                                                                return meta?.total?.song || 0
                                                            case ESearch.GLOBAL:
                                                            default:
                                                                return meta?.total?.global || 0
                                                        }
                                                    })()})
                                                </i>
                                            </h1>
                                        </div>
                                        <p className="control">
                                            <button
                                                className={classNames("button is-pink", { 'is-loading': status === Status.PENDING })}
                                                type="submit"
                                            >
                                                <FontAwesomeIcon icon={faSearch} />
                                            </button>
                                        </p>
                                    </div>
                                </Columns.Column>
                            </Columns>
                            <div className="is-hidden-desktop">
                                <Button
                                    onClick={() => setIsFilterDisplay(!isFilterDisplay)}
                                    iconLeft={faFilter}
                                    label={isFilterDisplay ? 'Hide filters' : 'Show filters'}
                                />
                                <br />
                                <br />
                            </div>
                            <Columns className={classNames("is-variable is-8-widescreen is-desktop", styles.contentrow)}>
                                <Columns.Column className={classNames("is-one-fifth-desktop", { 'is-hidden-touch': !isFilterDisplay })}>
                                    <div className={styles.sticky}>
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
                                        {me?.role > 0 &&
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
                                    </div>
                                </Columns.Column>
                                <Columns.Column className="is-four-fifths-desktop">
                                    <div className="tabs">
                                        <ul>
                                            {tabs?.map((tab, i) => (
                                                <li
                                                    key={i}
                                                    className={classNames({ "is-active": searchFilters.searchBy === tab.search || !searchFilters.searchBy })}
                                                >
                                                    <Link
                                                        href={{
                                                            pathname: router.pathname,
                                                            query: {
                                                                ...router.query,
                                                                searchBy: tab.search,
                                                                page: 1
                                                            }
                                                        }}
                                                    >
                                                        <a>
                                                            <span className="icon is-small">
                                                                <FontAwesomeIcon icon={tab.icon} />
                                                            </span>
                                                            <span>{tab.title}</span>
                                                        </a>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
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
                                                <p>No result</p>
                                            }
                                        </> :
                                        <Loader />
                                    }
                                    <br />

                                    {[Status.IDLE, Status.RESOLVED, Status.REJECTED].includes(status) &&
                                        <Pagination
                                            current={meta?.page?.current}
                                            total={meta?.page?.last}
                                        />
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
     * @param {GetServerSidePropsContext & {store: Store<{ main: MainState; notification: NotificationState }, AnyAction>;}} ctx
     */
    async ({ req, query }) => {
        try {
            const bootlegHandler = new BootlegHandler({ req })
            const [bootlegs, meta] = await bootlegHandler.getAll({
                ...query,
                orderBy: /** @type {string=} */ (query?.orderBy) || ESort.DATE_ASC,
                page: parseInt(/** @type {string=} */(query?.page)) || 1,
                searchBy: /** @type {string=} */ (query?.searchBy) || ESearch.GLOBAL,
            }).fetch()

            return { props: { bootlegsProps: bootlegs.map(x => x.toJson()), metaProps: meta.toJson() } }
        } catch (error) {
            switch (error?.constructor) {
                case CancelRequestError:
                case UnauthorizedError:
                case AuthentificationError:
                case InvalidEntityError:
                case NotImplementedError:
                case NotFoundError:
                default:
                    console.log(error)
                    return { props: { bootlegsProps: {} } }
            }
        }
    }
)

export default connect((state) => state)(withHandlers(SearchBootleg))