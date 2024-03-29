import React from "react"
import classNames from 'classnames'
// @ts-ignore
import ratingStyles from 'styles/components/form/rating.module.scss'
import Label from "./addons/label"
import Help from "./addons/help"

/**
 * Rating styles
 * @typedef {object} Styles
 * @property {any=} icon
 */

/**
 * Simple input
 * @param {object} props
 * @param {number=} props.min
 * @param {number=} props.max
 * @param {number} props.value
 * @param {function(React.MouseEvent<HTMLSpanElement, MouseEvent>, number):any=} props.onChange
 * @param {any=} props.icon
 * @param {any=} props.unselectedIcon
 * @param {string=} props.label
 * @param {boolean=} props.isRequired
 * @param {Styles=} props.styles
 * @param {'small' | 'medium' | 'large'=} props.size
 * @param {string=} props.errorMessage
 * @param {boolean=} props.isDisabled
 * @param {boolean=} props.isReadonly
 */
export default function Rating({
    max = 5,
    value = 1,
    onChange = () => null,
    icon = "★",
    unselectedIcon = "☆",
    label = "",
    isRequired = false,
    styles = {},
    size = null,
    errorMessage = undefined,
    isDisabled = false,
    isReadonly = false,
}) {
    return (
        <span
            className={classNames(ratingStyles.rating)}
            // @ts-ignore
            disabled={isDisabled}
            // @ts-ignore
            readOnly={isReadonly}
        >
            {!!label &&
                <Label
                    htmlFor={encodeURIComponent(label)}
                    isRequired={isRequired}
                >
                    {label}
                </Label>
            }
            {new Array(max).fill({}).map((_, i) => (
                <button
                    type="button"
                    className={classNames("has-text-pink", styles.icon, ratingStyles.icon, { [ratingStyles[`is-${size}`]]: !!size })}
                    key={i}
                    onClick={ev => !isDisabled ? onChange(ev, i + 1) : null}
                    disabled={isDisabled || isReadonly}
                    role="presentation"
                    tabIndex={i + 1 === value ? 0 : -1}
                >
                    {i + 1 <= value ? icon : unselectedIcon}
                </button>
            ))}
            <Help>
                {errorMessage}
            </Help>
        </span>
    )
}