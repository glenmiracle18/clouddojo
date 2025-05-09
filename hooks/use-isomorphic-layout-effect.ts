import { useEffect, useLayoutEffect } from 'react'

// Use useLayoutEffect on the client, fallback to useEffect during SSR
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect