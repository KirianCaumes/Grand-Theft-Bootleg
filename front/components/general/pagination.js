import React from 'react'
import classNames from 'classnames'
// @ts-ignore
import styles from "styles/components/general/pagination.module.scss"
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import Button from 'components/form/button'

/**
 * Pagination
 * @param {object} props
 * @param {number} props.current
 * @param {number} props.total
 */
export default function Pagination({ current = 1, total = 1 }) {
    const router = useRouter()

    return (
        <nav
            className={classNames("pagination", styles.pagination)}
            role="navigation"
            aria-label="pagination"
        >
            <Button
                label="Previous"
                iconLeft={faCaretLeft}
                styles={{ button: "pagination-previous" }}
                isDisabled={current <= 1}
                href={{
                    pathname: router.pathname,
                    query: {
                        ...router.query,
                        page: current - 1
                    },
                }}
            />
            <Button
                label="Next"
                iconRight={faCaretRight}
                styles={{ button: "pagination-next" }}
                isDisabled={current >= total}
                href={{
                    pathname: router.pathname,
                    query: {
                        ...router.query,
                        page: current + 1
                    },
                }}
            />
            <ul className="pagination-list">
                {new Array(total).fill({}).map((x, i) => {
                    const currentPage = current - 1
                    return (
                        <React.Fragment key={i}>
                            {currentPage - 1 === i && i > 1 && current - 2 !== total &&
                                <li><span className="pagination-ellipsis">&hellip;</span></li>
                            }
                            {[0, currentPage - 1, currentPage, currentPage + 1, total - 1].includes(i) &&
                                <li>
                                    <Button
                                        label={`${i + 1}`}
                                        styles={{ button: classNames("pagination-link", { 'is-current': currentPage === i }) }}
                                        color={null}
                                        href={{
                                            pathname: router.pathname,
                                            query: {
                                                ...router.query,
                                                page: i + 1
                                            },
                                        }}
                                    />
                                </li>
                            }
                            {currentPage + 1 === i && i < total - 1 && current + 2 !== total &&
                                <li><span className="pagination-ellipsis">&hellip;</span></li>
                            }
                        </React.Fragment>
                    )
                })}
            </ul>
        </nav >
    )
}