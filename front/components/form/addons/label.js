import React, { ReactChild } from "react"
import classNames from 'classnames'
// @ts-ignore
import labelStyles from 'styles/components/form/addons/label.module.scss'

/**
 * Label styles
 * @typedef {object} Styles
 * @property {any=} label
 */

/**
 * Simple input
 * @param {object} props
 * @param {boolean=} props.isRequired
 * @param {string=} props.htmlFor
 * @param {string=} props.id
 * @param {ReactChild} props.children
 * @param {Styles=} props.styles
 */
export default function Label({
    isRequired = null,
    htmlFor = null,
    id = null,
    children = null,
    styles = {}
}) {
    return (
        <label
            htmlFor={htmlFor}
            id={id}
            className={classNames("label", { 'is-required': isRequired }, styles.label, labelStyles.label)}
        >
            {children}
        </label>
    )
}