import React, { createRef, useEffect, useState, AriaAttributes } from 'react'
// @ts-ignore
import tabStyles from "styles/components/general/tabs.module.scss"
import classNames from 'classnames'
import Link from 'next/link'
import { UrlObject } from 'url'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import usePrevious from "helpers/hooks/usePrevious"

/**
 * A tab
 * @typedef {object} Tab
 * @property {boolean=} isActive IsActive
 * @property {string | UrlObject=} href Href
 * @property {IconProp=} icon Icon
 * @property {string=} label Label
 * @property {function(React.KeyboardEvent<HTMLLIElement>):any=} onKeyUp Ref element
 * @property {any=} ref Ref element
 */

/**
 * Tabs
 * @param {object} props
 * @param {Tab[]=} props.tabs Tabs
 */
export default function Tabs({ tabs }) {
    /** @type {[any, function(any):any]} Tab ref */
    const [tabsRefs, setTabsRefs] = useState([])
    /** @type {[number, function(number):any]} Status */
    const [indexSelected, setIndexSelected] = useState(0)

    /** @type {number} Previous state indexSelected */
    const prevIndexSelected = usePrevious(indexSelected)

    useEffect(() => {
        setTabsRefs(x => (
            Array(tabs.length).fill().map((_, i) => x[i] || createRef())
        ))
    }, [tabs.length])

    useEffect(
        () => {
            if (prevIndexSelected !== indexSelected)
                tabsRefs[indexSelected]?.current?.focus()
        },
        [indexSelected, prevIndexSelected, tabsRefs]
    )

    return (
        <div className={classNames("tabs", tabStyles["tabs"])}>
            <ul role="tablist" aria-label="tabs">
                {tabs.map((tab, i) => (
                    <Tab
                        key={`tab${i}`}
                        ref={tabsRefs[i]}
                        aria-selected={tab === indexSelected}
                        tabIndex={tab === indexSelected ? 0 : -1}
                        onKeyUp={ev => {
                            ev.preventDefault()
                            console.log(ev.which)
                            switch (ev.which) {
                                case 13: //Enter
                                    tabsRefs[indexSelected]?.current?.querySelector('a')?.click()
                                    tabsRefs[indexSelected]?.current?.blur()
                                    break
                                case 37: //Left
                                    setIndexSelected(i - 1 >= 0 ? i - 1 : tabs.length - 1)
                                    break
                                case 39: //Right
                                    setIndexSelected(i + 1 <= tabs.length - 1 ? i + 1 : 0)
                                    break
                                default:
                                    break;
                            }
                        }}

                        isActive={tab.isActive}
                        href={tab.href}
                        icon={tab.icon}
                        label={tab.label}
                    />
                ))}
            </ul>
        </div>
    )
}

/**
 * A tab
 * @type {React.ForwardRefExoticComponent<(Tab & AriaAttributes) | HTMLLIElement>}
 */
const Tab = React.forwardRef(
    /**
     * @param {Tab & AriaAttributes} props 
     * @param {any} ref 
     */
    ({ isActive, href, icon, label, onKeyUp }, ref) => {
        return (
            <li
                className={classNames({ "is-active": isActive }, tabStyles["tab"])}
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onKeyUp={onKeyUp}
                ref={ref}
            >
                <Link
                    href={href}
                >
                    <a
                        tabIndex={-1}
                    >
                        <span className="icon is-small">
                            <FontAwesomeIcon icon={icon} />
                        </span>
                        <span>{label}</span>
                    </a>
                </Link>
            </li>
        )
    })