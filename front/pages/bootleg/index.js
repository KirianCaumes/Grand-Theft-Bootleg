import React from "react"
import Head from "next/head"
// @ts-ignore
import styles from "styles/pages/bootleg/index.module.scss"
// @ts-ignore
import { Section, Columns, Container } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandshake, faQuestion, faSearch } from '@fortawesome/free-solid-svg-icons'
import withHandlers, { HandlersProps } from 'helpers/hoc/withHandlers'
import getConfig from 'next/config'
import { connect } from "react-redux"
import { ReduxProps } from 'redux/store'
import Fade from 'react-reveal/Fade';
import classNames from "classnames"
import Image from 'next/image'
import Button from "components/form/button"

/**
 * Index page
 * @param {HandlersProps & ReduxProps} props 
 */
function IndexBootleg({ ...props }) {
    const { publicRuntimeConfig } = getConfig()

    return (
        <>
            <Head>
                <title>What is a bootleg? - {publicRuntimeConfig.appName}</title>
                <meta
                    name="description"
                    content="Get to know the story of the bootlegs and understand how these underground shows a precious for Grand Theft Bootleg."
                />
            </Head>

            <main className={styles['index-bootleg']}>
                <Section>
                    <Container>
                        <h1 className="title is-1 is-title-underline">What is a Bootleg ?</h1>
                        <br />
                        <br />
                        <h2 className="title is-3 is-title-underline">Overall definition :</h2>
                        <p className={classNames(styles['space-para'], "is-size-5")}>
                            A <b>bootleg</b> recording is an audio or video recording of a performance not officially released by the artist or underother legal authority.
                            Making and distributing <b>such recordings is known as bootlegging</b>.
                            Recordings may be copied and traded among fans without financial exchange, but some bootleggers have sold recordings for profit, sometimes by adding professional-quality sound engineering and packaging to the raw material.
                            <b>Bootlegs</b> usually consist of unreleased studio recordings, live performances or interviews without the quality control of official releases.<br />
                            <br />
                                Changing technologies have affected the recording, distribution, and profitability of the bootlegging industry.
                                The copyrights for the music and the right to authorise recordings often reside with the artist, according to several international copyright treaties. The recording, trading and sale of <b>bootlegs</b>bootlegs continues to thrive, even as artists and record companies release official alternatives.
                        </p>
                    </Container>
                </Section>
                <Section className="is-relative">
                    <div className={styles.skewed} />
                    <br />
                    <Container>
                        <h2 className="title is-3 is-title-underline has-text-white">Deep information :</h2>
                        <p className={classNames(styles['space-para'], "is-size-5 has-text-white")}>
                            The most common type is the live <b>bootleg</b>, or audience recording, which is created with sound recording equipment smuggled into a live concert.
                            Many artists and live venues prohibit this form of recording, but from the 1970s onwards the increased availability of portable technology made such bootlegging easier, and the general quality of these recordings has improved over time as consumer equipment becomes sophisticated.
                            A number of <b>bootlegs</b> originated with FM radio broadcasts of live or previously recorded live performances.
                            Other <b>bootlegs</b> may be soundboard recordings taken directly from a multi-track mixing console used to feed the public address system at a live performance.
                                Artists may record their own shows for private review, but engineers may surreptitiously take a copy of this, which ends up being shared.<br />
                            <br />
                                Some <b>bootlegs</b> consist of private or professional studio recordings distributed without the artist's involvement, including demos, works-in-progress or discarded material.
                                These might be made from private recordings not meant to be widely shared, or from master recordings stolen or copied from an artist's home, a recording studio or the offices of a record label, or they may be copied from promotional material issued to music publishers or radio stations, but not for commercial release. <a href="https://en.wikipedia.org/wiki/Bootleg_recording"></a>
                        </p>
                    </Container>
                </Section>
                <Section>
                    <Container>
                        <div className={classNames(styles['history-timeline'])}>
                            <h2 className="title is-3 is-title-underline">History timeline :</h2>
                            <br />
                            <Fade top>
                                <div className={classNames(styles['history-card'], "boxed")}>
                                    <Image
                                        src={"/img/Shakespeare.jpg"}
                                        alt="Shakespeare"
                                        width={375}
                                        height={400}
                                    />
                                    <h3 className="title is-4">Pre-1960s </h3>
                                    <p className={classNames(styles['space-para'], "is-size-5")}>According to enthusiast and author Clinton Heylin, the concept of a <b>bootleg</b> record can be traced back to the days of William Shakespeare, where unofficial transcripts of his plays would be published </p>
                                </div>
                            </Fade>
                            <Fade top>
                                <div className={classNames(styles['history-card'], "boxed")}>
                                    <Image
                                        src={"/img/rock_arena.jpg"}
                                        alt="rock_arena"
                                        width={375}
                                        height={245}
                                    />
                                    <h3 className="title is-4">1970</h3>
                                    <p className={classNames(styles['space-para'], "is-size-5")}>Teh concept of bootleg expend rapidly with the conecpt or stadium rock or arena rock, and poeple who started to record
                                    all of this. Vast numbers of recordings were issued for profit by bootleg labels such as Kornyfone and TMQ.</p>
                                </div>
                            </Fade>
                            <Fade top>
                                <div className={classNames(styles['history-card'], "boxed")}>
                                    <Image
                                        src={"/img/cassette-videotape.jpg"}
                                        alt="cassette-videotape"
                                        width={375}
                                        height={330}
                                    />
                                    <h3 className="title is-4">1980s</h3>
                                    <p className={classNames(styles['space-para'], "is-size-5")} >With the increase of innovante technologie such as audio casset or viedotapes a new way to diffuse <b>bootleg</b> apear, thos type of support was smaller and easier to sold.</p>
                                </div>
                            </Fade>
                            <Fade top>
                                <div className={classNames(styles['history-card'], "boxed")}>
                                    <Image
                                        src={"/img/cd-1900-today.jpg"}
                                        alt="cd-1900-today"
                                        width={375}
                                        height={325}
                                    />
                                    <h3 className="title is-4">1990 - present.</h3>
                                    <p className={classNames(styles['space-para'], "is-size-5")} >Following the success of Ultra Rare Trax, the 1990s saw an increased production of bootleg CDs, including reissues of shows that had been recorded decades previously. In particular, companies in Germany and Italy exploited the more relaxed copyright laws in those countries by pressing large numbers of CDs and including catalogs of other titles on the inlays, making it easier for fans to find and order shows direct.</p>
                                </div>
                            </Fade>
                        </div>
                    </Container>
                </Section>
                <Section className="is-relative">
                    <div className={styles.skewed} />
                    <br />
                    <Container>
                        <div className={styles['general-information']}>
                            <h2 className="title is-3 is-title-underline has-text-white">What are we doing with <b>bootleg</b>, do this Website is legal ?</h2>

                            <p className={classNames(styles['space-para'], "is-size-5 has-text-white")} ><b>Bootleg</b> are technicaly not legal because the song they can contain are protected by copyrigth law, but only the site that host these <b>bootleg</b> can be shut down by law,
                            since we don't host any and the purpose of the site is just to be a directory of <b>bootleg</b>, and lead to site where you can find it, we technicaly do nothing who is out the low.
                            So it's safe too contribute and help people to find the group they love by adding some <b>bootleg</b>. Give it a try.</p>
                        </div>
                    </Container>
                </Section>
                <Section className="is-relative">
                    <Container>
                        <h2 className="title is-3  is-title-underline">
                            How Grand Theft <b>bootleg</b> works?
                        </h2>
                        <p className="is-size-5 ">
                            Participate in music history!
                        </p>
                        <br />
                        <br />
                        <Columns
                            className="is-8 is-variable"
                        >
                            <Columns.Column
                                size="one-third"
                            >
                                <Fade left>
                                    <div>
                                        <p
                                            className=" has-text-centered"
                                        >
                                            <FontAwesomeIcon
                                                style={{ height: '2.5rem', width: 'auto' }}
                                                icon={faHandshake}
                                            />
                                        </p>
                                        <h3 className="title is-5  has-text-centered">
                                            Have a bootleg ?
                                        </h3>
                                        <p className="subtitle is-6  has-text-centered">
                                            Let's share them with the community!
                                        </p>
                                        <Button
                                            label="Share"
                                            href="/bootleg/new/edit"
                                            styles={{ button: 'is-outlined is-fullwidth' }}
                                        />
                                    </div>
                                </Fade>
                            </Columns.Column>
                            <Columns.Column
                                size="one-third"
                            >
                                <Fade bottom>
                                    <div>
                                        <p
                                            className=" has-text-centered"
                                        >
                                            <FontAwesomeIcon
                                                style={{ height: '2.5rem', width: 'auto' }}
                                                icon={faSearch}
                                            />
                                        </p>
                                        <h3 className="title is-5  has-text-centered">
                                            Want to <b>listen</b> to something?
                                        </h3>
                                        <p className="subtitle is-6  has-text-centered">
                                            Search, find and listen!
                                        </p>
                                        <Button
                                            label="Search"
                                            href="/bootleg/search"
                                            styles={{ button: 'is-outlined is-fullwidth' }}
                                        />
                                    </div>
                                </Fade>
                            </Columns.Column>
                            <Columns.Column
                                size="one-third"
                            >
                                <Fade right>
                                    <div>
                                        <p
                                            className=" has-text-centered"
                                        >
                                            <FontAwesomeIcon
                                                style={{ height: '2.5rem', width: 'auto' }}
                                                icon={faQuestion}
                                            />
                                        </p>
                                        <h3 className="title is-5  has-text-centered">
                                            A <b>question</b>?
                                        </h3>
                                        <p className="subtitle is-6  has-text-centered">
                                            You can message us directly!
                                        </p>
                                        <Button
                                            label="Contact us"
                                            href="/general-conditions"
                                            styles={{ button: 'is-outlined is-fullwidth' }}
                                        />
                                    </div>
                                </Fade>
                            </Columns.Column>
                        </Columns>
                    </Container>
                    <br />
                </Section>
            </main>
        </>
    )
}

export default connect((state) => state)(withHandlers(IndexBootleg))