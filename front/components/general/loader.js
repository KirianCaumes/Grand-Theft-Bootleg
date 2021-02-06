import React from 'react'
// @ts-ignore
import { Loader as BulmaLoader } from 'react-bulma-components'
// @ts-ignore
import loaderStyles from "styles/components/general/loader.module.scss"
import classNames from 'classnames'

/**
 * Loader
 * @param {object} props
 * @param {string=} props.size
 * @param {boolean=} props.isRight
 */
export default function Loader({ size, isRight }) {
    return (
        <BulmaLoader
            className={classNames(loaderStyles.loader, { [loaderStyles[`is-${size}`]]: !!size }, { [loaderStyles[`is-right`]]: isRight })}
        />
    )
}