import React from 'react'
// @ts-ignore
import { Navbar } from 'react-bulma-components'
import Link from 'next/link'
import { Logo } from 'components/svg/icon'
import { removeToken } from 'redux/slices/main'
import { connect, useDispatch } from 'react-redux'
import { ReduxProps } from 'redux/store'

/**
 * @typedef {object} LayoutProps
 * @property {React.ReactNode} children
 */

/**
 * Login page
 * @param {LayoutProps & ReduxProps} props
 */
function Layout({ children, main: { token } }) {
    /** @type {[boolean, function(boolean):any]} Is burger active */
    const [isActive, setIsActive] = React.useState(!!false)

    const dispatch = useDispatch()

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
                            <Link href="/bootleg/search">
                                <a
                                    className="navbar-item"
                                    onClick={() => setIsActive(false)}
                                >
                                    Search
                        </a>
                            </Link>
                        </Navbar.Container>
                        <Navbar.Container position="end">
                            {!token ? <>
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
                                </div></>
                                :
                                <a
                                    className="navbar-item"
                                    onClick={() => dispatch(removeToken(undefined))}
                                >
                                    Logout
                                    </a>
                            }
                        </Navbar.Container>
                    </Navbar.Menu>
                </Navbar>
            </header>

            {children}

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

export default connect((state) => state)(Layout)