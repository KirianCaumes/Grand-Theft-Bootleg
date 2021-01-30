import React, { useCallback, useEffect, useRef, MutableRefObject } from "react"
import Head from "next/head"
// @ts-ignore
import { Section, Columns, Container } from 'react-bulma-components'
// @ts-ignore
import styles from "styles/pages/register.module.scss"
import { Logo } from "components/svg/icon"
import { Status } from "types/status"
import User, { ErrorUser } from "request/objects/user"
import { faEnvelope, faEye, faKey, faSignInAlt, faUser } from "@fortawesome/free-solid-svg-icons"
import { faGoogle, faTwitter, faFacebookF } from "@fortawesome/free-brands-svg-icons"
import { CancelRequestError } from "request/errors/cancelRequestError"
import { UnauthorizedError } from "request/errors/unauthorizedError"
import { InvalidEntityError } from "request/errors/invalidEntityError"
import { NotImplementedError } from "request/errors/notImplementedError"
import { useRouter } from 'next/router'
import withHandlers, { HandlersProps } from "helpers/hoc/withHandlers"
import Input from "components/form/input"
import Button from "components/form/button"
import getConfig from 'next/config'
import { useDispatch } from "react-redux"
import { removeToken, setMessage, setToken } from "redux/slices/main"
import { AuthentificationError } from "request/errors/authentificationError"
import { NotFoundError } from "request/errors/notFoundError"
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login'
import Divider from "components/general/divider"
import { EAuthStrategies } from "types/authStrategies"
import { RequestApi } from 'request/apiHandler'

/**
 * @typedef {object} RegisterProps
 * @property {any} _
 */

/**
 * Register page
 * @param {RegisterProps & HandlersProps} props
 */
function Register({ userHandler }) {
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = React.useState(Status.IDLE)
    /** @type {[User, function(User):any]} User */
    const [user, setUser] = React.useState(new User())
    /** @type {[ErrorUser, function(ErrorUser):any]} Error message */
    const [errorField, setErrorField] = React.useState(new ErrorUser())
    /** @type {[boolean, function(boolean):any]} Is password visible */
    const [isPwdVisible, setIsPwdVisible] = React.useState(!!false)

    /** @type {MutableRefObject<RequestApi<User>>} */
    const userHandlerCreate = useRef()

    const router = useRouter()
    const dispatch = useDispatch()
    const { publicRuntimeConfig } = getConfig()

    const upsert = useCallback(
        /**
         * @param {object} data
         * @param {EAuthStrategies=} data.strategy
         * @param {GoogleLoginResponse=} data.strategyData
         */
        async ({ strategy, strategyData } = {}) => {
            setStatus(Status.PENDING)
            try {
                const newUser = new User({ ...user, strategy: strategy ? strategy : user.strategy, strategyData })
                setUser(newUser)
                userHandlerCreate.current = userHandler.create(newUser)
                const userUptd = await userHandlerCreate.current.fetch()
                dispatch(setToken({ token: userUptd?.token }))
                router.push('/')
            } catch (error) {
                switch (error?.constructor) {
                    case CancelRequestError: break
                    case UnauthorizedError:
                    case AuthentificationError:
                        router.push('/login')
                        dispatch(removeToken(undefined))
                        dispatch(setMessage({ message: { isDisplay: true, content: error.message, type: 'warning' } }))
                        break
                    case InvalidEntityError:
                        setStatus(Status.REJECTED)
                        setErrorField(error.errorField)
                    case NotFoundError:
                    case NotImplementedError:
                    default:
                        dispatch(setMessage({ message: { isDisplay: true, content: error.message ?? 'An error occured during the login', type: 'danger' } }))
                        console.log(error)
                        break
                }
            }
        },
        [status, user]
    )

    useEffect(() => () => {
        userHandlerCreate.current?.cancel()
    }, [])

    return (
        <>
            <Head>
                <title>Register - {publicRuntimeConfig.appName}</title>
                <meta
                    name="description"
                    content="Create a new account on Grand Theft Bootleg and join the community."
                />
                <meta name="robots" content="noindex" />
            </Head>

            <main className={styles.register}>
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
                                    Sign up to Grand Theft Bootleg
                                </h1>
                                <form
                                    onSubmit={ev => {
                                        ev.preventDefault()
                                        upsert()
                                    }}
                                >
                                    <Input
                                        label="Email"
                                        placeholder="Your email"
                                        type="email"
                                        isRequired={true}
                                        value={user.mail}
                                        iconLeft={faEnvelope}
                                        errorMessage={errorField.mail}
                                        onChange={ev => setUser(new User({ ...user, mail: ev.target.value }))}
                                    />
                                    <Input
                                        label="Username"
                                        placeholder="Your username"
                                        type="text"
                                        isRequired={true}
                                        value={user.username}
                                        iconLeft={faUser}
                                        errorMessage={errorField.username}
                                        onChange={ev => setUser(new User({ ...user, username: ev.target.value }))}
                                    />
                                    <Input
                                        label="Password"
                                        placeholder="You password"
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
                                        label="Register"
                                        type="submit"
                                        isLoading={status === Status.PENDING}
                                        iconRight={faSignInAlt}
                                        styles={{ button: 'is-fullwidth' }}
                                    />
                                </form>
                                <Divider
                                    content="OR"
                                />
                                <div className="buttons is-centered">
                                    <GoogleLogin
                                        clientId={publicRuntimeConfig.googleKey}
                                        render={renderProps => (
                                            <Button
                                                label="Google"
                                                color="google"
                                                iconLeft={faGoogle}
                                                onClick={renderProps.onClick}
                                                isDisabled={renderProps.disabled || (user.strategy !== EAuthStrategies.GOOGLE && status === Status.PENDING)}
                                                isLoading={user.strategy === EAuthStrategies.GOOGLE && status === Status.PENDING}
                                                styles={{ button: 'flex-one' }}
                                            />
                                        )}
                                        onSuccess={res => upsert({ strategy: EAuthStrategies.GOOGLE, strategyData: /** @type {GoogleLoginResponse} */(res) })}
                                        onFailure={err => console.error(err)}
                                    />
                                    <Button
                                        label="Twitter"
                                        color="twitter"
                                        iconLeft={faTwitter}
                                        onClick={() => upsert({ strategy: EAuthStrategies.TWITTER, strategyData: null })}
                                        isLoading={user.strategy === EAuthStrategies.TWITTER && status === Status.PENDING}
                                        isDisabled={true}
                                        // isDisabled={user.strategy !== EAuthStrategies.TWITTER && status === Status.PENDING}
                                        styles={{ button: 'flex-one' }}
                                    />
                                    <Button
                                        label="Facebook"
                                        color="facebook"
                                        iconLeft={faFacebookF}
                                        onClick={() => upsert({ strategy: EAuthStrategies.FACEBOOK, strategyData: null })}
                                        isLoading={user.strategy === EAuthStrategies.FACEBOOK && status === Status.PENDING}
                                        isDisabled={true}
                                        // isDisabled={user.strategy !== EAuthStrategies.FACEBOOK && status === Status.PENDING}
                                        styles={{ button: 'flex-one' }}
                                    />
                                </div>
                            </Columns.Column>
                        </Columns>
                    </Container>
                </Section>
            </main>
        </>
    )
}

export default withHandlers(Register)