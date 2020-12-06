import React from "react"
import classNames from 'classnames'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from '@fortawesome/fontawesome-svg-core'
// @ts-ignore
import buttonStyles from 'styles/components/form/button.module.scss'
import Link from "next/link"

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
 * @param {function(React.MouseEvent<any, MouseEvent>)=} props.onClick
 * @param {boolean=} props.isLoading
 * @param {boolean=} props.isDisabled
 * @param {IconProp=} props.iconLeft
 * @param {IconProp=} props.iconRight
 * @param {Styles=} props.styles
 * @param {string=} props.color
 * @param {string=} props.href
 */
export default function Button({
    label = "",
    type = "submit",
    onClick = () => null,
    isLoading = false,
    isDisabled = false,
    iconLeft = undefined,
    iconRight = undefined,
    styles = {},
    color = 'pink',
    href = null
}) {
    const Btn = href ? 'a' : 'button'

    const element = <Btn
        type={type}
        className={classNames(`button is-${color}`, { 'is-loading': isLoading }, styles.button, buttonStyles.button)}
        onClick={onClick}
        disabled={isDisabled}
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
    </Btn>

    if (href)
        return (
            <Link href={href}>
                {element}
            </Link>
        )
    else
        return element
}