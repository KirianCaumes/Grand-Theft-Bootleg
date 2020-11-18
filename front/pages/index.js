import React, { useEffect } from "react"
import Head from "next/head"
// @ts-ignore
import styles from "styles/pages/index.module.scss"
import { GlobalProps } from "pages/_app"
import BootlegManager from "request/managers/bootlegManager"
// @ts-ignore
import { Section, Columns, Container, Button } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import BootlegCard from "components/bootlegCard"
import { Logo } from "components/svg/icon"

/**
 * @typedef {object} IndexProps
 * @property {string} test Test
 */

/**
 * Index page
 * @param {GlobalProps & IndexProps} props 
 */
export default function Index({ test = "qsdqsd", ...props }) {
    //Component did mount
    // useEffect(() => {
    //     (async () => {
    //         const bootlegManager = new BootlegManager()
    //         const bootlegs = await bootlegManager.getAll()
    //         console.log("bootlegs")
    //         console.log(bootlegs)
    //     })()
    // }, [])

    /** @type {[string, function(string):any]} Search text */
    const [searchText, setSearchText] = React.useState(null)

    return (
        <>
            <Head>
                <title>Home - {props.appname}</title>
            </Head>

            <main className={styles.index}>
                <Section className={styles.carousel} >
                    <Columns className="is-vcentered">
                        <Columns.Column
                            size="two-fifths"
                        >
                            <p className="has-text-right" >
                                <Logo width={85} />
                            </p>
                        </Columns.Column>
                        <Columns.Column
                            size="three-fifths"
                        >
                            <h1 className="title is-1 has-text-left has-text-white">
                                Grand Theft Bootleg
                            </h1>
                            <p className="subtitle is-5 has-text-left has-text-white" >
                                Music and its hidden sides submerged.<br />
                                What if we emerge them? 💿
                            </p>
                        </Columns.Column>

                    </Columns>
                </Section>
                <Section className={classNames(styles.search, "has-background-greyblue")} >
                    <div className={classNames(styles.field, "field has-addons")}>
                        <div className="control is-expanded">
                            <input
                                type="text"
                                placeholder="What are you looking for?"
                                defaultValue={searchText || ''}
                                className={classNames(styles.input, "input is-pink")}
                                onChange={ev => setSearchText(ev.target.value)}
                            />
                        </div>
                        <div className="control">
                            <button
                                className="button is-pink"
                                onClick={() => console.log("search", searchText)}
                            >
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>
                    </div>
                </Section>
                <Section>
                    <Container>
                        <h2 className="title is-2 has-text-centered">
                            Most popular Bootlegs
                        </h2>
                        <br />
                        <Columns>
                            <Columns.Column size="one-fifth">
                                <BootlegCard
                                    imageUrl="https://img.discogs.com/45tWYAPJWSnHv5FjPoxZ84jaWUM=/fit-in/600x600/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-10213608-1493499591-9392.jpeg.jpg"
                                    title="Live At Club Citta "
                                    band="In Flames"
                                    date="1998"
                                />
                            </Columns.Column>
                            <Columns.Column size="one-fifth">
                                <BootlegCard
                                    imageUrl="https://img.discogs.com/k3VlY3ds73dlHmDn0HJisgxIy74=/fit-in/516x511/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-5638567-1398636035-9309.jpeg.jpg"
                                    title="Playground Loudest Park - Loud Park '12 "
                                    band="In Flames"
                                    date="2012"
                                />
                            </Columns.Column>
                            <Columns.Column size="one-fifth">
                                <BootlegCard
                                    imageUrl="https://img.discogs.com/pjGNkgEGluMSF5Ye6dEkIWq4Ci4=/fit-in/600x449/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-5737820-1401293077-5189.jpeg.jpg"
                                    title="Fuel For The Fire"
                                    band="In Flames"
                                    date="2006"
                                />
                            </Columns.Column>
                            <Columns.Column size="one-fifth">
                                <BootlegCard
                                    imageUrl="https://img.discogs.com/yHYEsEhcNxBBqgsZvfIPfbMraqw=/fit-in/600x519/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-5754114-1401728563-5983.jpeg.jpg"
                                    title=" Live In Flames 3"
                                    band="In Flames"
                                    date="2000"
                                />
                            </Columns.Column>
                            <Columns.Column size="one-fifth">
                                <BootlegCard
                                    imageUrl="https://img.discogs.com/JabuhFQr42XzSg4l_EBVnL4f3Y8=/fit-in/600x590/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-12622889-1538794573-4702.jpeg.jpg"
                                    title="Live In Flames"
                                    band="In Flames"
                                    date="1998"
                                />
                            </Columns.Column>
                        </Columns>
                    </Container>
                    <br />
                </Section>
                <Section className="has-background-greyblue">
                    <br />
                    <Container>
                        <br />
                        <Columns className="is-vcentered">
                            <Columns.Column size="two-thirds">
                                <p className="subtitle is-4 has-text-centered has-text-white">
                                    You too, join the community and share your passion for your favorite bands.<br />
                                    Help us bring out the bootlegs lost in the depths of the abyss! 🌊
                                </p>
                            </Columns.Column>
                            <Columns.Column size="one-third">
                                <Button
                                    fullwidth={true}
                                    className="is-pink"
                                    onClick={() => console.log("register")}
                                >
                                    Register
                                </Button>
                            </Columns.Column>
                        </Columns>
                    </Container>
                    <br />
                </Section>
                <Section>
                    <br />
                    <Container>
                        <h2 className="title is-2 has-text-centered">
                            Newly added Bootlegs
                        </h2>
                        <br />
                        <Columns>
                            <Columns.Column size="one-fifth">
                                <BootlegCard
                                    imageUrl="https://img.discogs.com/45tWYAPJWSnHv5FjPoxZ84jaWUM=/fit-in/600x600/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-10213608-1493499591-9392.jpeg.jpg"
                                    title="Live At Club Citta "
                                    band="In Flames"
                                    date="1998"
                                />
                            </Columns.Column>
                            <Columns.Column size="one-fifth">
                                <BootlegCard
                                    imageUrl="https://img.discogs.com/k3VlY3ds73dlHmDn0HJisgxIy74=/fit-in/516x511/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-5638567-1398636035-9309.jpeg.jpg"
                                    title="Playground Loudest Park - Loud Park '12 "
                                    band="In Flames"
                                    date="2012"
                                />
                            </Columns.Column>
                            <Columns.Column size="one-fifth">
                                <BootlegCard
                                    imageUrl="https://img.discogs.com/pjGNkgEGluMSF5Ye6dEkIWq4Ci4=/fit-in/600x449/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-5737820-1401293077-5189.jpeg.jpg"
                                    title="Fuel For The Fire"
                                    band="In Flames"
                                    date="2006"
                                />
                            </Columns.Column>
                            <Columns.Column size="one-fifth">
                                <BootlegCard
                                    imageUrl="https://img.discogs.com/yHYEsEhcNxBBqgsZvfIPfbMraqw=/fit-in/600x519/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-5754114-1401728563-5983.jpeg.jpg"
                                    title=" Live In Flames 3"
                                    band="In Flames"
                                    date="2000"
                                />
                            </Columns.Column>
                            <Columns.Column size="one-fifth">
                                <BootlegCard
                                    imageUrl="https://img.discogs.com/JabuhFQr42XzSg4l_EBVnL4f3Y8=/fit-in/600x590/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-12622889-1538794573-4702.jpeg.jpg"
                                    title="Live In Flames"
                                    band="In Flames"
                                    date="1998"
                                />
                            </Columns.Column>
                        </Columns>
                    </Container>
                    <br />
                </Section>
                <Section className="has-background-greyblue">
                    <br />
                    <Container>
                        <h2 className="title is-2 has-text-centered has-text-white">
                            Top random Bootlegs
                        </h2>
                        <div className="flex-row">
                            <button
                                className="button is-pink"
                                onClick={() => console.log("reset random")}
                            >
                                I feel lucky! 🍀
                            </button>
                        </div>
                        <br />
                        <Columns>
                            <Columns.Column size="one-fifth">
                                <BootlegCard
                                    imageUrl="https://img.discogs.com/45tWYAPJWSnHv5FjPoxZ84jaWUM=/fit-in/600x600/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-10213608-1493499591-9392.jpeg.jpg"
                                    title="Live At Club Citta "
                                    band="In Flames"
                                    date="1998"
                                />
                            </Columns.Column>
                            <Columns.Column size="one-fifth">
                                <BootlegCard
                                    imageUrl="https://img.discogs.com/k3VlY3ds73dlHmDn0HJisgxIy74=/fit-in/516x511/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-5638567-1398636035-9309.jpeg.jpg"
                                    title="Playground Loudest Park - Loud Park '12 "
                                    band="In Flames"
                                    date="2012"
                                />
                            </Columns.Column>
                            <Columns.Column size="one-fifth">
                                <BootlegCard
                                    imageUrl="https://img.discogs.com/pjGNkgEGluMSF5Ye6dEkIWq4Ci4=/fit-in/600x449/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-5737820-1401293077-5189.jpeg.jpg"
                                    title="Fuel For The Fire"
                                    band="In Flames"
                                    date="2006"
                                />
                            </Columns.Column>
                            <Columns.Column size="one-fifth">
                                <BootlegCard
                                    imageUrl="https://img.discogs.com/yHYEsEhcNxBBqgsZvfIPfbMraqw=/fit-in/600x519/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-5754114-1401728563-5983.jpeg.jpg"
                                    title=" Live In Flames 3"
                                    band="In Flames"
                                    date="2000"
                                />
                            </Columns.Column>
                            <Columns.Column size="one-fifth">
                                <BootlegCard
                                    imageUrl="https://img.discogs.com/JabuhFQr42XzSg4l_EBVnL4f3Y8=/fit-in/600x590/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-12622889-1538794573-4702.jpeg.jpg"
                                    title="Live In Flames"
                                    band="In Flames"
                                    date="1998"
                                />
                            </Columns.Column>
                        </Columns>
                    </Container>
                    <br />
                </Section>
            </main>
        </>
    )
}
