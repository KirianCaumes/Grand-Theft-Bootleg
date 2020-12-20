import React from "react"
import classNames from 'classnames'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from '@fortawesome/fontawesome-svg-core'
// @ts-ignore
import inputStyles from 'styles/components/form/input.module.scss'
import Label from "./label"
import Button, { ButtonType } from 'components/form/button'
/**
 * Input styles
 * @typedef {object} Styles
 * @property {any=} control
 * @property {any=} input
 */

/**
 * Simple input
 * @param {object} props
 * @param {string=} props.label
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
 * @param {string=} props.color
 * @param {ButtonType=} props.button
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
    color = 'greyblue',

    button = {},

    multiline = false
}) {
    const Ipt = multiline ? 'textarea' : 'input'
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
            <div
                className={classNames("field", { 'has-addons': Object.keys(button)?.length > 0 })}
            >
                <div className={classNames("control is-expanded", { 'has-icons-left': iconLeft }, styles.control, inputStyles.control)}>
                    <Ipt
                        id={encodeURIComponent(label)}
                        className={classNames(`is-${color}`, { 'input': !multiline }, { 'textarea': multiline }, { 'is-danger': !!errorMessage }, styles.input, inputStyles.input)}
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
                    Object.keys(button)?.length > 0 &&
                    <div className="control">
                        <Button
                            {...button}
                        />
                    </div>
                }
            </div>
        </>
    )
}