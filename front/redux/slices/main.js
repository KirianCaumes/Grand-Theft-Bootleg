import { createSlice } from "@reduxjs/toolkit"
import { Slice, PayloadAction } from "@reduxjs/toolkit" // eslint-disable-line
import Cookie from "helpers/cookie"
import { HYDRATE } from 'next-redux-wrapper'
/**
 * 
 * Payload token
 * @typedef {object} PayloadToken
 * @property {string} token User JWT Token
 */

/**
 * Main State
 * @typedef {object} MainState
 * @property {string} token User JWT Token
*/

/**
 * Main Slice
 * @type {Slice<MainState>}
 */
const mainSlice = createSlice({
    name: "main",
    initialState: {
        token: null
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

export const { setToken, removeToken } = mainSlice.actions

export default mainSlice.reducer