import React from "react"
import classNames from 'classnames'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from '@fortawesome/fontawesome-svg-core'
// @ts-ignore
import selectStyles from 'styles/components/form/select.module.scss'

/**
 * Select styles
 * @typedef {object} Styles
 * @property {any=} control
 * @property {any=} select
 */

/**
 * Options type
 * @typedef {object} Options
 * @property {string | Number} key
 * @property {string} text
 */

/**
 * Simple select
 * @param {object} props
 * @param {string} props.label
 * @param {boolean=} props.isDisabled
 * @param {function(React.ChangeEvent<HTMLSelectElement>, Options)=} props.onChange
 * @param {Styles=} props.styles
 * @param {IconProp=} props.iconLeft
 * @param {string=} props.value
 * @param {Options[]=} props.options
 */
export default function Select({
    label = "",
    isDisabled = false,
    iconLeft = undefined,
    value = null,
    onChange = () => null,
    styles = {},
    options = []
}) {
    const id = Math.random().toString(36).slice(-6)

    return (
        <div className="field">
            <label
                className="label"
                htmlFor={id}
            >
                {label}
            </label>
            <div className={classNames("control", { 'has-icons-left': iconLeft }, styles.control, selectStyles.control)}>
                <div className={classNames("select is-pink", styles.select, selectStyles.select)}>
                    <select
                        id={id}
                        onChange={ev => onChange(ev, options.find(opt => (opt.key?.toString() || '') === ev.target.value))}
                        value={value || ""}
                        disabled={isDisabled}
                    >
                        {options.map((opt, i) =>
                            <option
                                key={i}
                                value={opt.key?.toString() || ''}
                            >
                                {opt.text}
                            </option>
                        )}
                    </select>
                </div>
                {iconLeft &&
                    <div className="icon is-small is-left">
                        <FontAwesomeIcon icon={iconLeft} />
                    </div>
                }
            </div>
        </div>
    )
}