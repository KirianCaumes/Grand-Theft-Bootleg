import React, { useCallback } from "react"
import Head from "next/head"
import { GetServerSidePropsContext } from 'next'
// @ts-ignore
import styles from "styles/pages/bootleg/create.module.scss"
import BootlegManager from "request/managers/bootlegManager"
// @ts-ignore
import { Section, Columns, Container } from 'react-bulma-components'
import Bootleg, { ErrorBootleg } from 'request/objects/bootleg'
import withManagers, { ManagersProps } from "helpers/hoc/withManagers"
import getConfig from 'next/config'
import { wrapper } from "redux/store"
import { AnyAction, Store } from 'redux'
import { MainState, removeToken, setMessage } from "redux/slices/main"
import Cookie from "helpers/cookie"
import { setToken } from 'redux/slices/main'
import { NotificationState } from 'redux/slices/notification'
import { CancelRequestError } from "request/errors/cancelRequestError"
import { UnauthorizedError } from "request/errors/unauthorizedError"
import { AuthentificationError } from "request/errors/authentificationError"
import { InvalidEntityError } from "request/errors/invalidEntityError"
import { NotImplementedError } from "request/errors/notImplementedError"
import { NotFoundError } from "request/errors/notFoundError"
import { useRouter } from "next/router"
import { useDispatch } from "react-redux"
import { Status } from "static/status"
import classNames from 'classnames'
import Input from "components/form/input"
import { faEnvelope } from "@fortawesome/free-regular-svg-icons"
import { faGlobe, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import Button from "components/form/button"
import Label from "components/form/label"
import Select from "components/form/select"
import { ECountries } from "static/searchFilters/countries"

/**
 * @typedef {object} BootlegProps
 * @property {Bootleg} bootlegProps Bootleg
 */

/**
 * Bootleg page
 * @param {BootlegProps & ManagersProps} props 
 */
function Edit({ bootlegProps, bootlegManager, ...props }) {
    /** @type {[Bootleg, function(Bootleg):any]} Bootlegs */
    const [bootleg, setBootleg] = React.useState(bootlegProps)
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = React.useState(Status.RESOLVED)
    /** @type {[ErrorBootleg, function(ErrorBootleg):any]} Error message */
    const [errorField, setErrorField] = React.useState(new ErrorBootleg())

    const { publicRuntimeConfig } = getConfig()
    const router = useRouter()
    const dispatch = useDispatch()

    /** Update bootleg API */
    const update = useCallback(
        async () => {
            try {
                setStatus(Status.PENDING)
                setBootleg(await bootlegManager.upsert(bootleg, bootleg._id))
                dispatch(setMessage({
                    message: {
                        isDisplay: true,
                        content: 'Bootleg state has been correctly updated',
                        type: 'success'
                    }
                }))
                setStatus(Status.RESOLVED)
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
                        setStatus(Status.REJECTED)
                        console.log(error)
                        break
                }
                return error
            }
        },
        [bootleg]
    )

    return (
        <>
            <Head>
                <title>{bootleg.title} - {publicRuntimeConfig.appName}</title>
            </Head>

            <main className={styles.create}>
                <Section className="flex">
                    <Container className="flex-one">
                        <form
                            onSubmit={ev => {
                                ev.preventDefault()
                                update()
                            }}
                        >
                            <Columns className="is-variable is-8-widescreen is-desktop">
                                <Columns.Column className="is-four-fifths-desktop" >
                                    <h1 className="title is-4 is-title-underline">
                                        {bootleg?._id ? `Edit ${bootleg.title}` : 'Create a new bootleg'}
                                    </h1>
                                    <h2 className="subtitle is-5">
                                        General informations
                                    </h2>
                                    <Input
                                        label="Title"
                                        placeholder="Bootleg's title"
                                        isRequired={true}
                                        value={bootleg.title}
                                        iconLeft={faEnvelope}
                                        errorMessage={errorField.title}
                                        onChange={ev => setBootleg(new Bootleg({ ...bootleg, title: ev.target.value }))}
                                    />
                                    <Input
                                        label="Description"
                                        placeholder="Bootleg's description"
                                        isRequired={true}
                                        value={bootleg.description}
                                        errorMessage={errorField.description}
                                        multiline
                                        onChange={ev => setBootleg(new Bootleg({ ...bootleg, description: ev.target.value }))}
                                    />
                                    <Label
                                        isRequired
                                    >
                                        {bootleg.bands?.length > 1 ? 'Bands' : 'Band'}
                                    </Label>
                                    {bootleg.bands?.map((band, i) =>
                                        <Input
                                            key={`band-${i}`}
                                            placeholder="Band"
                                            isRequired={true}
                                            value={band}
                                            iconLeft={faGlobe}
                                            errorMessage={errorField.bands}
                                            onChange={ev => {
                                                let bands = [...bootleg.bands]
                                                bands[i] = ev.target.value
                                                setBootleg(new Bootleg({ ...bootleg, bands }))
                                            }}
                                            button={{
                                                isDisabled: bootleg.bands?.length <= 1,
                                                onClick: () => setBootleg(new Bootleg({ ...bootleg, bands: [...bootleg.bands].filter((x, y) => y !== i) })),
                                                iconLeft: faTrash
                                            }}
                                        />
                                    )}
                                    <Button
                                        label="Add a band"
                                        onClick={() => setBootleg(new Bootleg({ ...bootleg, bands: [...bootleg.bands, ''] }))}
                                        iconLeft={faPlus}
                                        styles={{ button: 'is-small' }}
                                    />
                                    <br />
                                    <br />
                                    <Columns className="is-gapless" >
                                        <Columns.Column>
                                            <Input
                                                label="Release date"
                                                placeholder="Bootleg's release date"
                                                isRequired={true}
                                                value={new Date(bootleg.date)?.toISOString()?.split('T')?.[0]}
                                                type="date"
                                                iconLeft={faEnvelope}
                                                errorMessage={errorField.date}
                                                onChange={ev => setBootleg(new Bootleg({ ...bootleg, date: ev.target.value }))}
                                            />
                                        </Columns.Column>
                                        <Columns.Column className="is-hidden-touch" />
                                        <Columns.Column className="is-hidden-touch" />
                                    </Columns>
                                    <br />
                                    <h2 className="subtitle is-5">
                                        Location(s)
                                    </h2>
                                    <Columns className="is-gapless">
                                        <Columns.Column>
                                            <Label
                                                isRequired
                                            >
                                                {bootleg.countries?.length > 1 ? 'Countries' : 'Country'}
                                            </Label>
                                            {bootleg.countries?.map((country, i) =>
                                                <Select
                                                    key={`country-${i}`}
                                                    // isRequired={true}
                                                    value={country}
                                                    iconLeft={faGlobe}
                                                    // errorMessage={errorField.countries}
                                                    onChange={(ev, option) => {
                                                        let countries = [...bootleg.countries]
                                                        countries[i] =/** @type {string} */(option.key)
                                                        setBootleg(new Bootleg({ ...bootleg, countries }))
                                                    }}
                                                    options={[
                                                        { key: null, text: '' },
                                                        ...Object.keys(ECountries).map(country => ({
                                                            key: country, text: ECountries[country]
                                                        }))
                                                    ]}
                                                    button={{
                                                        isDisabled: bootleg.countries?.length <= 1,
                                                        onClick: () => setBootleg(new Bootleg({ ...bootleg, countries: [...bootleg.countries].filter((x, y) => y !== i) })),
                                                        iconLeft: faTrash
                                                    }}
                                                />
                                            )}
                                            <Button
                                                label="Add a country"
                                                onClick={() => setBootleg(new Bootleg({ ...bootleg, countries: [...bootleg.countries, ''] }))}
                                                iconLeft={faPlus}
                                                styles={{ button: 'is-small' }}
                                            />
                                        </Columns.Column>
                                        <Columns.Column className="is-hidden-touch" />
                                        <Columns.Column className="is-hidden-touch" />
                                    </Columns>
                                    <Columns className="is-gapless">
                                        <Columns.Column>
                                            <Label
                                                isRequired
                                            >
                                                {bootleg.cities?.length > 1 ? 'Cities' : 'City'}
                                            </Label>
                                            {bootleg.cities?.map((city, i) =>
                                                <Input
                                                    key={`city-${i}`}
                                                    placeholder="City"
                                                    isRequired={true}
                                                    value={city}
                                                    iconLeft={faGlobe}
                                                    errorMessage={errorField.cities}
                                                    onChange={ev => {
                                                        let cities = [...bootleg.cities]
                                                        cities[i] = ev.target.value
                                                        setBootleg(new Bootleg({ ...bootleg, cities }))
                                                    }}
                                                    button={{
                                                        isDisabled: bootleg.cities?.length <= 1,
                                                        onClick: () => setBootleg(new Bootleg({ ...bootleg, cities: [...bootleg.cities].filter((x, y) => y !== i) })),
                                                        iconLeft: faTrash
                                                    }}
                                                />
                                            )}
                                            <Button
                                                label="Add a city"
                                                onClick={() => setBootleg(new Bootleg({ ...bootleg, cities: [...bootleg.cities, ''] }))}
                                                iconLeft={faPlus}
                                                styles={{ button: 'is-small' }}
                                            />
                                        </Columns.Column>
                                        <Columns.Column className="is-hidden-touch" />
                                        <Columns.Column className="is-hidden-touch" />
                                    </Columns>
                                </Columns.Column>
                                <Columns.Column className="is-one-fifth-desktop" >
                                    Help info...
                                </Columns.Column>
                            </Columns>
                        </form>
                    </Container>
                </Section>
            </main>
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
        const token = Cookie.get(req)

        if (token)
            store.dispatch(setToken({ token }))

        if (!store.getState().main.token)
            return {
                redirect: {
                    destination: '/login',
                    permanent: false
                }
            }

        try {
            const bootlegManager = new BootlegManager({ req })
            const id = /** @type {string} */ (query.id)

            if (id === "new")
                return { props: { bootlegProps: new Bootleg().toJson() } }

            const bootleg = await bootlegManager.getById(id?.substring(id?.lastIndexOf("-") + 1))

            return { props: { bootlegProps: bootleg.toJson() } }
        } catch (error) {
            switch (error?.constructor) {
                case CancelRequestError:
                case UnauthorizedError:
                case AuthentificationError:
                case InvalidEntityError:
                case NotImplementedError: break
                case NotFoundError:
                    return { notFound: true }
                default:
                    console.log(error)
                    return { props: { bootlegProps: {} } }
            }
        }
    }
)

export default withManagers(Edit)