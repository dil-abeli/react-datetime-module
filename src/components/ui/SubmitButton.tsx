import { forwardRef, useCallback, useMemo, useRef, useState } from 'react'
import { CircularProgress, Tooltip } from '@mui/material'
import type { ElementType, MouseEvent, ReactNode } from 'react'
import { Button } from './Button'
import type { ButtonProps } from '@mui/material'

export type SubmitButtonProps = Omit<ButtonProps, 'startIcon' | 'endIcon' | 'onClick' | 'disableTouchRipple'> & {
  loading?: boolean
  loadingText?: ReactNode
  loadingPosition?: 'start' | 'end' | 'center'
  autoLoading?: boolean
  disableWhileLoading?: boolean
  tooltip?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
  component?: ElementType
  to?: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<unknown>
}

function isPromiseLike(value: unknown): value is Promise<unknown> {
  return typeof value === 'object' && value !== null && 'then' in value
}

export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(function SubmitButton(
  {
    loading: loadingProp,
    loadingText,
    loadingPosition = 'start',
    autoLoading = true,
    disableWhileLoading = true,
    tooltip,
    startIcon,
    endIcon,
    onClick,
    children,
    disabled,
    ...rest
  },
  ref,
) {
  const [loadingState, setLoadingState] = useState(false)
  const isMountedRef = useRef(true)

  const loading = loadingProp ?? loadingState
  const effectiveDisabled = disabled || (disableWhileLoading && loading)

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (!onClick) return
      const result = onClick(e)
      if (autoLoading && isPromiseLike(result)) {
        setLoadingState(true)
        result.finally(() => {
          if (isMountedRef.current) setLoadingState(false)
        })
      }
    },
    [onClick, autoLoading],
  )

  const spinner = useMemo(() => <CircularProgress size={16} color="inherit" />, [])

  const content = useMemo(() => {
    if (!loading) return children
    return loadingText ?? children
  }, [loading, loadingText, children])

  const computedStartIcon = loading && loadingPosition === 'start' ? spinner : startIcon
  const computedEndIcon = loading && loadingPosition === 'end' ? spinner : endIcon

  const button = (
    <Button
      ref={ref}
      disabled={effectiveDisabled}
      startIcon={computedStartIcon}
      endIcon={computedEndIcon}
      {...rest}
      onClick={handleClick}
      aria-busy={loading || undefined}
      aria-disabled={effectiveDisabled || undefined}
    >
      {loading && loadingPosition === 'center' ? spinner : content}
    </Button>
  )

  if (tooltip) return <Tooltip title={tooltip}>{button}</Tooltip>
  return button
})
