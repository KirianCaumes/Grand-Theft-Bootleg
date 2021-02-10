import React, { useEffect, useRef } from 'react'
// @ts-ignore
import stylesMessage from 'styles/components/general/message.module.scss'
import { connect, useDispatch } from 'react-redux'
import { ReduxProps } from 'redux/store'
import { setMessage } from "redux/slices/main"
import classNames from 'classnames'

/**
 * Notification
 * @param {ReduxProps} props
 */
function Message({ main: { message } }) {
    const dispatch = useDispatch()
    const timer = useRef(null)

    useEffect(() => {
        clearTimeout(timer.current)

        if (message.isDisplay)
            timer.current = setTimeout(
                () => dispatch(setMessage({ message: { ...message, isDisplay: false } })),
                5000
            )

        return () => {
            clearTimeout(timer.current)
        }
    }, [message.isDisplay])

    if (!message.isDisplay)
        return null

    return (
        <div
            className={classNames(stylesMessage.notification, stylesMessage.message, { [stylesMessage[`is-${message.type}`]]: !!message.type })}
        >
            <button
                className={classNames(stylesMessage.delete)}
                onClick={() => {
                    clearTimeout(timer.current)
                    dispatch(setMessage({ message: { ...message, isDisplay: false } }))
                }}
            />
            <p
                className={stylesMessage.content}
            >
                {message.content}
            </p>
        </div>
    )
}

export default connect((state) => state)(Message)