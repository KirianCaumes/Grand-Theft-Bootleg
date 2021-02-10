import React from "react"
import classNames from 'classnames'
// @ts-ignore
import toggleStyles from 'styles/components/form/toggle.module.scss'
import Label from "./addons/label"
import Help from "./addons/help"

/**
 * Toggle styles
 * @typedef {object} Styles
 * @property {any=} field
 */

/**
 * Simple input
 * @param {object} props
 * @param {string} props.label
 * @param {boolean} props.checked
 * @param {boolean=} props.isDisabled
 * @param {function(React.ChangeEvent<HTMLInputElement>)=} props.onChange
 * @param {Styles=} props.styles
 * @param {string=} props.color
 * @param {string=} props.errorMessage
 * @param {boolean=} props.isRequired
 */
export default function Toggle({
    label = "",
    checked = null,
    isDisabled = false,
    onChange = () => null,
    styles = {},
    color = 'light-greyblue',
    errorMessage = undefined,
    isRequired = false,
}) {
    return (
        <>
            {!!label &&
                <Label
                    htmlFor={encodeURIComponent(label)}
                    isRequired={isRequired}
                >
                    {label}
                </Label>
            }
            <div className={classNames(styles.field, toggleStyles.field)}>
                <input
                    id={encodeURIComponent(label)}
                    type="checkbox"
                    className={classNames(toggleStyles.switch, toggleStyles['is-rounded'], { [toggleStyles[`is-${color}`]]: !!color })}
                    checked={checked}
                    onChange={onChange}
                    disabled={isDisabled}
                />
                <label htmlFor={encodeURIComponent(label)}>
                    {!!checked ? 'Yes' : 'No'}
                </label>
                <Help>
                    {errorMessage}
                </Help>
            </div>
        </>
    )
}