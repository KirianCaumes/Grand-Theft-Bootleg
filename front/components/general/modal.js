import React, { useCallback, useState } from 'react'
import ReactDOM from "react-dom"
// @ts-ignore
import styles from "styles/components/general/modal.module.scss"
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Status } from 'types/status'

/**
 * @typedef {object} ModalType
 * @property {boolean} isDisplay Is modal display
 * @property {string=} title Title
 * @property {React.ReactNode=} children Content
 * @property {function():any=} props.onClickYes On click
 * @property {function():any=} props.onClickNo On click
 * @property {boolean=} props.isFormDisable Force disable form
 */

/**
 * Modal
 * @param {ModalType} props
 */
function Modal({ isDisplay, title, children, onClickYes, onClickNo, isFormDisable = false }) {
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = useState(Status.RESOLVED)

    const onSubmit = useCallback(
        async () => {
            setStatus(Status.PENDING)
            await onClickYes?.()
            setStatus(Status.RESOLVED)
        },
        [onClickYes]
    )

    if (!isDisplay)
        return <></>

    return ReactDOM.createPortal(
        <div className={classNames("modal is-active", styles.modal)}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <form
                    onSubmit={ev => {
                        ev.preventDefault()
                        onSubmit()
                    }}
                >
                    <header className={classNames("modal-card-head", styles.header)}>
                        <p className="modal-card-title">{title}</p>
                        <button
                            className="delete"
                            aria-label="close"
                            type="button"
                            onClick={() => {
                                onClickNo?.()
                            }}
                        />
                    </header>
                    <section className={classNames("modal-card-body", styles.body)}>
                        <div className="content">
                            {children}
                        </div>
                    </section>
                    <footer className={classNames("modal-card-foot flex-end", styles.footer)}>
                        <button
                            type={isFormDisable ? 'button' : 'submit'}
                            className={classNames("button is-pink", { 'is-loading': status === Status.PENDING })}
                            onClick={() => isFormDisable ? onSubmit() : null}
                        >
                            <span className="icon is-small">
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span>Validate</span>
                        </button>
                        <button
                            type="button"
                            className="button"
                            onClick={() => {
                                onClickNo?.()
                            }}
                            disabled={status === Status.PENDING}
                        >
                            <span className="icon is-small">
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                            <span>Cancel</span>
                        </button>
                    </footer>
                </form>
            </div>
        </div>,
        document.getElementById('modal-portal')
    )
}
export default Modal