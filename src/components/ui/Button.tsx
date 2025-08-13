import { Button as MuiButton, type ButtonProps } from '@mui/material'

export function Button(props: ButtonProps) {
  return <MuiButton {...props} disableTouchRipple />
}