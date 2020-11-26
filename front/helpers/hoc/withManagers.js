import React from 'react'
import ApiManager from 'request/apiManager'// eslint-disable-line
import BootlegManager from 'request/managers/bootlegManager'
import { Bootleg } from 'request/objects/bootleg'
import UserManager from 'request/managers/userManager'
import { User } from 'request/objects/user'

/**
 * @typedef {object} ManagersProps
 * @property {function(object):ApiManager<any>} manager Function to get proper manager for a desired object
 * @property {BootlegManager} bootlegManager Bootleg Manager
 * @property {UserManager} userManager User Manager
 */

/**
 * With managers hoc
 * @param {Object} WrappedComponent Component to wrapp
 */
export default function withManagers(WrappedComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props)

            // Declare all managers
            const bootlegManager = new BootlegManager()
            const userManager = new UserManager()

            /** @type {object} Store managers in an object */
            this.managers = {
                bootlegManager,
                userManager,
            }

            /** @type {function(object):ApiManager<any>} Function to get proper manager for a desired object */
            this.manager = obj => {
                switch (obj) {
                    case Bootleg:
                        return bootlegManager
                    case User:
                        return userManager
                    default:
                        return null
                }
            }
        }

        render() {
            return <WrappedComponent manager={this.manager} {...this.managers} {...this.props} />
        }
    }
}