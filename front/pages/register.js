import React, { useCallback } from "react"
import Head from "next/head"
// @ts-ignore
import { Section, Columns, Container } from 'react-bulma-components'
// @ts-ignore
import styles from "styles/pages/register.module.scss"
import { GlobalProps } from "pages/_app"
import { Logo } from "components/svg/icon"
import classNames from 'classnames'
import { Status } from "static/status"
import UserManager from "request/managers/userManager"
import { User, ErrorUser } from "request/objects/user"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faEye, faKey, faSignInAlt, faUser } from "@fortawesome/free-solid-svg-icons"
import { CancelRequestError } from "request/errors/cancelRequestError"
import { UnauthorizedError } from "request/errors/unauthorizedError"
import { InvalidEntityError } from "request/errors/invalidEntityError"
import { NotImplementedError } from "request/errors/notImplementedError"
import { useRouter } from 'next/router'

/**
 * @typedef {object} RegisterProps
 */

/**
 * Register page
 * @param {GlobalProps & RegisterProps} props 
 */
export default function Register({ ...props }) {
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = React.useState(Status.IDLE)
    /** @type {[User, function(User):any]} User */
    const [user, setUser] = React.useState(new User())
    /** @type {[ErrorUser, function(ErrorUser):any]} Error message */
    const [errorField, setErrorField] = React.useState(new ErrorUser())
    /** @type {[ErrorUser, function(ErrorUser):any]} Is password visible */
    const [isPwdVisible, setIsPwdVisible] = React.useState(!!false)

    const router = useRouter()

    const _upsert = useCallback(
        async () => {
            setStatus(Status.PENDING)
            try {
                const userManager = new UserManager()
                await userManager.create(user)
                //TODO token                
                router.push({
                    pathname: '/'
                })

            } catch (error) {
                switch (error?.constructor) {
                    case CancelRequestError:
                    case UnauthorizedError: break
                    case InvalidEntityError:
                        setStatus(Status.REJECTED)
                        setErrorField(error.errorField)
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
                <title>Register - {props.appname}</title>
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
                            <div className="is-divider-vertical" />
                            <Columns.Column>
                                <h1 className="title is-4">
                                    Sign up to Grand Theft Bootleg
                                </h1>
                                <form
                                    onSubmit={ev => {
                                        ev.preventDefault()
                                        _upsert()
                                    }}
                                >
                                    <div className="field">
                                        <label
                                            htmlFor="mail"
                                            className="label is-required"
                                        >
                                            Email
                                        </label>
                                        <div className="control has-icons-left ">
                                            <input
                                                id="mail"
                                                className={classNames("input", { 'is-danger': !!errorField.mail })}
                                                type="email"
                                                placeholder="Your email"
                                                onChange={ev => setUser({ ...user, mail: ev.target.value })}
                                                required
                                            />
                                            <span className="icon is-small is-left">
                                                <FontAwesomeIcon icon={faEnvelope} />
                                            </span>
                                        </div>
                                        {errorField.mail &&
                                            <p className="help is-danger">{errorField.mail}</p>
                                        }
                                    </div>

                                    <div className="field">
                                        <label
                                            htmlFor="username"
                                            className="label is-required"
                                        >
                                            Username
                                        </label>
                                        <div className="control has-icons-left ">
                                            <input
                                                id="username"
                                                className={classNames("input", { 'is-danger': !!errorField.username })}
                                                type="text"
                                                placeholder="Your username"
                                                onChange={ev => setUser({ ...user, username: ev.target.value })}
                                                required
                                            />
                                            <span className="icon is-small is-left">
                                                <FontAwesomeIcon icon={faUser} />
                                            </span>
                                        </div>
                                        {errorField.username &&
                                            <p className="help is-danger">{errorField.username}</p>
                                        }
                                    </div>

                                    <label
                                        htmlFor="password"
                                        className="label is-required"
                                    >
                                        Password
                                    </label>
                                    <div className="field has-addons">
                                        <div className="control has-icons-left is-expanded">
                                            <input
                                                id="password"
                                                className={classNames("input", { 'is-danger': !!errorField.password })}
                                                type={isPwdVisible ? 'text' : 'password'}
                                                placeholder="You password"
                                                autoComplete="new-password"
                                                onChange={ev => setUser({ ...user, password: ev.target.value })}
                                                required
                                            />
                                            <span className="icon is-small is-left">
                                                <FontAwesomeIcon icon={faKey} />
                                            </span>
                                            {errorField.password &&
                                                <p className="help is-danger">{errorField.password}</p>
                                            }
                                        </div>
                                        <div className="control">
                                            <button
                                                className="button is-greyblue"
                                                onClick={() => setIsPwdVisible(!isPwdVisible)}
                                                type="button"
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className={classNames("button is-pink", { 'is-loading': status === Status.PENDING })}
                                    >
                                        <span>Register</span>
                                        <span className="icon is-small">
                                            <FontAwesomeIcon icon={faSignInAlt} />
                                        </span>
                                    </button>
                                </form>
                            </Columns.Column>
                        </Columns>
                    </Container>
                </Section>
            </main>
        </>
    )
}
