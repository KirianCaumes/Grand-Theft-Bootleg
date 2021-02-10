import React, { useCallback, useState, MutableRefObject, useRef, useEffect } from "react"
import { GetServerSidePropsContext } from 'next'
import Head from "next/head"
// @ts-ignore
import styles from "styles/pages/user/index.module.scss"
// @ts-ignore
import { Section, Container, Columns, Content } from 'react-bulma-components'
import withHandlers, { HandlersProps } from 'helpers/hoc/withHandlers'
import getConfig from 'next/config'
import { connect, useDispatch } from "react-redux"
import { Store, AnyAction } from "redux"
import { ReduxProps, wrapper } from 'redux/store'
import Link from "next/link"
import { MainState, removeToken, setMessage, setToken, setUser } from "redux/slices/main"
import { NotificationState } from 'redux/slices/notification'
import { CancelRequestError } from "request/errors/cancelRequestError"
import { AuthentificationError } from "request/errors/authentificationError"
import { UnauthorizedError } from "request/errors/unauthorizedError"
import { InvalidEntityError } from "request/errors/invalidEntityError"
import { NotFoundError } from "request/errors/notFoundError"
import { NotImplementedError } from "request/errors/notImplementedError"
import BootlegHandler from "request/handlers/bootlegHandler"
import Bootleg from "request/objects/bootleg"
import { ESort } from "types/searchFilters/sort"
import { EStates } from "types/searchFilters/states"
import Button from "components/form/button"
import { faPlus, faSync, faUserEdit, faUserMinus } from "@fortawesome/free-solid-svg-icons"
import Image from "next/image"
import classNames from 'classnames'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { EUserRolesLabel } from "types/userRoles"
import Modal, { ModalType } from "components/general/modal"
import Input from "components/form/input"
import User, { ErrorUser } from "request/objects/user"
import { RequestApi } from 'request/apiHandler'
import { useRouter } from "next/router"
import Cookie from "helpers/cookie"
import UserHandler from "request/handlers/userHandler"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { UrlObject } from 'url'
import { Status } from "types/status"
import BootlegMeta from "request/objects/meta/bootlegMeta"
import Loader from "components/general/loader"
import { faEye } from "@fortawesome/free-regular-svg-icons"

/**
 * @typedef {object} IndexUserProps
 * @property {Bootleg[]} bootlegsPublishedProps Bootlegs from API
 * @property {Bootleg[]} bootlegsPendingProps Bootlegs from API
 * @property {Bootleg[]} bootlegsDraftProps Bootlegs from API
 * @property {Bootleg[]} bootlegAdminPendingProps Bootlegs from API
 * @property {Bootleg[]} bootlegAdminReportProps Bootlegs from API
 */

/**
 * Index page
 * @param {IndexUserProps & HandlersProps & ReduxProps} props 
 */
