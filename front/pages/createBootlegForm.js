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
import { Bootleg, ErrorBootleg } from "request/objects/bootleg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar, faEnvelope, faEye, faFile, faKey, faSignInAlt, faUser } from "@fortawesome/free-solid-svg-icons"
import { CancelRequestError } from "request/errors/cancelRequestError"
import { UnauthorizedError } from "request/errors/unauthorizedError"
import { InvalidEntityError } from "request/errors/invalidEntityError"
import { NotImplementedError } from "request/errors/notImplementedError"
import { useRouter } from 'next/router'
import withManagers, { ManagersProps } from "helpers/hoc/withManagers"
import Input from "components/form/input"
import Button from "components/form/button"

/**
 * @typedef {object} createBootlegFormProps
 */

/**
 * Register page
 * @param {GlobalProps & createBootlegFormProps & ManagersProps} props
 */
function createBootlegForm({ bootlegManager, ...props }) {
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = React.useState(Status.IDLE)
    /** @type {[Bootleg, function(Bootleg):any]} Bootleg */
    const [bootleg, setBootleg] = React.useState(new Bootleg())
    /** @type {[ErrorBootleg, function(ErrorBootleg):any]} Error message */
    const [errorField, setErrorField] = React.useState(new ErrorBootleg())

    const router = useRouter()

    const _upsert = useCallback(
        async () => {
            setStatus(Status.PENDING)
            try {
                await bootlegManager.create(bootleg)
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
        [status, bootleg]
    )

    return (
        <>
            <Head>
                <title>Create a Bootleg - {props.appname}</title>
            </Head>

            <main className={styles.createBootlegForm}>
                <Section>
                    <Container>
                        <Columns className="is-vcentered">
                            <form
                                onSubmit={ev => {
                                    ev.preventDefault()
                                    _upsert()
                                }}
                            >
                                <Columns.Column
                                    className="his-left has-text-left"
                                >
                                    <h1 className="title is-4 is-title-underline">
                                        Main information :
                                </h1>

                                    <Input
                                        label="Bootleg title"
                                        placeholder="Bootleg concert Nantes"
                                        type="text"
                                        isRequired={true}
                                        value={bootleg.title}
                                        errorMessage={errorField.title}
                                        onChange={ev => setBootleg({ ...bootleg, title: ev.target.value })}
                                    />
                                    <Input
                                        label="Description :"
                                        type="textarea"
                                        isRequired={true}
                                        value={bootleg.description}
                                        errorMessage={errorField.description}
                                        onChange={ev => setBootleg({ ...bootleg, description: ev.target.value })}
                                    />
                                    <Input
                                        label="Bootleg date :"
                                        type="date"
                                        isRequired={false}
                                        value={bootleg.description}
                                        iconLeft={faCalendar}
                                        errorMessage={errorField.description}
                                        onChange={ev => setBootleg({ ...bootleg, description: ev.target.value })}
                                    />
                                    <Input
                                        label="Image :"
                                        type="file"
                                        isRequired={true}
                                        value={bootleg.picture}
                                        iconLeft={faFile}
                                        errorMessage={errorField.picture}
                                        onChange={ev => setBootleg({ ...bootleg, picture: ev.target.value })}
                                    />

                                    <Logo width={85} fill="black" />
                                    <div className="is-divider-vertical" />
                                </Columns.Column>
                                <Columns.Column className="has-text-right his-rigth">
                                    <h1 className="title is-4 is-title-underline">
                                        Complementary information :
                                    </h1>


                                </Columns.Column>
                                <Button
                                    label="Register"
                                    isLoading={status === Status.PENDING}
                                    iconLeft={faSignInAlt}
                                />
                            </form>
                        </Columns>
                    </Container>
                </Section>
            </main>
        </>
    )
}

export default withManagers(createBootlegForm)