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
    const id = Math.random().toString(36).slice(-6)

    return (
        <>
            <label className="label" htmlFor={id}>{label}</label>
            <div className={classNames("field", styles.field, toggleStyles.field)}>
                <input
                    id={id}
                    type="checkbox"
                    className="switch is-rounded is-pink"
                    checked={checked}
                    onChange={onChange}
                    disabled={isDisabled}
                />
                <label htmlFor={id}>
                    {!!checked ? 'Yes' : 'No'}
                </label>
            </div>
        </>
    )
}