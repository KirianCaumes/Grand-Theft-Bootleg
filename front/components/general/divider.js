import React from 'react'
// @ts-ignore
import styles from "styles/components/general/divider.module.scss"
import classNames from 'classnames'

/**
 * Divider columns
 * @param {object} props
 * @param {boolean=} props.isVertical
 * @param {string=} props.content
 */
export default function Divider({ isVertical = false, content = undefined }) {
    return (
        <div
            className={classNames(
                { "is-divider-vertical": isVertical },
                { [styles["is-divider-vertical"]]: isVertical },
                { "is-divider": !isVertical },
                { [styles["is-divider"]]: !isVertical },
            )}
            data-content={content}
        />
    )
}