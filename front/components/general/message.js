import React, { useEffect, useRef } from 'react'
// @ts-ignore
import styles from 'styles/components/general/message.module.scss'
// @ts-ignore
import { Notification as BulmaNotification, Button } from 'react-bulma-components'
import { connect, useDispatch } from 'react-redux'
import { ReduxProps } from 'redux/store'
import { setMessage } from "redux/slices/main"

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
        <BulmaNotification
            color={message.type || 'primary'}
            className={styles.message}
        >
            <p
                className={styles.content}
            >
                {message.content}
            </p>
            <Button
                remove
                onClick={() => {
                    clearTimeout(timer.current)
                    dispatch(setMessage({ message: { ...message, isDisplay: false } }))
                }}
            />
        </BulmaNotification>
    )
}

export default connect((state) => state)(Message)