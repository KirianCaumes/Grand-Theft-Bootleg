import React, { useCallback, useState, MutableRefObject, useRef, useEffect } from "react"
import { GetServerSidePropsContext } from 'next'
import Head from "next/head"
// @ts-ignore
import styles from "styles/pages/user/index.module.scss"
// @ts-ignore
import { Section, Container, Columns } from 'react-bulma-components'
import withHandlers, { HandlersProps } from 'helpers/hoc/withHandlers'
import getConfig from 'next/config'
import { connect, useDispatch } from "react-redux"
import { Store, AnyAction } from "redux"
import { ReduxProps, wrapper } from 'redux/store'
import Link from "next/link"
import { MainState, removeToken, setMessage, setToken } from "redux/slices/main"
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
import { faPlus, faUserEdit, faUserMinus } from "@fortawesome/free-solid-svg-icons"
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

/**
 * @typedef {object} IndexUserProps
 * @property {Bootleg[]} bootlegsPublishedProps Bootlegs from API
 * @property {Bootleg[]} bootlegsPendingProps Bootlegs from API
 * @property {Bootleg[]} bootlegsDraftProps Bootlegs from API
 */

/**
 * Index page
 * @param {IndexUserProps & HandlersProps & ReduxProps} props 
 */
function IndexUser({ main: { me }, bootlegsPublishedProps, bootlegsPendingProps, bootlegsDraftProps, userHandler }) {
    /** @type {[User, function(User):any]} User */
    const [user, setUser] = useState(me)
    /** @type {[ModalType, function(ModalType):any]} Modal user infos */
    const [modalUsr, setModalUsr] = useState({ isDisplay: !!false })
    /** @type {[ModalType, function(ModalType):any]} Modal user infos */
    const [modal, setModal] = useState({ isDisplay: !!false })
    /** @type {[ErrorUser, function(ErrorUser):any]} Errors */
    const [errorFieldUser, setErrorFieldUser] = useState(new ErrorUser())

    /** @type {MutableRefObject<RequestApi<User>>} */
    const userHandlerUpdateById = useRef()
    /** @type {MutableRefObject<RequestApi<User>>} */
    const userHandlerSendMail = useRef()

    const { publicRuntimeConfig } = getConfig()
    const router = useRouter()
    const dispatch = useDispatch()

    /** Update user API */
    const update = useCallback(
        async () => {
            try {
                userHandlerUpdateById.current = userHandler.updateById(user, user._id)
                setUser(await userHandlerUpdateById.current.fetch())
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
        []
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
    useEffect(() => () => {
        userHandlerUpdateById.current?.cancel()
        userHandlerSendMail.current?.cancel()
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
                                <TableBootleg
                                    title="Your last bootlegs published"
                                    bootlegs={bootlegsPublishedProps}
                                    state={EStates.PUBLISHED}
                                    authorId={me?._id}
                                />
                                <br />
                                <TableBootleg
                                    title="Your last bootlegs pending"
                                    bootlegs={bootlegsPendingProps}
                                    state={EStates.PENDING}
                                    authorId={me?._id}
                                />
                                <br />
                                <TableBootleg
                                    title="Your last bootlegs draft"
                                    bootlegs={bootlegsDraftProps}
                                    state={EStates.DRAFT}
                                    authorId={me?._id}
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
                    value={user.username}
                    errorMessage={errorFieldUser.username}
                    onChange={ev => setUser(new User({ ...user, username: ev.target.value }))}
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
 * @param {EStates} props.state
 * @param {any} props.authorId
 */
function TableBootleg({ title, bootlegs, state, authorId }) {
    const { publicRuntimeConfig } = getConfig()

    return (
        <>
            <h2 className="title is-4 is-title-underline">
                {title}&nbsp;
                <Button
                    iconLeft={faPlus}
                    href="/bootleg/new/edit"
                    styles={{ button: 'is-small' }}
                />
            </h2>
            {bootlegs?.length <= 0 ?
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
                                    <Link href={`/bootleg/${bootleg._id}`}>
                                        <a>{bootleg?.title ?? <i>Unknown</i>}</a>
                                    </Link>
                                    <span>
                                        Added {new Date(bootleg.createdOn)?.toLocaleDateString('en-EN', { year: 'numeric', month: 'short', day: '2-digit' }) ?? <i>Unknown</i>}
                                    </span>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                    <p className="has-text-right">
                        <Link
                            href={{
                                pathname: '/bootleg/search',
                                query: {
                                    orderBy: ESort.DATE_CREATION_DESC,
                                    state: state,
                                    authorId: authorId
                                }
                            }}
                        >
                            <a>
                                See more &gt;
                        </a>
                        </Link>
                    </p>
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
            return {
                redirect: {
                    destination: '/user/login',
                    permanent: false
                }
            }

        const me = store.getState().main?.me

        try {
            const bootlegHandler = new BootlegHandler({ req })
            const [[bootlegsPublished], [bootlegsPending], [bootlegsDraft]] = await Promise.all([
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
                }).fetch()
            ])

            return {
                props: {
                    bootlegsPublishedProps: bootlegsPublished.map(x => x.toJson()),
                    bootlegsPendingProps: bootlegsPending.map(x => x.toJson()),
                    bootlegsDraftProps: bootlegsDraft.map(x => x.toJson()),
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
                            bootlegsRandom: []
                        }
                    }
            }
        }
    }
)

export default connect((state) => state)(withHandlers(IndexUser))