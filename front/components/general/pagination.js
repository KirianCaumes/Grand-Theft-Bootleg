import React from 'react'
import classNames from 'classnames'
// @ts-ignore
import styles from "styles/components/general/pagination.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'

/**
 * Pagination
 * @param {object} props
 * @param {number} props.current
 * @param {number} props.total
 * @param {function(React.MouseEvent<HTMLButtonElement, MouseEvent>, number):void} props.onClick
 */
export default function Pagination({ current = 1, total = 1, onClick = () => null }) {
    return (
        <nav
            className={classNames("pagination", styles.pagination)}
            role="navigation"
            aria-label="pagination"
        >
            <button
                className="pagination-previous button"
                type="button"
                onClick={ev => onClick(ev, current - 1)}
                disabled={current <= 1}
            >
                <span className="icon is-small">
                    <FontAwesomeIcon icon={faCaretLeft} />
                </span>
                <span>
                    Previous
                </span>
            </button>
            <button
                className="pagination-next button"
                type="button"
                onClick={ev => onClick(ev, current + 1)}
                disabled={current >= total}
            >
                <span>
                    Next page
                </span>
                <span className="icon is-small">
                    <FontAwesomeIcon icon={faCaretRight} />
                </span>
            </button>
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
                                    <button
                                        className={classNames("pagination-link button", { 'is-current': currentPage === i })}
                                        aria-label={`Goto page ${i + 1}`}
                                        type="button"
                                        onClick={ev => i === currentPage ? onClick(ev, i + 1) : null}
                                    >
                                        {i + 1}
                                    </button>
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