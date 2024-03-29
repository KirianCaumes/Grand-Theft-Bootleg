import React, { useEffect, MutableRefObject, useRef } from 'react'
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
import { faPlus, faSearch, faBell as faBellSolid, faUser, faSignOutAlt, faTachometerAlt, faCompactDisc } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { ESort } from 'types/searchFilters/sort'
import { EStates } from 'types/searchFilters/states'
import Bootleg from 'request/objects/bootleg'
import withHandlers, { HandlersProps } from "helpers/hoc/withHandlers"
import { RequestApi } from 'request/apiHandler'
import BootlegMeta from 'request/objects/meta/bootlegMeta'
import User from 'request/objects/user'

/**
 * @typedef {object} LayoutProps
 * @property {React.ReactNode} children
 */

/**
 * Login page
 * @param {LayoutProps & ReduxProps & HandlersProps} props 
 */
function Layout({ children, main: { token, me }, notification: { bootlegs }, bootlegHandler, userHandler }) {
    /** @type {[boolean, function(boolean):any]} Is burger active */
    const [isActive, setIsActive] = React.useState(!!false)

    /** @type {MutableRefObject<RequestApi<[Bootleg[], BootlegMeta]>>} */
    const bootlegHandlerGetAll = useRef()
    /** @type {MutableRefObject<RequestApi<User>>} */
    const userHandlerGetMe = useRef()

    // @ts-ignore
    Layout.handleClickOutside = () => setIsActive(false)

    const dispatch = useDispatch()
    const router = useRouter()

    const timer = useRef(null)

    useEffect(() => {
        clearInterval(timer.current)

        const getNotif = async () => {
            try {
                bootlegHandlerGetAll.current = bootlegHandler.getAll({
                    orderBy: ESort.DATE_CREATION_ASC,
                    state: EStates.PENDING,
                    limit: 5
                })
                const [bootlegs] = await bootlegHandlerGetAll.current.fetch()
                dispatch(setBootlegs({ bootlegs: bootlegs.map(x => x.toJson()) }))
            } catch (error) {
                console.error(error)
            }
        }

        if (token) {
            getNotif()
            setInterval(getNotif, 300000)
        } else
            dispatch(setBootlegs({ bootlegs: [] }))

        return () => {
            clearInterval(timer.current)
        }
    }, [token])

    useEffect(
        () => {
            if (!!token)
                (async () => {
                    try {
                        userHandlerGetMe.current = userHandler.getMe()
                        const user = await userHandlerGetMe.current.fetch()

                        if (!!user?._id)
                            dispatch(setUser({ user: user.toJson() }))
                        else {
                            dispatch(setUser({ user: new User().toJson() }))
                            dispatch(removeToken(undefined))
                        }
                    } catch (error) {
                        dispatch(setUser({ user: new User().toJson() }))
                        dispatch(removeToken(undefined))
                        console.error(error)
                    }
                })()
        },
        [token]
    )

    useEffect(() => {
        bootlegHandlerGetAll.current?.fetch()
        userHandlerGetMe.current?.fetch()
    }, [])

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
                            aria-label="burger"
                        />
                    </Navbar.Brand>
                    <Navbar.Menu>
                        <Navbar.Container>
                            <Link href="/bootleg">
                                <a
                                    className="navbar-item"
                                    onClick={() => setIsActive(false)}
                                >
                                    <FontAwesomeIcon icon={faCompactDisc} className="has-text-pink" />
                                    <span>&nbsp;What is a bootleg?</span>
                                </a>
                            </Link>
                            <Link href="/bootleg/search">
                                <a
                                    className="navbar-item"
                                    onClick={() => setIsActive(false)}
                                >
                                    <FontAwesomeIcon icon={faSearch} className="has-text-pink" />
                                    <span>&nbsp;Search</span>
                                </a>
                            </Link>
                            <Link href="/bootleg/new/edit">
                                <a
                                    className="navbar-item"
                                    onClick={() => setIsActive(false)}
                                >
                                    <FontAwesomeIcon icon={faPlus} className="has-text-pink" />
                                    <span>&nbsp;Create</span>
                                </a>
                            </Link>
                        </Navbar.Container>
                        <Navbar.Container position="end">
                            {!token ? <>
                                <Link href="/user/login">
                                    <a
                                        className="navbar-item"
                                        onClick={() => setIsActive(false)}
                                    >
                                        Login
                                    </a>
                                </Link>
                                <div className="navbar-item">
                                    <div className="buttons">
                                        <Link href="/user/register">
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
                                            <Link href="/user">
                                                <a
                                                    className="navbar-item"
                                                    onClick={() => setIsActive(false)}
                                                >
                                                    <FontAwesomeIcon icon={faTachometerAlt} className="has-text-pink" />
                                                    <span>&nbsp;Dashboard</span>
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
                                                <FontAwesomeIcon icon={faSignOutAlt} className="has-text-pink" />
                                                <span>&nbsp;Logout</span>
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
                            <Link href="/general-conditions">
                                <a>
                                    Grand Theft Bootleg
                                </a>
                            </Link>
                        </strong> - Copyright {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </>
    )
}


export default connect((state) => state)(onClickOutside(withHandlers(Layout), {
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
                                    href={{
                                        pathname: `/bootleg/${bootleg.title}-${bootleg._id}`
                                    }}
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
                                href={{
                                    pathname: '/bootleg/search',
                                    query: {
                                        orderBy: ESort.DATE_CREATION_ASC,
                                        state: EStates.PENDING
                                    }
                                }}
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