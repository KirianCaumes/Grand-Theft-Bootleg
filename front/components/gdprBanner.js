import { faCookieBite, faTimes } from '@fortawesome/free-solid-svg-icons'
import Cookie from 'helpers/cookie'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
// @ts-ignore
import styles from "styles/components/gdpr-banner.module.scss"
import Button from './form/button'

export default function GdprBanner() {
    /** @type {[boolean, function(boolean):any]} Modal */
    const [isVisible, setIsVisible] = useState(!true)

    const cookieName = useMemo(() => 'accept_cookies', [])

    useEffect(() => {
        setIsVisible(!Cookie.get(null, cookieName))
    }, [])

    if (!isVisible)
        return null

    return (
        <div className={styles['gdpr-banner']}>
            <p className={styles['gdpr-banner-content']}>
                This site uses <Link href="/general-conditions"><a>cookies</a></Link> to analyze your preferences anonymously via Google Analytics. You can accept this to allow us to improve your experience or refuse it.
            </p>
            <form
                className={styles['gdpr-banner-form']}
                id="accept-cookies"
                onSubmit={ev => {
                    ev.preventDefault()
                    Cookie.set('true', cookieName)
                    setIsVisible(false)
                }}
            >
                <Button
                    type="submit"
                    label="Accept cookies"
                    iconLeft={faCookieBite}
                />
                <Button
                    label="Refuse cookies"
                    iconLeft={faTimes}
                    onClick={() => {
                        setIsVisible(false)
                    }}
                />
            </form>
        </div >
    )
}