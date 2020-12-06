import React from 'react'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { connect } from 'react-redux'
import { ReduxProps } from 'redux/store'

/**
 * Notification
 * @param {ReduxProps} props
 */
function Notification({ main: { message } }) {
    return (
        <ReactNotification />
    )
}

export default connect((state) => state)(Notification)