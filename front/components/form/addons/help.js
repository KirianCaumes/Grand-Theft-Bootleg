import React from "react"
import classNames from 'classnames'
// @ts-ignore
import helpStyles from 'styles/components/form/addons/help.module.scss'

/**
 * Select styles
 * @typedef {object} Styles
 * @property {any=} help
 */

/**
 * Simple input
 * @param {object} props
 * @param {string=} props.children
 * @param {Styles=} props.styles
 * @param {string=} props.color
 */
export default function Help({
    children = null,
    styles = {},
    color = 'danger',
}) {
    if (!children)
        return null

    return (
        <p
            className={classNames("help", { [`is-${color}`]: !!color }, helpStyles.help, styles.help)}
        >
            {children}
        </p>
    )
}