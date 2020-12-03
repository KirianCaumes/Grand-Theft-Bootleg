import { createSlice } from "@reduxjs/toolkit"
import { Slice, PayloadAction } from "@reduxjs/toolkit" // eslint-disable-line
import Cookie from "helpers/cookie"
import { HYDRATE } from 'next-redux-wrapper'
import { User } from 'request/objects/user'

/**
 * Payload token
 * @typedef {object} PayloadToken
 * @property {string} token User JWT Token
 * 
 * Payload user
 * @typedef {object} PayloadUser
 * @property {User} user Me user
 */

/**
 * Main State
 * @typedef {object} MainState
 * @property {string} token User JWT Token
 * @property {User} me Me user
*/

/**
 * Main Slice
 * @type {Slice<MainState>}
 */
const mainSlice = createSlice({
    name: "main",
    initialState: {
        token: null,
        me: new User().toJson()
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
         * Set token
         * @param {PayloadAction<PayloadUser>} action
         */
        setUser: (state, action) => {
            state.me = action.payload.user
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

export const { setToken, removeToken, setUser } = mainSlice.actions

export default mainSlice.reducer