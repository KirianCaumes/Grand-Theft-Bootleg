import React, { AriaAttributes } from "react"
import classNames from 'classnames'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from '@fortawesome/fontawesome-svg-core'
// @ts-ignore
import buttonStyles from 'styles/components/form/button.module.scss'
import Link from "next/link"
import { UrlObject } from 'url'

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
 * @property {string | UrlObject=} href
 */

/**
 * Simple button
 * @param {ButtonType & AriaAttributes} props
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
    href = null,
    ...props
}) {
    const Btn = !!href && !isDisabled ? 'a' : 'button'

    const element = <Btn
        type={type}
        className={classNames(
            'button',
            [buttonStyles['button']],
            { [buttonStyles[`is-${color}`]]: !!color },
            { [buttonStyles['is-loading']]: isLoading },
            [...(styles.button?.split(' ').map(x => [buttonStyles[x]]) ?? [])],
            styles.button,
            buttonStyles.button
        )}
        onClick={onClick}
        disabled={isDisabled}
        name={!!label ? encodeURIComponent(label) : undefined}
        {...props}
    >
        {iconLeft &&
            <span
                className={classNames(
                    [buttonStyles['icon']],
                    [buttonStyles['is-small']]
                )}
            >
                <FontAwesomeIcon icon={iconLeft} />
            </span>
        }
        {label &&
            <span>{label}</span>
        }
        {iconRight &&
            <span
                className={classNames(
                    [buttonStyles['icon']],
                    [buttonStyles['is-small']]
                )}
            >
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