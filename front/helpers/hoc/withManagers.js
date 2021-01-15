import React from 'react'
import ApiManager from 'request/apiManager'// eslint-disable-line
import BootlegManager from 'request/managers/bootlegManager'
import Bootleg from 'request/objects/bootleg'
import UserManager from 'request/managers/userManager'
import User from 'request/objects/user'
import SongManager from 'request/managers/songManager'
import BandManager from 'request/managers/bandManager'
import Band from 'request/objects/band'
import Song from 'request/objects/song'

/**
 * @typedef {object} ManagersProps
 * @property {function(object):ApiManager<any>} manager Function to get proper manager for a desired object
 * @property {BootlegManager} bootlegManager Bootleg Manager
 * @property {UserManager} userManager User Manager
 * @property {SongManager} songManager Song Manager
 * @property {BandManager} bandManager Band Manager
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
            const songManager = new SongManager()
            const bandManager = new BandManager()

            /** @type {object} Store managers in an object */
            this.managers = {
                bootlegManager,
                userManager,
                songManager,
                bandManager
            }

            /** @type {function(object):ApiManager<any>} Function to get proper manager for a desired object */
            this.manager = obj => {
                switch (obj) {
                    case Bootleg:
                        return bootlegManager
                    case User:
                        return userManager
                    case Band:
                        return bandManager
                    case Song:
                        return songManager
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