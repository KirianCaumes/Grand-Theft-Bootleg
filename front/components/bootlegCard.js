import React from 'react'
// @ts-ignore
import { Card, Media, Heading } from 'react-bulma-components'
// @ts-ignore
import styles from "styles/components/bootlegcard.module.scss"
import classNames from 'classnames'

/**
 * BootlegCard
 * @param {object} props 
 * @param {string} props.title 
 * @param {string} props.band
 * @param {string} props.imageUrl
 * @param {string} props.date
 */
export default function BootlegCard({ title, band, imageUrl, date }) {
    return (
        <article className={classNames(styles.bootlegcard, "card")}>
            <div className="card-image">
                <figure className={classNames(styles.figure, "image")}>
                    <img className={styles.image} src={imageUrl} alt={title ?? "bootleg"} />
                </figure>
            </div>
            <Card.Content>
                <div className="media">
                    <div className={classNames(styles.mediacontent, "media-content")}>
                        <Heading
                            renderAs="h3"
                            size={5}
                            className={styles.title}
                        >
                            {title}
                        </Heading>
                        <Heading
                            renderAs="h4"
                            subtitle size={6}
                            className={styles.subtitle}
                        >
                            {band}
                        </Heading>
                        <Heading
                            renderAs="p"
                            subtitle
                            size={6}
                        >
                            <time dateTime={date}>{date}</time>
                        </Heading>
                    </div>
                </div>
            </Card.Content>
        </article>
    )
}
