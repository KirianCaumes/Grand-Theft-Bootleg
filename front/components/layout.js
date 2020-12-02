import React, { Children, useEffect } from 'react'
// @ts-ignore
import { Navbar } from 'react-bulma-components'
import Link from 'next/link'
import { Logo } from 'components/svg/icon'
import { wrapper } from 'redux/store'
import { removeToken, setToken } from 'redux/slices/main'
import Cookie from 'helpers/cookie'
import { connect, useDispatch, useStore } from 'react-redux'

function Layout({ children, main }) {
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
                            {!main?.token ? <>
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
                                <div className="navbar-item">
                                    <div className="buttons">
                                        <button
                                            className="button is-pink"
                                            onClick={() =>
                                                dispatch(
                                                    removeToken(undefined)
                                                )
                                            }
                                        >
                                            <strong>Logout</strong>
                                        </button>
                                    </div>
                                </div>
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