function IndexUser({ main: { me }, bootlegsPublishedProps, bootlegsPendingProps, bootlegsDraftProps, bootlegAdminPendingProps, bootlegAdminReportProps, userHandler, bootlegHandler }) {
    /** @type {[User, function(User):any]} User */
    const [userMe, setUserMe] = useState(me)
    /** @type {[ModalType, function(ModalType):any]} Modal user infos */
    const [modalUsr, setModalUsr] = useState({ isDisplay: !!false })
    /** @type {[ModalType, function(ModalType):any]} Modal user infos */
    const [modal, setModal] = useState({ isDisplay: !!false })
    /** @type {[ErrorUser, function(ErrorUser):any]} Errors */
    const [errorFieldUser, setErrorFieldUser] = useState(new ErrorUser())

    /** @type {[Bootleg[], function(Bootleg[]):any]} BootlegAdminPending */
    const [bootlegAdminPending, setBootlegAdminPending] = useState(bootlegAdminPendingProps)
    /** @type {[string, function(string):any]} BootlegAdminPending Status */
    const [BootlegAdminPendingStatus, setBootlegAdminPendingStatus] = React.useState(Status.RESOLVED)

    /** @type {[Bootleg[], function(Bootleg[]):any]} bootlegAdminReport */
    const [bootlegAdminReport, setBootlegAdminReport] = useState(bootlegAdminReportProps)
    /** @type {[string, function(string):any]} bootlegAdminReport Status */
    const [bootlegAdminReportStatus, setBootlegAdminReportStatus] = React.useState(Status.RESOLVED)

    /** @type {MutableRefObject<RequestApi<User>>} */
    const userHandlerUpdateById = useRef()
    /** @type {MutableRefObject<RequestApi<User>>} */
    const userHandlerSendMail = useRef()
    /** @type {MutableRefObject<RequestApi<[Bootleg[], BootlegMeta]>>} */
    const bootlegHandlerGetAllPending = useRef()
    /** @type {MutableRefObject<RequestApi<[Bootleg[], BootlegMeta]>>} */
    const bootlegHandlerGetAllReport = useRef()
    /** @type {MutableRefObject<RequestApi<Bootleg>>} */
    const bootlegHandlerRemoveReports = useRef()

    const { publicRuntimeConfig } = getConfig()
    const router = useRouter()
    const dispatch = useDispatch()

    /** Update user API */
    const update = useCallback(
        async () => {
            try {
                userHandlerUpdateById.current = userHandler.updateById(userMe, 'me')
                const usrBdd = await userHandlerUpdateById.current.fetch()
                setUser({ user: usrBdd })
                dispatch(setUser({ user: usrBdd.toJson() }))
                dispatch(setMessage({ message: { isDisplay: true, content: 'Your informations has been correctly updated', type: 'success' } }))
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
                        setErrorFieldUser(error.errorField)
                        dispatch(setMessage({ message: { isDisplay: true, content: 'Some fields are invalid', type: 'danger' } }))
                        break
                    case NotFoundError:
                    case NotImplementedError:
                    default:
                        dispatch(setMessage({ message: { isDisplay: true, content: 'An error occured during the user update', type: 'danger' } }))
                        console.error(error)
                        break
                }
                return error
            }
        },
        [userMe]
    )

    /** Send mail user API */
    const sendMail = useCallback(
        /**
         * @param {'password' | 'delete'} type
         */
        async (type) => {
            try {
                userHandlerSendMail.current = userHandler.sendMail(type)
                await userHandlerSendMail.current.fetch()
                dispatch(setMessage({ message: { isDisplay: true, content: 'An email has been send', type: 'success' } }))
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
                        dispatch(setMessage({ message: { isDisplay: true, content: 'An error occured', type: 'danger' } }))
                        console.error(error)
                        break
                }
                return error
            }
        },
        []
    )

    /** Refresh some bootlegs from API */
    const refresh = useCallback(
        /**
         * @param {'pending' | 'report'} type
         */
        async (type) => {
            try {
                switch (type) {
                    case "pending": {
                        setBootlegAdminPendingStatus(Status.PENDING)
                        setBootlegAdminPending([])
                        bootlegHandlerGetAllPending.current = bootlegHandler.getAll({
                            limit: 5,
                            orderBy: ESort.DATE_CREATION_DESC,
                            state: EStates.PENDING
                        })
                        const [bootlegs] = await bootlegHandlerGetAllPending.current.fetch()
                        setBootlegAdminPending(bootlegs)
                        setBootlegAdminPendingStatus(Status.RESOLVED)
                        break
                    }
                    case "report": {
                        setBootlegAdminReportStatus(Status.PENDING)
                        setBootlegAdminReport([])
                        bootlegHandlerGetAllPending.current = bootlegHandler.getAll({
                            limit: 5,
                            orderBy: ESort.DATE_CREATION_DESC,
                            isWithReport: 1
                        })
                        const [bootlegs] = await bootlegHandlerGetAllPending.current.fetch()
                        setBootlegAdminReport(bootlegs)
                        setBootlegAdminReportStatus(Status.RESOLVED)
                        break
                    }
                    default:
                        break
                }
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
                        switch (type) {
                            case "pending":
                                setBootlegAdminPendingStatus(Status.REJECTED)
                            case "report":
                                setBootlegAdminReportStatus(Status.REJECTED)
                                break
                            default:
                                break
                        }
                        dispatch(setMessage({ message: { isDisplay: true, content: 'An error occured', type: 'danger' } }))
                        console.error(error)
                        break
                }
                return error
            }
        },
        []
    )

    /** Clear report API */
    const clear = useCallback(
        async (id) => {
            try {
                bootlegHandlerRemoveReports.current = bootlegHandler.removeReports(id)
                await bootlegHandlerRemoveReports.current.fetch()
                setBootlegAdminReport(bootlegAdminReport.filter(x => x._id !== id))
                dispatch(setMessage({ message: { isDisplay: true, content: 'Report from the bootleg was cleared', type: 'success' } }))
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
                        dispatch(setMessage({ message: { isDisplay: true, content: 'An error occured', type: 'danger' } }))
                        console.error(error)
                        break
                }
                return error
            }
        },
        []
    )

    useEffect(() => () => {
        userHandlerUpdateById.current?.cancel()
        userHandlerSendMail.current?.cancel()
        bootlegHandlerGetAllPending.current?.cancel()
        bootlegHandlerGetAllReport.current?.cancel()
        bootlegHandlerGetAllReport.current?.cancel()
        bootlegHandlerRemoveReports.current?.cancel()
    }, [])

    return (
        <>
            <Head>
                <title>Your dashboard - {publicRuntimeConfig.appName}</title>
                <meta
                    name="description"
                    content="See informations of your Grand Theft Bootleg account: last publications, reset your password, etc."
                />
                <meta name="robots" content="noindex" />
            </Head>

            <main className={styles['index-user']}>
                <Section>
                    <Container>
                        <Columns>
                            <Columns.Column className="is-two-thirds">
                                <h1 className="title is-3 is-title-underline">
                                    <span className="is-capitalized">{me?.username}</span>'s dashboard
                                </h1>
                                <br />
                                {me.role > 1 && <>
                                    <TableBootleg
                                        title="Bootleg awaiting a validation"
                                        bootlegs={bootlegAdminPending}
                                        buttonAction={() => refresh("pending")}
                                        buttonIcon={faSync}
                                        status={BootlegAdminPendingStatus}
                                    />
                                    <br />
                                    <TableBootleg
                                        title="Bootleg with report awaiting"
                                        bootlegs={bootlegAdminReport}
                                        buttonAction={() => refresh("report")}
                                        buttonIcon={faSync}
                                        onClickSee={bootleg => setModal({
                                            isDisplay: true,
                                            title: `Report on "${bootleg.title}"`,
                                            children: <Content>
                                                <ol>
                                                    {bootleg.report?.map(x => <li>{x.message}</li>)}
                                                </ol>
                                            </Content>,
                                            onClickYes: async () => {
                                                const err = await clear(bootleg._id)
                                                if (!err)
                                                    setModal({ isDisplay: false })
                                            }
                                        })}
                                        status={bootlegAdminReportStatus}
                                    />
                                    <br />
                                </>}
                                <TableBootleg
                                    title="Your last bootlegs published"
                                    bootlegs={bootlegsPublishedProps}
                                    buttonIcon={faPlus}
                                    buttonHref="/bootleg/new/edit"
                                    actionHref={{
                                        pathname: '/bootleg/search',
                                        query: {
                                            orderBy: ESort.DATE_CREATION_DESC,
                                            state: EStates.PUBLISHED,
                                            authorId: me?._id
                                        }
                                    }}
                                />
                                <br />
                                <TableBootleg
                                    title="Your last bootlegs pending"
                                    bootlegs={bootlegsPendingProps}
                                    buttonIcon={faPlus}
                                    buttonHref="/bootleg/new/edit"
                                    actionHref={{
                                        pathname: '/bootleg/search',
                                        query: {
                                            orderBy: ESort.DATE_CREATION_DESC,
                                            state: EStates.PENDING,
                                            authorId: me?._id
                                        }
                                    }}
                                />
                                <br />
                                <TableBootleg
                                    title="Your last bootlegs draft"
                                    bootlegs={bootlegsDraftProps}
                                    buttonIcon={faPlus}
                                    buttonHref="/bootleg/new/edit"
                                    actionHref={{
                                        pathname: '/bootleg/search',
                                        query: {
                                            orderBy: ESort.DATE_CREATION_DESC,
                                            state: EStates.DRAFT,
                                            authorId: me?._id
                                        }
                                    }}
                                />
                            </Columns.Column>
                            <Columns.Column className="is-one-third">
                                <h2 className="title is-4 is-title-underline">
                                    Your informations
                                </h2>

                                <span>
                                    <strong>Username:</strong>
                                    {me?.username ?? <i>Unknown</i>}
                                </span>
                                <br />
                                <span>
                                    <strong>Email:</strong>
                                    {me?.mail ?? <i>Unknown</i>}
                                </span>
                                {me.role > 1 && <>
                                    <br />
                                    <span>
                                        <strong>Role:</strong>
                                        {EUserRolesLabel[me?.role] ?? <i>Unknown</i>}
                                    </span>
                                </>}

                                <br />
                                <br />
                                <br />

                                <h2 className="title is-4 is-title-underline">
                                    Actions
                                </h2>
                                <a
                                    onClick={() => setModalUsr({ isDisplay: true })}
                                >
                                    Change your username
                                </a>&nbsp;<FontAwesomeIcon icon={faUserEdit} className="has-text-pink" />
                                <br />
                                <a
                                    onClick={() => setModal({
                                        isDisplay: true,
                                        title: 'Reset your password',
                                        children: 'A confirmation email will be send to you to reset your password.',
                                        onClickYes: async () => {
                                            const err = await sendMail('password')
                                            if (!err)
                                                setModal({ isDisplay: false })
                                        }
                                    })}
                                >
                                    Reset your password
                                </a>&nbsp;<FontAwesomeIcon icon={faUserEdit} className="has-text-pink" />
                                <br />
                                <a
                                    onClick={() => setModal({
                                        isDisplay: true,
                                        title: 'Delete your account',
                                        children: 'A confirmation email will be send to you to delete your account.',
                                        onClickYes: async () => {
                                            const err = await sendMail('delete')
                                            if (!err)
                                                setModal({ isDisplay: false })
                                        }
                                    })}
                                >
                                    Delete your account
                                </a>&nbsp;<FontAwesomeIcon icon={faUserMinus} className="has-text-pink" />
                            </Columns.Column>
                        </Columns>
                    </Container>
                </Section>
            </main>

            <Modal
                isDisplay={modalUsr.isDisplay}
                title="Edit your informations"
                onClickYes={async () => {
                    const err = await update()
                    if (!err)
                        setModalUsr({ isDisplay: false })
                }}
                onClickNo={() => setModalUsr({ isDisplay: false })}
            >
                <Input
                    label="Username"
                    placeholder="Your username"
                    isRequired={true}
                    value={userMe.username}
                    errorMessage={errorFieldUser.username}
                    onChange={ev => setUserMe(new User({ ...userMe, username: ev.target.value }))}
                />
            </Modal>

            <Modal
                isDisplay={modal.isDisplay}
                title={modal.title}
                onClickYes={modal.onClickYes}
                onClickNo={() => setModal({ isDisplay: false })}
            >
                {modal.children}
            </Modal>
        </>
    )
}

