import React from 'react'
// @ts-ignore
import { Loader as BulmaLoader } from 'react-bulma-components'
// @ts-ignore
import styles from "styles/components/general/loader.module.scss"

export default function Layout() {
    return (
        <BulmaLoader
            className={styles.loader}
        />
    )
}