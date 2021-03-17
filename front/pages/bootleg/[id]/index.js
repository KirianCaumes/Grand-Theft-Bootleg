import React, { useCallback, useEffect, useMemo, useState, MutableRefObject, useRef } from "react"
import Head from "next/head"
import { GetServerSidePropsContext } from 'next'
// @ts-ignore
import styles from "styles/pages/bootleg/[id]/index.module.scss"
import BootlegHandler from "request/handlers/bootlegHandler"
// @ts-ignore
import { Section, Columns, Container } from 'react-bulma-components'
import Bootleg from 'request/objects/bootleg'
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeadphonesAlt, faEdit, faCheck, faTimes, faTrash, faCheckDouble, faMapMarker } from "@fortawesome/free-solid-svg-icons"
import withHandlers, { HandlersProps } from "helpers/hoc/withHandlers"
import getConfig from 'next/config'
import { wrapper } from "redux/store"
import { AnyAction, Store } from 'redux'
import { MainState, removeToken, setMessage } from "redux/slices/main"
import Button from "components/form/button"
import classNames from 'classnames'
import { connect, useDispatch } from "react-redux"
import { ReduxProps } from 'redux/store'
import { useRouter } from "next/router"
import { CancelRequestError } from "request/errors/cancelRequestError"
import { UnauthorizedError } from "request/errors/unauthorizedError"
import { InvalidEntityError } from "request/errors/invalidEntityError"
import { NotImplementedError } from "request/errors/notImplementedError"
import Modal, { ModalType } from "components/general/modal"
import Input from "components/form/input"
import Report, { ErrorReport } from "request/objects/report"
import { NotificationState, removeFromBootlegs, addToBootlegs } from 'redux/slices/notification'
import { AuthentificationError } from "request/errors/authentificationError"
import { NotFoundError } from "request/errors/notFoundError"
import { ESearch } from "types/searchFilters/search"
import Rating from "components/form/rating"
import Image from 'next/image'
import { RequestApi } from 'request/apiHandler'

/**
 * @typedef {object} BootlegProps
 * @property {Bootleg} bootlegProps Bootleg from props
 */

/**
 * Bootleg page
 * @param {BootlegProps & HandlersProps & ReduxProps} props 
 */
