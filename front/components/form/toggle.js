import React from "react"
import classNames from 'classnames'
// @ts-ignore
import toggleStyles from 'styles/components/form/toggle.module.scss'

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
 */
export default function Toggle({
    label = "",
    checked = null,
    isDisabled = false,
    onChange = () => null,
    styles = {}
}) {
    return (
        <>
            <label className="label" htmlFor={encodeURIComponent(label)}>{label}</label>
            <div className={classNames("field", styles.field, toggleStyles.field)}>
                <input
                    id={encodeURIComponent(label)}
                    type="checkbox"
                    className="switch is-rounded is-pink"
                    checked={checked}
                    onChange={onChange}
                    disabled={isDisabled}
                />
                <label htmlFor={encodeURIComponent(label)}>
                    {!!checked ? 'Yes' : 'No'}
                </label>
            </div>
        </>
    )
}