import React, { AriaAttributes } from "react"
import classNames from 'classnames'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from '@fortawesome/fontawesome-svg-core'
// @ts-ignore
import inputStyles from 'styles/components/form/input.module.scss'
import Label from "components/form/addons/label"
import Button, { ButtonType } from 'components/form/button'
import Help from "components/form/addons/help"

/**
 * Input styles
 * @typedef {object} Styles
 * @property {any=} control
 * @property {any=} input
 */

/**
 * Simple input
 * @typedef {object} InputProps
 * @property {string=} id
 * @property {string=} label
 * @property {string=} placeholder
 * @property {string=} type
 * @property {boolean=} isDisabled
 * @property {number | string=} min
 * @property {number | string=} max
 * @property {number=} step
 * @property {boolean=} isRequired
 * @property {string=} value
 * @property {IconProp=} iconLeft
 * @property {string=} errorMessage
 * @property {function(React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): any=} onChange
 * @property {function(React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): any=} onFocus
 * @property {function(React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): any=} onBlur
 * @property {function(React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): any=} onInput
 * @property {Styles=} styles
 * @property {string=} color
 * @property {number=} minLength
 * @property {number=} maxLength
 * @property {string[]=} options
 * @property {string=} autoComplete
 * @property {ButtonType & AriaAttributes=} button
 * @property {boolean=} multiline
 */
/**
 * 
 * @param {InputProps & AriaAttributes} props 
 */
export default function Input({
    id = "",
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
    onFocus = () => null,
    onBlur = () => null,
    onInput = () => null,
    styles = {},
    color = 'light-greyblue',
    minLength = null,
    maxLength = null,
    options = [],
    autoComplete = "off",

    button = {},

    multiline = false,

    ...props
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
                    {!!options?.length &&
                        <datalist
                            id={id || encodeURIComponent(label)}
                        >
                            {options.map((opt, i) =>
                                <option key={i}>
                                    {opt}
                                </option>
                            )}
                        </datalist>
                    }
                    <Ipt
                        id={id || encodeURIComponent(label)}
                        className={classNames({ [`is-${color}`]: !!color }, { 'input': !multiline }, { 'textarea': multiline }, { 'is-danger': !!errorMessage }, styles.input, inputStyles.input)}
                        type={type}
                        placeholder={placeholder}
                        onChange={onChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        required={isRequired}
                        value={value || ''}
                        min={min}
                        max={max}
                        step={step}
                        disabled={isDisabled}
                        minLength={minLength}
                        maxLength={maxLength}
                        list={!!options?.length ? id || encodeURIComponent(label) : undefined}
                        autoComplete={autoComplete}
                        onInput={onInput}
                        {...props}
                    />
                    {iconLeft &&
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon={iconLeft} />
                        </span>
                    }
                    <Help>
                        {errorMessage}
                    </Help>
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