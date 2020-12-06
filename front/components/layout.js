import React, { useEffect } from 'react'
// @ts-ignore
import { Navbar } from 'react-bulma-components'
import Link from 'next/link'
import { Logo } from 'components/svg/icon'
import { removeToken, setUser } from 'redux/slices/main'
import { setBootlegs } from 'redux/slices/notification'
import { connect, useDispatch } from 'react-redux'
import { ReduxProps } from 'redux/store'
import onClickOutside from "react-onclickoutside"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faClock } from '@fortawesome/free-regular-svg-icons'
import { faPlus, faSearch, faBell as faBellSolid, faUser, faSignOutAlt, faTachometerAlt } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { ESort } from 'static/searchFilters/sort'
import { EStates } from 'static/searchFilters/states'
import Bootleg from 'request/objects/bootleg'
import withManagers, { ManagersProps } from "helpers/hoc/withManagers"

/**
 * @typedef {object} LayoutProps
 * @property {React.ReactNode} children
 */

/**
 * Login page
 * @param {LayoutProps & ReduxProps & ManagersProps} props 
 */
function Layout({ children, main: { token, me }, notification: { bootlegs }, bootlegManager, userManager }) {
    /** @type {[boolean, function(boolean):any]} Is burger active */
    const [isActive, setIsActive] = React.useState(!!false)

    // @ts-ignore
    Layout.handleClickOutside = () => setIsActive(false)

    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(
        () => {
            if (token)
                (async () => {
                    try {
                        const bootlegs = await bootlegManager.getAll({
                            orderBy: ESort.DATE_CREATION_ASC,
                            state: EStates.PENDING,
                            limit: 5
                        })
                        dispatch(setBootlegs({ bootlegs: bootlegs.map(x => x.toJson()) }))
                    } catch (error) {
                        console.error(error)
                    }
                })()
            else
                dispatch(setBootlegs({ bootlegs: [] }))

        },
        [token]
    )

    useEffect(
        () => {
            if (token)
                (async () => {
                    try {
                        const user = await userManager.getMe()
                        dispatch(setUser({ user: user.toJson() }))

                        if (!user?._id)
                            dispatch(removeToken(undefined))
                    } catch (error) {
                        console.error(error)
                    }
                })()
        },
        [token]
    )

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
                                onClick={() => setIsActive(false)}
                            >
                                <Logo />
                                <span>
                                    Grand Theft Bootleg
                                </span>
                            </a>
                        </Link>
                        <Notification
                            bootlegs={bootlegs}
                            onClick={() => setIsActive(false)}
                            className="is-hidden-desktop"
                        />
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
                                    <FontAwesomeIcon icon={faSearch} className="has-text-pink" />&nbsp;
                                    Search
                                </a>
                            </Link>
                            <Link href="/bootleg/new/edit">
                                <a
                                    className="navbar-item"
                                    onClick={() => setIsActive(false)}
                                >
                                    <FontAwesomeIcon icon={faPlus} className="has-text-pink" />&nbsp;
                                    Create
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
                                <>
                                    {me?.role > 1 &&
                                        <Notification
                                            bootlegs={bootlegs}
                                            onClick={() => setIsActive(false)}
                                            className="is-hidden-touch"
                                        />
                                    }
                                    <Navbar.Item
                                        dropdown
                                        hoverable
                                    >
                                        <Navbar.Link>
                                            <FontAwesomeIcon icon={faUser} className="is-hidden-touch" />
                                            <FontAwesomeIcon icon={faUser} className="has-text-pink is-hidden-desktop" />
                                            <span className="is-hidden-desktop">
                                                &nbsp;User
                                            </span>
                                        </Navbar.Link>
                                        <Navbar.Dropdown
                                            className="is-right"
                                        >
                                            <Link href="/register">
                                                <a
                                                    className="navbar-item"
                                                    onClick={() => setIsActive(false)}
                                                >
                                                    <FontAwesomeIcon icon={faTachometerAlt} className="has-text-pink" />&nbsp;
                                                Dashboard
                                            </a>
                                            </Link>
                                            <a
                                                className="navbar-item"
                                                onClick={() => {
                                                    dispatch(removeToken(undefined))
                                                    router.push('/')
                                                    setIsActive(false)
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faSignOutAlt} className="has-text-pink" />&nbsp;
                                                Logout
                                            </a>
                                        </Navbar.Dropdown>
                                    </Navbar.Item>

                                </>
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


export default connect((state) => state)(onClickOutside(withManagers(Layout), {
    // @ts-ignore
    handleClickOutside: () => Layout.handleClickOutside
}))

/**
 * Notification
 * @param {object} props
 * @param {Bootleg[]} props.bootlegs  
 * @param {function():any} props.onClick
 * @param {string=} props.className
 */
function Notification({ bootlegs, onClick, className }) {
    return (
        <div className={classNames("dropdown is-hoverable bootleg-notif", className)}>
            <div className="dropdown-trigger">
                {bootlegs?.length ?
                    <>
                        <FontAwesomeIcon
                            icon={faBellSolid}
                            className="has-text-pink vibrate"
                        />
                        <span className="badge">
                            {bootlegs?.length}
                        </span>
                    </>
                    :
                    <FontAwesomeIcon
                        icon={faBell}
                    />
                }
            </div>
            <div className="dropdown-menu" role="menu">
                <div className="dropdown-content">
                    {bootlegs?.length > 0
                        ?
                        <>
                            {bootlegs?.map((bootleg, i) =>
                                <Link
                                    key={i}
                                    href={`/bootleg/${encodeURIComponent(bootleg.title)}-${encodeURIComponent(bootleg._id)}`}
                                >
                                    <a
                                        className="dropdown-item"
                                        onClick={onClick}
                                    >
                                        <span className="is-capitalize">{bootleg.title}</span>
                                        <br />
                                        <span>
                                            <FontAwesomeIcon icon={faClock} /> {bootleg.timeAgo}
                                        </span>
                                    </a>
                                </Link>
                            )}
                            <Link
                                href={`/bootleg/search?orderBy=${ESort.DATE_CREATION_ASC}&state=${EStates.PENDING}`}
                            >
                                <a
                                    onClick={onClick}
                                    className="dropdown-item"
                                >
                                    <b>See more...</b>
                                </a>
                            </Link>
                        </>
                        :
                        <div className="dropdown-item is-pointer-events-none">
                            <i>No notifications found</i>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}