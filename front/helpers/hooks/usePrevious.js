import { useEffect, useRef } from 'react'

/**
 * UsePrevious hooks
 * @param {any} value 
 */
export default function usePrevious(value) {
    const ref = useRef()

    useEffect(() => {
        ref.current = value
    })

    return ref.current
}