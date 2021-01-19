import React from 'react'
import ApiHandler from 'request/apiHandler'// eslint-disable-line
import BootlegHandler from 'request/handlers/bootlegHandler'
import Bootleg from 'request/objects/bootleg'
import UserHandler from 'request/handlers/userHandler'
import User from 'request/objects/user'
import SongHandler from 'request/handlers/songHandler'
import BandHandler from 'request/handlers/bandHandler'
import Band from 'request/objects/band'
import Song from 'request/objects/song'

/**
 * @typedef {object} HandlersProps
 * @property {function(object):ApiHandler<any>} handler Function to get proper handler for a desired object
 * @property {BootlegHandler} bootlegHandler Bootleg Handler
 * @property {UserHandler} userHandler User Handler
 * @property {SongHandler} songHandler Song Handler
 * @property {BandHandler} bandHandler Band Handler
 */

/**
 * With handlers hoc
 * @param {Object} WrappedComponent Component to wrapp
 */
export default function withHandlers(WrappedComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props)

            // Declare all handlers
            const bootlegHandler = new BootlegHandler()
            const userHandler = new UserHandler()
            const songHandler = new SongHandler()
            const bandHandler = new BandHandler()

            /** @type {object} Store handlers in an object */
            this.handlers = {
                bootlegHandler,
                userHandler,
                songHandler,
                bandHandler
            }

            /** @type {function(object):ApiHandler<any>} Function to get proper handler for a desired object */
            this.handler = obj => {
                switch (obj) {
                    case Bootleg:
                        return bootlegHandler
                    case User:
                        return userHandler
                    case Band:
                        return bandHandler
                    case Song:
                        return songHandler
                    default:
                        return null
                }
            }
        }

        render() {
            return <WrappedComponent handler={this.handler} {...this.handlers} {...this.props} />
        }
    }
}