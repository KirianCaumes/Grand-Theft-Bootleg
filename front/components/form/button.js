import React from "react"
import classNames from 'classnames'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from '@fortawesome/fontawesome-svg-core'
// @ts-ignore
import buttonStyles from 'styles/components/form/button.module.scss'

/**
 * Button styles
 * @typedef {object} Styles
 * @property {any=} button
 */

/**
 * Simple button
 * @param {object} props
 * @param {string} props.label
 * @param {"button" | "submit" | "reset"=} props.type
 * @param {function(React.MouseEvent<HTMLButtonElement, MouseEvent>)=} props.onClick
 * @param {boolean=} props.isLoading
 * @param {IconProp=} props.iconLeft
 * @param {IconProp=} props.iconRight
 * @param {Styles=} props.styles
 */
export default function Button({
    label = "",
    type = "submit",
    onClick = () => null,
    isLoading = false,
    iconLeft = undefined,
    iconRight = undefined,
    styles = {},
}) {
    return (
        <button
            type={type}
            className={classNames("button is-pink", { 'is-loading': isLoading }, styles.button, buttonStyles.button)}
            onClick={onClick}
        >
            {iconLeft &&
                <span className="icon is-small">
                    <FontAwesomeIcon icon={iconLeft} />
                </span>
            }
            <span>{label}</span>
            {iconRight &&
                <span className="icon is-small">
                    <FontAwesomeIcon icon={iconRight} />
                </span>
            }
        </button>
    )
}