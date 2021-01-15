import React, { useCallback, ReactChild, useEffect } from "react"
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
import { faCalendarAlt, faImage } from "@fortawesome/free-regular-svg-icons"
import { faCheck, faCity, faGlobeEurope, faHeading, faLink, faMusic, faPencilRuler, faPlus, faTrash, faUsers } from "@fortawesome/free-solid-svg-icons"
import Button from "components/form/button"
import Label from "components/form/addons/label"
import Select from "components/form/select"
import { ECountries } from "static/searchFilters/countries"
import Toggle from "components/form/toggle"
import { EStates } from "static/searchFilters/states"
import Rating from "components/form/rating"
import Song from 'request/objects/song'
import Band from 'request/objects/band'

/**
 * @typedef {object} SuggestionsType
 * @property {Object<string, Band[]>} bands
 * @property {Object<string, Song[]>} songs
 */

/**
 * @typedef {object} BootlegProps
 * @property {Bootleg} bootlegProps Bootleg
 */

/**
 * Bootleg page
 * @param {BootlegProps & ManagersProps} props 
 */
function Edit({ bootlegProps, bootlegManager, songManager, bandManager, ...props }) {
    /** @type {[Bootleg, function(Bootleg):any]} Bootlegs */
    const [bootleg, setBootleg] = React.useState(bootlegProps)
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = React.useState(Status.RESOLVED)
    /** @type {[ErrorBootleg, function(ErrorBootleg):any]} Error message */
    const [errorField, setErrorField] = React.useState(new ErrorBootleg())
    /** @type {[SuggestionsType, function(SuggestionsType):any]} test */
    const [suggestions, setSuggestions] = React.useState({ bands: {}, songs: {} })

    const [test, setTest] = React.useState([])


    const { publicRuntimeConfig } = getConfig()
    const router = useRouter()
    const dispatch = useDispatch()

    /** Update bootleg API */
    const update = useCallback(
        async () => {
            try {
                setStatus(Status.PENDING)
                const bootlegUptd = await bootlegManager.upsert(bootleg, bootleg._id)
                // dispatch(setMessage({
                //     message: {
                //         isDisplay: true,
                //         content: `Bootleg has been correctly ${bootleg._id ? 'updated' : 'created'}`,
                //         type: 'success'
                //     }
                // }))
                router.push(`/bootleg/${bootlegUptd._id}`)
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
                        setStatus(Status.REJECTED)
                        setErrorField(error.errorField)
                        dispatch(setMessage({
                            message: {
                                isDisplay: true,
                                content: 'Some fields are invalid',
                                type: 'danger'
                            }
                        }))
                        break
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

    useEffect(() => {
        if (bootleg.isAudioOnly)
            setBootleg(new Bootleg({ ...bootleg, videoQuality: null }))
    }, [bootleg.isAudioOnly])

    const updateSuggestions = useCallback(
        /**
         * @param {object} data 
         * @param {Band | Song | Object} data.object 
         * @param {number=} data.index 
         * @param {string=} data.value 
         * @param {boolean=} data.isClear 
         */
        async ({ object, index, value, isClear = false }) => {
            const key = (() => {
                switch (object) {
                    case Band:
                        return 'bands'
                    case Song:
                        return 'songs'
                    default:
                        return null
                }
            })()

            const newSugts = { ...suggestions[key] }

            if (!newSugts[index])
                newSugts[index] = []

            if (isClear) {
                newSugts[index] = []
                setSuggestions({ ...suggestions, [key]: newSugts })
                return
            }

            switch (object) {
                case Band:
                    bandManager.cancel()
                    try {
                        const [bands] = await bandManager.getAll({ string: value })
                        newSugts[index] = bands
                        setSuggestions({ ...suggestions, [key]: newSugts })
                    } catch (error) {
                        console.error(error)
                    }
                    break
                case Song:
                    songManager.cancel()
                    try {
                        const [songs] = await songManager.getAll({ string: value })
                        newSugts[index] = songs
                        setSuggestions({ ...suggestions, [key]: newSugts })
                    } catch (error) {
                        console.error(error)
                    }
                    break
                default:
                    break
            }
        },
        [suggestions]
    )

    return (
        <>
            <Head>
                <title>{bootleg.title || 'New'} - {publicRuntimeConfig.appName}</title>
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
                                        iconLeft={faHeading}
                                        errorMessage={errorField.title}
                                        onChange={ev => setBootleg(new Bootleg({ ...bootleg, title: ev.target.value }))}
                                        isDisabled={status === Status.PENDING}
                                        minLength={5}
                                        maxLength={255}
                                    />
                                    <Input
                                        label="Description"
                                        placeholder="Bootleg's description"
                                        isRequired={true}
                                        value={bootleg.description}
                                        errorMessage={errorField.description}
                                        multiline
                                        onChange={ev => setBootleg(new Bootleg({ ...bootleg, description: ev.target.value }))}
                                        isDisabled={status === Status.PENDING}
                                        minLength={5}
                                        maxLength={500}
                                    />
                                    <Columns className="is-variable">
                                        <Columns.Column size="one-third">
                                            <Input
                                                label="Release date"
                                                placeholder="Bootleg's release date"
                                                isRequired={true}
                                                value={!!bootleg.date ? new Date(bootleg.date)?.toISOString()?.split('T')?.[0] : ''}
                                                type="date"
                                                iconLeft={faCalendarAlt}
                                                errorMessage={errorField.date}
                                                onChange={ev => setBootleg(new Bootleg({ ...bootleg, date: ev.target.value }))}
                                                isDisabled={status === Status.PENDING}
                                                min="1900-01-01"
                                                max={new Date().toISOString()?.split('T')?.[0]}
                                            />
                                        </Columns.Column>
                                        <Columns.Column size="two-thirds">
                                            <Input
                                                label="Picture"
                                                placeholder="Bootleg's picture"
                                                isRequired={true}
                                                value={bootleg.picture || ''}
                                                type="url"
                                                iconLeft={faImage}
                                                errorMessage={errorField.picture}
                                                onChange={ev => setBootleg(new Bootleg({ ...bootleg, picture: ev.target.value }))}
                                                isDisabled={status === Status.PENDING}
                                            />
                                        </Columns.Column>
                                    </Columns>
                                    <br />

                                    <h2 className="subtitle is-5">
                                        Content
                                    </h2>
                                    <Label
                                        isRequired
                                        htmlFor="band"
                                    >
                                        {bootleg.bands?.length > 1 ? 'Bands' : 'Band'}
                                    </Label>
                                    {bootleg.bands?.map((band, i) =>
                                        <Input
                                            id={`band-${i}`}
                                            key={`band-${i}`}
                                            placeholder="Band"
                                            isRequired={true}
                                            value={band}
                                            iconLeft={faUsers}
                                            errorMessage={errorField.bands}
                                            onInput={ev => {
                                                const value = /** @type {HTMLInputElement} */(ev.target).value
                                                switch (/** @type {any} */(ev.nativeEvent)?.constructor) {
                                                    case InputEvent:
                                                        updateSuggestions({ object: Band, index: i, value })
                                                        break
                                                    case Event:
                                                        updateSuggestions({ object: Band, index: i, isClear: true })
                                                        break
                                                    default:
                                                        break
                                                }
                                                setBootleg(new Bootleg({ ...bootleg, bands: [...bootleg.bands].map((band, index) => index === i ? value : band) }))
                                            }}
                                            onBlur={() => {
                                                updateSuggestions({ object: Band, index: i, isClear: true })
                                            }}
                                            button={{
                                                isDisabled: bootleg.bands?.length <= 1 || status === Status.PENDING,
                                                onClick: () => setBootleg(new Bootleg({ ...bootleg, bands: [...bootleg.bands].filter((x, y) => y !== i) })),
                                                iconLeft: faTrash,
                                                styles: { button: 'is-greyblue' }
                                            }}
                                            isDisabled={status === Status.PENDING}
                                            minLength={1}
                                            maxLength={255}
                                            options={/** @type {String[]} */(suggestions.bands?.[i]) ?? []}
                                        />
                                    )}
                                    <Button
                                        label="Add a band"
                                        onClick={() => setBootleg(new Bootleg({ ...bootleg, bands: [...bootleg.bands, ''] }))}
                                        iconLeft={faPlus}
                                        styles={{ button: 'is-small is-greyblue' }}
                                        isDisabled={bootleg.bands?.length >= 10 || status === Status.PENDING}
                                    />
                                    <br />
                                    <br />
                                    <Label
                                        isRequired
                                        htmlFor="link"
                                    >
                                        {bootleg.links?.length > 1 ? 'Links' : 'Link'}
                                    </Label>
                                    {bootleg.links?.map((link, i) =>
                                        <Input
                                            id="link"
                                            key={`link-${i}`}
                                            placeholder="Link"
                                            isRequired={true}
                                            value={link}
                                            iconLeft={faLink}
                                            errorMessage={errorField.links}
                                            type="url"
                                            onChange={ev => {
                                                setBootleg(new Bootleg({ ...bootleg, links: [...bootleg.links].map((link, index) => index === i ? ev.target.value : link) }))
                                            }}
                                            button={{
                                                isDisabled: bootleg.links?.length <= 1 || status === Status.PENDING,
                                                onClick: () => setBootleg(new Bootleg({ ...bootleg, links: [...bootleg.links].filter((x, y) => y !== i) })),
                                                iconLeft: faTrash,
                                                styles: { button: 'is-greyblue' }
                                            }}
                                            isDisabled={status === Status.PENDING}
                                            minLength={5}
                                            maxLength={500}
                                        />
                                    )}
                                    <Button
                                        label="Add a link"
                                        onClick={() => setBootleg(new Bootleg({ ...bootleg, links: [...bootleg.links, ''] }))}
                                        iconLeft={faPlus}
                                        styles={{ button: 'is-small is-greyblue' }}
                                        isDisabled={bootleg.links?.length >= 10 || status === Status.PENDING}
                                    />
                                    <br />
                                    <br />
                                    <Label
                                        isRequired
                                        htmlFor="song"
                                    >
                                        {bootleg.songs?.length > 1 ? 'Songs' : 'Song'}
                                    </Label>
                                    {bootleg.songs?.map((song, i) =>
                                        <Input
                                            id={`song-${i}`}
                                            key={`song-${i}`}
                                            placeholder="Song"
                                            isRequired={true}
                                            value={song}
                                            iconLeft={faMusic}
                                            errorMessage={errorField.songs}
                                            onInput={ev => {
                                                const value = /** @type {HTMLInputElement} */(ev.target).value
                                                switch (/** @type {any} */(ev.nativeEvent)?.constructor) {
                                                    case InputEvent:
                                                        updateSuggestions({ object: Song, index: i, value })
                                                        break
                                                    case Event:
                                                        updateSuggestions({ object: Song, index: i, isClear: true })
                                                        break
                                                    default:
                                                        break
                                                }
                                                setBootleg(new Bootleg({ ...bootleg, songs: [...bootleg.songs].map((song, index) => index === i ? value : song) }))
                                            }}
                                            onBlur={() => {
                                                updateSuggestions({ object: Song, index: i, isClear: true })
                                            }}
                                            button={{
                                                isDisabled: bootleg.songs?.length <= 1 || status === Status.PENDING,
                                                onClick: () => setBootleg(new Bootleg({ ...bootleg, songs: [...bootleg.songs].filter((x, y) => y !== i) })),
                                                iconLeft: faTrash,
                                                styles: { button: 'is-greyblue' }
                                            }}
                                            isDisabled={status === Status.PENDING}
                                            minLength={1}
                                            maxLength={255}
                                            options={/** @type {String[]} */(suggestions.songs?.[i]) ?? []}
                                        />
                                    )}
                                    <Button
                                        label="Add a song"
                                        onClick={() => setBootleg(new Bootleg({ ...bootleg, songs: [...bootleg.songs, ''] }))}
                                        iconLeft={faPlus}
                                        styles={{ button: 'is-small is-greyblue' }}
                                        isDisabled={bootleg.songs?.length >= 10 || status === Status.PENDING}
                                    />
                                    <br />
                                    <br />
                                    <br />
                                    <h2 className="subtitle is-5">
                                        Location(s)
                                    </h2>
                                    <Columns className="is-variable">
                                        <Columns.Column>
                                            <Label
                                                isRequired
                                                htmlFor="country"
                                            >
                                                {bootleg.countries?.length > 1 ? 'Countries' : 'Country'}
                                            </Label>
                                            {bootleg.countries?.map((country, i) =>
                                                <Select
                                                    id="country"
                                                    key={`country-${i}`}
                                                    // isRequired={true}
                                                    value={country}
                                                    iconLeft={faGlobeEurope}
                                                    errorMessage={errorField.countries}
                                                    onChange={(ev, option) => {
                                                        setBootleg(new Bootleg({ ...bootleg, countries: [...bootleg.countries].map((country, index) => index === i ? ev.target.value : country) }))
                                                    }}
                                                    options={[
                                                        { key: null, text: '' },
                                                        ...Object.keys(ECountries).map(country => ({
                                                            key: country, text: ECountries[country]
                                                        }))
                                                    ]}
                                                    button={{
                                                        isDisabled: bootleg.countries?.length <= 1 || status === Status.PENDING,
                                                        onClick: () => setBootleg(new Bootleg({ ...bootleg, countries: [...bootleg.countries].filter((x, y) => y !== i) })),
                                                        iconLeft: faTrash,
                                                        styles: { button: 'is-greyblue' }
                                                    }}
                                                    isDisabled={status === Status.PENDING}
                                                />
                                            )}
                                            <Button
                                                label="Add a country"
                                                onClick={() => setBootleg(new Bootleg({ ...bootleg, countries: [...bootleg.countries, ''] }))}
                                                iconLeft={faPlus}
                                                styles={{ button: 'is-small is-greyblue' }}
                                                isDisabled={bootleg.countries?.length >= 10 || status === Status.PENDING}
                                            />
                                        </Columns.Column>
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
                                                    iconLeft={faCity}
                                                    errorMessage={errorField.cities}
                                                    onChange={ev => {
                                                        setBootleg(new Bootleg({ ...bootleg, cities: [...bootleg.cities].map((city, index) => index === i ? ev.target.value : city) }))
                                                    }}
                                                    button={{
                                                        isDisabled: bootleg.cities?.length <= 1 || status === Status.PENDING,
                                                        onClick: () => setBootleg(new Bootleg({ ...bootleg, cities: [...bootleg.cities].filter((x, y) => y !== i) })),
                                                        iconLeft: faTrash,
                                                        styles: { button: 'is-greyblue' }
                                                    }}
                                                    isDisabled={status === Status.PENDING}
                                                    minLength={1}
                                                    maxLength={255}
                                                />
                                            )}
                                            <Button
                                                label="Add a city"
                                                onClick={() => setBootleg(new Bootleg({ ...bootleg, cities: [...bootleg.cities, ''] }))}
                                                iconLeft={faPlus}
                                                styles={{ button: 'is-small is-greyblue' }}
                                                isDisabled={bootleg.cities?.length >= 10 || status === Status.PENDING}
                                            />
                                        </Columns.Column>
                                    </Columns>
                                    <br />
                                    <h2 className="subtitle is-5">
                                        Other
                                    </h2>
                                    <Columns className="is-variable">
                                        <Columns.Column>
                                            <Toggle
                                                label="Complete Show"
                                                isRequired={true}
                                                checked={!!bootleg.isCompleteShow}
                                                onChange={ev => setBootleg(new Bootleg({ ...bootleg, isCompleteShow: !!ev.target.checked }))}
                                                errorMessage={errorField.isCompleteShow}
                                                isDisabled={status === Status.PENDING}
                                            />
                                        </Columns.Column>
                                        <Columns.Column>
                                            <Toggle
                                                label="Audio Only"
                                                isRequired={true}
                                                checked={!!bootleg.isAudioOnly}
                                                onChange={ev => setBootleg(new Bootleg({ ...bootleg, isAudioOnly: !!ev.target.checked }))}
                                                errorMessage={errorField.isAudioOnly}
                                                isDisabled={status === Status.PENDING}
                                            />
                                        </Columns.Column>
                                        <Columns.Column>
                                            <Toggle
                                                label="Pro Record"
                                                isRequired={true}
                                                checked={!!bootleg.isProRecord}
                                                onChange={ev => setBootleg(new Bootleg({ ...bootleg, isProRecord: !!ev.target.checked }))}
                                                errorMessage={errorField.isProRecord}
                                                isDisabled={status === Status.PENDING}
                                            />
                                        </Columns.Column>
                                    </Columns>
                                    <Columns className="is-variable">
                                        <Columns.Column>
                                            <Rating
                                                label="Sound Quality"
                                                isRequired={true}
                                                value={bootleg.soundQuality || 0}
                                                onChange={(ev, i) => setBootleg(new Bootleg({ ...bootleg, soundQuality: i }))}
                                                size="large"
                                                errorMessage={errorField.soundQuality}
                                                isDisabled={status === Status.PENDING}
                                            />
                                        </Columns.Column>
                                        {!bootleg.isAudioOnly ?
                                            <Columns.Column>
                                                <Rating
                                                    label="Video Quality"
                                                    isRequired={true}
                                                    value={bootleg.videoQuality || 0}
                                                    onChange={(ev, i) => setBootleg(new Bootleg({ ...bootleg, videoQuality: i }))}
                                                    size="large"
                                                    errorMessage={errorField.videoQuality}
                                                    isDisabled={status === Status.PENDING}
                                                />
                                            </Columns.Column>
                                            :
                                            <Columns.Column className="is-hidden-mobile" />
                                        }
                                        <Columns.Column className="is-hidden-mobile" />
                                    </Columns>
                                    <br />
                                    <div className="buttons">
                                        <Button
                                            label="Brouillon"
                                            onClick={() => setBootleg(new Bootleg({ ...bootleg, state: EStates.DRAFT }))}
                                            iconLeft={faPencilRuler}
                                            type="submit"
                                            isDisabled={bootleg.state !== EStates.DRAFT && status === Status.PENDING}
                                            isLoading={bootleg.state === EStates.DRAFT && status === Status.PENDING}
                                        />
                                        <Button
                                            label="Validate"
                                            onClick={() => setBootleg(new Bootleg({ ...bootleg, state: EStates.PENDING }))}
                                            iconLeft={faCheck}
                                            type="submit"
                                            isDisabled={bootleg.state !== EStates.PENDING && status === Status.PENDING}
                                            isLoading={bootleg.state === EStates.PENDING && status === Status.PENDING}
                                        />
                                    </div>
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
     * @param {GetServerSidePropsContext & { store: Store<{ main: MainState; notification: NotificationState }, AnyAction>; }} ctx
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
                return {
                    props: {
                        bootlegProps: new Bootleg({
                            bands: [null],
                            countries: [null],
                            cities: [null],
                            links: [null],
                            songs: [null],
                            isAudioOnly: false,
                            isCompleteShow: false,
                            isProRecord: false,
                            state: EStates.DRAFT,
                            soundQuality: 0
                        }).toJson()
                    }
                }

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