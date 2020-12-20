import React from "react"
import classNames from 'classnames'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from '@fortawesome/fontawesome-svg-core'
// @ts-ignore
import selectStyles from 'styles/components/form/select.module.scss'
import Label from "./label"
import Button, { ButtonType } from 'components/form/button'

/**
 * Select styles
 * @typedef {object} Styles
 * @property {any=} control
 * @property {any=} selectContainer
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
 * @param {string=} props.label
 * @param {boolean=} props.isDisabled
 * @param {function(React.ChangeEvent<HTMLSelectElement>, Options)=} props.onChange
 * @param {Styles=} props.styles
 * @param {string=} props.color
 * @param {IconProp=} props.iconLeft
 * @param {string=} props.value
 * @param {Options[]=} props.options
 * @param {ButtonType=} props.button
 */
export default function Select({
    label = "",
    isDisabled = false,
    iconLeft = undefined,
    value = null,
    onChange = () => null,
    styles = {},
    color = 'greyblue',
    options = [],
    button = {},
}) {
    return (
        <div
            className={classNames("field", { 'has-addons': Object.keys(button)?.length > 0 })}
        >
            {!!label &&
                <Label
                    htmlFor={encodeURIComponent(label)}
                >
                    {label}
                </Label>
            }
            <div className={classNames("control", { 'has-icons-left': iconLeft }, styles.control, selectStyles.control)}>
                <div className={classNames(`select is-${color}`, styles.selectContainer, selectStyles.selectContainer)}>
                    <select
                        id={encodeURIComponent(label)}
                        onChange={ev => onChange(ev, options.find(opt => (opt.key?.toString() || '') === ev.target.value))}
                        value={value || ""}
                        disabled={isDisabled}
                        className={classNames(styles.select, selectStyles.select)}
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
            {
                Object.keys(button)?.length > 0 &&
                <div className="control">
                    <Button
                        {...button}
                    />
                </div>
            }
        </div>
    )
}