import React from 'react'
import 'styles/index.scss'
import { AppProps } from 'next/dist/next-server/lib/router/router'
// @ts-ignore
import { Navbar, Footer, Container, Content } from 'react-bulma-components'
import Link from 'next/link'
import { Logo } from 'components/svg/icon'


/**
 * @typedef {object} GlobalProps
 * @property {string} appname App name
 */

/**
 * Base layout
 * @param {AppProps} props 
 * {@link https://nextjs.org/docs/advanced-features/custom-app}
 */
export default function MyApp({ Component, pageProps }) {
    const globalProps = {
        appname: "Grand Theft Bootleg"
    }

    /** @type {[boolean, function(boolean):any]} Is burger active */
    const [isActive, setIsActive] = React.useState(!!false)

    return (
        <>
            <header>
                <Navbar
                    className="is-greyblue"
                    active={isActive}
                    transparent={true}
                >
                    <Navbar.Brand>
                        <Link href="/">
                            <a
                                className="navbar-item"
                                onClick={() => setIsActive(false)}>
                                <Logo />
                            </a>
                        </Link>
                        <Navbar.Burger
                            onClick={() => setIsActive(!isActive)}
                        />
                    </Navbar.Brand>
                    <Navbar.Menu>
                        <Navbar.Container>
                            <Link href="/search">
                                <a
                                    className="navbar-item"
                                    onClick={() => setIsActive(false)}
                                >
                                    Search
                                </a>
                            </Link>
                        </Navbar.Container>
                        <Navbar.Container position="end">
                            <Link href="/login">
                                <a
                                    className="navbar-item"
                                    onClick={() => setIsActive(false)}
                                >
                                    Login
                                </a>
                            </Link>
                            <div className="navbar-item">
                                <div className="buttons">

                                    <Link href="/register">
                                        <a
                                            className="button is-pink"
                                            onClick={() => setIsActive(false)}
                                        >
                                            <strong>Register</strong>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </Navbar.Container>
                    </Navbar.Menu>
                </Navbar>
            </header>

            <Component {...{ ...pageProps, ...globalProps }} />

            <footer className="footer has-background-dark-greyblue">
                <div className="content has-text-centered has-text-white">
                    <p>
                        <strong className="has-text-white">
                            <Link href="/">
                                <a>
                                    Grand Theft Bootleg
                                    </a>
                            </Link>
                        </strong> - Copyright 2020
                    </p>
                </div>
            </footer>
        </>
    )
}
