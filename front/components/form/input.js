import React from "react"
import classNames from 'classnames'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from '@fortawesome/fontawesome-svg-core'
// @ts-ignore
import inputStyles from 'styles/components/form/input.module.scss'

/**
 * Input styles
 * @typedef {object} Styles
 * @property {any=} control
 * @property {any=} input
 */

/**
 * Simple input
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.placeholder
 * @param {string=} props.type
 * @param {boolean=} props.isDisabled
 * @param {number=} props.min
 * @param {number=} props.max
 * @param {number=} props.step
 * @param {boolean=} props.isRequired
 * @param {string=} props.value
 * @param {IconProp=} props.iconLeft
 * @param {string=} props.errorMessage
 * @param {function(React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): any=} props.onChange
 * @param {Styles=} props.styles
 * @param {boolean=} props.isWithBtn
 * @param {function()=} props.onClickBtn
 * @param {IconProp=} props.iconBtn
 * @param {boolean=} props.multiline
 */
export default function Input({
    label = "",
    placeholder = "",
    type = "text",
    isDisabled = false,
    min = undefined,
    max = undefined,
    step = undefined,
    isRequired = false,
    value = null,
    iconLeft = undefined,
    errorMessage = undefined,
    onChange = () => null,
    styles = {},

    isWithBtn = false,
    onClickBtn = () => null,
    iconBtn = undefined,

    multiline = false
}) {
    const Ipt = multiline ? 'textarea' : 'input'
    return (
        <>
            <label
                htmlFor={encodeURIComponent(label)}
                className={classNames("label", { 'is-required': isRequired })}
            >
                {label}
            </label>
            <div
                className={classNames("field", { 'has-addons': isWithBtn })}
            >
                <div className={classNames("control is-expanded", { 'has-icons-left': iconLeft }, styles.control, inputStyles.control)}>
                    <Ipt
                        id={encodeURIComponent(label)}
                        className={classNames("is-greyblue", { 'input': !multiline }, { 'textarea': multiline }, { 'is-danger': !!errorMessage }, styles.input, inputStyles.input)}
                        type={type}
                        placeholder={placeholder}
                        onChange={onChange}
                        required={isRequired}
                        value={value || ''}
                        min={min}
                        max={max}
                        step={step}
                        disabled={isDisabled}
                    />
                    {iconLeft &&
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon={iconLeft} />
                        </span>
                    }
                    {errorMessage &&
                        <p className="help is-danger">{errorMessage}</p>
                    }
                </div>
                {
                    isWithBtn &&
                    <div className="control">
                        <button
                            className="button is-greyblue"
                            onClick={onClickBtn}
                            type="button"
                        >
                            <FontAwesomeIcon icon={iconBtn} />
                        </button>
                    </div>
                }
            </div>
        </>
    )
}