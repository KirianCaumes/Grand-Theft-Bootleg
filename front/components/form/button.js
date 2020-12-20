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
 * Button styles
 * @typedef {object} ButtonType
 * @property {string=} label
 * @property {"button" | "submit" | "reset"=} type
 * @property {function(React.MouseEvent<any, MouseEvent>)=} onClick
 * @property {boolean=} isLoading
 * @property {boolean=} isDisabled
 * @property {IconProp=} iconLeft
 * @property {IconProp=} iconRight
 * @property {Styles=} styles
 * @property {string=} color
 * @property {string=} href
 */

/**
 * Simple button
 * @param {ButtonType} props
 */
export default function Button({
    label = "",
    type = "button",
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
        {label &&
            <span>{label}</span>
        }
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