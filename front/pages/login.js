import React, { useCallback } from "react"
import Head from "next/head"
// @ts-ignore
import { Section, Columns, Container } from 'react-bulma-components'
// @ts-ignore
import styles from "styles/pages/login.module.scss"
import { GlobalProps } from "pages/_app"
import { Logo } from "components/svg/icon"
import classNames from 'classnames'
import { Status } from "static/status"
import { ErrorUser, User } from "request/objects/user"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faKey, faSignInAlt } from "@fortawesome/free-solid-svg-icons"
import { CancelRequestError } from "request/errors/cancelRequestError"
import { UnauthorizedError } from "request/errors/unauthorizedError"
import { InvalidEntityError } from "request/errors/invalidEntityError"
import { NotImplementedError } from "request/errors/notImplementedError"
// import { Cookies } from 'react-cookie'
import withManagers, { ManagersProps } from "helpers/hoc/withManagers"
import Input from "components/form/input"
import Button from "components/form/button"

// const cookies = new Cookies()

/**
 * @typedef {object} LoginProps
 */

/**
 * Login page
 * @param {GlobalProps & LoginProps & ManagersProps} props
 */
function Login({ userManager, ...props }) {
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = React.useState(Status.IDLE)
    /** @type {[User, function(User):any]} User */
    const [user, setUser] = React.useState(new User())
    /** @type {[ErrorUser, function(ErrorUser):any]} Error message */
    const [errorField, setErrorField] = React.useState(new ErrorUser())

    const _upsert = useCallback(
        async () => {
            setStatus(Status.PENDING)
            try {
                await userManager.login(user)
                // cookies.set(process.env.REACT_APP_LOCAL_STORAGE_KEY, (await userManager.login(user)).token)
            } catch (error) {
                switch (error?.constructor) {
                    case CancelRequestError:
                    case UnauthorizedError: break
                    case InvalidEntityError:
                        setStatus(Status.REJECTED)
                        setErrorField(error.errorField)
                        console.log(errorField)
                    case NotImplementedError:
                    default:
                        console.log(error)
                        break
                }
            }
        },
        [status, user]
    )

    return (
        <>
            <Head>
                <title>Login - {props.appname}</title>
            </Head>

            <main className={styles.login}>
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
                            <div className="is-divider-vertical" />
                            <Columns.Column>
                                <h1 className="title is-4 is-title-underline">
                                    Log In to Grand Theft Bootleg
                                </h1>
                                <form
                                    onSubmit={ev => {
                                        ev.preventDefault()
                                        _upsert()
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
                                        onChange={ev => setUser({ ...user, mail: ev.target.value })}
                                    />
                                    <Input
                                        label="Password"
                                        placeholder="You password"
                                        type="password"
                                        isRequired={true}
                                        value={user.password}
                                        iconLeft={faKey}
                                        errorMessage={errorField.password}
                                        onChange={ev => setUser({ ...user, password: ev.target.value })}
                                    />

                                    <Button
                                        label="Login"
                                        isLoading={status === Status.PENDING}
                                        iconLeft={faSignInAlt}
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

export default withManagers(Login)