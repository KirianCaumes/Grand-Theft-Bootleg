import React, { useCallback, useEffect, MutableRefObject, useRef } from "react"
import Head from "next/head"
// @ts-ignore
import { Section, Columns, Container } from 'react-bulma-components'
// @ts-ignore
import styles from "styles/pages/user/delete-account/[token].module.scss"
import { Logo } from "components/svg/icon"
import { Status } from "types/status"
import User, { ErrorUser } from "request/objects/user"
import { faKey, faSignInAlt, faUserTimes } from "@fortawesome/free-solid-svg-icons"
import { CancelRequestError } from "request/errors/cancelRequestError"
import { UnauthorizedError } from "request/errors/unauthorizedError"
import { InvalidEntityError } from "request/errors/invalidEntityError"
import { NotImplementedError } from "request/errors/notImplementedError"
import withHandlers, { HandlersProps } from "helpers/hoc/withHandlers"
import Input from "components/form/input"
import Button from "components/form/button"
import { connect, useDispatch } from "react-redux"
import { removeToken, setMessage, setUser } from "redux/slices/main"
import { useRouter } from "next/router"
import getConfig from 'next/config'
import { AuthentificationError } from "request/errors/authentificationError"
import { NotFoundError } from "request/errors/notFoundError"
import Divider from "components/general/divider"
import { RequestApi } from 'request/apiHandler'
import { faEye } from "@fortawesome/free-regular-svg-icons"
import { ReduxProps } from 'redux/store'

/**
 * @typedef {object} TokenDeleteAccountUserProps
 * @property {any} _
 */

/**
 * Login page
 * @param {TokenDeleteAccountUser & HandlersProps & ReduxProps} props
 */
function TokenDeleteAccountUser({ userHandler, main: { me } }) {
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = React.useState(Status.IDLE)

    /** @type {MutableRefObject<RequestApi<User>>} */
    const userHandlerPatch = useRef()

    const dispatch = useDispatch()
    const router = useRouter()
    const { publicRuntimeConfig } = getConfig()

    const remove = useCallback(
        async () => {
            setStatus(Status.PENDING)
            try {
                userHandlerPatch.current = userHandler.patch(/** @type {string} */(router.query.token), 'delete-account')
                await userHandlerPatch.current.fetch()
                dispatch(setUser({ user: new User() }))
                dispatch(removeToken(undefined))
                router.push('/')
                dispatch(setMessage({ message: { isDisplay: true, content: 'Your account is now deleted.', type: 'success' } }))
            } catch (error) {
                switch (error?.constructor) {
                    case CancelRequestError: break
                    case UnauthorizedError: break
                    case AuthentificationError:
                        router.push('/user/login')
                        dispatch(removeToken(undefined))
                        dispatch(setMessage({ message: { isDisplay: true, content: error.message, type: 'warning' } }))
                        break
                    case InvalidEntityError:
                    case NotFoundError:
                    case NotImplementedError:
                    default:
                        setStatus(Status.REJECTED)
                        dispatch(setMessage({ message: { isDisplay: true, content: error.message ?? 'An error occured during the deletion.', type: 'danger' } }))
                        console.error(error)
                        break
                }
            }
        },
        [status, router.query, me]
    )

    useEffect(() => () => {
        userHandlerPatch.current?.cancel()
    }, [])

    return (
        <>
            <Head>
                <title>Delete account - {publicRuntimeConfig.appName}</title>
                <meta
                    name="description"
                    content="Delete your account of your Grand Theft Bootleg account."
                />
                <meta name="robots" content="noindex" />
            </Head>

            <main className={styles['token-delete-account-user']}>
                <Section>
                    <Container>
                        <Columns className="is-vcentered">
                            <Columns.Column
                                className="has-text-right"
                            >
                                <p className="title is-1">
                                    Grand Theft Bootleg
                                </p>
                                <p className="subtitle is-5" >
                                    Music and its hidden sides submerged.<br />
                                    What if we emerge them? 💿
                                </p>
                                <Logo width={85} fill="black" />
                            </Columns.Column>
                            <Divider
                                isVertical={true}
                            />
                            <Columns.Column>
                                <h1 className="title is-4 is-title-underline">
                                    Delete your account
                                </h1>
                                <form
                                    onSubmit={ev => {
                                        ev.preventDefault()
                                        remove()
                                    }}
                                >
                                    Are you really sure you want to delete account?<br />
                                    This action is <b>final</b>.
                                    <br />
                                    <br />
                                    <Button
                                        label="Delete your account"
                                        type="submit"
                                        isLoading={status === Status.PENDING}
                                        iconRight={faUserTimes}
                                        styles={{ button: 'is-fullwidth' }}
                                    />
                                </form>
                            </Columns.Column>
                        </Columns>
                    </Container>
                </Section>
            </main>
        </>
    )
}

export default connect((state) => state)(withHandlers(TokenDeleteAccountUser))