import { configureStore } from "@reduxjs/toolkit"
import { createWrapper } from 'next-redux-wrapper'
import logger from "redux-logger"

import mainReducer, { MainState } from "redux/slices/main"

/**
 * Redux props
 * @typedef {object} ReduxProps
 * @property {MainState=} main
 */

export const makeStore = () => configureStore({
    reducer: {
        main: mainReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: process.env.NODE_ENV === 'development'
})

export const wrapper = createWrapper(
    makeStore,
    {
        debug: process.env.NODE_ENV === 'development'
    }
)
