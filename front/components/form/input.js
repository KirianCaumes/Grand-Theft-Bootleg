import React from "react"
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
 * @param {object} props
 * @param {string=} props.id
 * @param {string=} props.label
 * @param {string} props.placeholder
 * @param {string=} props.type
 * @param {boolean=} props.isDisabled
 * @param {number | string=} props.min
 * @param {number | string=} props.max
 * @param {number=} props.step
 * @param {boolean=} props.isRequired
 * @param {string=} props.value
 * @param {IconProp=} props.iconLeft
 * @param {string=} props.errorMessage
 * @param {function(React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): any=} props.onChange
 * @param {function(React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): any=} props.onFocus
 * @param {function(React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): any=} props.onBlur
 * @param {function(React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): any=} props.onInput
 * @param {Styles=} props.styles
 * @param {string=} props.color
 * @param {number=} props.minLength
 * @param {number=} props.maxLength
 * @param {string[]=} props.options
 * @param {string=} props.autoComplete
 * @param {ButtonType=} props.button
 * @param {boolean=} props.multiline
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
    color = 'greyblue',
    minLength = null,
    maxLength = null,
    options = [],
    autoComplete = "off",

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
                        className={classNames(`is-${color}`, { 'input': !multiline }, { 'textarea': multiline }, { 'is-danger': !!errorMessage }, styles.input, inputStyles.input)}
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