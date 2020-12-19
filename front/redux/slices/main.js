import { createSlice } from "@reduxjs/toolkit"
import { Slice, PayloadAction, ActionCreatorWithPayload } from "@reduxjs/toolkit"
import Cookie from "helpers/cookie"
import { HYDRATE } from 'next-redux-wrapper'
import User from 'request/objects/user'

/**
 * @typedef {object} Message
 * @property {boolean} isDisplay Is notif display
 * @property {string} content
 * @property {'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'} type
 */

/**
 * Payload token
 * @typedef {object} PayloadToken
 * @property {string} token User JWT Token
 * 
 * Payload user
 * @typedef {object} PayloadUser
 * @property {User} user Me user
 * 
 * Payload message
 * @typedef {object} PayloadMessage
 * @property {Message} message Message
 */

/**
 * Main State
 * @typedef {object} MainState
 * @property {string} token User JWT Token
 * @property {User} me Me user
 * @property {Message} message Message to display  
*/

/**
 * Main Slice
 * @type {Slice<MainState>}
 */
const mainSlice = createSlice({
    name: "main",
    /** @type {MainState} */
    initialState: {
        token: null,
        me: new User().toJson(),
        message: {
            isDisplay: false,
            content: null,
            type: null,
        }
    },
    reducers: {
        /**
         * Set token
         * @param {PayloadAction<PayloadToken>} action
         */
        setToken: (state, action) => {
            Cookie.set(action.payload.token)
            state.token = action.payload.token
        },
        /**
         * Set token
         * @param {PayloadAction<undefined>} action
         */
        removeToken: (state, action) => {
            Cookie.remove()
            state.token = null
            state.me = new User().toJson()
        },
        /**
         * Set user
         * @param {PayloadAction<PayloadUser>} action
         */
        setUser: (state, action) => {
            state.me = action.payload.user
        },
        /**
         * Set notification
         * @param {PayloadAction<PayloadMessage>} action
         */
        setMessage: (state, action) => {
            state.message = action.payload.message
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            if (action.payload.main.token)
                state.token = action.payload.main.token
        }
    }
})

export const selectmain = state => state.main

export const setToken = /** @type {ActionCreatorWithPayload<PayloadToken, string>} */(mainSlice.actions.setToken)
export const removeToken = /** @type {ActionCreatorWithPayload<undefined, string>} */(mainSlice.actions.removeToken)
export const setUser = /** @type {ActionCreatorWithPayload<PayloadUser, string>} */(mainSlice.actions.setUser)
export const setMessage = /** @type {ActionCreatorWithPayload<PayloadMessage, string>} */(mainSlice.actions.setMessage)

export default mainSlice.reducer