/**
 * @param {object} props 
 * @param {string} props.title
 * @param {Bootleg[]} props.bootlegs
 * @param {function(React.MouseEvent<any, MouseEvent>)=} props.buttonAction
 * @param {IconProp=} props.buttonIcon
 * @param {string | UrlObject=} props.buttonHref
 * @param {string | UrlObject=} props.actionHref
 * @param {Status=} props.status
 * @param {function=} props.onClickSee
 */
function TableBootleg({ title, bootlegs, buttonAction, buttonIcon, buttonHref, actionHref, status = Status.RESOLVED, onClickSee }) {
    const { publicRuntimeConfig } = getConfig()

    return (
        <>
            <h2 className="title is-4 is-title-underline">
                {title}&nbsp;
                <Button
                    iconLeft={buttonIcon}
                    href={buttonHref}
                    onClick={buttonAction}
                    styles={{ button: 'is-small' }}
                />
            </h2>
            {status === Status.PENDING ?
                <Loader
                    size="small"
                    isRight
                />
                :
                bootlegs?.length <= 0 ?
                    <p>
                        <i>No result found</i>
                        <br />
                        <br />
                    </p>
                    :
                    <>
                        {bootlegs?.map((bootleg, i) => (
                            <React.Fragment key={i}>
                                <div className={classNames("boxed", styles.bootlegRow)}>
                                    <Link href={`/bootleg/${bootleg._id}`}>
                                        <a>
                                            <Image
                                                src={bootleg.picture ? `${publicRuntimeConfig.backUrl}/images/${bootleg.picture}` : '/logo.png'}
                                                alt={bootleg.title ?? "bootleg"}
                                                title={bootleg.title}
                                                width={40}
                                                height={40}
                                            />
                                        </a>
                                    </Link>
                                    <div>
                                        <div>
                                            <Link href={`/bootleg/${bootleg._id}`}>
                                                <a>{bootleg?.title ?? <i>Unknown</i>}</a>
                                            </Link>
                                            <span>
                                                Added {new Date(bootleg.createdOn)?.toLocaleDateString('en-EN', { year: 'numeric', month: 'short', day: '2-digit' }) ?? <i>Unknown</i>}
                                            </span>
                                        </div>
                                        {!!onClickSee &&
                                            <div>
                                                <Button
                                                    iconLeft={faEye}
                                                    onClick={() => onClickSee(bootleg)}
                                                    styles={{ button: 'is-small' }}
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                        {!!actionHref &&
                            <p className="has-text-right">
                                <Link href={actionHref}>
                                    <a>
                                        See more &gt;
                                    </a>
                                </Link>
                            </p>
                        }
                    </>
            }
        </>
    )
}

/** Get server side props */
export const getServerSideProps = wrapper.getServerSideProps(
    /**
     * Get server side props
     * @param {GetServerSidePropsContext & {store: Store<{ main: MainState; notification: NotificationState }, AnyAction>;}} ctx
     */
    async ({ req, store }) => {
        const token = Cookie.get(req)

        if (token)
            store.dispatch(setToken({ token }))

        if (!store.getState().main.token)
            return { redirect: { destination: '/user/login', permanent: false } }

        try {
            const user = await (new UserHandler({ req })).getMe().fetch()
            if (!!user?._id)
                store.dispatch(setUser({ user: user.toJson() }))
        } catch (error) {
            console.error(error)
            return { redirect: { destination: '/user/login', permanent: false } }
        }

        const me = store.getState().main?.me

        if (!me)
            return { redirect: { destination: '/user/login', permanent: false } }

        try {
            const bootlegHandler = new BootlegHandler({ req })
            const [[bootlegsPublished], [bootlegsPending], [bootlegsDraft], [bootlegAdminPending], [bootlegAdminReport]] = await Promise.all([
                bootlegHandler.getAll({
                    limit: 5,
                    orderBy: ESort.DATE_CREATION_DESC,
                    state: EStates.PUBLISHED,
                    authorId: me?._id
                }).fetch(),
                bootlegHandler.getAll({
                    limit: 5,
                    orderBy: ESort.DATE_CREATION_DESC,
                    state: EStates.PENDING,
                    authorId: me?._id
                }).fetch(),
                bootlegHandler.getAll({
                    limit: 5,
                    orderBy: ESort.DATE_CREATION_DESC,
                    state: EStates.DRAFT,
                    authorId: me?._id
                }).fetch(),
                bootlegHandler.getAll({
                    limit: 5,
                    orderBy: ESort.DATE_CREATION_DESC,
                    state: EStates.PENDING
                }).fetch(),
                bootlegHandler.getAll({
                    limit: 5,
                    orderBy: ESort.DATE_CREATION_DESC,
                    isWithReport: 1
                }).fetch(),
            ])

            return {
                props: {
                    bootlegsPublishedProps: bootlegsPublished.map(x => x.toJson()),
                    bootlegsPendingProps: bootlegsPending.map(x => x.toJson()),
                    bootlegsDraftProps: bootlegsDraft.map(x => x.toJson()),
                    bootlegAdminPendingProps: bootlegAdminPending.map(x => x.toJson()),
                    bootlegAdminReportProps: bootlegAdminReport.map(x => x.toJson()),
                }
            }
        } catch (error) {
            switch (error?.constructor) {
                case CancelRequestError:
                case UnauthorizedError:
                case AuthentificationError:
                case InvalidEntityError:
                case NotImplementedError:
                case NotFoundError:
                default:
                    console.error(error)
                    return {
                        props: {
                            bootlegsPopular: [],
                            bootlesgNew: [],
                            bootlegsRandom: [],
                            adminBootlegPendingProps: [],
                            adminBootlegReportProps: []
                        }
                    }
            }
        }
    }
)

export default connect((state) => state)(withHandlers(IndexUser))