function IndexIdBootleg({ bootlegProps, bootlegHandler, main: { token, me }, ...props }) {
    /** @type {[Bootleg, function(Bootleg):any]} Bootleg */
    const [bootleg, setBootleg] = useState(new Bootleg(bootlegProps))
    /** @type {[ModalType, function(ModalType):any]} Modal */
    const [modal, setModal] = useState({ isDisplay: !!false })
    /** @type {[ModalType, function(ModalType):any]} Modal */
    const [modalReport, setModalReport] = useState({ isDisplay: !!false })
    /** @type {[ErrorReport, function(ErrorReport):any]} Error message */
    const [errorFieldReport, setErrorFieldReport] = useState(new ErrorReport())
    /** @type {[Report, function(Report):any]} Report */
    const [report, setReport] = useState(new Report())

    /** @type {MutableRefObject<RequestApi<Bootleg>>} */
    const bootlegHandlerUpdateById = useRef()
    /** @type {MutableRefObject<RequestApi<Bootleg>>} */
    const bootlegHandlerRemoveById = useRef()
    /** @type {MutableRefObject<RequestApi<Bootleg>>} */
    const bootlegHandlerClick = useRef()
    /** @type {MutableRefObject<RequestApi<Bootleg>>} */
    const bootlegHandlerCreateReport = useRef()

    const { publicRuntimeConfig } = getConfig()
    const router = useRouter()
    const dispatch = useDispatch()

    /** Hostname */
    const hostname = useCallback(
        /**
         * Get hostname
         * @param {string} url Url
         */
        (url) => {
            try {
                const host = (new URL(url))?.hostname?.split('.')
                return host?.length > 2 ? host?.[1] : host?.[0]
            } catch {
                return null
            }
        },
        [bootleg]
    )

    /** Update bootleg API */
    const update = useCallback(
        /**
         * @param {Bootleg} bootlegData
         */
        async (bootlegData) => {
            try {
                const id = /** @type {string} */ (router?.query?.id)
                if (bootlegData?.state !== 3) {
                    bootlegHandlerUpdateById.current = bootlegHandler.updateById(bootlegData, id?.substring(id?.lastIndexOf("-") + 1))
                    setBootleg(await bootlegHandlerUpdateById.current.fetch())
                } else {
                    bootlegHandlerRemoveById.current = bootlegHandler.removeById(id?.substring(id?.lastIndexOf("-") + 1))
                    setBootleg(await bootlegHandlerRemoveById.current.fetch())
                }
                dispatch(setMessage({ message: { isDisplay: true, content: 'Bootleg state has been correctly updated', type: 'success' } }))
            } catch (error) {
                switch (error?.constructor) {
                    case CancelRequestError: break
                    case UnauthorizedError:
                    case AuthentificationError:
                        router.push('/user/login')
                        dispatch(removeToken(undefined))
                        dispatch(setMessage({ message: { isDisplay: true, content: /** @type {Error} */(error).message, type: 'warning' } }))
                        break
                    case InvalidEntityError:
                    case NotFoundError:
                    case NotImplementedError:
                    default:
                        dispatch(setMessage({ message: { isDisplay: true, content: 'An error occured during the bootleg update', type: 'danger' } }))
                        console.error(error)
                        break
                }
                return error
            }
        },
        []
    )

    /** Clicked on link */
    const click = useCallback(
        async () => {
            try {
                bootlegHandlerClick.current = bootlegHandler.click(bootleg._id)
                setBootleg(await bootlegHandlerClick.current.fetch())
            } catch (error) {
                console.error(error)
            }
        },
        [bootleg]
    )

    /** Report */
    const addReport = useCallback(
        async () => {
            try {
                bootlegHandlerCreateReport.current = bootlegHandler.createReport(bootleg._id, { message: report.message })
                setBootleg(await bootlegHandlerCreateReport.current.fetch())
                setReport(new Report())
                setErrorFieldReport(new ErrorReport())
                dispatch(setMessage({ message: { isDisplay: true, content: 'Your report has been correctly added', type: 'success' } }))
            } catch (error) {
                switch (error?.constructor) {
                    case CancelRequestError: break
                    case UnauthorizedError:
                    case AuthentificationError:
                        router.push('/user/login')
                        dispatch(removeToken(undefined))
                        dispatch(setMessage({ message: { isDisplay: true, content: /** @type {Error} */(error).message, type: 'warning' } }))
                        break
                    case InvalidEntityError:
                    case NotFoundError:
                    case NotImplementedError:
                    default:
                        dispatch(setMessage({ message: { isDisplay: true, content: 'An error occured during the report', type: 'danger' } }))
                        console.error(error)
                        break
                }
                return error
            }
        },
        [bootleg, report]
    )

    useEffect(() => () => {
        bootlegHandlerUpdateById.current?.cancel()
        bootlegHandlerRemoveById.current?.cancel()
        bootlegHandlerClick.current?.cancel()
        bootlegHandlerCreateReport.current?.cancel()
    }, [])

    return (
        <>
            <Head>
                <title>{bootleg.title} - {publicRuntimeConfig.appName}</title>
                <meta
                    name="description"
                    content={`Live bootleg from ${bootleg?.bands?.join(', ')} played on ${new Date(bootleg.date)?.getFullYear()} in ${bootleg?.countries?.join(', ')}`}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "MusicEvent",
                            name: bootleg.title,
                            description: bootleg.description,
                            startDate: bootleg.date.toISOString()?.split('T')?.[0],
                            endDate: bootleg.date.toISOString()?.split('T')?.[0],
                            image: `${publicRuntimeConfig.backUrl}/images/${bootleg.picture}`,
                            url: `${publicRuntimeConfig.appUrl}/bootleg/${bootleg.title}-${bootleg._id}`,
                            location: {
                                "@type": "MusicVenue",
                                name: `${bootleg.countries?.[0]}, ${bootleg.cities?.[0]}`,
                                address: `${bootleg.cities?.[0]}`
                            },
                            performer: bootleg.bands?.map(band => ({
                                "@type": "MusicGroup",
                                name: band
                            })),
                            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
                            eventStatus: "https://schema.org/EventScheduled",
                            offers: {
                                "@type": "Offer",
                                availability: "https://schema.org/OutOfStock",
                                price: "0",
                                priceCurrency: "EUR",
                                url: `${publicRuntimeConfig.appUrl}/bootleg/${bootleg.title}-${bootleg._id}`,
                                validFrom: bootleg.date.toISOString()?.split('T')?.[0]
                            },
                            organizer: {
                                "@type": "Organization",
                                name: publicRuntimeConfig.appName,
                                email: publicRuntimeConfig.appMail,
                                url: publicRuntimeConfig.appUrl
                            }
                        })
                    }}
                />
            </Head>

            <main className={styles['index-id-bootleg']}>
                <Section>
                    <Container>
                        <Columns>
                            <Columns.Column className="is-two-thirds-desktop">
                                <Columns>
                                    <Columns.Column size="one-third">
                                        <figure className="image">
                                            <Image
                                                src={bootleg.picture ? `${publicRuntimeConfig.backUrl}/images/${bootleg.picture}` : '/logo.png'}
                                                alt={bootleg.title ?? "bootleg"}
                                                layout="fill"
                                            />
                                        </figure>
                                    </Columns.Column>
                                    <Columns.Column size="two-thirds">
                                        <h1
                                            className="title is-3 is-title-underline is-capitalize"
                                            title={bootleg.title}
                                        >
                                            {bootleg.title}
                                        </h1>
                                        <p>
                                            {bootleg.description}
                                        </p>
                                    </Columns.Column>
                                </Columns>

                                <h2 className="title is-4 is-title-underline">Setlist</h2>
                                <ul className={classNames(styles['block-list'], styles['is-small'], styles['has-radiust'], styles['is-greyblue'], styles['is-highlighted'])}>
                                    {bootleg.songs?.map((song, i) => (
                                        <li
                                            key={i}
                                            className="is-capitalize"
                                        >
                                            <strong>{i + 1} - </strong>
                                            <Link
                                                href={{
                                                    pathname: `/bootleg/search`,
                                                    query: {
                                                        string: song?.toLowerCase(),
                                                        searchBy: ESearch.SONG
                                                    }
                                                }}
                                            >
                                                <a>
                                                    {song}
                                                </a>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </Columns.Column>
                            <Columns.Column size="one-third">
                                <div className={styles.sticky}>
                                    {!!token && (me?.role > 1 || me?._id === bootleg.createdById) &&
                                        <div className="boxed">
                                            <h2 className="title is-4 is-title-underline">
                                                Actions&nbsp;
                                        <span className="tag is-dark-pink is-v-bottom"><FontAwesomeIcon icon={faMapMarker} />&nbsp;&nbsp;{bootleg.stateName}</span>
                                            </h2>
                                            <div className={classNames("buttons", styles.buttons)}>
                                                {(me?.role > 1 || me?._id === bootleg.createdById) &&
                                                    <Button
                                                        label="Edit"
                                                        iconLeft={faEdit}
                                                        color="greyblue"
                                                        styles={{
                                                            button: classNames('is-small', styles.button)
                                                        }}
                                                        href={{
                                                            pathname: `/bootleg/${router.query?.id}/edit`
                                                        }}
                                                    />
                                                }
                                                {((me?.role > 1 || me?._id === bootleg.createdById) && bootleg.state === 0) &&
                                                    <Button
                                                        label="Validate"
                                                        iconLeft={faCheck}
                                                        onClick={() => {
                                                            setModal({
                                                                isDisplay: true,
                                                                title: 'Validate the bootleg?',
                                                                children: <>Are you sure you want to validate this bootleg?<br /> The bootleg is going to be in the <b>Pending</b> state.</>,
                                                                onClickYes: async () => {
                                                                    const err = await update(new Bootleg({ ...bootleg, state: 1 }))
                                                                    if (!err)
                                                                        dispatch(addToBootlegs({ bootleg: bootleg?.toJson() }))
                                                                    setModal({ isDisplay: false })
                                                                }
                                                            })
                                                        }}
                                                        color="greyblue"
                                                        styles={{
                                                            button: classNames('is-small', styles.button)
                                                        }}
                                                    />
                                                }
                                                {me?.role > 1 && bootleg.state < 2 &&
                                                    <Button
                                                        label="Publish"
                                                        iconLeft={faCheckDouble}
                                                        onClick={() => {
                                                            setModal({
                                                                isDisplay: true,
                                                                title: 'Publish the bootleg?',
                                                                children: <>Are you sure you want to Publish this bootleg?<br /> The bootleg is going to be in the <b>Published</b> state and going to be visible from everyone.</>,
                                                                onClickYes: async () => {
                                                                    const err = await update(new Bootleg({ ...bootleg, state: 2 }))
                                                                    if (!err)
                                                                        dispatch(removeFromBootlegs({ bootleg: bootleg.toJson() }))
                                                                    setModal({ isDisplay: false })
                                                                }
                                                            })
                                                        }}
                                                        color="greyblue"
                                                        styles={{
                                                            button: classNames('is-small', styles.button)
                                                        }}
                                                    />
                                                }
                                                {me?.role > 1 && bootleg.state !== 0 &&
                                                    <Button
                                                        label="Draft"
                                                        iconLeft={faTimes}
                                                        onClick={() => {
                                                            setModal({
                                                                isDisplay: true,
                                                                title: 'Draft the bootleg?',
                                                                children: <>Are you sure you want this bootleg to go back to draft?<br /> The bootleg is going to be in the <b>Draft</b> state.</>,
                                                                onClickYes: async () => {
                                                                    const err = await update(new Bootleg({ ...bootleg, state: 0 }))
                                                                    if (!err)
                                                                        dispatch(removeFromBootlegs({ bootleg: bootleg.toJson() }))
                                                                    setModal({ isDisplay: false })
                                                                }
                                                            })
                                                        }}
                                                        color="greyblue"
                                                        styles={{
                                                            button: classNames('is-small', styles.button)
                                                        }}
                                                    />
                                                }
                                                {me?.role > 2 && bootleg.state !== 3 &&
                                                    <Button
                                                        label="Delete"
                                                        iconLeft={faTrash}
                                                        onClick={() => {
                                                            setModal({
                                                                isDisplay: true,
                                                                title: 'Delete the bootleg?',
                                                                children: <>Are you sure you want to delete this bootleg?<br /> The bootleg is going to be in the <b>Deleted</b> state.</>,
                                                                onClickYes: async () => {
                                                                    const err = await update(new Bootleg({ ...bootleg, state: 3 }))
                                                                    if (!err)
                                                                        dispatch(removeFromBootlegs({ bootleg: bootleg.toJson() }))
                                                                    setModal({ isDisplay: false })
                                                                }
                                                            })
                                                        }}
                                                        color="greyblue"
                                                        styles={{
                                                            button: classNames('is-small', styles.button)
                                                        }}
                                                    />
                                                }
                                            </div>
                                        </div>
                                    }

                                    <br />

                                    <div className="boxed">
                                        <h2 className="title is-4 is-title-underline">
                                            Details
                                        </h2>
                                        <span className="is-capitalize">
                                            <strong>Date:</strong>
                                            <Link
                                                href={{
                                                    pathname: `/bootleg/search`,
                                                    query: {
                                                        year: new Date(bootleg.date)?.getFullYear(),
                                                    }
                                                }}
                                            >
                                                <a>
                                                    {new Date(bootleg.date)?.toLocaleDateString('en-EN', { year: 'numeric', month: 'short', day: '2-digit' })}
                                                </a>
                                            </Link>
                                        </span>
                                        <br />

                                        <span className="is-capitalize">
                                            <strong>{bootleg.bands?.length > 1 ? 'Bands' : 'Band'}:</strong>
                                            <ul className={styles['flat-list']}>
                                                {bootleg.bands?.map((band, i) => (
                                                    <li key={i}>
                                                        <Link
                                                            href={{
                                                                pathname: `/bootleg/search`,
                                                                query: {
                                                                    string: band?.toLowerCase(),
                                                                    searchBy: ESearch.BAND
                                                                }
                                                            }}
                                                        >
                                                            {band}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </span>
                                        <br />

                                        <span className="is-capitalize">
                                            <strong>{bootleg.countries?.length > 1 ? 'Countries' : 'Country'}:</strong>
                                            <ul className={styles['flat-list']}>
                                                {bootleg.countries?.map((country, i) => (
                                                    <li key={i}>
                                                        <Link
                                                            href={{
                                                                pathname: `/bootleg/search`,
                                                                query: {
                                                                    country: encodeURIComponent(country),
                                                                }
                                                            }}
                                                        >
                                                            {country}
                                                        </Link>
                                                        {i < bootleg.countries?.length - 1 && ', '}
                                                    </li>
                                                ))}
                                            </ul>
                                        </span>
                                        <br />

                                        <span className="is-capitalize">
                                            <strong>{bootleg.cities?.length > 1 ? 'Cities' : 'City'}:</strong>
                                            <ul className={styles['flat-list']}>
                                                {bootleg.cities?.map((city, i) => (
                                                    <li key={i}>
                                                        <Link
                                                            href={{
                                                                pathname: `/bootleg/search`,
                                                                query: {
                                                                    city: encodeURIComponent(city?.toLowerCase()),
                                                                }
                                                            }}
                                                        >
                                                            {city}
                                                        </Link>
                                                        {i < bootleg.countries?.length - 1 && ', '}
                                                    </li>
                                                ))}
                                            </ul>
                                        </span>
                                    </div>

                                    <br />

                                    <div className="boxed">
                                        <h2 className="title is-4 is-title-underline">
                                            {bootleg.isAudioOnly ? 'Listen' : 'Watch'}
                                        </h2>
                                        <div className="field is-grouspaned">
                                            {bootleg.links?.map((link, i) =>
                                                <p className="control" key={i}>
                                                    <a
                                                        className="button is-pink"
                                                        href={link}
                                                        target="_blank"
                                                        onClick={click}
                                                        rel="noopener"
                                                    >
                                                        <span className="icon">
                                                            <FontAwesomeIcon icon={faHeadphonesAlt} />
                                                        </span>
                                                        <span className="is-capitalize">{hostname(link) ?? `Link N°${i + 1}`}</span>
                                                    </a>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <br />

                                    <div className="boxed">
                                        <h2 className="title is-4 is-title-underline">
                                            Informations
                                        </h2>

                                        <span className="is-capitalize">
                                            <strong>Audio only:</strong>
                                            <Link
                                                href={{
                                                    pathname: `/bootleg/search`,
                                                    query: {
                                                        isAudioOnly: bootleg.isAudioOnly ? 1 : 0
                                                    }
                                                }}
                                            >
                                                <a>
                                                    {bootleg.isAudioOnly ? 'Yes' : 'No'}
                                                </a>
                                            </Link>
                                        </span>
                                        <br />

                                        <span className="is-capitalize">
                                            <strong>Complete show:</strong>
                                            <Link
                                                href={{
                                                    pathname: `/bootleg/search`,
                                                    query: {
                                                        isCompleteShow: bootleg.isCompleteShow ? 1 : 0
                                                    }
                                                }}
                                            >
                                                <a>
                                                    {bootleg.isCompleteShow ? 'Yes' : 'No'}
                                                </a>
                                            </Link>
                                        </span>
                                        <br />

                                        <span className="is-capitalize">
                                            <strong>Pro record:</strong>
                                            <Link
                                                href={{
                                                    pathname: `/bootleg/search`,
                                                    query: {
                                                        isProRecord: bootleg.isProRecord ? 1 : 0
                                                    }
                                                }}
                                            >
                                                <a>
                                                    {bootleg.isProRecord ? 'Yes' : 'No'}
                                                </a>
                                            </Link>
                                        </span>
                                        <br />

                                        <span className="is-capitalize">
                                            <strong>Sound quality:</strong>
                                            <Rating
                                                value={bootleg.soundQuality}
                                                isReadonly={true}
                                            />
                                        </span>
                                        <br />

                                        <span className="is-capitalize">
                                            <strong>Video quality:</strong>
                                            {bootleg.isAudioOnly ?
                                                <i>N/A</i> :
                                                <Rating
                                                    value={bootleg.videoQuality}
                                                    isReadonly={true}
                                                />
                                            }
                                        </span>
                                    </div>

                                    <br />

                                    <div className="boxed">
                                        <h2 className="title is-4 is-title-underline">
                                            Creator
                                        </h2>
                                        <span className="is-capitalize">
                                            <strong>Submited by:</strong>
                                            <Link
                                                href={{
                                                    pathname: `/bootleg/search`,
                                                    query: {
                                                        authorId: bootleg.createdById
                                                    }
                                                }}
                                            >
                                                <a>
                                                    {bootleg.createdBy?.username ?? <i>Deleted user</i>}
                                                </a>
                                            </Link>
                                        </span>
                                        <br />

                                        <span className="is-capitalize">
                                            <strong>Submited on:</strong>
                                            {new Date(bootleg.createdOn)?.toLocaleDateString('en-EN', { year: 'numeric', month: 'short', day: '2-digit' })}
                                        </span>
                                        <br />

                                        <span className="is-capitalize">
                                            <strong>Time {bootleg.isAudioOnly ? 'listened' : 'watched'}:</strong>
                                            <span title={bootleg.clickedCount?.toString()}>{bootleg.clickedCountAbr}</span>
                                        </span>
                                        <br />

                                        <br />
                                        <a
                                            onClick={() => setModalReport({ isDisplay: true })}
                                        >
                                            Report
                                        </a>
                                    </div>
                                </div>
                            </Columns.Column>
                        </Columns>
                    </Container>
                </Section>
            </main>

            <Modal
                isDisplay={modal.isDisplay}
                title={modal.title}
                onClickYes={modal.onClickYes}
                onClickNo={() => setModal({ isDisplay: false })}
            >
                {modal.children}
            </Modal>

            <Modal
                isDisplay={modalReport.isDisplay}
                title="Report a problem"
                onClickYes={async () => {
                    const err = await addReport()
                    if (!err)
                        setModalReport({ isDisplay: false })
                }}
                onClickNo={() => setModalReport({ isDisplay: false })}
            >
                <Input
                    label="Message"
                    placeholder="Your message"
                    isRequired={true}
                    value={report.message}
                    errorMessage={errorFieldReport.message}
                    onChange={ev => setReport(new Report({ ...report, message: ev.target.value }))}
                    multiline
                // min={5}
                />
            </Modal>
        </>
    )
}

/** Get server side props */
export const getServerSideProps = wrapper.getServerSideProps(
    /**
     * Get server side props
     * @param {GetServerSidePropsContext & {store: Store<{ main: MainState; notification: NotificationState }, AnyAction>;}} ctx
     */
    async ({ query, req, store }) => {
        try {
            const bootlegHandler = new BootlegHandler({ req })
            const id = /** @type {string} */ (query.id)
            const bootleg = await bootlegHandler.getById(id.substring(id?.lastIndexOf("-") + 1)).fetch()

            return { props: { bootlegProps: bootleg.toJson() } }
        } catch (error) {
            switch (error?.constructor) {
                case CancelRequestError: break
                case UnauthorizedError:
                case AuthentificationError:
                    /** Issue: https://github.com/kirill-konshin/next-redux-wrapper/pull/295 */
                    store.dispatch(setMessage({
                        message: {
                            isDisplay: true,
                            content: /** @type {Error} */(error).message,
                            type: 'warning'
                        }
                    }))
                    store.dispatch(removeToken(undefined))
                    return {
                        redirect: {
                            destination: '/user/login',
                            permanent: false
                        }
                    }
                case NotFoundError:
                    return { notFound: true }
                case InvalidEntityError:
                case NotImplementedError:
                default:
                    console.error(error)
                    break
            }
        }
    }
)

export default connect((state) => state)(withHandlers(IndexIdBootleg))