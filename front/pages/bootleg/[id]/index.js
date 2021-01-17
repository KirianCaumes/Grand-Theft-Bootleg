import React, { useCallback, useMemo, useState } from "react"
import Head from "next/head"
import { GetServerSidePropsContext } from 'next'
// @ts-ignore
import styles from "styles/pages/bootleg/[id]/index.module.scss"
import BootlegManager from "request/managers/bootlegManager"
// @ts-ignore
import { Section, Columns, Container } from 'react-bulma-components'
import Bootleg from 'request/objects/bootleg'
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeadphonesAlt, faEdit, faCheck, faTimes, faTrash, faCheckDouble, faMapMarker } from "@fortawesome/free-solid-svg-icons"
import withManagers, { ManagersProps } from "helpers/hoc/withManagers"
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

/**
 * @typedef {object} BootlegProps
 * @property {Bootleg} bootlegProps Bootleg from props
 */

/**
 * Bootleg page
 * @param {BootlegProps & ManagersProps & ReduxProps} props 
 */
function IndexIdBootleg({ bootlegProps, bootlegManager, main: { token, me }, ...props }) {
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

    const { publicRuntimeConfig } = getConfig()
    const router = useRouter()
    const dispatch = useDispatch()

    /** Score */
    const score = useCallback(
        /**
         * Get score
         * @param {number} value score  
         */
        (value = 0) => {
            if (value > 5)
                value = 5
            else if (value < 0)
                value = 0

            return (<>
                {
                    new Array(value <= 5 ? value : 5)
                        .fill({})
                        .map((x, i) =>
                            <span className="has-text-pink" key={i}>★</span>
                        )
                }
                {
                    new Array(5 - value > 0 ? 5 - value : 0)
                        .fill({})
                        .map((x, i) =>
                            <span className="has-text-pink" key={i}>☆</span>
                        )
                }
            </>)
        },
        [bootleg]
    )

    /** Set list */
    const setlist = useMemo(
        () => <>
            <h2 className="title is-4 is-title-underline">Setlist</h2>
            <ul className="block-list is-small has-radius is-greyblue is-highlighted ">
                {bootleg.songs?.map((song, i) => (
                    <li
                        key={i}
                        className="is-capitalize"
                    >
                        <strong>{i + 1} - </strong>
                        <Link
                            href={`/bootleg/search?string=${encodeURIComponent(song?.toLocaleLowerCase())}&searchBy=${ESearch.SONG}`}
                        >
                            <a>
                                {song}
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </>,
        [bootleg]
    )

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
                if (bootlegData?.state !== 3)
                    setBootleg(await bootlegManager.updateById(bootlegData, id?.substring(id?.lastIndexOf("-") + 1)))
                else
                    setBootleg(await bootlegManager.removeById(id?.substring(id?.lastIndexOf("-") + 1)))

                dispatch(setMessage({
                    message: {
                        isDisplay: true,
                        content: 'Bootleg state has been correctly updated',
                        type: 'success'
                    }
                }))
            } catch (error) {
                switch (error?.constructor) {
                    case CancelRequestError: break
                    case UnauthorizedError:
                    case AuthentificationError:
                        router.push('/login')
                        dispatch(removeToken(undefined))
                        dispatch(setMessage({
                            message: {
                                isDisplay: true,
                                content: /** @type {Error} */(error).message,
                                type: 'warning'
                            }
                        }))
                        break
                    case InvalidEntityError:
                    case NotFoundError:
                    case NotImplementedError:
                    default:
                        dispatch(setMessage({
                            message: {
                                isDisplay: true,
                                content: 'An error occured during the bootleg update',
                                type: 'danger'
                            }
                        }))
                        console.log(error)
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
                setBootleg(await bootlegManager.click(bootleg._id))
            } catch (error) {
                console.error(error?.message)
            }
        },
        [bootleg]
    )

    /** Report */
    const addReport = useCallback(
        async () => {
            try {
                setBootleg(await bootlegManager.createReport(bootleg._id, { message: report.message }))
                setReport(new Report())
                setErrorFieldReport(new ErrorReport())
                dispatch(setMessage({
                    message: {
                        isDisplay: true,
                        content: 'Your report has been correctly added',
                        type: 'success'
                    }
                }))
            } catch (error) {
                switch (error?.constructor) {
                    case CancelRequestError: break
                    case UnauthorizedError:
                    case AuthentificationError:
                        router.push('/login')
                        dispatch(removeToken(undefined))
                        dispatch(setMessage({
                            message: {
                                isDisplay: true,
                                content: /** @type {Error} */(error).message,
                                type: 'warning'
                            }
                        }))
                        break
                    case InvalidEntityError:
                    case NotFoundError:
                    case NotImplementedError:
                    default:
                        dispatch(setMessage({
                            message: {
                                isDisplay: true,
                                content: 'An error occured during the report',
                                type: 'danger'
                            }
                        }))
                        console.log(error)
                        break
                }
                return error
            }
        },
        [bootleg, report]
    )

    return (
        <>
            <Head>
                <title>{bootleg.title} - {publicRuntimeConfig.appName}</title>
            </Head>

            <main className={styles['index-id-bootleg']}>
                <Section>
                    <Container>
                        <Columns className="is-variable is-8">
                            <Columns.Column className="is-two-thirds-desktop">
                                <Columns className="is-variable is-3">
                                    <Columns.Column size="one-third">
                                        <figure className="image">
                                            <Image //TODO remplace later with IMAGE component from Next
                                                src={`${publicRuntimeConfig.backUrl}/images/${bootleg.picture}`}
                                                alt={bootleg.title ?? "bootleg"}
                                                layout="fill"
                                            // onError={ev => {
                                            //     const target = /** @type {HTMLImageElement} */(ev.target)
                                            //     target.src = "/logo.png"
                                            // }}
                                            // layout="responsive"
                                            // width={250}
                                            // height={250}
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
                                <div className="is-hidden-mobile">
                                    {setlist}
                                </div>
                            </Columns.Column>
                            <Columns.Column size="one-third">
                                {!!token && (me?.role > 1 || me?._id === bootleg.createdById) && <>
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
                                                href={`/bootleg/${router.query?.id}/edit`}
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

                                    <br />
                                </>}
                                <h2 className="title is-4 is-title-underline">
                                    Details
                                </h2>
                                <span className="is-capitalize">
                                    <strong>Date:</strong>
                                    <Link
                                        href={`/bootleg/search?year=${encodeURIComponent(new Date(bootleg.date)?.getFullYear())}`}
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
                                                    href={`/bootleg/search?string=${encodeURIComponent(band?.toLowerCase())}&searchBy=${ESearch.BAND}`}
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
                                                    href={`/search?country=${encodeURIComponent(country)}`}
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
                                                    href={`/bootleg/search?city=${encodeURIComponent(city?.toLowerCase())}`}
                                                >
                                                    {city}
                                                </Link>
                                                {i < bootleg.countries?.length - 1 && ', '}
                                            </li>
                                        ))}
                                    </ul>
                                </span>

                                <br />
                                <br />
                                <br />

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
                                            >
                                                <span className="icon">
                                                    <FontAwesomeIcon icon={faHeadphonesAlt} />
                                                </span>
                                                <span className="is-capitalize">{hostname(link) ?? `Link N°${i + 1}`}</span>
                                            </a>
                                        </p>
                                    )}
                                </div>

                                <br />
                                <br />
                                <h2 className="title is-4 is-title-underline">
                                    Informations
                                </h2>

                                <span className="is-capitalize">
                                    <strong>Audio only:</strong>
                                    <Link
                                        href={`/bootleg/search?isAudioOnly=${encodeURIComponent(bootleg.isAudioOnly ? 1 : 0)}`}
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
                                        href={`/bootleg/search?isCompleteShow=${encodeURIComponent(bootleg.isCompleteShow ? 1 : 0)}`}
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
                                        href={`/bootleg/search?isProRecord=${encodeURIComponent(bootleg.isProRecord ? 1 : 0)}`}
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

                                <br />
                                <br />
                                <br />

                                <h2 className="title is-4 is-title-underline">
                                    Creator
                                </h2>
                                <span className="is-capitalize">
                                    <strong>Submited by:</strong>
                                    <Link
                                        href={`/bootleg/search?authorId=${encodeURIComponent(bootleg.createdById)}`}
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
                                    <strong>Time listened:</strong>
                                    {bootleg.clickedCount}
                                </span>
                                <br />

                                <div className="is-hidden-tablet">
                                    <br />
                                    <br />
                                    {setlist}
                                </div>

                                <br />
                                <a
                                    onClick={() => setModalReport({ isDisplay: true })}
                                >
                                    Report
                                </a>
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
            const bootlegManager = new BootlegManager({ req })
            const id = /** @type {string} */ (query.id)
            const bootleg = await bootlegManager.getById(id.substring(id?.lastIndexOf("-") + 1))

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
                            destination: '/login',
                            permanent: false
                        }
                    }
                case NotFoundError:
                    return { notFound: true }
                case InvalidEntityError:
                case NotImplementedError:
                default:
                    console.log(error)
                    break
            }
        }
    }
)

export default connect((state) => state)(withManagers(IndexIdBootleg))