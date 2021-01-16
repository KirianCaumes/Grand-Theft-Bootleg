import React, { ReactChild, useRef, useState } from "react"
import classNames from 'classnames'
// @ts-ignore
import fileInputStyles from 'styles/components/form/fileInput.module.scss'
import { faUpload } from "@fortawesome/free-solid-svg-icons"
import Label from "./addons/label"
import Help from "./addons/help"
import Button from "./button"
import { Status } from "static/status"
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons"
import Modal, { ModalType } from "components/general/modal"

/**
 * File styles
 * @typedef {object} Styles
 * @property {any=} file
 */

/**
 * Simple input
 * @param {object} props
 * @param {boolean=} props.isRequired
 * @param {string=} props.label
 * @param {ReactChild} props.value
 * @param {string=} props.errorMessage
 * @param {string=} props.infoMessage
 * @param {boolean=} props.isDisabled
 * @param {function(File):Promise<any>=} props.onUpload
 * @param {function():Promise<any>=} props.onDelete
 * @param {Styles=} props.styles
 */
export default function FileInput({
    isRequired = null,
    label = null,
    value = null,
    errorMessage = undefined,
    infoMessage = undefined,
    isDisabled = false,
    onUpload = () => null,
    onDelete = () => null,
    styles = {}
}) {
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = useState(Status.RESOLVED)
    /** @type {[ModalType, function(ModalType):any]} Modal */
    const [modalReport, setModalReport] = useState({ isDisplay: !!false })

    const inputRef = useRef(null)

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
            <div className={classNames("file has-name is-fullwidth is-greyblue", fileInputStyles.file)}>
                <label
                    className="file-label"
                >
                    <input
                        className="file-input"
                        type="file"
                        name="resume"
                        disabled={isDisabled || !!value}
                        ref={inputRef}
                        onChange={async ev => {
                            if (ev.target?.files?.[0]) {
                                setStatus(Status.PENDING)
                                await onUpload(ev.target.files[0])
                                setStatus(Status.RESOLVED)
                            }
                        }}
                    />
                    <span
                        className={classNames("file-name", fileInputStyles['file-name'])}
                        // @ts-ignore
                        disabled={isDisabled || !!value}
                    >
                        {value}
                    </span>
                    <Button
                        iconLeft={!value ? faUpload : faTrashAlt}
                        color='greyblue'
                        isDisabled={isDisabled}
                        isLoading={status === Status.PENDING}
                        onClick={async () => {
                            if (!value) {
                                inputRef.current?.click()
                            } else {
                                setModalReport({ isDisplay: true })
                            }
                        }}
                        styles={{ button: classNames("file-cta", fileInputStyles['file-cta']) }}
                    />
                </label>
            </div>
            <Help>
                {errorMessage}
            </Help>
            <Help color={null}>
                {infoMessage}
            </Help>

            <Modal
                isDisplay={modalReport.isDisplay}
                title="Delete file"
                onClickYes={async () => {
                    setStatus(Status.PENDING)
                    await onDelete()
                    setStatus(Status.RESOLVED)
                    setModalReport({ isDisplay: false })
                }}
                onClickNo={() => setModalReport({ isDisplay: false })}
                isFormDisable={true}
            >
                Are your certain you want to delete this file? This action is definitive.
            </Modal>
        </>
    )
}