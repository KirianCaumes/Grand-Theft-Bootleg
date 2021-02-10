import React, { useCallback, useEffect, MutableRefObject, useRef } from "react"
import Head from "next/head"
// @ts-ignore
import { Section, Columns, Container } from 'react-bulma-components'
// @ts-ignore
import styles from "styles/pages/user/reset-password/[token].module.scss"
import { Logo } from "components/svg/icon"
import { Status } from "types/status"
import User, { ErrorUser } from "request/objects/user"
import { faKey, faSignInAlt } from "@fortawesome/free-solid-svg-icons"
import { CancelRequestError } from "request/errors/cancelRequestError"
import { UnauthorizedError } from "request/errors/unauthorizedError"
import { InvalidEntityError } from "request/errors/invalidEntityError"
import { NotImplementedError } from "request/errors/notImplementedError"
import withHandlers, { HandlersProps } from "helpers/hoc/withHandlers"
import Input from "components/form/input"
import Button from "components/form/button"
import { connect, useDispatch } from "react-redux"
import { removeToken, setMessage } from "redux/slices/main"
import { useRouter } from "next/router"
import getConfig from 'next/config'
import { AuthentificationError } from "request/errors/authentificationError"
import { NotFoundError } from "request/errors/notFoundError"
import Divider from "components/general/divider"
import { RequestApi } from 'request/apiHandler'
import { faEye } from "@fortawesome/free-regular-svg-icons"
import { ReduxProps } from 'redux/store'

/**
 * @typedef {object} TokenResetPasswordUserProps
 * @property {any} _
 */

/**
 * Login page
 * @param {TokenResetPasswordUserProps & HandlersProps & ReduxProps} props
 */
function TokenResetPasswordUser({ userHandler, main: { me } }) {
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = React.useState(Status.IDLE)
    /** @type {[User, function(User):any]} User */
    const [user, setUser] = React.useState(new User())
    /** @type {[ErrorUser, function(ErrorUser):any]} Error message */
    const [errorField, setErrorField] = React.useState(new ErrorUser())
    /** @type {[boolean, function(boolean):any]} Is password visible */
    const [isPwdVisible, setIsPwdVisible] = React.useState(!!false)

    /** @type {MutableRefObject<RequestApi<User>>} */
    const userHandlerPatch = useRef()

    const dispatch = useDispatch()
    const router = useRouter()
    const { publicRuntimeConfig } = getConfig()

    const update = useCallback(
        async () => {
            setStatus(Status.PENDING)
            try {
                userHandlerPatch.current = userHandler.patch(/** @type {string} */(router.query.token), 'reset-pwd', user)
                await userHandlerPatch.current.fetch()

                if (!!me?._id)
                    router.push('/user')
                else
                    router.push('/user/login')

                dispatch(setMessage({ message: { isDisplay: true, content: 'Your password is up to date.', type: 'success' } }))
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
                        setStatus(Status.REJECTED)
                        setErrorField(error.errorField)
                        break
                    case NotFoundError:
                    case NotImplementedError:
                    default:
                        setStatus(Status.REJECTED)
                        dispatch(setMessage({ message: { isDisplay: true, content: error.message ?? 'An error occured during the login', type: 'danger' } }))
                        console.error(error)
                        break
                }
            }
        },
        [status, user, router.query, me]
    )

    useEffect(() => () => {
        userHandlerPatch.current?.cancel()
    }, [])

    return (
        <>
            <Head>
                <title>Reset password - {publicRuntimeConfig.appName}</title>
                <meta
                    name="description"
                    content="Reset your password account of your Grand Theft Bootleg account."
                />
                <meta name="robots" content="noindex" />
            </Head>

            <main className={styles['token-reset-paswword-user']}>
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
                                    Reset your password
                                </h1>
                                <form
                                    onSubmit={ev => {
                                        ev.preventDefault()
                                        update()
                                    }}
                                >
                                    <Input
                                        label="New Password"
                                        placeholder="You new password"
                                        type={isPwdVisible ? 'text' : 'password'}
                                        isRequired={true}
                                        value={user.password}
                                        iconLeft={faKey}
                                        errorMessage={errorField.password}
                                        onChange={ev => setUser(new User({ ...user, password: ev.target.value }))}
                                        button={{
                                            onClick: () => setIsPwdVisible(!isPwdVisible),
                                            iconLeft: faEye
                                        }}
                                    />
                                    <br />

                                    <Button
                                        label="Update"
                                        type="submit"
                                        isLoading={status === Status.PENDING}
                                        iconRight={faSignInAlt}
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

export default connect((state) => state)(withHandlers(TokenResetPasswordUser))