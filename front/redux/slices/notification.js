import { createSlice } from "@reduxjs/toolkit"
import { Slice, PayloadAction } from "@reduxjs/toolkit" // eslint-disable-line
import Cookie from "helpers/cookie"
import { HYDRATE } from 'next-redux-wrapper'
import User from 'request/objects/user'
import Bootleg from 'request/objects/bootleg'

/**
 * Payload set bootlegs
 * @typedef {object} PayloadSetBootlegs
 * @property {Bootleg[]} bootlegs Bootlegs in pending state
 * 
 * Payload remove from bootlegs
 * @typedef {object} PayloadEditBootlegs
 * @property {Bootleg} bootleg Bootleg id to remove
 */

/**
 * Notification State
 * @typedef {object} NotificationState
 * @property {Bootleg[]} bootlegs Bootlegs in pending state
 * @property {any[]} reports Reports
*/

/**
 * Main Slice
 * @type {Slice<NotificationState>}
 */
const notificationSlice = createSlice({
    name: "notification",
    /** @type {NotificationState} */
    initialState: {
        bootlegs: [],
        reports: []
    },
    reducers: {
        /**
         * Set bootlegs
         * @param {PayloadAction<PayloadSetBootlegs>} action
         */
        setBootlegs: (state, action) => {
            state.bootlegs = action.payload.bootlegs
        },
        /**
         * Remove from bootlegs
         * @param {PayloadAction<PayloadEditBootlegs>} action
         */
        removeFromBootlegs: (state, action) => {
            state.bootlegs = [...state.bootlegs].filter(x => x._id !== action.payload.bootleg?._id)
        },
        /**
         * Add to bootlegs
         * @param {PayloadAction<PayloadEditBootlegs>} action
         */
        addToBootlegs: (state, action) => {
            state.bootlegs = [...state.bootlegs, action.payload.bootleg]
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
        }
    }
})

export const selectnotification = state => state.notification

export const {
    setBootlegs,
    removeFromBootlegs,
    addToBootlegs
} = notificationSlice.actions

export default notificationSlice.reducer